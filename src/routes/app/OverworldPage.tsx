import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Map as MapIcon, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Sparkles, Moon, Sun, MessageSquare, Coins, User, Paintbrush, Hammer, Image as ImageIcon, Zap, Plus, Check, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { SequenceChallenge } from '../../components/trail/SequenceChallenge';
import { SEQUENCE_PUZZLES } from '../../data/sequencePuzzles';
import { PixelArtStudioModal } from '../../components/studio/PixelArtStudioModal';
import { ClassGalleryModal, type GalleryItem } from '../../components/studio/ClassGalleryModal';
import { soundEngine } from '../../services/soundEngine';
import type { ClassOutletContext } from './ClassLayout';

const CANVAS_W = 960;
const CANVAS_H = 540;
const AVATAR_R = 18;
const SPEED = 3.6;

interface MapNPC {
  id: string;
  name: string;
  title: string;
  avatarIcon: string;
  avatarImg?: string;
  x: number;
  y: number;
  route?: string;
  isEncounter?: boolean;
  encounterId?: string;
  icon: string;
  greeting: string;
  color: string;
  facing: 'left' | 'right';
}

interface PlacedItem {
  id: string;
  name: string;
  icon?: string;
  dataUrl?: string;
  x: number;
  y: number;
  type: 'solar' | 'wind' | 'garden' | 'crystal' | 'custom';
}

interface HarvestNode {
  id: string;
  type: 'energy' | 'biomass' | 'crystal';
  icon: string;
  name: string;
  x: number;
  y: number;
  ready: boolean;
  yieldXp: number;
  yieldCoins: number;
}

const NPCS: MapNPC[] = [
  {
    id: 'trilha',
    name: 'Maga Ada',
    title: 'Torre das Habilidades',
    avatarIcon: '🧙‍♀️',
    avatarImg: '/game/npc_mage_ada.png',
    x: 140,
    y: 145,
    route: 'trilha',
    icon: '⚡',
    greeting: 'Olá Herói! Venha expandir seus ramos de habilidades em código e robótica!',
    color: '#00e1ff',
    facing: 'right'
  },
  {
    id: 'missoes',
    name: 'Mestre Leo',
    title: 'Mural de Missões',
    avatarIcon: '📜',
    avatarImg: '/avatars/avatar-cyber-coder.svg',
    x: 480,
    y: 135,
    route: 'missoes',
    icon: '❗',
    greeting: 'Novas missões ODS da ONU disponíveis! Aceite um desafio e ganhe XP.',
    color: '#ffb700',
    facing: 'left'
  },
  {
    id: 'guildas',
    name: 'Comandante Val',
    title: 'Salão das Guildas',
    avatarIcon: '🛡️',
    avatarImg: '/avatars/avatar-hardware-mage.svg',
    x: 825,
    y: 145,
    route: 'guildas',
    icon: '🏰',
    greeting: 'Reúna seu esquadrão! As guildas aumentam o poder de toda a turma.',
    color: '#00ffaa',
    facing: 'left'
  },
  {
    id: 'lab',
    name: 'Engenheiro Tinker',
    title: 'Maker Lab',
    avatarIcon: '🔧',
    avatarImg: '/avatars/avatar-robot-engineer.svg',
    x: 125,
    y: 285,
    route: 'lab',
    icon: '⚙️',
    greeting: 'Bancadas de Arduino, sensores e circuitos prontas para seus experimentos!',
    color: '#38b6ff',
    facing: 'right'
  },
  {
    id: 'portais',
    name: 'Sábia Chrono',
    title: 'Portais de Desafios',
    avatarIcon: '🌐',
    avatarImg: '/avatars/avatar-pixel-artist.svg',
    x: 840,
    y: 285,
    route: 'portais',
    icon: '🌀',
    greeting: 'Os portais conectam sua jornada com as Olimpíadas e Torneios do mundo real!',
    color: '#c77dff',
    facing: 'left'
  },
  {
    id: 'curiosidades',
    name: 'Astrônomo Galileu',
    title: 'Torre Curiosidades',
    avatarIcon: '🧭',
    x: 235,
    y: 435,
    route: 'curiosidades',
    icon: '💡',
    greeting: 'Descubra segredos da história maker e curiosidades que valem pontos.',
    color: '#ff9e00',
    facing: 'right'
  },
  {
    id: 'hackathon',
    name: 'Campeão Blitz',
    title: 'Arena Hackathon',
    avatarIcon: '⚔️',
    x: 710,
    y: 435,
    route: 'hackathon',
    icon: '🏆',
    greeting: 'A arena está aberta! Enfrente os desafios de justiça climática.',
    color: '#ff007f',
    facing: 'left'
  },
  // NPCs de Encontros
  {
    id: 'enc-npc-1',
    name: 'Bot Sparky',
    title: 'Enigma de Lógica',
    avatarIcon: '🤖',
    x: 370,
    y: 280,
    isEncounter: true,
    encounterId: 'enc-1',
    icon: '❓',
    greeting: 'Bip-bup! Resolva meu quebra-cabeça de sequência lógica para ganhar moedas.',
    color: '#ffd700',
    facing: 'right'
  },
  {
    id: 'enc-npc-2',
    name: 'Guardiã Byte',
    title: 'Arca de Algoritmos',
    avatarIcon: '🦊',
    x: 580,
    y: 250,
    isEncounter: true,
    encounterId: 'enc-2',
    icon: '❓',
    greeting: 'Tenho um desafio especial de algoritmos! Aceita decifrar a chave?',
    color: '#ff8800',
    facing: 'left'
  },
  {
    id: 'enc-npc-3',
    name: 'Mestre Volt',
    title: 'Cofre Maker',
    avatarIcon: '🧝‍♂️',
    x: 480,
    y: 395,
    isEncounter: true,
    encounterId: 'enc-3',
    icon: '❓',
    greeting: 'Você sabe como montar circuitos na ordem certa? Prove seu valor!',
    color: '#00ffcc',
    facing: 'right'
  }
];

