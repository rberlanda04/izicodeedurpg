import React, { useMemo, useState } from 'react';
import { computeTrailLayout } from './useTrailLayout';
import { TrailNode, type TrailNodeStatus } from './TrailNode';
import { TrailNodeDetailSheet } from './TrailNodeDetailSheet';
import type { SkillNode, Quest } from '../../types';

interface TrailProps {
  skills: SkillNode[];
  quests: Quest[];
  unlockedSkillIds: string[];
  onUnlockSkill: (skillId: string) => void;
  onCompleteQuest: (questId: string, xpReward: number, coinReward: number) => void;
}

export const Trail: React.FC<TrailProps> = ({ skills, quests, unlockedSkillIds, onUnlockSkill, onCompleteQuest }) => {
  const layout = useMemo(() => computeTrailLayout(skills, quests), [skills, quests]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const skillStatus = (skill: SkillNode): TrailNodeStatus => {
    if (unlockedSkillIds.includes(skill.id)) return 'completed';
    const ready = skill.prerequisites.every((p) => unlockedSkillIds.includes(p));
    return ready ? 'available' : 'locked';
  };

  const questStatus = (quest: Quest): TrailNodeStatus => {
    if (quest.status === 'COMPLETED') return 'completed';
    const ready = quest.requiredSkills.every((s) => unlockedSkillIds.includes(s));
    return ready && quest.status !== 'PROPOSED' ? 'available' : 'locked';
  };

  const selectedNode = layout.nodes.find((n) => n.id === selectedId);
  const selectedSkill = selectedNode?.kind === 'skill' ? skills.find((s) => s.id === selectedNode.refId) : undefined;
  const selectedQuest = selectedNode?.kind === 'quest' ? quests.find((q) => q.id === selectedNode.refId) : undefined;

  return (
    <div className="relative mx-auto max-w-lg" style={{ height: layout.height }}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 100 ${layout.height}`}
        preserveAspectRatio="none"
      >
        {layout.edges.map((edge, idx) => {
          const from = layout.nodes.find((n) => n.id === edge.from);
          const to = layout.nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#dce8ef"
              strokeWidth={6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          );
        })}
      </svg>

      {layout.nodes.map((node) => {
        if (node.kind === 'skill') {
          const skill = skills.find((s) => s.id === node.refId);
          if (!skill || (skill.isSecretNode && !unlockedSkillIds.includes(skill.id))) return null;
          return (
            <TrailNode
              key={node.id}
              kind="skill"
              icon={skill.icon}
              status={skillStatus(skill)}
              x={node.x}
              y={node.y}
              onClick={() => setSelectedId(node.id)}
            />
          );
        }
        const quest = quests.find((q) => q.id === node.refId);
        if (!quest) return null;
        return (
          <TrailNode
            key={node.id}
            kind="quest"
            icon="📜"
            status={questStatus(quest)}
            x={node.x}
            y={node.y}
            onClick={() => setSelectedId(node.id)}
          />
        );
      })}

      {selectedSkill && (
        <TrailNodeDetailSheet
          kind="skill"
          data={selectedSkill}
          status={skillStatus(selectedSkill)}
          onUnlock={() => {
            onUnlockSkill(selectedSkill.id);
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}
      {selectedQuest && (
        <TrailNodeDetailSheet
          kind="quest"
          data={selectedQuest}
          status={questStatus(selectedQuest)}
          onComplete={() => {
            onCompleteQuest(selectedQuest.id, selectedQuest.xpReward, selectedQuest.coinReward);
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};
