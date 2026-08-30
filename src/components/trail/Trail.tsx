import React, { useMemo, useState } from 'react';
import { computeTrailLayout } from './useTrailLayout';
import { TrailNode, type TrailNodeStatus } from './TrailNode';
import { TrailNodeDetailSheet } from './TrailNodeDetailSheet';
import { soundEngine } from '../../services/soundEngine';
import type { SkillNode, Quest } from '../../types';
import type { TrailNodePosition } from './useTrailLayout';

interface TrailProps {
  skills: SkillNode[];
  quests: Quest[];
  unlockedSkillIds: string[];
  currentUid: string;
  avatarHead: string;
  onUnlockSkill: (skillId: string) => void;
  onAcceptQuest: (questId: string, xpReward: number, coinReward: number) => void;
}

export const Trail: React.FC<TrailProps> = ({
  skills,
  quests,
  unlockedSkillIds,
  currentUid,
  avatarHead,
  onUnlockSkill,
  onAcceptQuest
}) => {
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

  const nodeStatus = (node: TrailNodePosition): TrailNodeStatus => {
    if (node.kind === 'skill') {
      const skill = skills.find((s) => s.id === node.refId);
      return skill ? skillStatus(skill) : 'locked';
    }
    const quest = quests.find((q) => q.id === node.refId);
    return quest ? questStatus(quest) : 'locked';
  };

  const selectedNode = layout.nodes.find((n) => n.id === selectedId);
  const selectedSkill = selectedNode?.kind === 'skill' ? skills.find((s) => s.id === selectedNode.refId) : undefined;
  const selectedQuest = selectedNode?.kind === 'quest' ? quests.find((q) => q.id === selectedNode.refId) : undefined;

  // Posição do avatar: em cima do nó selecionado (foi até lá pra encarar o
  // desafio) ou, em repouso, no último nó já concluído — dá a sensação de
  // "aqui é onde você está na jornada" sem precisar guardar timestamps.
  const lastCompletedNode = [...layout.nodes].reverse().find((n) => nodeStatus(n) === 'completed');
  const avatarNode = selectedNode ?? lastCompletedNode;
  const avatarX = avatarNode?.x ?? layout.nodes[0]?.x ?? 50;
  const avatarY = avatarNode ? avatarNode.y - 46 : 24;

  const handleSelect = (nodeId: string) => {
    soundEngine.playWhoosh();
    setSelectedId(nodeId);
  };

  return (
    <div
      className="relative mx-auto max-w-lg rounded-3xl overflow-hidden"
      style={{
        height: layout.height,
        backgroundImage: 'radial-gradient(circle, var(--color-stem-line) 1.5px, transparent 1.5px)',
        backgroundSize: '22px 22px',
        backgroundColor: 'color-mix(in srgb, var(--color-stem-mist) 60%, transparent)'
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 100 ${layout.height}`}
        preserveAspectRatio="none"
      >
        {layout.edges.map((edge, idx) => {
          const from = layout.nodes.find((n) => n.id === edge.from);
          const to = layout.nodes.find((n) => n.id === edge.to);
          if (!from || !to) return null;
          const traveled = nodeStatus(from) === 'completed' && nodeStatus(to) === 'completed';
          return (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={traveled ? 'var(--color-stem-teal)' : 'var(--color-stem-line)'}
              strokeWidth={traveled ? 7 : 6}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              opacity={traveled ? 0.9 : 1}
            />
          );
        })}
      </svg>

      {/* Avatar do jogador: viaja pelo caminho conforme o progresso/seleção. */}
      {avatarNode && (
        <div
          className="absolute z-10 pointer-events-none transition-[left,top] duration-500 ease-out"
          style={{ left: `${avatarX}%`, top: avatarY }}
        >
          <span
            className="block text-3xl drop-shadow-[0_4px_3px_rgba(22,35,44,0.35)]"
            style={{ animation: 'bobIdle 2.4s ease-in-out infinite', transform: 'translate(-50%, -100%)' }}
          >
            {avatarHead}
          </span>
        </div>
      )}

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
              onClick={() => handleSelect(node.id)}
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
            onClick={() => handleSelect(node.id)}
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
          currentUid={currentUid}
          onAccept={() => {
            onAcceptQuest(selectedQuest.id, selectedQuest.xpReward, selectedQuest.coinReward);
            setSelectedId(null);
          }}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
};
