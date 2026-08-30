import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Map as MapIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SequenceChallenge } from '../../components/trail/SequenceChallenge';
import { SEQUENCE_PUZZLES } from '../../data/sequencePuzzles';
import { soundEngine } from '../../services/soundEngine';
import type { ClassOutletContext } from './ClassLayout';

const CANVAS_W = 800;
const CANVAS_H = 480;
const AVATAR_R = 16;
const SPEED = 3.2;

interface Building {
  id: string;
  label: string;
  icon: string;
  x: number;
  y: number;
  w: number;
  h: number;
  route: string;
  color: string;
}

const BUILDINGS: Building[] = [
  { id: 'trilha', label: 'Torre das Habilidades', icon: '🗼', x: 50, y: 30, w: 150, h: 110, route: 'trilha', color: '#38b6ff' },
  { id: 'missoes', label: 'Mural de Missões', icon: '📜', x: 325, y: 20, w: 150, h: 110, route: 'missoes', color: '#c08347' },
  { id: 'guildas', label: 'Salão das Guildas', icon: '🛡️', x: 600, y: 30, w: 150, h: 110, route: 'guildas', color: '#2f9e44' },
  { id: 'lab', label: 'Maker Lab', icon: '🔧', x: 20, y: 200, w: 150, h: 110, route: 'lab', color: '#38b6ff' },
  { id: 'portais', label: 'Portais de Desafios', icon: '🌐', x: 630, y: 200, w: 150, h: 110, route: 'portais', color: '#2f9e44' },
  { id: 'curiosidades', label: 'Torre das Curiosidades', icon: '🧭', x: 150, y: 350, w: 150, h: 100, route: 'curiosidades', color: '#c08347' },
  { id: 'hackathon', label: 'Arena Hackathon', icon: '⚔️', x: 500, y: 350, w: 150, h: 100, route: 'hackathon', color: '#004b72' }
];

// Pontos de encontro fixos, em áreas abertas entre os prédios — cada um
// dispara um SequenceChallenge sorteado. "Coletado" é só desta sessão de
// navegação (estado local), recarregar a página traz todos de volta.
const ENCOUNTER_SPOTS = [
  { id: 'enc-1', x: 400, y: 150 },
  { id: 'enc-2', x: 240, y: 260 },
  { id: 'enc-3', x: 560, y: 280 }
];

type Direction = 'up' | 'down' | 'left' | 'right';

function rectsOverlap(ax: number, ay: number, ar: number, bx: number, by: number, bw: number, bh: number) {
  return ax + ar > bx && ax - ar < bx + bw && ay + ar > by && ay - ar < by + bh;
}

