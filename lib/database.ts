import { supabase } from './supabase';
import type { 
  Poll, 
  PollOption, 
  Vote, 
  PollWithOptions, 
  PollResult, 
  CreatePollData, 
  VoteData,
  Profile 
} from './types';

// Profile functions
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }

  return data;
}

// Poll functions
export async function getPolls(): Promise<(Poll & { total_votes: number; options_count: number })[]> {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      creator:profiles(id, email, full_name, avatar_url)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching polls:', error);
    return [];
  }

  // If no polls exist, return empty array
  if (!data || data.length === 0) {
    return [];
  }

  // Get vote counts and options counts for each poll
  const pollsWithCounts = await Promise.all(
    data.map(async (poll) => {
      const [totalVotes, optionsCount] = await Promise.all([
        getTotalVotes(poll.id),
        supabase
          .from('poll_options')
          .select('*', { count: 'exact', head: true })
          .eq('poll_id', poll.id)
          .then(({ count }) => count || 0)
      ]);

      return {
        ...poll,
        total_votes: totalVotes,
        options_count: optionsCount
      };
    })
  );

  return pollsWithCounts;
}

export async function getPoll(pollId: string): Promise<PollWithOptions | null> {
  // Get poll with creator info
  const { data: pollData, error: pollError } = await supabase
    .from('polls')
    .select(`
      *,
      creator:profiles(id, email, full_name, avatar_url)
    `)
    .eq('id', pollId)
    .single();

  if (pollError) {
    console.error('Error fetching poll:', pollError);
    return null;
  }

  // Get poll options
  const { data: optionsData, error: optionsError } = await supabase
    .from('poll_options')
    .select('*')
    .eq('poll_id', pollId)
    .order('order_index', { ascending: true });

  if (optionsError) {
    console.error('Error fetching poll options:', optionsError);
    return null;
  }

  // Get total votes
  const { count: totalVotes, error: votesError } = await supabase
    .from('votes')
    .select('*', { count: 'exact', head: true })
    .eq('poll_id', pollId);

  if (votesError) {
    console.error('Error fetching vote count:', votesError);
    return null;
  }

  return {
    ...pollData,
    options: optionsData || [],
    total_votes: totalVotes || 0
  };
}

export async function createPoll(pollData: CreatePollData, creatorId: string): Promise<string | null> {
  // Start a transaction
  const { data: poll, error: pollError } = await supabase
    .from('polls')
    .insert({
      title: pollData.title,
      description: pollData.description,
      creator_id: creatorId,
      visibility: pollData.visibility || 'public',
      allow_multiple_votes: pollData.allow_multiple_votes || false,
      allow_anonymous_votes: pollData.allow_anonymous_votes || false,
      expires_at: pollData.expires_at
    })
    .select('id')
    .single();

  if (pollError) {
    console.error('Error creating poll:', pollError);
    return null;
  }

  // Insert poll options
  const optionsToInsert = pollData.options.map((label, index) => ({
    poll_id: poll.id,
    label,
    order_index: index
  }));

  const { error: optionsError } = await supabase
    .from('poll_options')
    .insert(optionsToInsert);

  if (optionsError) {
    console.error('Error creating poll options:', optionsError);
    // Clean up the poll if options creation fails
    await supabase.from('polls').delete().eq('id', poll.id);
    return null;
  }

  return poll.id;
}

export async function updatePoll(pollId: string, updates: Partial<Poll>): Promise<boolean> {
  const { error } = await supabase
    .from('polls')
    .update(updates)
    .eq('id', pollId);

  if (error) {
    console.error('Error updating poll:', error);
    return false;
  }

  return true;
}

export async function deletePoll(pollId: string): Promise<boolean> {
  const { error } = await supabase
    .from('polls')
    .delete()
    .eq('id', pollId);

  if (error) {
    console.error('Error deleting poll:', error);
    return false;
  }

  return true;
}

// Vote functions
export async function getPollResults(pollId: string): Promise<PollResult[]> {
  const { data, error } = await supabase
    .rpc('get_poll_results', { poll_uuid: pollId });

  if (error) {
    console.error('Error fetching poll results:', error);
    return [];
  }

  return data || [];
}

export async function submitVote(voteData: VoteData, userId?: string): Promise<boolean> {
  const { error } = await supabase
    .from('votes')
    .insert({
      poll_id: voteData.poll_id,
      option_id: voteData.option_id,
      voter_id: userId,
      voter_email: voteData.voter_email,
      voter_name: voteData.voter_name
    });

  if (error) {
    console.error('Error submitting vote:', error);
    return false;
  }

  return true;
}

export async function hasUserVoted(pollId: string, userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .rpc('has_user_voted', { 
      poll_uuid: pollId, 
      user_uuid: userId 
    });

  if (error) {
    console.error('Error checking if user voted:', error);
    return false;
  }

  return data || false;
}

export async function getTotalVotes(pollId: string): Promise<number> {
  const { data, error } = await supabase
    .rpc('get_poll_total_votes', { poll_uuid: pollId });

  if (error) {
    console.error('Error getting total votes:', error);
    return 0;
  }

  return data || 0;
}

// Poll shares functions
export async function recordPollShare(pollId: string, shareMethod: string, sharedBy?: string): Promise<boolean> {
  const { error } = await supabase
    .from('poll_shares')
    .insert({
      poll_id: pollId,
      shared_by: sharedBy,
      share_method: shareMethod
    });

  if (error) {
    console.error('Error recording poll share:', error);
    return false;
  }

  return true;
}

export async function getPollShares(pollId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('poll_shares')
    .select('*')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching poll shares:', error);
    return [];
  }

  return data || [];
}

// User's polls functions
export async function getUserPolls(userId: string): Promise<Poll[]> {
  const { data, error } = await supabase
    .from('polls')
    .select(`
      *,
      creator:profiles(id, email, full_name, avatar_url)
    `)
    .eq('creator_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user polls:', error);
    return [];
  }

  return data || [];
}

// Real-time subscriptions
export function subscribeToPollVotes(pollId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`poll_votes_${pollId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'votes',
        filter: `poll_id=eq.${pollId}`
      },
      callback
    )
    .subscribe();
}

export function subscribeToPollUpdates(pollId: string, callback: (payload: any) => void) {
  return supabase
    .channel(`poll_updates_${pollId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'polls',
        filter: `id=eq.${pollId}`
      },
      callback
    )
    .subscribe();
}
