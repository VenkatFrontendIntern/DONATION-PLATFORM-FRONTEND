export const socialShare = {
  whatsapp: (url: string, text: string): void => {
    const message = encodeURIComponent(`${text}\n${url}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  },

  facebook: (url: string): void => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  },

  twitter: (url: string, text: string): void => {
    const message = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${message}`, '_blank');
  },

  copyLink: async (url: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch (error) {
      return false;
    }
  },
};

