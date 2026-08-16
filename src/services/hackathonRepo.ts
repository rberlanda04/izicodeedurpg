import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  onSnapshot,
  collection,
  query,
  where,
  getDocs,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import { generateRoomPasscode } from './passcode';
import type {
  HackathonEvent,
  HackathonEventCodeLookup,
  HackathonTeam,
  HackathonTeamMember,
  HackathonTeamScores,
  HackathonMentorRequest,
  HackathonMentorRequestType,
  HackathonTestingSlot,
  HackathonDisasterType,
  HackathonCheckin,
  HackathonSchedulePhase,
  HackathonTestingWindow
} from '../types';

// Follows the same conventions as classRepo.ts/userRepo.ts: plain async
// wrappers, subscribeToX(id, onChange, onError) with the 3-arg onSnapshot
// form, and runTransaction for anything that needs read-then-write
// consistency (deterministic-ID slot booking, event+code creation).

// ---- Events ----

export async function createEvent(
  name: string,
  date: string,
  staffUid: string,
  schedule: HackathonSchedulePhase[],
  testingWindows: HackathonTestingWindow[]
): Promise<HackathonEvent> {
  const ref = doc(collection(db, 'hackathonEvents'));
  const joinCode = generateRoomPasscode('ECO');
  const event: HackathonEvent = {
    id: ref.id,
    name,
    date,
    joinCode,
    staffIds: [staffUid],
    schedule,
    testingWindows,
    createdAt: new Date().toISOString()
  };
  await runTransaction(db, async (tx) => {
    tx.set(ref, event);
    tx.set(doc(db, 'hackathonEventCodes', joinCode), { eventId: ref.id } satisfies HackathonEventCodeLookup);
  });
  return event;
}

export async function getEvent(eventId: string): Promise<HackathonEvent | null> {
  const snap = await getDoc(doc(db, 'hackathonEvents', eventId));
  return snap.exists() ? (snap.data() as HackathonEvent) : null;
}

export function subscribeToEvent(
  eventId: string,
  onChange: (event: HackathonEvent | null) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'hackathonEvents', eventId),
    (snap) => onChange(snap.exists() ? (snap.data() as HackathonEvent) : null),
    onError
  );
}

export async function joinEventByCode(code: string): Promise<HackathonEvent> {
  const codeSnap = await getDoc(doc(db, 'hackathonEventCodes', code.toUpperCase()));
  if (!codeSnap.exists()) {
    throw new Error('Código de evento inválido. Confira com a organização.');
  }
  const { eventId } = codeSnap.data() as HackathonEventCodeLookup;
  const event = await getEvent(eventId);
  if (!event) throw new Error('Evento não encontrado.');
  return event;
}

/** Events where the signed-in user is staff — the "my events" list for organizers/mentors/judges. */
export async function listStaffEvents(uid: string): Promise<HackathonEvent[]> {
  const snap = await getDocs(query(collection(db, 'hackathonEvents'), where('staffIds', 'array-contains', uid)));
  return snap.docs.map((d) => d.data() as HackathonEvent);
}

// ---- Teams ----

export async function createTeam(
  eventId: string,
  name: string,
  questId: string,
  uid: string,
  member: HackathonTeamMember
): Promise<HackathonTeam> {
  const ref = doc(collection(db, 'hackathonTeams'));
  const team: HackathonTeam = {
    id: ref.id,
    eventId,
    name,
    questId,
    members: { [uid]: member },
    scores: {},
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, team);
  return team;
}

export async function getTeam(teamId: string): Promise<HackathonTeam | null> {
  const snap = await getDoc(doc(db, 'hackathonTeams', teamId));
  return snap.exists() ? (snap.data() as HackathonTeam) : null;
}

export async function joinTeam(teamId: string, uid: string, member: HackathonTeamMember): Promise<void> {
  await updateDoc(doc(db, 'hackathonTeams', teamId), { [`members.${uid}`]: member });
}