export const OverworldPage: React.FC = () => {
  const { handleCollectEncounter } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: CANVAS_W / 2, y: CANVAS_H / 2 });
  const heldRef = useRef<Set<Direction>>(new Set());
  const frameRef = useRef<number>(0);

  const [nearBuilding, setNearBuilding] = useState<Building | null>(null);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [activePuzzle, setActivePuzzle] = useState<{ spotId: string; puzzleId: string } | null>(null);
  // Espelha activePuzzle para checar de forma síncrona dentro do loop de
  // animação — o closure do loop só vê o valor de activePuzzle do momento em
  // que o efeito foi montado, então sem isso dois encontros muito próximos
  // no mesmo quadro podiam disparar dois puzzles em sequência antes do
  // React re-renderizar o efeito com a dependência atualizada.
  const activePuzzleRef = useRef<typeof activePuzzle>(null);
  const [, forceRender] = useState(0);

  const avatarHead = profile?.avatarConfig.head ?? '🧑';

  const puzzleForActive = useMemo(
    () => (activePuzzle ? SEQUENCE_PUZZLES.find((p) => p.id === activePuzzle.puzzleId) : undefined),
    [activePuzzle]
  );

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Chão: tom claro + textura de grade pontilhada, mesma linguagem visual
    // da Trilha (radial-dot pattern), pra parecer o mesmo "mundo".
    ctx.fillStyle = '#eef6fb';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.fillStyle = 'rgba(220, 232, 239, 0.9)';
    for (let gx = 12; gx < CANVAS_W; gx += 24) {
      for (let gy = 12; gy < CANVAS_H; gy += 24) {
        ctx.beginPath();
        ctx.arc(gx, gy, 1.4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Prédios
    for (const b of BUILDINGS) {
      ctx.fillStyle = b.color;
      ctx.globalAlpha = 0.14;
      roundRect(ctx, b.x, b.y, b.w, b.h, 18);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = b.color;
      ctx.lineWidth = nearBuilding?.id === b.id ? 4 : 3;
      roundRect(ctx, b.x, b.y, b.w, b.h, 18);
      ctx.stroke();

      ctx.font = '34px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(b.icon, b.x + b.w / 2, b.y + b.h / 2 + 2);

      ctx.font = 'bold 12px Manrope, sans-serif';
      ctx.fillStyle = '#16232c';
      ctx.fillText(b.label, b.x + b.w / 2, b.y + b.h + 16);
    }

    // Pontos de encontro (não coletados)
    for (const spot of ENCOUNTER_SPOTS) {
      if (collected.has(spot.id)) continue;
      const pulse = 5 + Math.sin(Date.now() / 220) * 2;
      ctx.fillStyle = 'rgba(192, 131, 71, 0.25)';
      ctx.beginPath();
      ctx.arc(spot.x, spot.y, 14 + pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('❓', spot.x, spot.y + 7);
    }

    // Avatar
    const { x, y } = posRef.current;
    ctx.font = '30px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(avatarHead, x, y + 10);
  }, [avatarHead, nearBuilding, collected]);

  useEffect(() => {
    const loop = () => {
      const held = heldRef.current;
      const pos = posRef.current;
      let dx = 0;
      let dy = 0;
      if (held.has('up')) dy -= 1;
      if (held.has('down')) dy += 1;
      if (held.has('left')) dx -= 1;
      if (held.has('right')) dx += 1;
      if (dx !== 0 || dy !== 0) {
        const len = Math.hypot(dx, dy);
        pos.x = Math.min(CANVAS_W - AVATAR_R, Math.max(AVATAR_R, pos.x + (dx / len) * SPEED));
        pos.y = Math.min(CANVAS_H - AVATAR_R, Math.max(AVATAR_R, pos.y + (dy / len) * SPEED));

        const building = BUILDINGS.find((b) => rectsOverlap(pos.x, pos.y, AVATAR_R, b.x, b.y, b.w, b.h)) ?? null;
        setNearBuilding((prev) => (prev?.id !== building?.id ? building : prev));

        for (const spot of ENCOUNTER_SPOTS) {
          if (collected.has(spot.id) || activePuzzleRef.current) continue;
          if (Math.hypot(pos.x - spot.x, pos.y - spot.y) < AVATAR_R + 14) {
            soundEngine.playWhoosh();
            const puzzle = SEQUENCE_PUZZLES[Math.floor(Math.random() * SEQUENCE_PUZZLES.length)];
            const next = { spotId: spot.id, puzzleId: puzzle.id };
            activePuzzleRef.current = next;
            setActivePuzzle(next);
          }
        }
      }
      draw();
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [draw, collected, activePuzzle]);

  useEffect(() => {
    const keyMap: Record<string, Direction> = {
      ArrowUp: 'up',
      w: 'up',
      W: 'up',
      ArrowDown: 'down',
      s: 'down',
      S: 'down',
      ArrowLeft: 'left',
      a: 'left',
      A: 'left',
      ArrowRight: 'right',
      d: 'right',
      D: 'right'
    };
    const onDown = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (dir) {
        heldRef.current.add(dir);
        e.preventDefault();
      }
      if ((e.key === 'Enter' || e.key === ' ') && nearBuilding) {
        navigate(`../${nearBuilding.route}`);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      const dir = keyMap[e.key];
      if (dir) heldRef.current.delete(dir);
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [nearBuilding, navigate]);

  const holdDirection = (dir: Direction, active: boolean) => {
    if (active) heldRef.current.add(dir);
    else heldRef.current.delete(dir);
    forceRender((n) => n + 1);
  };

  if (!profile) return null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink flex items-center gap-2">
          <MapIcon className="w-6 h-6 text-stem-teal" /> Mundo Maker
        </h1>
        <p className="font-body-stem text-sm text-stem-ink-soft">
          Ande com WASD/setas (ou os botões abaixo no celular) e entre nos prédios. Marcadores{' '}
          <span className="font-semibold">❓</span> pelo mapa valem um minigame bônus.
        </p>
      </div>

      <div className="relative mx-auto max-w-3xl rounded-3xl overflow-hidden border-2 border-stem-line shadow-[0_4px_0_0_rgba(27,36,48,0.06)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          className="w-full h-auto block bg-stem-mist"
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}` }}
        />

        {nearBuilding && (
          <button
            onClick={() => navigate(`../${nearBuilding.route}`)}
            className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-stem-teal text-white font-display font-bold text-sm px-5 py-2.5 rounded-2xl border-b-4 border-stem-teal-dark shadow-lg animate-[bobIdle_1.2s_ease-in-out_infinite]"
          >
            Entrar em {nearBuilding.label} (Enter)
          </button>
        )}
      </div>

      {/* D-pad tátil — mobile/tablet, onde não há teclado físico. */}
      <div className="lg:hidden flex items-center justify-center gap-2 select-none">
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-40">
          <div />
          <DPadButton icon={<ArrowUp className="w-5 h-5" />} onHold={(v) => holdDirection('up', v)} />
          <div />
          <DPadButton icon={<ArrowLeft className="w-5 h-5" />} onHold={(v) => holdDirection('left', v)} />
          <div />
          <DPadButton icon={<ArrowRight className="w-5 h-5" />} onHold={(v) => holdDirection('right', v)} />
          <div />
          <DPadButton icon={<ArrowDown className="w-5 h-5" />} onHold={(v) => holdDirection('down', v)} />
          <div />
        </div>
      </div>

      {puzzleForActive && (
        <SequenceChallenge
          key={puzzleForActive.id}
          puzzle={puzzleForActive}
          onClose={() => {
            activePuzzleRef.current = null;
            setActivePuzzle(null);
          }}
          onSuccess={() => {
            if (activePuzzle) {
              setCollected((prev) => new Set(prev).add(activePuzzle.spotId));
              handleCollectEncounter(puzzleForActive.xpReward, puzzleForActive.coinReward);
            }
            activePuzzleRef.current = null;
            setActivePuzzle(null);
          }}
        />
      )}
    </div>
  );
};

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

const DPadButton: React.FC<{ icon: React.ReactNode; onHold: (active: boolean) => void }> = ({ icon, onHold }) => (
  <button
    onPointerDown={(e) => {
      e.preventDefault();
      onHold(true);
    }}
    onPointerUp={() => onHold(false)}
    onPointerLeave={() => onHold(false)}
    onPointerCancel={() => onHold(false)}
    className="flex items-center justify-center w-12 h-12 rounded-xl bg-stem-cloud border-2 border-stem-line text-stem-ink active:bg-stem-teal active:text-white active:border-stem-teal touch-none"
  >
    {icon}
  </button>
);
