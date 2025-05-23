// lib/utils/date-service.ts
import {
  format,
  parseISO,
  addDays,
  differenceInDays,
  isBefore,
} from "date-fns";
import { fr } from "date-fns/locale";

export class DateService {
  // Pour vos projets avec startDate/endDate
  static formatProjectDate(date: Date | string): string {
    const dateObj = typeof date === "string" ? parseISO(date) : date;
    return format(dateObj, "dd MMM yyyy", { locale: fr });
  }

  // Pour vos tâches avec dueDate
  static formatTaskDueDate(dueDate: Date | string): string {
    const date = typeof dueDate === "string" ? parseISO(dueDate) : dueDate;
    const today = new Date();

    if (isBefore(date, today)) {
      return `En retard (${format(date, "dd/MM", { locale: fr })})`;
    }

    const daysLeft = differenceInDays(date, today);
    if (daysLeft === 0) return "Aujourd'hui";
    if (daysLeft === 1) return "Demain";

    return format(date, "dd MMM", { locale: fr });
  }

  // Pour vos sprints
  static getSprintDuration(
    startDate: Date | string,
    endDate: Date | string
  ): number {
    const start =
      typeof startDate === "string" ? parseISO(startDate) : startDate;
    const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
    return differenceInDays(end, start);
  }
}
