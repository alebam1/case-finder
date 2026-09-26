import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, BookOpen, ChevronDown, Clock3, FileSearch, Heart, History, Home, LogOut, Menu, Search, Settings, SlidersHorizontal, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AIAssistantButton } from "@/components/ai/AIAssistantButton";
import { AIAssistantPanel } from "@/components/ai/AIAssistantPanel";

const navigation = [
  { to:"/", label:"Главная", icon:Home }, { to:"/search", label:"Поиск", icon:Search },
  { to:"/advanced-search", label:"Расширенный поиск", icon:SlidersHorizontal }, { to:"/results", label:"Результаты", icon:FileSearch },
  { to:"/favorites", label:"Избранное", icon:Heart }, { to:"/history", label:"История поиска", icon:History },
  { to:"/help", label:"Справочная информация", icon:BookOpen }, { to:"/settings", label:"Настройки", icon:Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select:(state) => state.location.pathname });
  return <div className="min-h-screen bg-background">
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:flex lg:flex-col"><SidebarContent pathname={pathname} onNavigate={() => undefined} /></aside>
    {mobileOpen && <div className="fixed inset-0 z-50 lg:hidden"><button aria-label="Закрыть меню" className="absolute inset-0 bg-foreground/35" onClick={() => setMobileOpen(false)} /><aside className="relative flex h-full w-[min(19rem,88vw)] flex-col bg-sidebar shadow-xl"><Button variant="ghost" size="icon" className="absolute right-3 top-3 z-10" onClick={() => setMobileOpen(false)} aria-label="Закрыть меню"><X /></Button><SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} /></aside></div>}
    <div className="lg:pl-64">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-card px-4 lg:px-7">
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Открыть меню"><Menu /></Button>
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">Информационная система розыска</p><p className="hidden text-xs text-muted-foreground sm:block">Служебный контур · демонстрационный режим</p></div>
        <div className="relative hidden w-full max-w-md md:block"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-9" placeholder="Глобальный поиск по ФИО, документу, номеру" aria-label="Глобальный поиск" /></div>
        <AIAssistantButton />
        <Button variant="ghost" size="icon" className="relative" aria-label="Уведомления"><Bell/><span className="absolute right-2 top-2 size-1.5 rounded-full bg-destructive" /></Button>
        <button className="hidden items-center gap-2 rounded-sm p-1 text-left hover:bg-muted sm:flex" aria-label="Открыть профиль"><span className="grid size-8 place-items-center rounded-sm bg-primary text-xs font-semibold text-primary-foreground">АК</span><span className="hidden xl:block"><span className="block text-xs font-medium">Алексей Крылов</span><span className="block text-[11px] text-muted-foreground">Оператор</span></span><ChevronDown className="size-3 text-muted-foreground" /></button>
      </header>
      <main className="mx-auto max-w-[1600px] p-4 md:p-6 lg:p-7">{children}</main>
      <AIAssistantPanel />
    </div>
  </div>;
}

function SidebarContent({ pathname, onNavigate }:{ pathname:string; onNavigate:()=>void }) {
  return <><div className="flex h-20 items-center gap-3 border-b px-5"><div className="grid size-10 place-items-center rounded-sm bg-primary text-primary-foreground"><FileSearch className="size-5"/></div><div><p className="text-sm font-bold">ИС РОЗЫСК</p><p className="text-[11px] uppercase text-muted-foreground">Единый реестр</p></div></div>
  <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Основная навигация">{navigation.map(({to,label,icon:Icon}) => <Link key={to} to={to} onClick={onNavigate} className={cn("flex h-10 items-center gap-3 rounded-sm px-3 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent", pathname === to && "bg-primary text-primary-foreground hover:bg-primary")}><Icon className="size-4"/>{label}</Link>)}</nav>
  <div className="border-t p-3"><div className="flex items-center gap-3 rounded-sm px-2 py-3"><span className="grid size-9 place-items-center rounded-sm bg-secondary text-xs font-semibold"><UserRound className="size-4"/></span><div className="min-w-0 flex-1"><p className="truncate text-xs font-semibold">Алексей Крылов</p><p className="text-[11px] text-muted-foreground">Оператор системы</p></div></div><Button variant="ghost" className="w-full justify-start text-muted-foreground"><LogOut/>Выйти</Button></div></>;
}