// Nós de colheita periódica de energia inspirados no Sunflower Land
const INITIAL_HARVEST_NODES: HarvestNode[] = [
  { id: 'node-1', type: 'energy', icon: '☀️', name: 'Placa Solar Comunitária', x: 280, y: 150, ready: true, yieldXp: 15, yieldCoins: 5 },
  { id: 'node-2', type: 'crystal', icon: '💎', name: 'Mina de Cristais Quânticos', x: 670, y: 150, ready: true, yieldXp: 20, yieldCoins: 8 },
  { id: 'node-3', type: 'biomass', icon: '🌱', name: 'Horta Hidropônica Maker', x: 420, y: 440, ready: true, yieldXp: 15, yieldCoins: 6 }
];

type Direction = 'up' | 'down' | 'left' | 'right';

export const OverworldPage: React.FC = () => {
  const { handleCollectEncounter } = useOutletContext<ClassOutletContext>();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const posRef = useRef({ x: CANVAS_W / 2, y: CANVAS_H / 2 });
  const heldRef = useRef<Set<Direction>>(new Set());
  const frameRef = useRef<number>(0);
  const lastFacingRef = useRef<Direction>('down');
  const stepCountRef = useRef(0);

  const [nearNpc, setNearNpc] = useState<MapNPC | null>(null);
  const [collected, setCollected] = useState<Set<string>>(new Set());
  const [activePuzzle, setActivePuzzle] = useState<{ spotId: string; puzzleId: string } | null>(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [isBuildMode, setIsBuildMode] = useState(false);
  const [showStudio, setShowStudio] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // Sunflower Land: Itens construídos e colocados na ilha
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([
    { id: 'item-1', name: 'Painel Solar Solarpunk', icon: '☀️', x: 260, y: 220, type: 'solar' },
    { id: 'item-2', name: 'Turbina Eólica Maker', icon: '🌀', x: 700, y: 220, type: 'wind' }
  ]);
  const [selectedBuildType, setSelectedBuildType] = useState<'solar' | 'wind' | 'garden' | 'crystal' | 'custom'>('solar');
  const [harvestNodes, setHarvestNodes] = useState<HarvestNode[]>(INITIAL_HARVEST_NODES);
  const [galleryArtworks, setGalleryArtworks] = useState<GalleryItem[]>([]);
  const [solarpunkEnergy, setSolarpunkEnergy] = useState(120);

  const [particles, setParticles] = useState<Array<{ x: number; y: number; s: number; vy: number; alpha: number }>>([]);
  const activePuzzleRef = useRef<typeof activePuzzle>(null);
  const [, forceRender] = useState(0);

  const mapImageRef = useRef<HTMLImageElement | null>(null);
  const adaImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const mapImg = new Image();
    mapImg.src = '/game/overworld_rpg_map.jpg';
    mapImg.onload = () => {
      mapImageRef.current = mapImg;
    };

    const adaImg = new Image();
    adaImg.src = '/game/npc_mage_ada.png';
    adaImg.onload = () => {
      adaImageRef.current = adaImg;
    };

    const pts = Array.from({ length: 28 }).map(() => ({
      x: Math.random() * CANVAS_W,
      y: Math.random() * CANVAS_H,
      s: Math.random() * 2 + 1,
      vy: -(Math.random() * 0.4 + 0.2),
      alpha: Math.random() * 0.6 + 0.3
    }));
    setParticles(pts);
  }, []);

  const avatarHead = profile?.avatarConfig.head ?? '🧑';

  const puzzleForActive = useMemo(
    () => (activePuzzle ? SEQUENCE_PUZZLES.find((p) => p.id === activePuzzle.puzzleId) : undefined),
    [activePuzzle]
  );

  // Colher recurso Solarpunk
  const handleHarvest = (nodeId: string) => {
    const node = harvestNodes.find((n) => n.id === nodeId);
    if (!node || !node.ready) return;

    soundEngine.playHarvest();
    setSolarpunkEnergy((prev) => prev + 25);
    handleCollectEncounter(node.yieldXp, node.yieldCoins);

    // Desativa e agenda recarga
    setHarvestNodes((prev) =>
      prev.map((n) => (n.id === nodeId ? { ...n, ready: false } : n))
    );

    setTimeout(() => {
      setHarvestNodes((prev) =>
        prev.map((n) => (n.id === nodeId ? { ...n, ready: true } : n))
      );
    }, 12000);
  };

  // Clique no canvas para construir ou colher
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // 1. Checar clique nos nós de colheita
    for (const node of harvestNodes) {
      if (node.ready && Math.hypot(clickX - node.x, clickY - node.y) < 28) {
        handleHarvest(node.id);
        return;
      }
    }

    // 2. Se modo construtor ativo, coloca o item na posição clicada
    if (isBuildMode) {
      soundEngine.playPlace();
      const icons: Record<string, string> = {
        solar: '☀️',
        wind: '🌀',
        garden: '🌸',
        crystal: '💎',
        custom: '🎨'
      };
      const names: Record<string, string> = {
        solar: 'Painel Solar',
        wind: 'Microturbina',
        garden: 'Canteiro Solarpunk',
        crystal: 'Cristal Quântico',
        custom: 'Arte do Aluno'
      };
      setPlacedItems((prev) => [
        ...prev,
        {
          id: `placed-${Date.now()}`,
          name: names[selectedBuildType],
          icon: icons[selectedBuildType],
          x: Math.round(clickX),
          y: Math.round(clickY),
          type: selectedBuildType
        }
      ]);
    }
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    // 1. Fundo do Mapa Pixel Art
    if (mapImageRef.current && mapImageRef.current.complete) {
      ctx.drawImage(mapImageRef.current, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // Grade do Modo Construtor (Sunflower Land Grid)
    if (isBuildMode) {
      ctx.strokeStyle = 'rgba(0, 255, 170, 0.18)';
      ctx.lineWidth = 1;
      for (let x = 0; x < CANVAS_W; x += 32) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, CANVAS_H);
        ctx.stroke();
      }
      for (let y = 0; y < CANVAS_H; y += 32) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(CANVAS_W, y);
        ctx.stroke();
      }
    }

    if (isNightMode) {
      ctx.fillStyle = 'rgba(10, 15, 35, 0.6)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    const time = Date.now() / 250;

    // 2. Renderização de Estruturas e Decorações da Ilha Solarpunk
    for (const item of placedItems) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(item.x, item.y + 12, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (item.dataUrl) {
        const img = new Image();
        img.src = item.dataUrl;
        ctx.drawImage(img, item.x - 16, item.y - 16, 32, 32);
      } else {
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon ?? '🌸', item.x, item.y + 8);
      }
    }

    // 3. Nós de Colheita de Energia (Sunflower Land Crops / Energy Generators)
    for (const node of harvestNodes) {
      const bob = node.ready ? Math.sin(time * 2 + node.x) * 3 : 0;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(node.x, node.y + 12, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(node.icon, node.x, node.y + 6 + bob);

      if (node.ready) {
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillStyle = '#00ffaa';
        ctx.fillText('COLHER!', node.x, node.y - 18 + bob);
      }
    }

    // 4. Renderização de NPCs
    for (const npc of NPCS) {
      if (npc.isEncounter && npc.encounterId && collected.has(npc.encounterId)) continue;
      const isNear = nearNpc?.id === npc.id;
      const idleBob = Math.sin(time + npc.x) * 2.5;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(npc.x, npc.y + 14, 13, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isNear) {
        ctx.strokeStyle = npc.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(npc.x, npc.y + 12, 18, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (npc.id === 'trilha' && adaImageRef.current && adaImageRef.current.complete) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(npc.x, npc.y + idleBob, 16, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(adaImageRef.current, npc.x - 16, npc.y - 16 + idleBob, 32, 32);
        ctx.restore();
        ctx.strokeStyle = npc.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(npc.avatarIcon, npc.x, npc.y + 8 + idleBob);
      }

      const iconBounce = Math.sin(time * 2 + npc.y) * 3;
      ctx.fillStyle = '#0a0e17';
      ctx.beginPath();
      ctx.arc(npc.x, npc.y - 24 + iconBounce, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = npc.color;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.font = 'bold 11px "Press Start 2P", monospace';
      ctx.fillStyle = npc.color;
      ctx.textAlign = 'center';
      ctx.fillText(npc.icon, npc.x, npc.y - 20 + iconBounce);

      ctx.font = 'bold 9px "Press Start 2P", monospace';
      const textW = ctx.measureText(npc.name).width;
      ctx.fillStyle = 'rgba(10, 14, 23, 0.85)';
      ctx.fillRect(npc.x - textW / 2 - 4, npc.y + 20, textW + 8, 14);
      ctx.strokeStyle = npc.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(npc.x - textW / 2 - 4, npc.y + 20, textW + 8, 14);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(npc.name, npc.x, npc.y + 30);
    }

    // 5. Partículas Mágicas
    ctx.fillStyle = isNightMode ? '#00ffaa' : '#ffd700';
    for (const pt of particles) {
      ctx.globalAlpha = pt.alpha;
      ctx.fillRect(pt.x, pt.y, pt.s, pt.s);
    }
    ctx.globalAlpha = 1;

    // 6. Jogador / Avatar
    const { x, y } = posRef.current;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(x, y + 16, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#00ffaa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y + 14, 15, 0, Math.PI * 2);
    ctx.stroke();

    const walkBob = heldRef.current.size > 0 ? Math.sin(stepCountRef.current * 0.25) * 3 : 0;
    ctx.font = '34px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(avatarHead, x, y + 10 + walkBob);

    const heroName = profile?.adventureName ?? 'Herói Maker';
    ctx.font = 'bold 10px "Press Start 2P", monospace, sans-serif';
    ctx.fillStyle = '#0a0e17';
    ctx.fillText(heroName, x + 1, y - 19);
    ctx.fillStyle = '#00ffaa';
    ctx.fillText(heroName, x, y - 20);

  }, [avatarHead, nearNpc, collected, isNightMode, isBuildMode, placedItems, harvestNodes, particles, profile?.adventureName]);

  // Loop de Movimento
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
        stepCountRef.current += 1;
        const len = Math.hypot(dx, dy);
        pos.x = Math.min(CANVAS_W - AVATAR_R, Math.max(AVATAR_R, pos.x + (dx / len) * SPEED));
        pos.y = Math.min(CANVAS_H - AVATAR_R, Math.max(AVATAR_R, pos.y + (dy / len) * SPEED));

        if (dx < 0) lastFacingRef.current = 'left';
        else if (dx > 0) lastFacingRef.current = 'right';
        else if (dy < 0) lastFacingRef.current = 'up';
        else if (dy > 0) lastFacingRef.current = 'down';

        const closestNpc =
          NPCS.find((npc) => {
            if (npc.isEncounter && npc.encounterId && collected.has(npc.encounterId)) return false;
            return Math.hypot(pos.x - npc.x, pos.y - npc.y) < 42;
          }) ?? null;

        setNearNpc((prev) => (prev?.id !== closestNpc?.id ? closestNpc : prev));

        if (closestNpc?.isEncounter && closestNpc.encounterId && !activePuzzleRef.current && !collected.has(closestNpc.encounterId)) {
          soundEngine.playWhoosh();
          const puzzle = SEQUENCE_PUZZLES[Math.floor(Math.random() * SEQUENCE_PUZZLES.length)];
          const next = { spotId: closestNpc.encounterId, puzzleId: puzzle.id };
          activePuzzleRef.current = next;
          setActivePuzzle(next);
        }
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          y: p.y < 0 ? CANVAS_H : p.y + p.vy,
          x: p.x + Math.sin(p.y * 0.02) * 0.2
        }))
      );

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
      if ((e.key === 'Enter' || e.key === ' ') && nearNpc?.route) {
        navigate(`../${nearNpc.route}`);
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
  }, [nearNpc, navigate]);

  const holdDirection = (dir: Direction, active: boolean) => {
    if (active) heldRef.current.add(dir);
    else heldRef.current.delete(dir);
    forceRender((n) => n + 1);
  };

  if (!profile) return null;

  const currentLevel = profile.level ?? 1;
  const currentXp = profile.xp ?? 0;
  const currentCoins = profile.izicoins ?? 0;
  const xpForNextLevel = profile.xpToNextLevel || (currentLevel * 200);
  const xpPercentage = Math.min(100, Math.round(((currentXp % 200) / 200) * 100));

  return (
    <div className="space-y-4">
      {/* Sunflower Land Solarpunk Top Action Bar */}
      <div className="sunflower-box p-3 flex flex-wrap items-center justify-between gap-3 text-white">
        {/* Perfil & Nível */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(255,183,0,0.4)]">
            {avatarHead}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-amber-400">{profile.adventureName}</span>
              <span className="font-pixel text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500 px-1.5 py-0.5 rounded">
                LVL {currentLevel}
              </span>
            </div>
            {/* XP Bar */}
            <div className="w-40 mt-1.5">
              <div className="flex justify-between text-[9px] font-pixel text-slate-300 mb-0.5">
                <span>XP</span>
                <span>{currentXp} / {xpForNextLevel}</span>
              </div>
              <div className="pixel-progress-bg h-2.5">
                <div
                  className="pixel-progress-fill pixel-progress-fill-xp"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Recursos: Energia Solarpunk & Moedas */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#142334] border border-cyan-500/80 px-2.5 py-1.5 rounded-lg shadow-sm">
            <Zap className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="font-pixel text-xs text-cyan-300">{solarpunkEnergy} kWh</span>
          </div>

          <div className="flex items-center gap-1.5 bg-[#2d2208] border border-amber-500/80 px-2.5 py-1.5 rounded-lg shadow-sm">
            <Coins className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="font-pixel text-xs text-amber-300">{currentCoins} G</span>
          </div>
        </div>

        {/* Ações de Protagonismo Maker: Estúdio, Modo Construtor, Galeria */}
        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => setShowStudio(true)}
            className="sunflower-btn sunflower-btn-gold text-[10px] py-1.5 px-3 flex items-center gap-1.5"
            title="Desenhar Pixel Art para o jogo"
          >
            <Paintbrush className="w-3.5 h-3.5" /> ESTÚDIO PIXEL
          </button>

          <button
            onClick={() => {
              soundEngine.playClick();
              setIsBuildMode((v) => !v);
            }}
            className={`sunflower-btn text-[10px] py-1.5 px-3 flex items-center gap-1.5 ${isBuildMode ? 'bg-amber-500 text-slate-950 font-bold' : 'sunflower-btn-cyber'}`}
            title="Construir na Ilha Maker"
          >
            <Hammer className="w-3.5 h-3.5" /> {isBuildMode ? 'CONSTRUINDO...' : 'CONSTRUIR'}
          </button>

          <button
            onClick={() => setShowGallery(true)}
            className="sunflower-btn text-[10px] py-1.5 px-3 flex items-center gap-1.5 bg-purple-900 border-purple-500 text-purple-200"
            title="Ver Galeria de Artes da Turma"
          >
            <ImageIcon className="w-3.5 h-3.5" /> GALERIA
          </button>

          <button
            onClick={() => setIsNightMode((v) => !v)}
            className="pixel-btn text-[10px] py-1.5 px-2.5"
            title="Dia / Cyber Solarpunk"
          >
            {isNightMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>
      </div>

      {/* Barra de Seleção de Estrutura no Modo Construtor */}
      {isBuildMode && (
        <div className="sunflower-box p-2.5 flex items-center justify-between gap-2 text-white animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-pixel text-amber-300">
            <span>SELECIONE O QUE CONSTRUIR (CLIQUE NO MAPA):</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { type: 'solar', label: 'Painel Solar', icon: '☀️' },
              { type: 'wind', label: 'Turbina', icon: '🌀' },
              { type: 'garden', label: 'Canteiro', icon: '🌸' },
              { type: 'crystal', label: 'Cristal', icon: '💎' }
            ].map((b) => (
              <button
                key={b.type}
                onClick={() => setSelectedBuildType(b.type as typeof selectedBuildType)}
                className={`px-2.5 py-1.5 rounded-lg font-pixel text-[10px] flex items-center gap-1 border-2 transition-all ${selectedBuildType === b.type ? 'bg-amber-500 text-slate-950 border-amber-300 font-bold scale-105' : 'bg-slate-900 border-slate-700 text-slate-300'}`}
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mapa Canvas Viewport */}
      <div className="relative mx-auto max-w-5xl rounded-xl overflow-hidden border-4 border-[#2e3859] shadow-[0_0_35px_rgba(0,0,0,0.8)]">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={handleCanvasClick}
          className="w-full h-auto block bg-[#0b101d] cursor-pointer"
          style={{ aspectRatio: `${CANVAS_W} / ${CANVAS_H}`, imageRendering: 'pixelated' }}
        />

        {/* Balão de Diálogo de NPC ao se aproximar */}
        {nearNpc && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 w-11/12 max-w-xl rpg-dialogue p-3.5 shadow-2xl bg-slate-950/95 border-2 border-cyan-400 rounded-lg animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-2xl shrink-0">
                {nearNpc.avatarIcon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-pixel text-[11px] text-cyan-300">[{nearNpc.name}]</span>
                  <span className="text-[10px] font-pixel text-slate-400">{nearNpc.title}</span>
                </div>
                <p className="text-xs font-body-stem text-slate-200 leading-relaxed mb-2">
                  "{nearNpc.greeting}"
                </p>

                {nearNpc.route && (
                  <button
                    onClick={() => navigate(`../${nearNpc.route}`)}
                    className="pixel-btn pixel-btn-primary text-[10px] py-1.5 px-3 font-pixel flex items-center gap-1.5"
                  >
                    <span>FALAR / ENTRAR</span>
                    <span className="text-slate-900 bg-emerald-300 px-1 rounded text-[9px]">[ESPAÇO]</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Overlay do Mini Radar de Enigmas */}
        <div className="absolute top-3 right-3 bg-black/75 border border-cyan-500/60 p-2 rounded text-[10px] font-pixel text-cyan-300 backdrop-blur-sm">
          <p className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" /> MESTRES: {3 - collected.size}/3 ENIGMAS
          </p>
        </div>
      </div>

      {/* D-pad estilo Game Boy para Mobile & Tablet */}
      <div className="lg:hidden flex flex-col items-center justify-center gap-2 select-none pt-2">
        <p className="font-pixel text-[10px] text-slate-400">CONTROLES DIGITAIS</p>
        <div className="grid grid-cols-3 grid-rows-3 gap-1.5 w-44">
          <div />
          <DPadButton icon={<ArrowUp className="w-5 h-5 text-cyan-400" />} onHold={(v) => holdDirection('up', v)} />
          <div />
          <DPadButton icon={<ArrowLeft className="w-5 h-5 text-cyan-400" />} onHold={(v) => holdDirection('left', v)} />
          <div className="flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-cyan-500/40" />
          </div>
          <DPadButton icon={<ArrowRight className="w-5 h-5 text-cyan-400" />} onHold={(v) => holdDirection('right', v)} />
          <div />
          <DPadButton icon={<ArrowDown className="w-5 h-5 text-cyan-400" />} onHold={(v) => holdDirection('down', v)} />
          <div />
        </div>
      </div>

      {/* Modal de Desafio do Enigma */}
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
              soundEngine.playSuccess();
            }
            activePuzzleRef.current = null;
            setActivePuzzle(null);
          }}
        />
      )}

      {/* Modal do Estúdio Pixel Art */}
      {showStudio && (
        <PixelArtStudioModal
          authorName={profile.adventureName}
          onClose={() => setShowStudio(false)}
          onSaveToIsland={(customArt) => {
            setPlacedItems((prev) => [
              ...prev,
              {
                id: customArt.id,
                name: customArt.name,
                dataUrl: customArt.dataUrl,
                x: 480,
                y: 270,
                type: 'custom'
              }
            ]);
            handleCollectEncounter(50, 25);
          }}
          onPublishToGallery={(art) => {
            setGalleryArtworks((prev) => [
              {
                id: `art-${Date.now()}`,
                title: art.title,
                author: art.author,
                dataUrl: art.dataUrl,
                likes: 1,
                category: 'Criação do Aluno'
              },
              ...prev
            ]);
            handleCollectEncounter(50, 25);
          }}
        />
      )}

      {/* Modal da Galeria da Turma */}
      {showGallery && (
        <ClassGalleryModal
          customArtworks={galleryArtworks}
          onClose={() => setShowGallery(false)}
          onImportToIsland={(item) => {
            setPlacedItems((prev) => [
              ...prev,
              {
                id: `import-${Date.now()}`,
                name: item.title,
                dataUrl: item.dataUrl,
                x: 520,
                y: 300,
                type: 'custom'
              }
            ]);
          }}
        />
      )}
    </div>
  );
};

const DPadButton: React.FC<{ icon: React.ReactNode; onHold: (active: boolean) => void }> = ({ icon, onHold }) => (
  <button
    onPointerDown={(e) => {
      e.preventDefault();
      onHold(true);
    }}
    onPointerUp={() => onHold(false)}
    onPointerLeave={() => onHold(false)}
    onPointerCancel={() => onHold(false)}
    className="flex items-center justify-center w-13 h-13 rounded-lg bg-[#161d31] border-2 border-cyan-500/50 text-cyan-300 active:bg-cyan-500 active:text-black shadow-[0_4px_0_0_#0a0e19] touch-none"
  >
    {icon}
  </button>
);


