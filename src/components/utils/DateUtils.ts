export const convertToLocalDate = (dateString: string | null | undefined): string => {
  console.log('dateString:', dateString);
  if (!dateString) {
    return '';
  }
  const date = new Date(dateString);
  // Adjust the date to the correct time zone (GMT+2)
  const localDate = new Date(date.getTime() + 2 * 60 * 60 * 1000);
  return localDate.toISOString().split('T')[0];
};
