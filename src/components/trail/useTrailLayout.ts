import type { SkillNode, SkillTier, Quest } from '../../types';

export type TrailNodeKind = 'skill' | 'quest';

export interface TrailNodePosition {
  id: string; // `skill:${skillId}` or `quest:${questId}`
  kind: TrailNodeKind;
  refId: string; // the underlying SkillNode.id or Quest.id
  tier: SkillTier;
  x: number; // percent, 0-100
  y: number; // px
}

export interface TrailEdge {
  from: string; // node id
  to: string; // node id
}

export interface TrailLayout {
  nodes: TrailNodePosition[];
  edges: TrailEdge[];
  height: number;
}

const TIER_ORDER: SkillTier[] = ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'SPECIALIST'];
const ROW_HEIGHT = 150;
const TOP_PADDING = 90;

/**
 * Pure layout function (no DOM) — computes a winding Duolingo-style path
 * position for every skill + quest node, grouped by tier, and the edges
 * that should connect them based on real prerequisite/requiredSkills
 * relationships (not just sequential order, since SkillNode.prerequisites
 * is a DAG — a skill can have more than one incoming edge).
 */
export function computeTrailLayout(skills: SkillNode[], quests: Quest[]): TrailLayout {
  const nodes: TrailNodePosition[] = [];
  let rowIndex = 0;

  for (const tier of TIER_ORDER) {
    const tierSkills = skills.filter((s) => s.tier === tier);
    const tierQuests = quests.filter((q) => q.tier === tier && !q.isSecretQuest);

    for (const skill of tierSkills) {
      nodes.push(makeNode('skill', skill.id, tier, rowIndex));
      rowIndex += 1;
    }
    for (const quest of tierQuests) {
      nodes.push(makeNode('quest', quest.id, tier, rowIndex));
      rowIndex += 1;
    }
  }

  const edges: TrailEdge[] = [];
  const nodeBySkillId = new Map(nodes.filter((n) => n.kind === 'skill').map((n) => [n.refId, n]));
  const nodeByQuestId = new Map(nodes.filter((n) => n.kind === 'quest').map((n) => [n.refId, n]));

  for (const skill of skills) {
    const target = nodeBySkillId.get(skill.id);
    if (!target) continue;
    for (const prereqId of skill.prerequisites) {
      const source = nodeBySkillId.get(prereqId);
      if (source) edges.push({ from: source.id, to: target.id });
    }
  }
  for (const quest of quests) {
    const target = nodeByQuestId.get(quest.id);
    if (!target) continue;
    for (const skillId of quest.requiredSkills) {
      const source = nodeBySkillId.get(skillId);
      if (source) edges.push({ from: source.id, to: target.id });
    }
  }

  return { nodes, edges, height: TOP_PADDING + rowIndex * ROW_HEIGHT + 60 };
}

function makeNode(kind: TrailNodeKind, refId: string, tier: SkillTier, rowIndex: number): TrailNodePosition {
  // Organic winding: x oscillates smoothly rather than a rigid left/right
  // zig-zag, so the path reads as a trail rather than a staircase.
  const x = 50 + 32 * Math.sin(rowIndex * 0.85);
  const y = TOP_PADDING + rowIndex * ROW_HEIGHT;
  return { id: `${kind}:${refId}`, kind, refId, tier, x, y };
}
