import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Paintbrush, Eraser, PaintBucket, Pipette, RotateCcw, RotateCw, Download, Sparkles, Check, Grid, Palette, Share2, Layers } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

interface PixelArtStudioModalProps {
  onClose: () => void;
  onSaveToIsland?: (item: { id: string; name: string; icon: string; dataUrl: string }) => void;
  onSaveAsAvatar?: (dataUrl: string) => void;
  onPublishToGallery?: (item: { title: string; dataUrl: string; author: string }) => void;
  authorName?: string;
}

const PALETTES = {
  solarpunk: [
    '#2ecc71', '#27ae60', '#1abc9c', '#f1c40f', '#e67e22', '#e74c3c',
    '#3498db', '#9b59b6', '#34495e', '#795548', '#8d6e63', '#ffffff',
    '#000000', '#f39c12', '#16a085', '#2c3e50'
  ],
  cyberpunk: [
    '#00ffaa', '#00e1ff', '#ff007f', '#ffb700', '#9d4edd', '#0d0f18',
    '#ffffff', '#ff0055', '#7928ca', '#0070f3', '#50e3c2', '#ff5500',
    '#112233', '#161b2e', '#2e3859', '#38ef7d'
  ],
  retroGame: [
    '#0f380f', '#306230', '#8bac0f', '#9bbc0f', '#000000', '#ffffff',
    '#b81414', '#e06000', '#008800', '#00a8a8', '#0000a8', '#a800a8',
    '#f8b800', '#a8a8a8', '#f85898', '#58d858'
  ]
};

type Tool = 'brush' | 'eraser' | 'bucket' | 'picker';

