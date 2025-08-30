-- Enable Row Level Security (RLS)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create custom types
CREATE TYPE poll_visibility AS ENUM ('public', 'private', 'unlisted');
CREATE TYPE poll_status AS ENUM ('active', 'closed', 'draft');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create polls table
CREATE TABLE polls (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  creator_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  visibility poll_visibility DEFAULT 'public',
  status poll_status DEFAULT 'active',
  allow_multiple_votes BOOLEAN DEFAULT FALSE,
  allow_anonymous_votes BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create poll options table
CREATE TABLE poll_options (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES poll_options(id) ON DELETE CASCADE NOT NULL,
  voter_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  voter_email TEXT, -- For anonymous votes
  voter_name TEXT, -- For anonymous votes
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, option_id, voter_id) -- Prevent duplicate votes from same user
);

-- Create poll shares table for tracking QR code usage
CREATE TABLE poll_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID REFERENCES polls(id) ON DELETE CASCADE NOT NULL,
  shared_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  share_method TEXT, -- 'qr_code', 'link', 'email', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_polls_creator_id ON polls(creator_id);
CREATE INDEX idx_polls_status ON polls(status);
CREATE INDEX idx_polls_visibility ON polls(visibility);
CREATE INDEX idx_polls_created_at ON polls(created_at DESC);
CREATE INDEX idx_poll_options_poll_id ON poll_options(poll_id);
CREATE INDEX idx_poll_options_order ON poll_options(poll_id, order_index);
CREATE INDEX idx_votes_poll_id ON votes(poll_id);
CREATE INDEX idx_votes_option_id ON votes(option_id);
CREATE INDEX idx_votes_voter_id ON votes(voter_id);
CREATE INDEX idx_votes_created_at ON votes(created_at DESC);
CREATE INDEX idx_poll_shares_poll_id ON poll_shares(poll_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to get poll results
CREATE OR REPLACE FUNCTION get_poll_results(poll_uuid UUID)
RETURNS TABLE (
  option_id UUID,
  option_label TEXT,
  option_description TEXT,
  vote_count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    po.id as option_id,
    po.label as option_label,
    po.description as option_description,
    COUNT(v.id) as vote_count,
    CASE 
      WHEN (SELECT COUNT(*) FROM votes WHERE poll_id = poll_uuid) > 0 
      THEN ROUND((COUNT(v.id)::NUMERIC / (SELECT COUNT(*) FROM votes WHERE poll_id = poll_uuid)::NUMERIC) * 100, 2)
      ELSE 0 
    END as percentage
  FROM poll_options po
  LEFT JOIN votes v ON po.id = v.option_id
  WHERE po.poll_id = poll_uuid
  GROUP BY po.id, po.label, po.description
  ORDER BY po.order_index, po.label;
END;
$$ LANGUAGE plpgsql;

-- Create function to check if user has voted
CREATE OR REPLACE FUNCTION has_user_voted(poll_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM votes 
    WHERE poll_id = poll_uuid AND voter_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Create function to get total votes for a poll
CREATE OR REPLACE FUNCTION get_poll_total_votes(poll_uuid UUID)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) FROM votes WHERE poll_id = poll_uuid
  );
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_shares ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Polls policies
CREATE POLICY "Anyone can view public polls" ON polls
  FOR SELECT USING (visibility = 'public' AND status = 'active');

CREATE POLICY "Users can view their own polls" ON polls
  FOR SELECT USING (creator_id = auth.uid());

CREATE POLICY "Users can create polls" ON polls
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own polls" ON polls
  FOR UPDATE USING (creator_id = auth.uid());

CREATE POLICY "Users can delete their own polls" ON polls
  FOR DELETE USING (creator_id = auth.uid());

-- Poll options policies
CREATE POLICY "Anyone can view options for public polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.visibility = 'public' 
      AND polls.status = 'active'
    )
  );

CREATE POLICY "Users can view options for their own polls" ON poll_options
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage options for their own polls" ON poll_options
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_options.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

-- Votes policies
CREATE POLICY "Anyone can view votes for public polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.visibility = 'public'
    )
  );

CREATE POLICY "Users can view votes for their own polls" ON votes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can vote on public polls" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.visibility = 'public' 
      AND polls.status = 'active'
    )
  );

CREATE POLICY "Users can vote on their own polls" ON votes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = votes.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

-- Poll shares policies
CREATE POLICY "Anyone can view shares for public polls" ON poll_shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_shares.poll_id 
      AND polls.visibility = 'public'
    )
  );

CREATE POLICY "Users can view shares for their own polls" ON poll_shares
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_shares.poll_id 
      AND polls.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create shares for public polls" ON poll_shares
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM polls 
      WHERE polls.id = poll_shares.poll_id 
      AND polls.visibility = 'public'
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Note: Sample data insertion is commented out because it requires a real user in auth.users
-- Uncomment and modify these lines after you have real users in your auth.users table
-- INSERT INTO profiles (id, email, full_name) VALUES 
--   ('your-real-user-id-here', 'demo@example.com', 'Demo User');

-- Note: Sample polls are commented out because they require a real user in auth.users
-- Uncomment and modify these lines after you have real users in your auth.users table
-- INSERT INTO polls (id, title, description, creator_id, visibility, status) VALUES 
--   ('11111111-1111-1111-1111-111111111111', 'Which feature should we build next?', 'Help us prioritize features for the next release. Pick the option you want most or add a comment.', 'your-real-user-id-here', 'public', 'active'),
--   ('22222222-2222-2222-2222-222222222222', 'Team Lunch Preferences', 'Where should we go for our next team lunch?', 'your-real-user-id-here', 'public', 'active');

-- Note: Sample poll options and votes are commented out because they require real polls
-- Uncomment and modify these lines after you have real polls in your database
-- INSERT INTO poll_options (poll_id, label, description, order_index) VALUES 
--   ('11111111-1111-1111-1111-111111111111', 'Real-time results', 'See live updates as people vote', 1),
--   ('11111111-1111-1111-1111-111111111111', 'Anonymous voting', 'Allow users to vote without revealing their identity', 2),
--   ('11111111-1111-1111-1111-111111111111', 'Export results (CSV)', 'Download poll results in CSV format', 3),
--   ('11111111-1111-1111-1111-111111111111', 'Multi-select polls', 'Allow users to select multiple options', 4),
--   ('22222222-2222-2222-2222-222222222222', 'Italian Restaurant', 'Authentic Italian cuisine', 1),
--   ('22222222-2222-2222-2222-222222222222', 'Sushi Bar', 'Fresh sushi and Japanese dishes', 2),
--   ('22222222-2222-2222-2222-222222222222', 'Mexican Grill', 'Spicy Mexican favorites', 3),
--   ('22222222-2222-2222-2222-222222222222', 'Pizza Place', 'Casual pizza and pasta', 4);

-- -- Insert some sample votes
-- INSERT INTO votes (poll_id, option_id, voter_id) VALUES 
--   ('11111111-1111-1111-1111-111111111111', (SELECT id FROM poll_options WHERE poll_id = '11111111-1111-1111-1111-111111111111' AND label = 'Real-time results'), 'your-real-user-id-here'),
--   ('11111111-1111-1111-1111-111111111111', (SELECT id FROM poll_options WHERE poll_id = '11111111-1111-1111-1111-111111111111' AND label = 'Anonymous voting'), 'your-real-user-id-here'),
--   ('22222222-2222-2222-2222-222222222222', (SELECT id FROM poll_options WHERE poll_id = '22222222-2222-2222-2222-222222222222' AND label = 'Italian Restaurant'), 'your-real-user-id-here');
