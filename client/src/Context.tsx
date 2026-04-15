import { createContext } from "react";

export const Context = createContext({
  language: 'English',
  setLanguage: (language: string) => {},
  isAdmin: false,
  setAdmin: (isAdmin: boolean) => {},
});

