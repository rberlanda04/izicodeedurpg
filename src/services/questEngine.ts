import type { UserProfile, SkillNode, Quest, SkillTier } from '../types';

/**
 * "IA Quest Engine" — a rules-based recommendation engine that analyzes the
 * tools/skills a Guild member has already unlocked and suggests a Quest that
 * genuinely fits their current progression, instead of returning a fixed quest.
 */

const TIER_RANK: Record<SkillTier, number> = {
  BASIC: 0,
  INTERMEDIATE: 1,
  ADVANCED: 2,
  SPECIALIST: 3
};

/** Which skill tiers has the user actually unlocked, cross-referenced against SKILL_NODES. */
function getUnlockedTiers(user: UserProfile, skills: SkillNode[]): SkillTier[] {
  const tiers = new Set<SkillTier>();
  for (const skillId of user.unlockedSkills) {
    const node = skills.find((s) => s.id === skillId);
    if (node) tiers.add(node.tier);
  }
  return Array.from(tiers);
}

/** Which hardware ids the user has effectively unlocked via their unlocked skill nodes. */
function getUnlockedHardwareIds(user: UserProfile, skills: SkillNode[]): string[] {
  const hardware = new Set<string>();
  for (const skillId of user.unlockedSkills) {
    const node = skills.find((s) => s.id === skillId);
    node?.hardwareUnlocked?.forEach((hw) => hardware.add(hw));
  }
  return Array.from(hardware);
}

function isSubset(required: string[], unlocked: string[]): boolean {
  return required.every((skillId) => unlocked.includes(skillId));
}

function normalizeToken(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Rough heuristic: does the human-readable hardwareRequired text of a template
 * reference hardware the user has already unlocked (e.g. hardware id 'esp8266'
 * unlocked -> matches "NodeMCU 1.0 (ESP8266)")? Used only as a tie-breaker.
 */
function hardwareMatchScore(template: Omit<Quest, 'id' | 'status'>, unlockedHardwareIds: string[]): number {
  const text = normalizeToken(template.hardwareRequired.join(' '));
  return unlockedHardwareIds.reduce((count, hwId) => {
    const token = normalizeToken(hwId.split('_')[0]);
    return token.length > 2 && text.includes(token) ? count + 1 : count;
  }, 0);
}

/**
 * Generates a Quest recommendation based on the user's real unlocked skills/hardware.
 *
 * - Filters `templates` down to those whose requiredSkills the user has already
 *   unlocked, excluding any template whose title matches an existing quest
 *   (active/completed/proposed) so we never suggest an exact duplicate.
 * - Among the eligible pool, prefers the highest reachable tier, then breaks
 *   ties by how well the template's hardware matches hardware the Guild
 *   member has already unlocked, then picks randomly among the remaining ties
 *   so the suggestion still varies run to run.
 * - Falls back to the lowest-tier, zero-prerequisite template (e.g. for a
 *   brand-new Adventurer with no skills unlocked yet) so the engine never
 *   crashes or returns nothing.
 */
export function generateAIQuest(
  user: UserProfile,
  skills: SkillNode[],
  existingQuests: Quest[],
  templates: Omit<Quest, 'id' | 'status'>[]
): Quest {
  // Real state read: unlocked tiers + unlocked hardware, cross-referenced against SKILL_NODES.
  const unlockedTiers = getUnlockedTiers(user, skills);
  const unlockedHardwareIds = getUnlockedHardwareIds(user, skills);
  const unlockedSkillIds = user.unlockedSkills;

  const existingTitles = new Set(existingQuests.map((q) => q.title.trim().toLowerCase()));

  // A brand-new Adventurer with zero unlocked tiers has nothing meaningful to
  // match against yet, so skip straight to the no-prerequisite fallback pool.
  const eligible =
    unlockedTiers.length === 0
      ? []
      : templates.filter(
          (t) => isSubset(t.requiredSkills, unlockedSkillIds) && !existingTitles.has(t.title.trim().toLowerCase())
        );

  let chosen: Omit<Quest, 'id' | 'status'> | undefined;

  if (eligible.length > 0) {
    const maxTierRank = Math.max(...eligible.map((t) => TIER_RANK[t.tier]));
    const topTierPool = eligible.filter((t) => TIER_RANK[t.tier] === maxTierRank);

    const maxHardwareScore = Math.max(...topTierPool.map((t) => hardwareMatchScore(t, unlockedHardwareIds)));
    const bestMatchPool = topTierPool.filter((t) => hardwareMatchScore(t, unlockedHardwareIds) === maxHardwareScore);

    chosen = bestMatchPool[Math.floor(Math.random() * bestMatchPool.length)];
  } else {
    // Fallback: lowest-tier template that requires no prerequisite skills at all.
    const fallbackPool = templates
      .filter((t) => t.requiredSkills.length === 0)
      .sort((a, b) => TIER_RANK[a.tier] - TIER_RANK[b.tier]);
    chosen = fallbackPool[0] ?? templates[0];
  }

  return {
    ...chosen,
    id: `quest-ai-${Date.now()}`,
    status: 'ACTIVE'
  };
}
