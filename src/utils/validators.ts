export const validators = {
  email: (email: string): boolean => {
    const re = /^\S+@\S+\.\S+$/;
    return re.test(email);
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },

  phone: (phone: string): boolean => {
    const re = /^[6-9]\d{9}$/;
    return re.test(phone);
  },

  pan: (pan: string): boolean => {
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(pan);
  },

  amount: (amount: number): boolean => {
    return amount > 0 && amount <= 10000000; // Max 1 crore
  },
};

