import { differenceInCalendarDays, startOfDay } from "date-fns";
import type { Database } from "@/types/database";
import {
  PROGRAM_SESSIONS,
  countCompletedCoreSessions,
  countCoreCompletedWeeks,
  isWeekFullyCompleteUnion,
} from "@/lib/weekCompletionStats";

export const PROGRAM_TOTAL_DAYS = 90;
export const PROGRAM_WEEKS = 12;

type WLog = Database["public"]["Tables"]["workout_session_logs"]["Row"];

export type ProgramProgress = {
  hasAnchor: boolean;
  /** 1-based day in program, capped 1–90 */
  currentDay: number;
  /** 1–12 — current week to work on (from check-ins) or calendar fallback */
  weekNumber: number;
  percentComplete: number;
  daysRemaining: number;
  isComplete: boolean;
  anchorDate: Date | null;
  /** Weeks with Mon + Wed + Fri checked (any track per slot, any order). Name kept for existing callers. */
  completedContiguousWeeks: number;
};

/**
 * Member dashboard: progress from session checkboxes.
 * Every checked program session (Mon, Wed, Fri of weeks 1–12 — gym, home or 10 min) moves the 90-day count:
 * 36 sessions = 90 days, about 2.5 days per session. The Saturday bonus is optional and does not count.
 * Current week = first week whose Mon/Wed/Fri are not all done.
 */
export function getProgramProgressFromSessionLogs(logs: WLog[]): ProgramProgress {
  const sessions = countCompletedCoreSessions(logs);
  const completedWeeks = countCoreCompletedWeeks(logs);
  const isComplete = sessions >= PROGRAM_SESSIONS;

  let weekNumber = PROGRAM_WEEKS;
  for (let w = 1; w <= PROGRAM_WEEKS; w++) {
    if (!isWeekFullyCompleteUnion(logs, w)) {
      weekNumber = w;
      break;
    }
  }

  const currentDay =
    sessions === 0 ? 1 : Math.min(PROGRAM_TOTAL_DAYS, Math.round((sessions / PROGRAM_SESSIONS) * PROGRAM_TOTAL_DAYS));
  const daysRemaining = Math.max(0, PROGRAM_TOTAL_DAYS - currentDay);
  const percentComplete = Math.min(100, Math.round((currentDay / PROGRAM_TOTAL_DAYS) * 100));

  return {
    hasAnchor: true,
    currentDay,
    weekNumber,
    percentComplete,
    daysRemaining,
    isComplete,
    anchorDate: null,
    completedContiguousWeeks: completedWeeks,
  };
}

/** Calendar-based progress from access grant (legacy / non-dashboard use). */
export function getProgramProgress(anchorIso: string | null): ProgramProgress {
  if (!anchorIso) {
    return {
      hasAnchor: false,
      currentDay: 1,
      weekNumber: 1,
      percentComplete: 0,
      daysRemaining: PROGRAM_TOTAL_DAYS,
      isComplete: false,
      anchorDate: null,
      completedContiguousWeeks: 0,
    };
  }
  const anchor = startOfDay(new Date(anchorIso));
  const today = startOfDay(new Date());
  const elapsed = differenceInCalendarDays(today, anchor) + 1;
  const currentDay = Math.min(PROGRAM_TOTAL_DAYS, Math.max(1, elapsed));
  const isComplete = elapsed >= PROGRAM_TOTAL_DAYS;
  const daysRemaining = Math.max(0, PROGRAM_TOTAL_DAYS - currentDay);
  const weekNumber = Math.min(PROGRAM_WEEKS, Math.floor((currentDay - 1) / 7) + 1);
  const percentComplete = Math.min(100, Math.round((currentDay / PROGRAM_TOTAL_DAYS) * 100));

  return {
    hasAnchor: true,
    currentDay,
    weekNumber,
    percentComplete,
    daysRemaining,
    isComplete,
    anchorDate: anchor,
    completedContiguousWeeks: 0,
  };
}

type MemberAccess = Database["public"]["Tables"]["member_access"]["Row"];

/** Prefer official start time; fall back to row creation for legacy rows. */
export function getProgramAnchorIso(access: MemberAccess | null): string | null {
  if (!access?.has_access) return null;
  return access.activated_at ?? access.created_at ?? null;
}
