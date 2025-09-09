export type PollVisibility = 'public' | 'private' | 'unlisted';
export type PollStatus = 'active' | 'closed' | 'draft';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  creator_id: string;
  visibility: PollVisibility;
  status: PollStatus;
  allow_multiple_votes: boolean;
  allow_anonymous_votes: boolean;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  label: string;
  description?: string;
  order_index: number;
  created_at: string;
}

export interface Vote {
  id: string;
  poll_id: string;
  option_id: string;
  voter_id?: string;
  voter_email?: string;
  voter_name?: string;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface PollShare {
  id: string;
  poll_id: string;
  shared_by?: string;
  share_method?: string;
  created_at: string;
}

export interface PollWithOptions extends Poll {
  options: PollOption[];
  creator: Profile;
  total_votes: number;
}

export interface PollResult {
  option_id: string;
  option_label: string;
  option_description?: string;
  vote_count: number;
  percentage: number;
}

export interface CreatePollData {
  title: string;
  description?: string | null;
  visibility?: PollVisibility;
  allow_multiple_votes?: boolean;
  allow_anonymous_votes?: boolean;
  expires_at?: string;
  options: string[];
}

export interface VoteData {
  poll_id: string;
  option_id: string;
  voter_email?: string;
  voter_name?: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      polls: {
        Row: Poll;
        Insert: Omit<Poll, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Poll, 'id' | 'created_at' | 'updated_at'>>;
      };
      poll_options: {
        Row: PollOption;
        Insert: Omit<PollOption, 'id' | 'created_at'>;
        Update: Partial<Omit<PollOption, 'id' | 'poll_id' | 'created_at'>>;
      };
      votes: {
        Row: Vote;
        Insert: Omit<Vote, 'id' | 'created_at'>;
        Update: Partial<Omit<Vote, 'id' | 'poll_id' | 'option_id' | 'created_at'>>;
      };
      poll_shares: {
        Row: PollShare;
        Insert: Omit<PollShare, 'id' | 'created_at'>;
        Update: Partial<Omit<PollShare, 'id' | 'poll_id' | 'created_at'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_poll_results: {
        Args: { poll_uuid: string };
        Returns: PollResult[];
      };
      has_user_voted: {
        Args: { poll_uuid: string; user_uuid: string };
        Returns: boolean;
      };
      get_poll_total_votes: {
        Args: { poll_uuid: string };
        Returns: number;
      };
    };
    Enums: {
      poll_visibility: PollVisibility;
      poll_status: PollStatus;
    };
  };
}
