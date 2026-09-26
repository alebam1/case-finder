import type { Person } from "@/lib/demo-data";

/** Системный prompt для будущего подключения реального API. */
export const AI_SYSTEM_PROMPT = `Ты являешься встроенным помощником информационной системы.

Отвечай исключительно на основании данных, переданных приложением в текущем контексте.

Не используй интернет.
Не используй собственные знания для дополнения отсутствующей информации.
Не придумывай сведения.
Не делай предположений о человеке.
Не устанавливай виновность человека.
Не превращай отсутствие данных в утверждение.

Если пользователь спрашивает о сведении, которого нет в переданных данных, ответь:

'В доступных данных системы эта информация отсутствует.'

Если вопрос неоднозначный, попроси уточнить его.

Если информация присутствует в данных, кратко перескажи её понятным языком и не изменяй её смысл.

Всегда различай:

1. что непосредственно указано в данных;
2. чего в данных нет.`;

export const MISSING = "В доступных данных системы эта информация отсутствует.";

/** Минимально необходимый контекст одной записи. */
export type RecordFields = {
  name?: string; birthDate?: string; citizenship?: string; gender?: string; document?: string;
  status?: string; searchInitiator?: string; searchReason?: string; caseNumber?: string;
  added?: string; updated?: string; notes?: string;
};

export type RecordContext =
  | { type: "record"; record: RecordFields }
  | { type: "results"; results: Pick<RecordFields, "name" | "birthDate" | "citizenship" | "gender" | "status" | "searchInitiator">[] }
  | { type: "none" };

export type AISource = "record" | "results";
export type AIAnswer = { text: string; source?: AISource };

export class AIAssistantError extends Error {
  constructor(public kind: "unavailable" | "request" | "timeout" | "empty" | "no-context") { super(kind); }
}

export interface AIAssistantService {
  ask(question: string, context: RecordContext): Promise<AIAnswer>;
}

export function toRecordContext(p: Person): RecordContext {
  return { type: "record", record: {
    name: p.name, birthDate: p.birthDate, citizenship: p.citizenship, gender: p.gender, document: p.document,
    status: p.status, searchInitiator: p.initiator, searchReason: p.basis, caseNumber: p.caseNumber,
    added: p.added, updated: p.updated, notes: p.notes,
  } };
}

export function toResultsContext(list: Person[]): RecordContext {
  return { type: "results", results: list.map((p) => ({ name: p.name, birthDate: p.birthDate, citizenship: p.citizenship, gender: p.gender, status: p.status, searchInitiator: p.initiator })) };
}

const has = (q: string, ...words: string[]) => words.some((w) => q.includes(w));
const val = (v?: string) => (v && v.trim() ? v : undefined);
const line = (label: string, v?: string) => `${label}: ${val(v) ?? "не указано"}`;

