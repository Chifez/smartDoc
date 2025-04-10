import { formatDistanceToNow } from 'date-fns';

export function formatLastEdited(date: string | Date): string {
  const now = new Date();
  const lastEdited = new Date(date);
  const diffInSeconds = Math.floor(
    (now.getTime() - lastEdited.getTime()) / 1000
  );

  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }

  return formatDistanceToNow(lastEdited, { addSuffix: true });
}
