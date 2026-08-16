import type { HackathonSchedulePhase } from '../types';

/**
 * Picks whichever schedule phase's [startTime, endTime) contains the given
 * time (defaults to now) — the event's "current phase" is purely computed
 * from wall-clock time against the schedule, not a manual staff toggle a
 * facilitator could forget to click.
 */
export function getCurrentPhase(schedule: HackathonSchedulePhase[], at: Date = new Date()): HackathonSchedulePhase | null {
  const minutesNow = at.getHours() * 60 + at.getMinutes();
  for (const phase of schedule) {
    const [startH, startM] = phase.startTime.split(':').map(Number);
    const [endH, endM] = phase.endTime.split(':').map(Number);
    const start = startH * 60 + startM;
    const end = endH * 60 + endM;
    if (minutesNow >= start && minutesNow < end) return phase;
  }
  return null;
}

export function isWithinWindow(windowRange: { start: string; end: string }, at: Date = new Date()): boolean {
  const minutesNow = at.getHours() * 60 + at.getMinutes();
  const [startH, startM] = windowRange.start.split(':').map(Number);
  const [endH, endM] = windowRange.end.split(':').map(Number);
  return minutesNow >= startH * 60 + startM && minutesNow < endH * 60 + endM;
}

/** 5-minute slot labels ('HH:mm-HH:mm') inside a testing window. */
export function generateSlotLabels(windowRange: { start: string; end: string }, stepMinutes = 5): string[] {
  const [startH, startM] = windowRange.start.split(':').map(Number);
  const [endH, endM] = windowRange.end.split(':').map(Number);
  const start = startH * 60 + startM;
  const end = endH * 60 + endM;
  const labels: string[] = [];
  for (let m = start; m + stepMinutes <= end; m += stepMinutes) {
    const fmt = (mins: number) => `${String(Math.floor(mins / 60)).padStart(2, '0')}:${String(mins % 60).padStart(2, '0')}`;
    labels.push(`${fmt(m)}-${fmt(m + stepMinutes)}`);
  }
  return labels;
}
