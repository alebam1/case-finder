import { AlertCircle, Database } from "lucide-react";
import type { AISource } from "@/lib/ai-assistant";
import { cn } from "@/lib/utils";

export type ChatMessage = { id: number; role: "user" | "assistant" | "error"; text: string; source?: AISource };

const sourceLabel: Record<AISource, string> = { record: "Источник: текущая карточка", results: "Источник: результаты текущего поиска" };

export function AIMessage({ message }: { message: ChatMessage }) {
  if (message.role === "user") return <div className="flex justify-end"><div className="max-w-[85%] whitespace-pre-wrap rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground">{message.text}</div></div>;
  if (message.role === "error") return <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" />{message.text}</div>;
  return <div className="max-w-[92%]">
    <div className={cn("whitespace-pre-wrap text-sm leading-relaxed text-foreground")}>{message.text}</div>
    {message.source && <p className="mt-2 inline-flex items-center gap-1.5 rounded-sm border bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"><Database className="size-3" />{sourceLabel[message.source]}</p>}
  </div>;
}

export function AIThinking() {
  return <div className="max-w-[80%] space-y-2" aria-live="polite">
    <p className="text-xs font-medium text-muted-foreground">Анализирую данные...</p>
    <div className="h-3 w-56 animate-pulse rounded-sm bg-muted" /><div className="h-3 w-40 animate-pulse rounded-sm bg-muted" />
  </div>;
}
