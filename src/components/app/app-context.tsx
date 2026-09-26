import { createContext, useContext, useState, type ReactNode } from "react";
import type { Person } from "@/lib/demo-data";

type AppContextValue = {
  favorites: string[]; toggleFavorite: (id:string) => void;
  aiOpen: boolean; setAiOpen: (open:boolean) => void;
  displayedResults: Person[] | null; setDisplayedResults: (list: Person[] | null) => void;
};
const AppContext = createContext<AppContextValue | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>(["RZ-2026-004788"]);
  const [aiOpen, setAiOpen] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<Person[] | null>(null);
  const toggleFavorite = (id:string) => setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
  return <AppContext.Provider value={{ favorites, toggleFavorite, aiOpen, setAiOpen, displayedResults, setDisplayedResults }}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppState must be used within AppProvider");
  return value;
}
