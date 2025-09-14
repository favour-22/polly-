import { getPolls } from '@/lib/database';
import type { Poll } from '@/lib/types';

/**
 * @deprecated This function is deprecated. Use `getPolls` directly from `@/lib/database` instead.
 */
export async function fetchPolls(): Promise<Poll[]> {
  try {
    return await getPolls();
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
}