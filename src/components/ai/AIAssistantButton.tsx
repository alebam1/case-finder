import { MessageSquareText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppState } from "@/components/app/app-context";

export function AIAssistantButton() {
  const { setAiOpen } = useAppState();
  return <Button variant="outline" size="sm" onClick={() => setAiOpen(true)} aria-label="Открыть AI-помощника" className="gap-2">
    <MessageSquareText className="size-4 text-primary" /><span className="hidden sm:inline">AI-помощник</span>
  </Button>;
}
