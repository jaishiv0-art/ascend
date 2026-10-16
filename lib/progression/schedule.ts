// ==============================================================================
// ASCEND - WEEKLY RECURRING QUEST SCHEDULE LOGIC
// Routine scheduling, day-of-week matching, and completion tracking
// ==============================================================================

import { Quest, Weekday } from '@/types/rpg';

export const WEEKDAYS: { id: Weekday; label: string; short: string; dayIndex: number }[] = [
  { id: 'mon', label: 'Monday', short: 'Mon', dayIndex: 1 },
  { id: 'tue', label: 'Tuesday', short: 'Tue', dayIndex: 2 },
  { id: 'wed', label: 'Wednesday', short: 'Wed', dayIndex: 3 },
  { id: 'thu', label: 'Thursday', short: 'Thu', dayIndex: 4 },
  { id: 'fri', label: 'Friday', short: 'Fri', dayIndex: 5 },
  { id: 'sat', label: 'Saturday', short: 'Sat', dayIndex: 6 },
  { id: 'sun', label: 'Sunday', short: 'Sun', dayIndex: 0 },
];

/**
 * Returns today's ISO date string 'YYYY-MM-DD' without local timezone skew.
 */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Extracts the 3-letter lowercase Weekday from a Date or 'YYYY-MM-DD' string.
 */
export function getWeekdayFromDate(date: Date | string): Weekday {
  let d: Date;
  if (typeof date === 'string') {
    if (date.length === 10) {
      const [year, month, day] = date.split('-').map(Number);
      d = new Date(year, month - 1, day);
    } else {
      d = new Date(date);
    }
  } else {
    d = date;
  }

  const dayIndex = d.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const map: Weekday[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return map[dayIndex];
}

/**
 * Checks if a quest is scheduled for a particular date (Date object or 'YYYY-MM-DD' string).
 * Supports:
 *  - One-off with no date (matches creation date or active board)
 *  - One-off with specific due date
 *  - Weekly recurring on selected weekdays
 */
export function isQuestScheduledForDate(quest: Quest, date: Date | string): boolean {
  const dateStr = typeof date === 'string' && date.length === 10
    ? date
    : typeof date === 'string'
    ? date.split('T')[0]
    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const targetWeekday = getWeekdayFromDate(dateStr);

  // 1. Recurring Quests
  if (quest.is_recurring) {
    if (quest.recurring_days && Array.isArray(quest.recurring_days) && quest.recurring_days.length > 0) {
      return quest.recurring_days.includes(targetWeekday as Weekday);
    }
    // If no specific recurring_days set, default daily repetition
    return true;
  }

  // 2. One-off Quest with specific due date
  if (quest.due_date) {
    const dueDateClean = quest.due_date.includes('T') ? quest.due_date.split('T')[0] : quest.due_date;
    return dueDateClean === dateStr;
  }

  // 3. One-off without due date: matched by creation date if checking past/calendar
  const createdClean = quest.created_at ? quest.created_at.split('T')[0] : '';
  return createdClean === dateStr;
}

/**
 * Checks if a recurring or one-off quest was completed on a given date.
 */
export function isQuestCompletedOnDate(quest: Quest, dateStr: string = getTodayDateString()): boolean {
  if (!quest.completed_at) {
    return quest.status === 'Completed' && !quest.is_recurring;
  }
  const completedDate = quest.completed_at.includes('T') ? quest.completed_at.split('T')[0] : quest.completed_at;
  return completedDate === dateStr;
}

/**
 * Generates a clean human-readable schedule summary (e.g. "Repeats every Mon, Wed, Fri")
 */
export function formatRecurringDaysSummary(days?: (Weekday | string)[] | null): string {
  if (!days || days.length === 0) return 'No repeat';
  if (days.length === 7) return 'Repeats every day';

  const weekdaysList: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri'];
  const weekendsList: Weekday[] = ['sat', 'sun'];

  const isAllWeekdays = days.length === 5 && weekdaysList.every((d) => days.includes(d));
  if (isAllWeekdays) return 'Repeats every weekday (Mon-Fri)';

  const isAllWeekends = days.length === 2 && weekendsList.every((d) => days.includes(d));
  if (isAllWeekends) return 'Repeats every weekend (Sat, Sun)';

  const order: Weekday[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const labels: Record<string, string> = {
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
    sun: 'Sun',
  };

  const sorted = [...days].sort((a, b) => order.indexOf(a as Weekday) - order.indexOf(b as Weekday));
  return `Repeats every ${sorted.map((d) => labels[d] || d).join(', ')}`;
}
