// Tiny client-side helper to remember the admin password locally so the panel doesn't
// re-prompt on every action. Server still validates on every request.
const KEY = "admin_pw";
export const getAdminPw = () => (typeof window === "undefined" ? "" : localStorage.getItem(KEY) ?? "");
export const setAdminPw = (pw: string) => localStorage.setItem(KEY, pw);
export const clearAdminPw = () => localStorage.removeItem(KEY);
