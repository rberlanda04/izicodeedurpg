import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './Button';

interface ValidationCodeRevealProps {
  token: string;
}

/**
 * Hidden-by-default code reveal for the GM to confirm a quest in person —
 * shows the 4-digit code as text (to say out loud) and as a QR code (for
 * the student to scan). Kept collapsed until clicked so a shoulder-surfing
 * student can't see it just by glancing at the teacher's screen before the
 * work is actually checked.
 */
export const ValidationCodeReveal: React.FC<ValidationCodeRevealProps> = ({ token }) => {
  const [revealed, setRevealed] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!revealed) return;
    QRCode.toDataURL(token, { width: 140, margin: 1, color: { dark: '#16232c', light: '#ffffff' } })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(''));
  }, [revealed, token]);

  if (!revealed) {
    return (
      <Button variant="secondary" onClick={() => setRevealed(true)}>
        <Eye className="w-4 h-4" /> Mostrar código
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <span className="block font-display font-extrabold text-2xl text-stem-teal tracking-[0.3em]">{token}</span>
        {qrDataUrl && <img src={qrDataUrl} alt={`QR code do token ${token}`} className="w-20 h-20 mt-1" />}
      </div>
      <button
        onClick={() => setRevealed(false)}
        title="Esconder código"
        className="p-2 rounded-xl border-2 border-stem-line hover:border-stem-teal text-stem-ink-soft"
      >
        <EyeOff className="w-4 h-4" />
      </button>
    </div>
  );
};
