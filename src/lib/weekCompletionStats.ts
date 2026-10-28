import type { Database } from "@/types/database";

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];
export type WorkoutVariant = WLog["variant"];

const SLOTS: WLog["slot"][] = ["mon", "wed", "fri", "sat_bonus"];
/** The three program sessions per week; the Saturday 10-min bonus is optional and never required for progress. */
export const CORE_SLOTS: WLog["slot"][] = ["mon", "wed", "fri"];
export const PROGRAM_WEEKS_TOTAL = 12;
export const PROGRAM_SESSIONS = CORE_SLOTS.length * PROGRAM_WEEKS_TOTAL;

/** Slot counts as done if that slot is completed for gym, home, or emergency (10 min). */
export function isSlotCompletedUnion(logs: WLog[], weekNumber: number, slot: WLog["slot"]): boolean {
  return logs.some(
    (l) =>
      l.week_number === weekNumber &&
      l.slot === slot &&
      l.completed &&
      (l.variant === "gym" || l.variant === "home" || l.variant === "emergency")
  );
}

/** A week counts if every slot has at least one completed log (any track). */
export function countFullyCompletedProgramWeeks(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= 12; w++) {
    const allDone = SLOTS.every((slot) => isSlotCompletedUnion(logs, w, slot));
    if (allDone) n++;
  }
  return n;
}

export function isWeekFullyCompleteForVariant(logs: WLog[], weekNumber: number, variant: WorkoutVariant): boolean {
  return SLOTS.every((slot) =>
    logs.some((l) => l.week_number === weekNumber && l.slot === slot && l.variant === variant && l.completed)
  );
}

/** Mon + Wed + Fri done on any track (Saturday bonus optional) — used for overview / check-in bump. */
export function isWeekFullyCompleteUnion(logs: WLog[], weekNumber: number): boolean {
  return CORE_SLOTS.every((slot) => isSlotCompletedUnion(logs, weekNumber, slot));
}

/** Completed program sessions (Mon/Wed/Fri of weeks 1–12, any track, any order), 0–36. */
export function countCompletedCoreSessions(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= PROGRAM_WEEKS_TOTAL; w++) {
    for (const slot of CORE_SLOTS) if (isSlotCompletedUnion(logs, w, slot)) n++;
  }
  return n;
}

/** Weeks with Mon + Wed + Fri all done (any order of weeks). */
export function countCoreCompletedWeeks(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= PROGRAM_WEEKS_TOTAL; w++) if (isWeekFullyCompleteUnion(logs, w)) n++;
  return n;
}

/** Weeks 1..n in order; stops at first week missing any slot (any track). */
export function countContiguousCompletedWeeksFromStart(logs: WLog[]): number {
  let n = 0;
  for (let w = 1; w <= 12; w++) {
    const allDone = SLOTS.every((slot) => isSlotCompletedUnion(logs, w, slot));
    if (!allDone) break;
    n++;
  }
  return n;
}
