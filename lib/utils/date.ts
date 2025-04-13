import { formatDistanceToNow } from 'date-fns';

export function formatLastEdited(
  dateString: string | null | undefined
): string {
  if (!dateString) return 'Never edited';

  try {
    // Parse the date string, handling both ISO and other formats
    const date = new Date(dateString);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Invalid date';
    }

    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}
