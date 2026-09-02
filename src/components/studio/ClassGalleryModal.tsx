import React, { useState } from 'react';
import { X, Heart, Sparkles, Download, User, Share2, Award } from 'lucide-react';
import { soundEngine } from '../../services/soundEngine';

export interface GalleryItem {
  id: string;
  title: string;
  author: string;
  dataUrl: string;
  likes: number;
  featured?: boolean;
  category: string;
}

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Robô Auxiliar Solarpunk',
    author: 'Lucas Dev',
    dataUrl: '/avatars/avatar-robot-engineer.svg',
    likes: 14,
    featured: true,
    category: 'Robótica'
  },
  {
    id: 'gal-2',
    title: 'Cristal Quântico de Código',
    author: 'Mariana Maker',
    dataUrl: '/badges/badge-code-wizard.svg',
    likes: 19,
    featured: true,
    category: 'Cristais'
  },
  {
    id: 'gal-3',
    title: 'Painel Solar Futurista',
    author: 'Enzo Tech',
    dataUrl: '/badges/badge-energy-saver.svg',
    likes: 9,
    category: 'Energia'
  },
  {
    id: 'gal-4',
    title: 'Placa Arduino Pixel',
    author: 'Bia Circuitos',
    dataUrl: '/badges/badge-hardware-hero.svg',
    likes: 12,
    category: 'Hardware'
  }
];

interface ClassGalleryModalProps {
  onClose: () => void;
  customArtworks?: GalleryItem[];
  onImportToIsland?: (item: GalleryItem) => void;
}

export const ClassGalleryModal: React.FC<ClassGalleryModalProps> = ({
  onClose,
  customArtworks = [],
  onImportToIsland
}) => {
  const [items, setItems] = useState<GalleryItem[]>(() => [...customArtworks, ...DEFAULT_GALLERY]);
  const [votedIds, setVotedIds] = useState<Set<string>>(new Set());

  const handleLike = (id: string) => {
    if (votedIds.has(id)) return;
    soundEngine.playHarvest();
    setVotedIds((prev) => new Set(prev).add(id));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
  };

  const handleImport = (item: GalleryItem) => {
    soundEngine.playPlace();
    onImportToIsland?.(item);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none">
      <div className="w-full max-w-3xl sunflower-box overflow-hidden flex flex-col max-h-[90vh] text-white">
        {/* Header */}
        <div className="bg-[#141d2b] border-b-2 border-[#2b3d56] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-lg">
              🖼️
            </span>
            <div>
              <h2 className="font-pixel text-xs text-emerald-400">GALERIA DA TURMA · ARTES DOS ALUNOS</h2>
              <p className="text-[11px] font-body-stem text-slate-300">Vote nas melhores criações e use na sua ilha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-300 hover:text-white hover:bg-rose-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="p-5 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((art) => {
            const hasVoted = votedIds.has(art.id);
            return (
              <div
                key={art.id}
                className="bg-[#0f1622] border-2 border-[#27384e] rounded-xl p-3 flex flex-col justify-between hover:border-cyan-400 transition-all shadow-lg"
              >
                <div>
                  {/* Imagem */}
                  <div className="w-full h-32 bg-slate-900 rounded-lg border border-slate-700/80 flex items-center justify-center p-3 mb-2.5 relative overflow-hidden">
                    <img
                      src={art.dataUrl}
                      alt={art.title}
                      className="w-20 h-20 object-contain animate-[bobFloat_3s_ease-in-out_infinite]"
                      style={{ imageRendering: 'pixelated' }}
                    />
                    {art.featured && (
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-pixel bg-amber-500 text-slate-950 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                        <Award className="w-3 h-3" /> DESTAQUE
                      </span>
                    )}
                  </div>

                  {/* Informações */}
                  <h3 className="font-pixel text-[11px] text-white truncate mb-0.5">{art.title}</h3>
                  <p className="text-[10px] font-body-stem text-slate-400 flex items-center gap-1">
                    <User className="w-3 h-3 text-cyan-400" /> Criador: <span className="text-cyan-300">{art.author}</span>
                  </p>
                </div>

                {/* Ações */}
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleLike(art.id)}
                    disabled={hasVoted}
                    className={`flex items-center gap-1 text-[10px] font-pixel px-2 py-1 rounded border ${hasVoted ? 'bg-rose-950/80 text-rose-400 border-rose-500' : 'bg-slate-800 text-slate-300 border-slate-700 hover:border-rose-400'}`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${hasVoted ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
                    <span>{art.likes}</span>
                  </button>

                  <button
                    onClick={() => handleImport(art)}
                    className="sunflower-btn sunflower-btn-cyber text-[9px] py-1 px-2.5 font-pixel"
                  >
                    USAR NA ILHA
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
