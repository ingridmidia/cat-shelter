module.exports = {
    // Formats a text to be title-case (e.g., "german shepherd" -> "German Shepherd")
    formatTitleCase: (str) => {
      return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    },
  
    // Checks if a cat is adoptable and returns a string
    isAdoptable: (adoptable) => {
      return adoptable ? 'Available for Adoption' : 'Already Adopted';
    },
  
    // Formats a boolean value to display as 'Yes' or 'No'
    formatBooleanToYesNo: (value) => {
      return value ? 'Yes' : 'No';
    },
  
    // Any other helpers you might find useful...
  };
  