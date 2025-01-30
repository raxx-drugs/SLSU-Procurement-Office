export const formatDate = (date) => {
    if (!date) return "";  // return empty string if date is null or undefined
    const d = new Date(date);
    if (isNaN(d)) return "";  // return empty string if date is invalid
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
  };

// Utility function to format the date to a time string
export const formatDateToTimeString = (date) => {
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric', 
    hour: 'numeric', 
    minute: 'numeric', 
    hour12: true 
  };
  return new Date(date).toLocaleString('en-US', options);
};