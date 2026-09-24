import type { PersonStatus } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: PersonStatus }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-xs font-medium", status === "Активен" && "bg-status-active text-status-active-foreground", status === "Требует проверки" && "bg-status-review text-status-review-foreground", status === "Приостановлен" && "bg-muted text-muted-foreground")}><span className="size-1.5 rounded-full bg-current" />{status}</span>;
}
