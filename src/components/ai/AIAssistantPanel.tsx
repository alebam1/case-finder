import { useRouterState } from "@tanstack/react-router";
import { FileText, RotateCcw, SendHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useAppState } from "@/components/app/app-context";
import { StatusBadge } from "@/components/app/status-badge";
import { AIMessage, AIThinking, type ChatMessage } from "@/components/ai/AIMessage";
import { AIAssistantError, askWithTimeout, toRecordContext, toResultsContext, type RecordContext } from "@/lib/ai-assistant";
import { people } from "@/lib/demo-data";

const quick = ["Объяснить найденную запись", "Кратко описать запись", "Какие сведения указаны в карточке?", "Помочь найти нужную информацию"];

export function AIAssistantPanel() {
  const { aiOpen, setAiOpen, displayedResults } = useAppState();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const routeRecordId = pathname.startsWith("/records/") ? decodeURIComponent(pathname.split("/")[2] ?? "") : undefined;
  const [contextId, setContextId] = useState<string | undefined>(routeRecordId);
  const [picking, setPicking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hint, setHint] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setContextId(routeRecordId); }, [routeRecordId]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: "end" }); }, [messages, loading]);

  const record = people.find((p) => p.id === contextId);
  const context: RecordContext = useMemo(() => record ? toRecordContext(record) : displayedResults ? toResultsContext(displayedResults) : { type: "none" }, [record, displayedResults]);

  const send = async (text: string) => {
    const q = text.trim();
    if (!q) { setHint("Введите вопрос."); return; }
    if (loading) return;
    setHint("");
    if (context.type === "none") { setHint("Нет контекста: откройте карточку записи или выполните поиск."); return; }
    const id = Date.now();
    setMessages((m) => [...m, { id, role: "user", text: q }]);
    setInput(""); setLoading(true);
    try {
      const a = await askWithTimeout(q, context);
      setMessages((m) => [...m, { id: id + 1, role: "assistant", text: a.text, source: a.source }]);
    } catch (e) {
      const kind = e instanceof AIAssistantError ? e.kind : "request";
      const text = kind === "timeout" ? "Превышено время ожидания. Попробуйте ещё раз." : kind === "unavailable" ? "AI-помощник временно недоступен. Попробуйте ещё раз." : "Не удалось получить ответ. Попробуйте ещё раз.";
      setMessages((m) => [...m, { id: id + 1, role: "error", text }]);
    } finally { setLoading(false); }
  };

  return <Sheet open={aiOpen} onOpenChange={setAiOpen}>
    <SheetContent className="flex w-[96vw] flex-col gap-0 p-0 sm:max-w-none md:w-[65vw] lg:w-[460px] [&>button]:hidden">
      <header className="flex items-start justify-between gap-3 border-b px-5 py-4">
        <div><SheetTitle className="text-base">AI-помощник</SheetTitle><SheetDescription className="text-xs">Ответы на основании доступных данных системы</SheetDescription></div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="size-8" onClick={() => { setMessages([]); setHint(""); }} disabled={!messages.length || loading} aria-label="Очистить диалог" title="Очистить диалог"><RotateCcw className="size-4" /></Button>
          <Button variant="ghost" size="icon" className="size-8" onClick={() => setAiOpen(false)} aria-label="Закрыть"><X className="size-4" /></Button>
        </div>
      </header>

      <div className="border-b bg-muted/40 px-5 py-3">
        <div className="flex items-center justify-between gap-2"><p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Текущий контекст</p><Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => setPicking((v) => !v)}>Сменить контекст</Button></div>
        {record ? <div className="mt-2 flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-medium"><FileText className="mr-1.5 inline size-3.5 text-primary" />{record.name}</p><p className="text-xs text-muted-foreground">{record.id}</p></div><StatusBadge status={record.status} /></div>
          : displayedResults ? <p className="mt-2 text-sm">Результаты текущего поиска · {displayedResults.length}</p>
          : <p className="mt-2 text-sm text-muted-foreground">Контекст не выбран</p>}
        {picking && <div className="mt-3 max-h-48 space-y-1 overflow-y-auto border-t pt-2">
          {displayedResults && <button className="block w-full rounded-sm px-2 py-1.5 text-left text-xs hover:bg-muted" onClick={() => { setContextId(undefined); setPicking(false); }}>Результаты текущего поиска ({displayedResults.length})</button>}
          {people.map((p) => <button key={p.id} className="block w-full rounded-sm px-2 py-1.5 text-left text-xs hover:bg-muted" onClick={() => { setContextId(p.id); setPicking(false); }}>{p.name} <span className="text-muted-foreground">· {p.id}</span></button>)}
        </div>}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
        {messages.length === 0 && !loading && <div><h3 className="text-sm font-semibold">Чем могу помочь?</h3><div className="mt-3 grid gap-2">{quick.map((q) => <Button key={q} variant="outline" size="sm" className="h-auto justify-start whitespace-normal py-2 text-left font-normal" onClick={() => send(q)}>{q}</Button>)}</div></div>}
        {messages.map((m) => <AIMessage key={m.id} message={m} />)}
        {loading && <AIThinking />}
        <div ref={endRef} />
      </div>

      <form className="border-t p-3" onSubmit={(e) => { e.preventDefault(); send(input); }}>
        {hint && <p className="mb-2 text-xs text-destructive">{hint}</p>}
        <div className="flex items-end gap-2">
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder="Напишите вопрос..." rows={1} className="max-h-32 min-h-10 resize-none" aria-label="Вопрос AI-помощнику" />
          <Button type="submit" size="icon" disabled={loading} aria-label="Отправить"><SendHorizontal /></Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">Enter — отправить, Shift+Enter — новая строка. Диалог не сохраняется.</p>
      </form>
    </SheetContent>
  </Sheet>;
}