export const PixelArtStudioModal: React.FC<PixelArtStudioModalProps> = ({
  onClose,
  onSaveToIsland,
  onSaveAsAvatar,
  onPublishToGallery,
  authorName = 'Herói Maker'
}) => {
  const [gridSize, setGridSize] = useState<16 | 32>(16);
  const [pixels, setPixels] = useState<string[]>(() => Array(16 * 16).fill('#00000000'));
  const [color, setColor] = useState('#00ffaa');
  const [tool, setTool] = useState<Tool>('brush');
  const [paletteKey, setPaletteKey] = useState<'solarpunk' | 'cyberpunk' | 'retroGame'>('solarpunk');
  const [title, setTitle] = useState('Minha Criação Maker');
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState<string[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [published, setPublished] = useState(false);
  const isMouseDownRef = useRef(false);

  // Inicializar histórico
  useEffect(() => {
    const initial = Array(gridSize * gridSize).fill('#00000000');
    setPixels(initial);
    setHistory([initial]);
    setHistoryIndex(0);
  }, [gridSize]);

  const pushState = useCallback((newPixels: string[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      return [...sliced, newPixels];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = () => {
    if (historyIndex > 0) {
      soundEngine.playClick();
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setPixels(history[nextIdx]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      soundEngine.playClick();
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setPixels(history[nextIdx]);
    }
  };

  const applyToolAt = (index: number) => {
    if (tool === 'picker') {
      const picked = pixels[index];
      if (picked && picked !== '#00000000') {
        setColor(picked);
        setTool('brush');
        soundEngine.playClick();
      }
      return;
    }

    if (tool === 'bucket') {
      const targetColor = pixels[index];
      const fillColor = color;
      if (targetColor === fillColor) return;

      const newPixels = [...pixels];
      const queue = [index];
      const visited = new Set<number>();

      while (queue.length > 0) {
        const curr = queue.pop()!;
        if (visited.has(curr)) continue;
        visited.add(curr);

        if (newPixels[curr] === targetColor) {
          newPixels[curr] = fillColor;
          const x = curr % gridSize;
          const y = Math.floor(curr / gridSize);

          if (x > 0) queue.push(curr - 1);
          if (x < gridSize - 1) queue.push(curr + 1);
          if (y > 0) queue.push(curr - gridSize);
          if (y < gridSize - 1) queue.push(curr + gridSize);
        }
      }
      setPixels(newPixels);
      pushState(newPixels);
      soundEngine.playHarvest();
      return;
    }

    const newColor = tool === 'eraser' ? '#00000000' : color;
    if (pixels[index] === newColor) return;

    const next = [...pixels];
    next[index] = newColor;
    setPixels(next);
  };

  const handlePointerDown = (index: number) => {
    isMouseDownRef.current = true;
    applyToolAt(index);
  };

  const handlePointerEnter = (index: number) => {
    if (isMouseDownRef.current && (tool === 'brush' || tool === 'eraser')) {
      applyToolAt(index);
    }
  };

  const handlePointerUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      pushState(pixels);
    }
  };

  // Gerar Data URL do canvas
  const getRenderedDataUrl = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const idx = y * gridSize + x;
        const pColor = pixels[idx];
        if (pColor && pColor !== '#00000000') {
          ctx.fillStyle = pColor;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    }
    return canvas.toDataURL('image/png');
  };

  const handleClear = () => {
    soundEngine.playClick();
    const empty = Array(gridSize * gridSize).fill('#00000000');
    setPixels(empty);
    pushState(empty);
  };

  const handleExportPNG = () => {
    soundEngine.playHarvest();
    const dataUrl = getRenderedDataUrl();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_pixel.png`;
    a.click();
  };

  const handlePlaceOnIsland = () => {
    soundEngine.playPlace();
    const dataUrl = getRenderedDataUrl();
    onSaveToIsland?.({
      id: `custom-${Date.now()}`,
      name: title,
      icon: '🎨',
      dataUrl
    });
    onClose();
  };

  const handleSetAvatar = () => {
    soundEngine.playLevelUp();
    const dataUrl = getRenderedDataUrl();
    onSaveAsAvatar?.(dataUrl);
    onClose();
  };

  const handlePublish = () => {
    soundEngine.playSuccess();
    const dataUrl = getRenderedDataUrl();
    onPublishToGallery?.({
      title,
      dataUrl,
      author: authorName
    });
    setPublished(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none"
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="w-full max-w-3xl sunflower-box overflow-hidden flex flex-col max-h-[92vh] text-white">
        {/* Header */}
        <div className="bg-[#141d2b] border-b-2 border-[#2b3d56] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-lg">
              🎨
            </span>
            <div>
              <h2 className="font-pixel text-xs text-amber-400">ESTÚDIO PIXEL ART · PROTAGONISMO MAKER</h2>
              <p className="text-[11px] font-body-stem text-slate-300">Crie avatares, itens e decorações para a sua ilha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workspace Body */}
        <div className="p-4 overflow-y-auto flex flex-col md:flex-row gap-5 items-center justify-center">
          {/* Lado Esquerdo: Barra de Ferramentas & Paletas */}
          <div className="flex flex-col gap-3 w-full md:w-56 shrink-0">
            {/* Ferramentas de Desenho */}
            <div className="bg-[#0f1622] p-3 rounded-lg border-2 border-[#27384e]">
              <span className="text-[10px] font-pixel text-slate-400 block mb-2">FERRAMENTAS</span>
              <div className="grid grid-cols-4 gap-1.5">
                <button
                  onClick={() => { setTool('brush'); soundEngine.playClick(); }}
                  className={`p-2 rounded flex items-center justify-center ${tool === 'brush' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  title="Pincel (Pixel)"
                >
                  <Paintbrush className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setTool('eraser'); soundEngine.playClick(); }}
                  className={`p-2 rounded flex items-center justify-center ${tool === 'eraser' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  title="Borracha"
                >
                  <Eraser className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setTool('bucket'); soundEngine.playClick(); }}
                  className={`p-2 rounded flex items-center justify-center ${tool === 'bucket' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  title="Balde de Tinta"
                >
                  <PaintBucket className="w-4 h-4" />
                </button>
                <button
                  onClick={() => { setTool('picker'); soundEngine.playClick(); }}
                  className={`p-2 rounded flex items-center justify-center ${tool === 'picker' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                  title="Conta-gotas"
                >
                  <Pipette className="w-4 h-4" />
                </button>
              </div>

              {/* Undo / Redo / Grid / Clear */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-700/60">
                <button
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                  title="Desfazer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="p-1.5 rounded bg-slate-800 text-slate-300 disabled:opacity-40 hover:bg-slate-700"
                  title="Refazer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowGrid((v) => !v)}
                  className={`p-1.5 rounded ${showGrid ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400'}`}
                  title="Grade"
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleClear}
                  className="text-[10px] font-pixel px-2 py-1 bg-rose-950/60 text-rose-300 border border-rose-600/40 rounded hover:bg-rose-900"
                >
                  LIMPAR
                </button>
              </div>
            </div>

            {/* Paletas Temáticas */}
            <div className="bg-[#0f1622] p-3 rounded-lg border-2 border-[#27384e]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-pixel text-slate-400">PALETAS</span>
                <select
                  value={paletteKey}
                  onChange={(e) => setPaletteKey(e.target.value as typeof paletteKey)}
                  className="bg-slate-900 text-cyan-300 text-[10px] font-pixel rounded px-1.5 py-0.5 border border-slate-700 outline-none"
                >
                  <option value="solarpunk">Solarpunk</option>
                  <option value="cyberpunk">Cyberpunk</option>
                  <option value="retroGame">Retro 8-Bit</option>
                </select>
              </div>

              {/* Swatches */}
              <div className="grid grid-cols-4 gap-1.5">
                {PALETTES[paletteKey].map((swatch, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setColor(swatch); setTool('brush'); soundEngine.playClick(); }}
                    className={`w-7 h-7 rounded border-2 transition-transform ${color === swatch ? 'scale-110 border-white shadow-[0_0_8px_rgba(255,255,255,0.8)] z-10' : 'border-black/50 hover:scale-105'}`}
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>

              {/* Custom Color Input */}
              <div className="mt-2.5 flex items-center gap-2 pt-2 border-t border-slate-700/60">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-[10px] font-mono text-slate-300 uppercase">{color}</span>
              </div>
            </div>

            {/* Resolução 16x16 / 32x32 */}
            <div className="flex gap-2">
              <button
                onClick={() => setGridSize(16)}
                className={`flex-1 py-1.5 text-[10px] font-pixel rounded border-2 ${gridSize === 16 ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                16 x 16
              </button>
              <button
                onClick={() => setGridSize(32)}
                className={`flex-1 py-1.5 text-[10px] font-pixel rounded border-2 ${gridSize === 32 ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
              >
                32 x 32
              </button>
            </div>
          </div>

          {/* Centro: Grade de Desenho Pixel Art */}
          <div className="flex flex-col items-center gap-3">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nome da Criação"
              className="bg-slate-900/90 text-amber-300 font-pixel text-xs text-center border border-amber-500/50 rounded-lg px-3 py-1.5 outline-none w-64 focus:border-amber-400"
            />

            {/* Canvas Interativo */}
            <div
              className="p-1 bg-[#0b0f17] border-4 border-[#334661] rounded-lg shadow-2xl relative"
              style={{ width: 288, height: 288 }}
            >
              <div
                className="w-full h-full grid"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                  gridTemplateRows: `repeat(${gridSize}, 1fr)`
                }}
              >
                {pixels.map((pColor, idx) => (
                  <div
                    key={idx}
                    onPointerDown={() => handlePointerDown(idx)}
                    onPointerEnter={() => handlePointerEnter(idx)}
                    className="w-full h-full cursor-crosshair relative"
                    style={{
                      backgroundColor: pColor === '#00000000' ? ((Math.floor(idx / gridSize) + (idx % gridSize)) % 2 === 0 ? '#131b26' : '#1a2433') : pColor,
                      boxShadow: showGrid ? 'inset 0 0 0 0.5px rgba(255,255,255,0.06)' : 'none'
                    }}
                  />
                ))}
              </div>
            </div>

            <p className="text-[10px] font-pixel text-slate-400">
              CLIQUE E ARRASTE PARA PINTAR
            </p>
          </div>

          {/* Lado Direito: Preview Vivo e Ações de Gamificação */}
          <div className="flex flex-col gap-3 w-full md:w-56 shrink-0">
            {/* Preview da Arte */}
            <div className="bg-[#0f1622] p-3 rounded-lg border-2 border-[#27384e] flex flex-col items-center">
              <span className="text-[10px] font-pixel text-slate-400 mb-2">PRÉVIA AO VIVO</span>
              
              {/* Mini display flutuante */}
              <div className="w-20 h-20 bg-slate-900 border-2 border-amber-400 rounded-xl flex items-center justify-center p-2 shadow-[0_0_15px_rgba(255,183,0,0.3)] animate-[bobIdle_2.4s_ease-in-out_infinite]">
                <img
                  src={getRenderedDataUrl()}
                  alt="Preview"
                  className="w-full h-full object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />
              </div>

              <div className="mt-2 text-center">
                <span className="text-[9px] font-pixel text-emerald-400 block">+50 XP POR CRIAÇÃO</span>
                <span className="text-[9px] font-pixel text-amber-300">🪙 +25 MOEDAS</span>
              </div>
            </div>

            {/* Ações Gamificadas */}
            <div className="flex flex-col gap-2">
              <button
                onClick={handlePlaceOnIsland}
                className="sunflower-btn sunflower-btn-cyber text-[10px] justify-center py-2 font-pixel"
              >
                <Sparkles className="w-3.5 h-3.5" /> COLOCAR NA ILHA
              </button>

              <button
                onClick={handleSetAvatar}
                className="sunflower-btn text-[10px] justify-center py-2 font-pixel"
              >
                <Check className="w-3.5 h-3.5" /> DEFINIR AVATAR
              </button>

              <button
                onClick={handlePublish}
                disabled={published}
                className={`sunflower-btn sunflower-btn-gold text-[10px] justify-center py-2 font-pixel ${published ? 'opacity-50' : ''}`}
              >
                <Share2 className="w-3.5 h-3.5" /> {published ? 'PUBLICADO!' : 'GALERIA DA TURMA'}
              </button>

              <button
                onClick={handleExportPNG}
                className="pixel-btn text-[10px] justify-center py-2 text-slate-300"
              >
                <Download className="w-3.5 h-3.5" /> BAIXAR .PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
