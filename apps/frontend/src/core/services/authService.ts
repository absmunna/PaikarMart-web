export const authService = {
  setToken: (token: string) => localStorage.setItem('pm_token', token),
  getToken: () => localStorage.getItem('pm_token'),
  clearToken: () => localStorage.removeItem('pm_token'),
  parseJwt: (token: string) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  },
};
