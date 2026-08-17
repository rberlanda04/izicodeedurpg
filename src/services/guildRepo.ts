import {
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  where,
  arrayUnion,
  type FirestoreError,
  type Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';
import type { Guild, ScrumRole } from '../types';

// guilds/{guildId} already has full firestore.rules coverage (any class
// member can create/update, GM/Admin can delete) — written during the
// original SaaS redesign but never wired up until now.

export function subscribeToClassGuilds(
  classId: string,
  onChange: (guilds: Guild[]) => void,
  onError?: (error: FirestoreError) => void
): Unsubscribe {
  return onSnapshot(
    query(collection(db, 'guilds'), where('classId', '==', classId)),
    (snap) => onChange(snap.docs.map((d) => d.data() as Guild)),
    onError
  );
}

export async function createGuild(
  classId: string,
  schoolId: string,
  name: string,
  motto: string,
  canvaLink: string,
  leaderUid: string,
  leaderName: string,
  leaderAvatarHead: string
): Promise<Guild> {
  const ref = doc(collection(db, 'guilds'));
  const guild: Guild & { classId: string; schoolId: string } = {
    id: ref.id,
    classId,
    schoolId,
    name,
    motto,
    emblemUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    leaderId: leaderUid,
    leaderName,
    members: [{ uid: leaderUid, name: leaderName, role: 'SCRUM_MASTER', avatarHead: leaderAvatarHead }],
    score: 500,
    canvaFigmaLink: canvaLink
  };
  await setDoc(ref, guild);
  return guild;
}

/**
 * Adding a member is always a pure append (a student can only ever join
 * once — the UI already hides "join" once profile.guildId is set), so
 * arrayUnion is safe without a transaction: it doesn't need to know the
 * array's current contents to append correctly, unlike a read-modify-write.
 */
export async function joinGuild(
  guildId: string,
  uid: string,
  name: string,
  role: ScrumRole,
  avatarHead: string
): Promise<void> {
  await updateDoc(doc(db, 'guilds', guildId), {
    members: arrayUnion({ uid, name, role, avatarHead })
  });
}
