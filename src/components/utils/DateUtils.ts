export const convertToLocalDate = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  const localDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};

export const formatDbDateDisplay = (dateString: string | null | undefined): string => {
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};
