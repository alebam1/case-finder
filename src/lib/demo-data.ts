import askarPhoto from "@/assets/person-askar.jpg";
import dinaraPhoto from "@/assets/person-dinara.jpg";
import viktorPhoto from "@/assets/person-viktor.jpg";
import malikaPhoto from "@/assets/person-malika.jpg";

export type PersonStatus = "Активен" | "Требует проверки" | "Приостановлен";
export type Person = {
  id: string; photo: string; name: string; surname: string; firstName: string; patronymic: string;
  birthDate: string; citizenship: string; gender: "Мужской" | "Женский"; document: string;
  initiator: string; status: PersonStatus; added: string; updated: string; caseNumber: string;
  basis: string; notes: string;
};

export const people: Person[] = [
  { id:"RZ-2026-004821", photo:askarPhoto, name:"Сагындыков Аскар Нурланович", surname:"Сагындыков", firstName:"Аскар", patronymic:"Нурланович", birthDate:"14.03.1984", citizenship:"Казахстан", gender:"Мужской", document:"NQ 4829163", initiator:"ДП г. Астана", status:"Активен", added:"18.09.2026", updated:"24.09.2026, 09:42", caseNumber:"ОРД-26-1842", basis:"Розыск по постановлению уполномоченного органа", notes:"Сведения представлены исключительно в демонстрационных целях." },
  { id:"RZ-2026-004788", photo:dinaraPhoto, name:"Каримова Динара Рустамовна", surname:"Каримова", firstName:"Динара", patronymic:"Рустамовна", birthDate:"28.11.1990", citizenship:"Узбекистан", gender:"Женский", document:"FA 7312054", initiator:"ГУВД г. Ташкент", status:"Требует проверки", added:"16.09.2026", updated:"23.09.2026, 16:18", caseNumber:"РМ-116/26", basis:"Уточнение местонахождения", notes:"Запись полностью вымышлена. Не является сведением о реальном лице." },
  { id:"RZ-2026-004701", photo:viktorPhoto, name:"Мельников Виктор Сергеевич", surname:"Мельников", firstName:"Виктор", patronymic:"Сергеевич", birthDate:"06.07.1978", citizenship:"Кыргызстан", gender:"Мужской", document:"AN 0948157", initiator:"ГУВД г. Бишкек", status:"Активен", added:"08.09.2026", updated:"24.09.2026, 08:05", caseNumber:"КР-771/26", basis:"Межгосударственный розыск", notes:"Совпадение требует обязательной проверки уполномоченным сотрудником." },
  { id:"RZ-2026-004635", photo:malikaPhoto, name:"Юсупова Малика Азизовна", surname:"Юсупова", firstName:"Малика", patronymic:"Азизовна", birthDate:"19.01.1997", citizenship:"Таджикистан", gender:"Женский", document:"TJ 5720184", initiator:"УМВД г. Душанбе", status:"Приостановлен", added:"01.09.2026", updated:"22.09.2026, 11:31", caseNumber:"ТД-480/26", basis:"Розыск по материалам проверки", notes:"Демонстрационная карточка, все идентификаторы вымышлены." },
  { id:"RZ-2026-004514", photo:askarPhoto, name:"Омаров Тимур Бахытович", surname:"Омаров", firstName:"Тимур", patronymic:"Бахытович", birthDate:"02.12.1987", citizenship:"Казахстан", gender:"Мужской", document:"NQ 6639201", initiator:"ДП Алматинской области", status:"Активен", added:"25.08.2026", updated:"21.09.2026, 14:52", caseNumber:"ОРД-26-1604", basis:"Установление местонахождения", notes:"Фотография и сведения сгенерированы для прототипа." },
  { id:"RZ-2026-004477", photo:dinaraPhoto, name:"Ахмедова Саида Ильхомовна", surname:"Ахмедова", firstName:"Саида", patronymic:"Ильхомовна", birthDate:"11.05.1989", citizenship:"Узбекистан", gender:"Женский", document:"AA 8071432", initiator:"УВД Самаркандской области", status:"Активен", added:"20.08.2026", updated:"20.09.2026, 10:06", caseNumber:"СМ-228/26", basis:"Межгосударственный розыск", notes:"Данные не относятся к реальным лицам." },
];

export const historyItems = [
  { date:"24.09.2026", time:"10:18", query:"Сагындыков · Казахстан · мужской", count:1 },
  { date:"24.09.2026", time:"09:47", query:"Документ: FA 7312054", count:1 },
  { date:"23.09.2026", time:"16:32", query:"Гражданство: Узбекистан", count:12 },
  { date:"23.09.2026", time:"11:05", query:"Инициатор: ГУВД г. Бишкек", count:8 },
];