function answerRecord(q: string, r: RecordFields): string {
  if (has(q, "объясн", "кратко", "опиш", "резюм")) {
    return [
      `В карточке указано: ${val(r.name) ?? "ФИО не указано"}, дата рождения ${val(r.birthDate) ?? "не указана"}, гражданство — ${val(r.citizenship) ?? "не указано"}.`,
      `Статус записи: «${val(r.status) ?? "не указан"}». Инициатор розыска: ${val(r.searchInitiator) ?? "не указан"}.`,
      `Основание, указанное в карточке: ${val(r.searchReason) ?? "не указано"}.`,
      "Сведения о виновности или обстоятельствах дела в данных отсутствуют.",
    ].join("\n\n");
  }
  if (has(q, "какие сведения", "что указано", "поля", "карточк")) {
    return ["В карточке указаны следующие сведения:", line("ФИО", r.name), line("Дата рождения", r.birthDate), line("Гражданство", r.citizenship), line("Пол", r.gender), line("Документ", r.document), line("Статус", r.status), line("Инициатор", r.searchInitiator), line("Основание", r.searchReason), line("Номер дела", r.caseNumber), line("Дата добавления", r.added), line("Обновлено", r.updated)].join("\n");
  }
  if (has(q, "за что", "почему", "основан", "причин")) return val(r.searchReason) ? `В карточке указано основание: «${r.searchReason}». Других сведений о причинах в данных нет.` : MISSING;
  if (has(q, "статус")) return val(r.status) ? `Статус записи: «${r.status}».` : MISSING;
  if (has(q, "инициатор", "кто разыск", "орган")) return val(r.searchInitiator) ? `Инициатор розыска: ${r.searchInitiator}.` : MISSING;
  if (has(q, "родил", "возраст", "дата рожд", "лет")) return val(r.birthDate) ? `Дата рождения по данным карточки: ${r.birthDate}.` : MISSING;
  if (has(q, "граждан", "страна")) return val(r.citizenship) ? `Гражданство: ${r.citizenship}.` : MISSING;
  if (has(q, "документ", "паспорт")) return val(r.document) ? `Документ: ${r.document}.` : MISSING;
  if (has(q, "дело", "номер")) return val(r.caseNumber) ? `Номер дела: ${r.caseNumber}.` : MISSING;
  if (has(q, "обнов", "добав", "когда")) return `Дата добавления: ${val(r.added) ?? "не указана"}. Последнее обновление: ${val(r.updated) ?? "не указано"}.`;
  if (has(q, "пол ")) return val(r.gender) ? `Пол: ${r.gender}.` : MISSING;
  if (has(q, "найти", "помо")) return "Уточните, какое сведение нужно найти: например, статус, основание, инициатор, документ или даты.";
  if (has(q, "адрес", "местонахожд", "телефон", "родствен", "работ", "где ")) return MISSING;
  return "Вопрос не удалось однозначно соотнести с данными карточки. Уточните, пожалуйста, какое сведение вас интересует.";
}

function answerResults(q: string, list: Extract<RecordContext, { type: "results" }>["results"]): string {
  if (list.length === 0) return "В текущем поиске нет отображаемых результатов.";
  const group = (key: keyof (typeof list)[number]) => {
    const m = new Map<string, number>();
    list.forEach((r) => { const v = val(r[key]); if (v) m.set(v, (m.get(v) ?? 0) + 1); });
    return [...m].map(([k, n]) => `${k} — ${n}`).join("\n");
  };
  if (has(q, "сколько", "количеств")) return `Среди отображаемых результатов: ${list.length}.`;
  if (has(q, "граждан")) return `Гражданства среди результатов:\n${group("citizenship")}`;
  if (has(q, "статус")) return `Статусы среди результатов:\n${group("status")}`;
  if (has(q, "инициатор")) return `Инициаторы среди результатов:\n${group("searchInitiator")}`;
  if (has(q, "пол")) return `Распределение по полу:\n${group("gender")}`;
  if (has(q, "кратко", "опиш", "объясн", "список", "кто")) return `Отображаемые результаты (${list.length}):\n${list.map((r) => `• ${r.name ?? "ФИО не указано"}, ${r.birthDate ?? "—"}, ${r.status ?? "—"}`).join("\n")}\n\nДля подробного разбора откройте конкретную запись.`;
  if (has(q, "найти", "помо")) return "Могу подсказать количество результатов, гражданства, статусы или инициаторов среди отображаемых записей. Уточните запрос.";
  return "Уточните вопрос. Я могу отвечать только по отображаемым результатам текущего поиска.";
}

export const mockAIAssistantService: AIAssistantService = {
  async ask(question, context) {
    const q = ` ${question.trim().toLocaleLowerCase("ru")} `;
    if (!question.trim()) throw new AIAssistantError("empty");
    if (context.type === "none") throw new AIAssistantError("no-context");
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    if (context.type === "record") return { text: answerRecord(q, context.record), source: "record" };
    return { text: answerResults(q, context.results), source: "results" };
  },
};

/** Точка замены: позже здесь будет openAIAssistantService. */
export const aiAssistantService: AIAssistantService = mockAIAssistantService;

export async function askWithTimeout(question: string, context: RecordContext, ms = 15000): Promise<AIAnswer> {
  return Promise.race([
    aiAssistantService.ask(question, context),
    new Promise<never>((_, rej) => setTimeout(() => rej(new AIAssistantError("timeout")), ms)),
  ]);
}