export async function chooseQuest(teamId: string, questId: string): Promise<void> {
  await updateDoc(doc(db, 'hackathonTeams', teamId), { questId });
}

export async function updateTeamScores(teamId: string, scores: HackathonTeamScores, scoreNotes: string): Promise<void> {
  await updateDoc(doc(db, 'hackathonTeams', teamId), { scores, scoreNotes });
}

export function subscribeToEventTeams(
  eventId: string,
  onChange: (teams: HackathonTeam[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'hackathonTeams'), where('eventId', '==', eventId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as HackathonTeam)),
    onError
  );
}

// ---- Mentor requests ----

export async function createMentorRequest(
  eventId: string,
  teamId: string,
  teamName: string,
  type: HackathonMentorRequestType
): Promise<void> {
  const ref = doc(collection(db, 'hackathonMentorRequests'));
  const request: HackathonMentorRequest = {
    id: ref.id,
    eventId,
    teamId,
    teamName,
    type,
    status: 'waiting',
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, request);
}

export function subscribeToMentorRequests(
  eventId: string,
  onChange: (requests: HackathonMentorRequest[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'hackathonMentorRequests'), where('eventId', '==', eventId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as HackathonMentorRequest)),
    onError
  );
}

export async function claimMentorRequest(requestId: string, uid: string, name: string): Promise<void> {
  await updateDoc(doc(db, 'hackathonMentorRequests', requestId), {
    status: 'claimed',
    claimedByUid: uid,
    claimedByName: name
  });
}

export async function resolveMentorRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'hackathonMentorRequests', requestId), { status: 'resolved' });
}

// ---- Testing slots ----

function slotDocId(eventId: string, station: HackathonDisasterType, timeSlot: string): string {
  return `${eventId}__${station}__${timeSlot}`;
}

/**
 * Books a testing-station slot. Uses a deterministic doc ID + a transaction
 * that only claims the slot if it isn't already booked — same read-then-write
 * shape as joinClassByPasscode (classRepo.ts), which is what actually
 * prevents two teams from double-booking the same station/time under
 * concurrent requests (a naive setDoc would let the second call silently
 * overwrite the first).
 */
export async function bookTestingSlot(
  eventId: string,
  station: HackathonDisasterType,
  timeSlot: string,
  teamId: string,
  teamName: string
): Promise<'booked' | 'taken'> {
  const ref = doc(db, 'hackathonTestingSlots', slotDocId(eventId, station, timeSlot));
  return runTransaction(db, async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists() && (snap.data() as HackathonTestingSlot).teamId) {
      return 'taken';
    }
    const slot: HackathonTestingSlot = {
      id: ref.id,
      eventId,
      station,
      timeSlot,
      teamId,
      teamName,
      status: 'booked'
    };
    tx.set(ref, slot);
    return 'booked';
  });
}

export async function logTestOutcome(slotId: string, outcome: 'passed' | 'retry', staffNote: string): Promise<void> {
  await updateDoc(doc(db, 'hackathonTestingSlots', slotId), { status: 'completed', outcome, staffNote });
}

export function subscribeToTestingSlots(
  eventId: string,
  onChange: (slots: HackathonTestingSlot[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'hackathonTestingSlots'), where('eventId', '==', eventId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as HackathonTestingSlot)),
    onError
  );
}

// ---- Check-ins ----

export async function submitCheckin(
  eventId: string,
  teamId: string,
  teamName: string,
  level: 1 | 2 | 3,
  checkpointLabel: string
): Promise<void> {
  const ref = doc(collection(db, 'hackathonCheckins'));
  const checkin: HackathonCheckin = {
    id: ref.id,
    eventId,
    teamId,
    teamName,
    level,
    checkpointLabel,
    createdAt: new Date().toISOString()
  };
  await setDoc(ref, checkin);
}

export function subscribeToCheckins(
  eventId: string,
  onChange: (checkins: HackathonCheckin[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'hackathonCheckins'), where('eventId', '==', eventId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as HackathonCheckin)),
    onError
  );
}
