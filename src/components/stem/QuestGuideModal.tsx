import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { MiniMarkdown } from './MiniMarkdown';
import { ToolBadgeRow } from './ToolBadge';
import type { Quest } from '../../types';

export const QuestGuideModal: React.FC<{ quest: Quest; onClose: () => void }> = ({ quest, onClose }) => (
  <div className="fixed inset-0 z-[60] bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-stem-cloud rounded-3xl w-full max-w-2xl max-h-[85vh] flex flex-col">
      <div className="flex items-start justify-between p-6 border-b-2 border-stem-line shrink-0">
        <div>
          <h2 className="font-display font-extrabold text-lg text-stem-ink">{quest.title}</h2>
          <div className="mt-2">
            <ToolBadgeRow tools={quest.hardwareRequired} size="sm" />
          </div>
        </div>
        <button onClick={onClose} className="text-stem-ink-soft hover:text-stem-ink shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="overflow-y-auto p-6">
        {quest.guideContent ? (
          <MiniMarkdown content={quest.guideContent} />
        ) : (
          <p className="text-sm font-body-stem text-stem-ink-soft">{quest.description}</p>
        )}

        {quest.externalLink && (
          <a
            href={quest.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 mt-4 text-sm font-display font-bold text-stem-teal hover:underline"
          >
            Ver projeto de referência <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  </div>
);
