// Opções de avatar do jogador. Os 4 emojis são o comportamento original
// (sorteado em newUserProfile) e continuam existindo — os 4 ilustrados abaixo
// eram um lote de SVGs já pronto no repo (public/avatars/*.svg) sem nenhuma
// tela que permitisse escolhê-los. PerfilPage.tsx é essa tela.
export interface EmojiAvatarPreset {
  kind: 'emoji';
  head: string;
  body: string;
  accessory: string;
  color: string;
  label: string;
}

export interface ImageAvatarPreset {
  kind: 'image';
  imageUrl: string;
  label: string;
}

export type AvatarPreset = EmojiAvatarPreset | ImageAvatarPreset;

export const EMOJI_AVATAR_PRESETS: EmojiAvatarPreset[] = [
  { kind: 'emoji', head: '🤖', body: '🛡️', accessory: '⚡', color: '#0E7C7B', label: 'Robô' },
  { kind: 'emoji', head: '🦊', body: '🎒', accessory: '🔧', color: '#F25C54', label: 'Raposa' },
  { kind: 'emoji', head: '🐈', body: '🧪', accessory: '✨', color: '#6A4C93', label: 'Gato' },
  { kind: 'emoji', head: '👽', body: '🚀', accessory: '💡', color: '#F4A259', label: 'Alien' }
];

export const IMAGE_AVATAR_PRESETS: ImageAvatarPreset[] = [
  { kind: 'image', imageUrl: '/avatars/avatar-cyber-coder.svg', label: 'Cyber Coder' },
  { kind: 'image', imageUrl: '/avatars/avatar-hardware-mage.svg', label: 'Mago do Hardware' },
  { kind: 'image', imageUrl: '/avatars/avatar-pixel-artist.svg', label: 'Artista Pixel' },
  { kind: 'image', imageUrl: '/avatars/avatar-robot-engineer.svg', label: 'Engenheira de Robôs' }
];

export const ALL_AVATAR_PRESETS: AvatarPreset[] = [...EMOJI_AVATAR_PRESETS, ...IMAGE_AVATAR_PRESETS];
