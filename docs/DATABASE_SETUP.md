# Database Setup Guide

## Overview

This guide will help you set up the Supabase database for your polling app. The database includes tables for polls, options, votes, user profiles, and poll shares, with full Row Level Security (RLS) policies.

## Prerequisites

1. A Supabase account and project
2. Your Supabase project URL and anon key
3. Access to the Supabase SQL editor

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `alx-polly-project` (or your preferred name)
   - Database Password: Choose a strong password
   - Region: Select the closest region to your users
5. Click "Create new project"
6. Wait for the project to be set up (usually 1-2 minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to Settings → API
2. Copy the following values:
   - Project URL
   - Anon public key

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Run the Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the entire contents of `database/schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

This will create:
- All necessary tables (profiles, polls, poll_options, votes, poll_shares)
- Custom types and enums
- Indexes for performance
- Row Level Security policies
- Helper functions
- Sample data

## Step 5: Configure Authentication

1. Go to Authentication → Settings in your Supabase dashboard
2. Configure your authentication providers:
   - Email/Password (enabled by default)
   - Google, GitHub, etc. (optional)
3. Set up email templates if needed

## Step 6: Test the Setup

1. Start your development server: `npm run dev`
2. Navigate to your app
3. Try creating a poll and voting
4. Check the Supabase dashboard to see if data is being created

## Database Schema Overview

### Tables

#### `profiles`
- Extends Supabase auth.users
- Stores user profile information
- Automatically created when users sign up

#### `polls`
- Main polls table
- Stores poll metadata and settings
- Links to creator via `creator_id`

#### `poll_options`
- Poll voting options
- Ordered by `order_index`
- Links to poll via `poll_id`

#### `votes`
- Individual votes cast by users
- Supports both authenticated and anonymous voting
- Prevents duplicate votes with unique constraint

#### `poll_shares`
- Tracks QR code usage and sharing
- Used for analytics and tracking

### Key Features

#### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access data they're authorized to see
- Public polls are visible to everyone
- Private polls are only visible to creators

#### Helper Functions
- `get_poll_results(poll_uuid)` - Get formatted poll results
- `has_user_voted(poll_uuid, user_uuid)` - Check if user has voted
- `get_poll_total_votes(poll_uuid)` - Get total vote count

#### Real-time Subscriptions
- Live updates when votes are cast
- Real-time poll updates
- WebSocket connections for instant feedback

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that your `.env.local` file exists and has the correct variables
   - Restart your development server after adding environment variables

2. **"Permission denied" errors**
   - Make sure RLS policies are correctly set up
   - Check that users are authenticated when required
   - Verify the SQL schema was run completely

3. **"Table doesn't exist" errors**
   - Run the complete schema SQL again
   - Check that all tables were created successfully

4. **Authentication issues**
   - Verify your Supabase project URL and key are correct
   - Check that authentication is enabled in your Supabase dashboard

### Verification Steps

1. **Check Tables**: Go to Table Editor in Supabase dashboard
   - Verify all tables exist: `profiles`, `polls`, `poll_options`, `votes`, `poll_shares`

2. **Check RLS**: Go to Authentication → Policies
   - Verify RLS is enabled on all tables
   - Check that policies are created

3. **Check Functions**: Go to SQL Editor → Functions
   - Verify helper functions exist: `get_poll_results`, `has_user_voted`, `get_poll_total_votes`

4. **Test Authentication**: Try signing up a new user
   - Check that a profile is automatically created
   - Verify the user can create polls

## Sample Data

The schema includes sample data for testing:
- Demo user: `demo@example.com`
- Sample polls with options and votes
- Use these to test the QR code functionality

## Next Steps

After setting up the database:

1. Update your components to use the new database functions
2. Test the QR code functionality with real data
3. Implement real-time updates for live voting
4. Add analytics and reporting features

## Security Notes

- All tables have Row Level Security enabled
- Users can only access data they're authorized to see
- Anonymous voting is supported but tracked
- IP addresses and user agents are logged for security
- Unique constraints prevent duplicate votes

## Performance Considerations

- Indexes are created on frequently queried columns
- Poll results are calculated using database functions
- Real-time subscriptions use efficient WebSocket connections
- Consider adding additional indexes based on your usage patterns
