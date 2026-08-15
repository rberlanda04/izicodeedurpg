import React from 'react';

interface ToolInfo {
  logo?: string; // path under /public
  url?: string; // omitido quando não há uma URL oficial confirmada (ex: Dropefly)
  emoji?: string;
}

// Ferramentas reais do catálogo de projetos (src/data/projectCatalog.ts) e
// da árvore de habilidades (src/data/mockData.ts). Logos copiados de
// github.com/izicripto/izicode-landing e de src/assets/logos — ver
// public/tool-logos/. Ferramentas sem logo próprio (C++, Blocos, NEPO etc.)
// caem no fallback de texto simples.
const TOOLS: Record<string, ToolInfo> = {
  Arduino: { logo: '/tool-logos/arduino-logo.svg', url: 'https://www.arduino.cc' },
  Scratch: { logo: '/tool-logos/scratch-logo.svg', url: 'https://scratch.mit.edu' },
  Tinkercad: { logo: '/tool-logos/tinkercad-logo.svg', url: 'https://www.tinkercad.com' },
  'Code.org': { logo: '/tool-logos/codeorg-logo.svg', url: 'https://code.org' },
  'Micro:bit': { logo: '/tool-logos/microbit.png', url: 'https://microbit.org' },
  'Raspberry Pi': { logo: '/tool-logos/pi.png', url: 'https://www.raspberrypi.org' },
  'Open Roberta': { logo: '/tool-logos/openroberta.png', url: 'https://lab.open-roberta.org' },
  'Open Roberta Lab': { logo: '/tool-logos/openroberta.png', url: 'https://lab.open-roberta.org' },
  'Makey Makey': { logo: '/tool-logos/makey_makey.png', url: 'https://makeymakey.com' },
  'App Inventor': { logo: '/tool-logos/app-inventor.png', url: 'https://appinventor.mit.edu' },
  'Minecraft Education': { logo: '/tool-logos/minecraft-education.png', url: 'https://education.minecraft.net' },
  'Lego WeDo 2.0': { logo: '/tool-logos/lego-wedo.png', url: 'https://education.lego.com' },
  'Bambu Lab': { logo: '/tool-logos/bambu-lab.png', url: 'https://bambulab.com' },
  Canva: { logo: '/tool-logos/canva.jpg', url: 'https://www.canva.com' },
  Gamma: { logo: '/tool-logos/gamma.jpg', url: 'https://gamma.app' },
  'Office 365': { logo: '/tool-logos/office365.png', url: 'https://www.office.com' },
  'Drone Educacional': { logo: '/tool-logos/dropefly.png' },
  Python: { url: 'https://www.python.org', emoji: '🐍' },
  'Modelagem 3D': { url: 'https://www.tinkercad.com', emoji: '🧊' },
  'IoT Cloud': { emoji: '☁️', url: 'https://www.arduino.cc/en/iot/' },
  'API Cloud': { emoji: '☁️', url: 'https://www.arduino.cc/en/iot/' }
};

const SIZES = {
  sm: { img: 'w-4 h-4', text: 'text-[10px]', pad: 'px-2 py-0.5' },
  md: { img: 'w-5 h-5', text: 'text-xs', pad: 'px-2.5 py-1' }
};

export const ToolBadge: React.FC<{ tool: string; size?: 'sm' | 'md' }> = ({ tool, size = 'md' }) => {
  const info = TOOLS[tool];
  const s = SIZES[size];

  const content = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border-2 border-stem-line bg-stem-cloud font-display font-semibold text-stem-ink-soft ${s.pad} ${s.text}`}
    >
      {info?.logo ? (
        <img src={info.logo} alt="" className={`${s.img} object-contain`} />
      ) : info?.emoji ? (
        <span>{info.emoji}</span>
      ) : null}
      {tool}
    </span>
  );

  if (!info?.url) return content;

  return (
    <a href={info.url} target="_blank" rel="noopener noreferrer" title={`Site oficial: ${tool}`}>
      {content}
    </a>
  );
};

export const ToolBadgeRow: React.FC<{ tools: string[]; size?: 'sm' | 'md' }> = ({ tools, size = 'md' }) => (
  <div className="flex flex-wrap gap-1.5">
    {tools.map((t) => (
      <ToolBadge key={t} tool={t} size={size} />
    ))}
  </div>
);
