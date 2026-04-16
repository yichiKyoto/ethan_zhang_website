import { createContext } from "react";

export const Context = createContext({
  language: 'English',
  setLanguage: (_language: string) => {},
  isAdmin: false,
  setAdmin: (_isAdmin: boolean) => {},
});

