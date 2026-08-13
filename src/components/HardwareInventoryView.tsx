import React, { useState } from 'react';
import type { HardwareItem } from '../types';
import { soundEngine } from '../services/soundEngine';
import { Wrench, AlertTriangle, BookOpen, Zap } from 'lucide-react';

interface HardwareInventoryViewProps {
  catalog: HardwareItem[];
  userCoins: number;
  onRequestHardware: (itemId: string, cost: number) => void;
}

export const HardwareInventoryView: React.FC<HardwareInventoryViewProps> = ({
  catalog,
  userCoins,
  onRequestHardware
}) => {
  // Store only the id so the selection always reflects the live catalog item
  // (stockQuantity changes after each requisition and must stay in sync here).
  const [selectedItemId, setSelectedItemId] = useState<string>(catalog[0]?.id ?? '');
  const [purchaseMsg, setPurchaseMsg] = useState('');

  const selectedItem = catalog.find((item) => item.id === selectedItemId) ?? catalog[0];

  const handleRequestClick = (item: HardwareItem) => {
    if (item.stockQuantity <= 0) {
      soundEngine.playErrorBeep();
      setPurchaseMsg('❌ Item esgotado no laboratório!');
      setTimeout(() => setPurchaseMsg(''), 2500);
      return;
    }

    if (userCoins < item.coinCost) {
      soundEngine.playErrorBeep();
      setPurchaseMsg('❌ Izicoins insuficientes!');
      setTimeout(() => setPurchaseMsg(''), 2500);
      return;
    }

    soundEngine.playItemCollect();
    onRequestHardware(item.id, item.coinCost);
    setPurchaseMsg(`✅ Requisitado! Dirija-se à Bancada do Mestre para retirar: ${item.name}`);
    setTimeout(() => setPurchaseMsg(''), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="pixel-box pixel-box-green p-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-lg text-[#00ffaa] flex items-center gap-2">
            <Wrench className="w-5 h-5" /> INVENTÁRIO MAKER & GUIA DE TROUBLESHOOTING
          </h2>
          <p className="font-body text-xs text-slate-300 mt-1">
            Requisite componentes no laboratório usando Izicoins e resolva conflitos de biblioteca e pinagem I2C.
          </p>
        </div>

        <div className="bg-[#090c15] px-4 py-2 border-2 border-[#ffb700] flex items-center gap-2">
          <span className="text-xl">🪙</span>
          <div>
            <p className="font-pixel text-[10px] text-slate-400">SEU SALDO:</p>
            <p className="font-pixel text-sm text-[#ffb700]">{userCoins} IZICOINS</p>
          </div>
        </div>
      </div>

      {purchaseMsg && (
        <div className="bg-[#161b2e] border-2 border-[#00ffaa] p-3 text-center font-mono text-xs text-[#00ffaa]">
          {purchaseMsg}
        </div>
      )}

      {/* Catalog & Troubleshooting Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Catalog Items Column */}
        <div className="space-y-3">
          <h3 className="font-pixel text-xs text-slate-400 uppercase">Componentes em Estoque:</h3>
          {catalog.map((item) => {
            const isSelected = selectedItem.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => {
                  soundEngine.playItemCollect();
                  setSelectedItemId(item.id);
                }}
                className={`p-4 border-2 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-[#00e1ff] bg-[#1a2238]'
                    : 'border-[#2e3859] bg-[#161b2e] hover:bg-[#121626]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.icon}</span>
                  <div>
                    <h4 className="font-pixel text-xs text-white">{item.name}</h4>
                    <p className="font-mono text-[10px] text-slate-400">Estoque: {item.stockQuantity} un.</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-pixel text-xs text-[#ffb700]">🪙 {item.coinCost}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Troubleshooting & Pinout Column (Spans 2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Item Overview */}
          <div className="pixel-box p-6 bg-[#161b2e] border-2 border-[#00e1ff] space-y-4">
            <div className="flex items-center justify-between border-b border-[#2e3859] pb-3">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedItem.icon}</span>
                <div>
                  <h3 className="font-pixel text-base text-[#00e1ff]">{selectedItem.name}</h3>
                  <p className="font-mono text-xs text-slate-400">Categoria: {selectedItem.category}</p>
                </div>
              </div>

              <button
                onClick={() => handleRequestClick(selectedItem)}
                disabled={selectedItem.stockQuantity <= 0}
                className={
                  selectedItem.stockQuantity <= 0
                    ? 'pixel-btn grayscale opacity-50 cursor-not-allowed hover:!translate-y-0'
                    : 'pixel-btn pixel-btn-primary'
                }
              >
                {selectedItem.stockQuantity <= 0
                  ? 'ESGOTADO NO LABORATÓRIO'
                  : `REQUISITAR HARDWARE (🪙 ${selectedItem.coinCost})`}
              </button>
            </div>

            {/* Troubleshooting Guide if Available */}
            {selectedItem.troubleshootingGuide ? (
              <div className="space-y-4">
                <div className="bg-[#090c15] p-3 border border-[#00e1ff]/40">
                  <h4 className="font-pixel text-xs text-[#00e1ff] flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-4 h-4" /> GUIA TÉCNICO E RESOLUÇÃO DE CONFLITOS
                  </h4>
                  <p className="font-body text-xs text-slate-300">
                    {selectedItem.troubleshootingGuide.overview}
                  </p>
                </div>

                {/* Common Errors & Solutions */}
                <div className="space-y-2">
                  <h5 className="font-pixel text-[11px] text-pink-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> DIAGNÓSTICO DE ERROS COMUNS (TROUBLESHOOTING):
                  </h5>
                  {selectedItem.troubleshootingGuide.commonErrors.map((err, idx) => (
                    <div key={idx} className="bg-[#090c15] p-3 border border-pink-500/30 text-xs font-mono space-y-1">
                      <p className="text-pink-400 font-bold">⚠️ {err.error}</p>
                      <p className="text-emerald-400 pl-4">🔧 Solução: {err.solution}</p>
                    </div>
                  ))}
                </div>

                {/* Wiring Pinout Table */}
                {selectedItem.troubleshootingGuide.wiringDiagram.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-pixel text-[11px] text-[#00ffaa] flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> DIAGRAMA DE PINAGEM ({selectedItem.name}):
                    </h5>
                    <div className="bg-[#090c15] p-3 border border-[#2e3859] overflow-x-auto">
                      <table className="w-full text-left font-mono text-xs">
                        <thead>
                          <tr className="border-b border-[#2e3859] text-slate-400">
                            <th className="pb-1">Pino Origem</th>
                            <th className="pb-1">Pino Destino</th>
                            <th className="pb-1">Observação Técnica</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2e3859]">
                          {selectedItem.troubleshootingGuide.wiringDiagram.map((row, idx) => (
                            <tr key={idx} className="text-slate-200">
                              <td className="py-1.5 text-[#00e1ff]">{row.pinFrom}</td>
                              <td className="py-1.5 text-[#00ffaa]">{row.pinTo}</td>
                              <td className="py-1.5 text-slate-400 text-[11px]">{row.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Compatible Libraries */}
                {selectedItem.troubleshootingGuide.compatibleLibraries.length > 0 && (
                  <div className="bg-[#090c15] p-3 border border-[#2e3859]">
                    <p className="font-pixel text-[10px] text-slate-400 mb-1">BIBLIOTECAS C++ REQUERIDAS (ARDUINO IDE):</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.troubleshootingGuide.compatibleLibraries.map((lib) => (
                        <span key={lib} className="font-mono text-xs bg-[#161b2e] border border-[#00e1ff] text-[#00e1ff] px-2 py-0.5">
                          #include &lt;{lib}&gt;
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#090c15] p-4 text-center font-body text-xs text-slate-400 border border-[#2e3859]">
                Componente padrão de laboratório. Consulte o Game Master para especificações adicionais.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
