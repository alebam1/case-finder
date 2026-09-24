import { createContext, useContext, useState, type ReactNode } from "react";

type AppContextValue = { favorites: string[]; toggleFavorite: (id:string) => void };
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["RZ-2026-004788"]);
  const toggleFavorite = (id:string) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <AppContext.Provider value={{ favorites, toggleFavorite }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState must be used within AppProvider");
  return value;
}
