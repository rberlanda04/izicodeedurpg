# 🚀 PLANO DE DESENVOLVIMENTO - IziCodeEdu v2.0

**Data:** 13 de Agosto de 2026  
**Projeto:** Plataforma Educacional Gamificada STEAM  
**Stack Atual:** React 19 + TypeScript + Vite + Tailwind CSS

---

## 📋 ÍNDICE

1. [Resumo Executivo](#1-resumo-executivo)
2. [Análise do Estado Atual](#2-análise-do-estado-atual)
3. [Fase 1: Infraestrutura (Prioridade Crítica)](#3-fase-1-infraestrutura-prioridade-crítica)
4. [Fase 2: Features Essenciais (Alta Prioridade)](#4-fase-2-features-essenciais-alta-prioridade)
5. [Fase 3: Conteúdo & Gamificação (Média Prioridade)](#5-fase-3-conteúdo--gamificação-média-prioridade)
6. [Fase 4: Avançado (Prioridade Baixa)](#6-fase-4-avançado-prioridade-baixa)
7. [Quests Propostas](#7-quests-propostas)
8. [Ferramentas & Integrações](#8-ferramentas--integrações)
9. [Metodologias Pedagógicas](#9-metodologias-pedagógicas)
10. [Roadmap Visual](#10-roadmap-visual)
11. [Análise Crítica do Plano](#11-análise-crítica-do-plano)
12. [Novas Ideias de Implementação — Plataforma Completa](#12-novas-ideias-de-implementação--plataforma-completa)

---

## 1. RESUMO EXECUTIVO

### Visão Geral
O IziCodeEdu é uma plataforma educacional gamificada para ensino de STEAM (Science, Technology, Engineering, Arts, Mathematics) com tema cyberpunk/pixel art. O sistema atual possui gamificação sólida mas depende de localStorage para persistência.

### Objetivos do Plano
1. **Migrar para backend real** (Firebase/Supabase)
2. **Expandir conteúdo educacional** (novas quests, trilhas)
3. **Melhorar experiência social** (colaboração, mentoria)
4. **Adicionar simuladores** (Wokwi, Tinkercad)
5. **Criar analytics** para professores

### Cronograma Estimado
| Fase | Duração | Entregáveis |
|------|---------|-------------|
| Fase 1 | 4-6 semanas | Auth + Backend + Rotas |
| Fase 2 | 6-8 semanas | Simuladores + Loja + Chat |
| Fase 3 | 8-10 semanas | 30+ quests + Mentoria |
| Fase 4 | 10-12 semanas | Analytics + PWA + Marketplace |

---

## 2. ANÁLISE DO ESTADO ATUAL

### 2.1 Estrutura do Projeto
```
izicodeedu/
├── src/
│   ├── components/          # 11 componentes React
│   │   ├── AdventurerProfileView.tsx
│   │   ├── CuriosityRadarView.tsx
│   │   ├── GameMasterControlView.tsx
│   │   ├── GuildsView.tsx
│   │   ├── HackathonCampaignView.tsx
│   │   ├── HackerTerminalModal.tsx
│   │   ├── HardwareInventoryView.tsx
│   │   ├── Header.tsx
│   │   ├── PasscodeModal.tsx
│   │   ├── QuestBoardView.tsx
│   │   └── SkillTreeView.tsx
│   ├── data/
│   │   └── mockData.ts      # Dados estáticos
│   ├── services/
│   │   ├── persistence.ts   # localStorage
│   │   └── soundEngine.ts   # Audio 8-bit
│   ├── styles/
│   │   └── pixel.css        # Estilos cyberpunk
│   └── types/
│       └── index.ts         # TypeScript types
├── package.json
└── vite.config.ts
```

### 2.2 Features Existentes
| Feature | Status | Observação |
|---------|--------|------------|
| Sistema de Perfis | ✅ Completo | Avatar pixel art, badges |
| Guildas Scrum | ✅ Completo | Criação, entrada, papéis |
| Árvore de Habilidades | ✅ Completo | 4 tiers, dependências |
| Quest Board | ✅ Completo | ODS ONU, filtros |
| Inventário Hardware | ✅ Completo | Troubleshooting I2C |
| Curiosidades | ✅ Completo | Cards desbloqueáveis |
| Hackathon Boss | ✅ Completo | Raid colaborativo |
| Terminal Hacker | ✅ Completo | CLI com comandos |
| Reserva FabLab | ✅ Completo | 3D/Laser slots |
| Sons 8-bit | ✅ Completo | Web Audio API |
| Persistência | �️ Parcial | Apenas localStorage |

### 2.3 Pontos Fortes
- Gamificação bem estruturada (XP, levels, moeda)
- Alinhamento com ODS (Objetivos de Desenvolvimento Sustentável)
- Terminal hacker criativo para engajamento
- Estética cyberpunk/pixel art imersiva
- Sistema de guildas com papéis Scrum reais

### 2.4 Lacunas Críticas
- **Sem backend real** - dados perdidos ao limpar cache
- **Sem autenticação** - qualquer um acessa qualquer perfil
- **Sem rotas** - tudo em uma única página
- **Sem colaboração real** - guildas são apenas visuais
- **Sem analytics** - professores não acompanham progresso

---

## 3. FASE 1: INFRAESTRUTURA (PRIORIDADE CRÍTICA)

### 3.1 Backend Firebase/Supabase

**Objetivo:** Migrar de localStorage para banco de dados real.

**Tecnologias:**
- Firebase Auth (autenticação)
- Firestore (banco de dados NoSQL)
- Firebase Storage (imagens de avatar/emblemas)

**Coleções Firestore:**
```typescript
// users/{uid}
{
  uid: string;
  adventureName: string;
  realName: string; // criptografado, visível apenas Game Master
  role: 'ADMIN' | 'GAME_MASTER' | 'ADVENTURER';
  level: number;
  xp: number;
  xpToNextLevel: number;
  izicoins: number;
  guildId: string | null;
  guildRole: ScrumRole | null;
  avatarConfig: AvatarConfig;
  unlockedSkills: string[];
  badges: Badge[];
  inventory: InventoryItem[];
  unlockedCuriosities: string[];
  heroContractSigned: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// guilds/{guildId}
{
  id: string;
  name: string;
  motto: string;
  emblemUrl: string;
  leaderId: string;
  leaderName: string;
  members: GuildMember[];
  score: number;
  canvaFigmaLink: string | null;
  createdAt: Timestamp;
}

// quests/{questId}
{
  id: string;
  title: string;
  description: string;
  tier: SkillTier;
  requiredSkills: string[];
  sdgGoals: SDGGoal[];
  xpReward: number;
  coinReward: number;
  hardwareRequired: string[];
  proposedByStudentId: string | null;
  proposedByStudentName: string | null;
  status: 'PROPOSED' | 'APPROVED' | 'ACTIVE' | 'COMPLETED';
  validationSteps: string[];
  isSecretQuest: boolean;
  secretPasscode: string | null;
  createdAt: Timestamp;
}

// bookings/{bookingId}
{
  id: string;
  machine: 'Impressora 3D' | 'Cortadora a Laser';
  studentName: string;
  guildName: string | null;
  date: string;
  timeSlot: string;
  createdAt: Timestamp;
}

// quickHacks/{hackId}
{
  id: string;
  title: string;
  description: string;
  riddle: string;
  answerHash: string;
  timeLimitSeconds: number;
  xpReward: number;
  active: boolean;
  createdBy: string;
  createdAt: Timestamp;
}
```

**Serviços a Criar:**
```typescript
// src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // Configurações do projeto Firebase
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// src/services/userService.ts
export const userService = {
  async getProfile(uid: string): Promise<UserProfile> {},
  async updateProfile(uid: string, data: Partial<UserProfile>): Promise<void> {},
  async updateXP(uid: string, amount: number): Promise<void> {},
  async unlockSkill(uid: string, skillId: string): Promise<void> {},
  async addBadge(uid: string, badge: Badge): Promise<void> {},
};

// src/services/guildService.ts
export const guildService = {
  async getAll(): Promise<Guild[]> {},
  async getById(id: string): Promise<Guild> {},
  async create(guild: Omit<Guild, 'id'>): Promise<string> {},
  async join(guildId: string, member: GuildMember): Promise<void> {},
  async updateScore(guildId: string, points: number): Promise<void> {},
};

// src/services/questService.ts
export const questService = {
  async getAll(): Promise<Quest[]> {},
  async getByStatus(status: Quest['status']): Promise<Quest[]> {},
  async propose(quest: Omit<Quest, 'id'>): Promise<string> {},
  async approve(questId: string): Promise<void> {},
  async complete(questId: string): Promise<void> {},
};

// src/services/bookingService.ts
export const bookingService = {
  async getByDate(date: string): Promise<ResourceBooking[]> {},
  async create(booking: Omit<ResourceBooking, 'id'>): Promise<boolean> {},
  async cancel(bookingId: string): Promise<void> {},
};
```

**Tempo Estimado:** 2-3 semanas

---

### 3.2 Autenticação Firebase Auth

**Objetivo:** Login seguro com diferentes métodos.

**Métodos de Login:**
1. **Email/Senha** - Cadastro básico
2. **Google OAuth** - Login com conta Google
3. **Código de Sala** - Game Master gera código temporário

**Fluxo de Autenticação:**
```
┌─────────────────┐
│   Tela de Login  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Email/  │ │Google  │
│Senha   │ │OAuth   │
└────┬───┘ └────┬───┘
     │          │
     ▼          ▼
┌─────────────────┐
│  Firebase Auth   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐ ┌────────┐
│Aluno   │ │Game    │
│        │ │Master  │
└────┬───┘ └────┬───┘
     │          │
     ▼          ▼
┌─────────────────┐
│  Criar Perfil    │
│  (AdventureName)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Dashboard       │
└─────────────────┘
```

**Componentes a Criar:**
```typescript
// src/components/auth/LoginView.tsx
// - Formulário email/senha
// - Botão Google OAuth
// - Link "Sou Game Master"

// src/components/auth/RegisterView.tsx
// - Cadastro de novo aluno
// - Validação de código de sala (opcional)
// - Seleção de avatar inicial

// src/components/auth/ProtectedRoute.tsx
// - Wrapper para rotas autenticadas
// - Redirect para login se não autenticado
// - Role-based access control
```

**Regras Firestore:**
```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só leem/escrevem seu próprio perfil
    match /users/{userId} {
      allow read: if request.auth != null && 
        (request.auth.uid == userId || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ADMIN', 'GAME_MASTER']);
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Guildas - leitura pública, escrita autenticada
    match /guilds/{guildId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.uid == resource.data.leaderId;
    }
    
    // Quests - leitura pública, criação por Game Master
    match /quests/{questId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['ADMIN', 'GAME_MASTER'];
    }
  }
}
```

**Tempo Estimado:** 1-2 semanas

---

### 3.3 React Router + Navegação

**Objetivo:** Navegação real com URLs amigáveis e deep linking.

**Estrutura de Rotas:**
```typescript
// src/App.tsx (atualizado)
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          
          {/* Rotas Protegidas */}
          <Route path="/" element={<ProtectedRoute />}>
            <Route index element={<Navigate to="/profile" replace />} />
            <Route path="profile" element={<AdventurerProfileView />} />
            <Route path="guilds" element={<GuildsView />} />
            <Route path="guilds/:guildId" element={<GuildDetailView />} />
            <Route path="skills" element={<SkillTreeView />} />
            <Route path="skills/:skillId" element={<SkillDetailView />} />
            <Route path="quests" element={<QuestBoardView />} />
            <Route path="quests/:questId" element={<QuestDetailView />} />
            <Route path="hardware" element={<HardwareInventoryView />} />
            <Route path="hardware/:itemId" element={<HardwareDetailView />} />
            <Route path="curiosities" element={<CuriosityRadarView />} />
            <Route path="hackathon" element={<HackathonCampaignView />} />
            <Route path="terminal" element={<HackerTerminalModal />} />
          </Route>
          
          {/* Rotas Game Master */}
          <Route path="/gm" element={<ProtectedRoute requiredRole="GAME_MASTER" />}>
            <Route index element={<GameMasterDashboard />} />
            <Route path="quests" element={<GMQuestManager />} />
            <Route path="guilds" element={<GMGuildManager />} />
            <Route path="analytics" element={<GMAnalytics />} />
          </Route>
          
          {/* 404 */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

**Componentes de Navegação:**
```typescript
// src/components/layout/Sidebar.tsx
// - Menu lateral colapsável
// - Ícones para cada seção
// - Indicador de rota ativa
// - Badge de notificações

// src/components/layout/MobileNav.tsx
// - Menu inferior para mobile
// - 5 itens principais
// - Animações de transição

// src/components/layout/Breadcrumb.tsx
// - Navegação hierárquica
// - Links clicáveis
// - Responsivo
```

**Tempo Estimado:** 1 semana

---

## 4. FASE 2: FEATURES ESSENCIAIS (ALTA PRIORIDADE)

### 4.1 Simulador Wokwi Integrado

**Objetivo:** Testar código Arduino/ESP8266 online sem hardware físico.

**Integração:**
```typescript
// src/components/simulator/WokwiSimulator.tsx
interface WokwiSimulatorProps {
  code: string;
  board: 'esp8266' | 'arduino-uno' | 'microbit';
  onRun: (output: string) => void;
  onStop: () => void;
}

// Uso do iframe Wokwi
const WokwiSimulator: React.FC<WokwiSimulatorProps> = ({ code, board }) => {
  const [isRunning, setIsRunning] = useState(false);
  
  const wokwiConfig = {
    version: 1,
    parts: getPartsForBoard(board),
    connections: getConnectionsForBoard(board),
  };

  return (
    <div className="simulator-container">
      <div className="simulator-controls">
        <button onClick={() => setIsRunning(true)}>▶ INICIAR</button>
        <button onClick={() => setIsRunning(false)}>⏹ PARAR</button>
        <button onClick={() => setCode('')}>🗑️ LIMPAR</button>
      </div>
      
      <iframe
        src={`https://wokwi.com/projects/new/arduino${board === 'esp8266' ? '-esp8266' : ''}`}
        width="100%"
        height="500"
        allow="accelerometer; gyroscope"
      />
      
      <div className="simulator-output">
        <h4>Console Serial:</h4>
        <pre>{output}</pre>
      </div>
    </div>
  );
};
```

**Funcionalidades:**
- Editor de código inline
- Simulação em tempo real
- Monitor serial virtual
- Diagrama de conexões interativo
- Salvar/capturar screenshots

**Tempo Estimado:** 2 semanas

---

### 4.2 Sistema de Loja & Marketplace

**Objetivo:** Comércio de itens cosméticos e funcionais entre jogadores.

**Estrutura da Loja:**
```typescript
// src/types/shop.ts
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'COSMETIC' | 'FUNCTIONAL' | 'COLLECTION';
  price: number;
  currency: 'IZICOINS' | 'REAL';
  rarity: 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
  previewUrl: string;
  effects?: ItemEffects;
  limitedTime?: {
    startDate: string;
    endDate: string;
  };
}

export interface ItemEffects {
  xpMultiplier?: number;
  coinMultiplier?: number;
  unlockSkill?: string;
  unlockAvatar?: AvatarConfig;
  unlockBadge?: Badge;
}

// Categorias de Itens
export const SHOP_CATEGORIES = {
  AVATARS: {
    name: 'Avatares',
    items: [
      { id: 'avatar-cyberpunk', name: 'Cyberpunk Pack', price: 500 },
      { id: 'avatar-retro', name: 'Retro 80s Pack', price: 400 },
      { id: 'avatar-space', name: 'Space Explorer', price: 600 },
    ]
  },
  EFFECTS: {
    name: 'Efeitos Visuais',
    items: [
      { id: 'effect-glitch', name: 'Glitch Effect', price: 200 },
      { id: 'effect-neon', name: 'Neon Glow', price: 250 },
      { id: 'effect-pixel', name: 'Pixel Trail', price: 150 },
    ]
  },
  BOOSTS: {
    name: 'Bônus',
    items: [
      { id: 'boost-2xp', name: '2x XP (24h)', price: 800 },
      { id: 'boost-2coins', name: '2x Coins (24h)', price: 600 },
      { id: 'boost-skip', name: 'Pular Pré-requisito', price: 1000 },
    ]
  },
  COLLECTIONS: {
    name: 'Coleções Raras',
    items: [
      { id: 'col-holographic', name: 'Badge Holográfico', price: 2000 },
      { id: 'col-animated', name: 'Avatar Animado', price: 1500 },
    ]
  }
};

// Componentes
// src/components/shop/ShopView.tsx
// src/components/shop/ShopItemCard.tsx
// src/components/shop/ShopCategoryFilter.tsx
// src/components/shop/PurchaseModal.tsx
// src/components/shop/PlayerInventory.tsx
```

**Tempo Estimado:** 2-3 semanas

---

### 4.3 Sistema de Chat & Comunicação

**Objetivo:** Comunicação em tempo real entre membros da guilda.

**Arquitetura:**
```typescript
// src/services/chatService.ts
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  guildId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  type: 'TEXT' | 'CODE' | 'FILE' | 'SYSTEM';
  timestamp: Timestamp;
}

export const chatService = {
  // Enviar mensagem
  async sendMessage(guildId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) {
    await addDoc(collection(db, 'guilds', guildId, 'messages'), {
      ...message,
      timestamp: Timestamp.now()
    });
  },

  // Escutar mensagens em tempo real
  subscribeToMessages(guildId: string, callback: (messages: ChatMessage[]) => void) {
    const q = query(
      collection(db, 'guilds', guildId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      callback(messages);
    });
  },

  // Enviar código
  async sendCode(guildId: string, senderId: string, code: string, language: string) {
    await addDoc(collection(db, 'guilds', guildId, 'messages'), {
      senderId,
      content: JSON.stringify({ code, language }),
      type: 'CODE',
      timestamp: Timestamp.now()
    });
  }
};

// Componentes
// src/components/chat/ChatPanel.tsx - Painel lateral de chat
// src/components/chat/MessageBubble.tsx - Balão de mensagem
// src/components/chat/CodeBlock.tsx - Bloco de código formatado
// src/components/chat/ChatInput.tsx - Input com suporte a código
// src/components/chat/OnlineUsers.tsx - Lista de usuários online
```

**Funcionalidades:**
- Mensagens de texto em tempo real
- Suporte a blocos de código (syntax highlighting)
- Compartilhamento de arquivos (imagens de projetos)
- Indicador de presença (online/offline)
- Notificações de mensagens

**Tempo Estimado:** 2 semanas

---

### 4.4 Dashboard do Game Master

**Objetivo:** Painel completo para professores gerenciarem turmas.

**Métricas Disponíveis:**
```typescript
// src/types/analytics.ts
export interface DashboardMetrics {
  // Métricas Gerais
  totalStudents: number;
  activeStudentsToday: number;
  activeStudentsWeek: number;
  averageLevel: number;
  totalXPAwarded: number;
  totalCoinsAwarded: number;

  // Métricas de Engajamento
  questsCompletedToday: number;
  questsCompletedWeek: number;
  averageTimePerQuest: number; // minutos
  mostPopularQuest: Quest;
  leastPopularQuest: Quest;

  // Métricas de Hardware
  hardwareRequestsToday: number;
  mostRequestedHardware: HardwareItem;
  FabLabUtilization: number; // percentual

  // Métricas de Guildas
  totalGuilds: number;
  averageGuildSize: number;
  topPerformingGuild: Guild;
  guildScores: Array<{ name: string; score: number }>;

  // Métricas de Aprendizado
  skillDistribution: Record<SkillTier, number>;
  sdgGoalDistribution: Record<SDGGoal, number>;
  completionRate: number;
  averageRetriesPerQuest: number;
}

// Componentes
// src/components/analytics/DashboardView.tsx
// src/components/analytics/MetricsCard.tsx
// src/components/analytics/ProgressChart.tsx
// src/components/analytics/StudentLeaderboard.tsx
// src/components/analytics/GuildComparison.tsx
// src/components/analytics/QuestHeatmap.tsx
```

**Visualizações:**
1. **Visão Geral** - KPIs principais em cards
2. **Progresso Individual** - Gráfico de evolução por aluno
3. **Comparativo de Guildas** - Rankings e métricas
4. **Heatmap de Atividade** - Atividade por dia/hora
5. **Exportação de Relatórios** - PDF/CSV com dados

**Tempo Estimado:** 2-3 semanas

---

## 5. FASE 3: CONTEÚDO & GAMIFICAÇÃO (MÉDIA PRIORIDADE)

### 5.1 Novas Quests Propostas

#### Tier BÁSICO (Nível 1-5)

| ID | Título | Descrição | ODS | XP | Coins |
|----|--------|-----------|-----|-----|-------|
| q-basic-1 | **Jardim de Código** | Crie um fluxograma que simule crescimento de planta | 12.c | 150 | 40 |
| q-basic-2 | **Caça ao Bug** | Encontre 3 erros em código Scratch | 4.3 | 200 | 50 |
| q-basic-3 | **Algoritmo da Reciclagem** | Ordene etapas de reciclagem em sequência lógica | 12.c | 180 | 45 |
| q-basic-4 | **Decifra Binário** | Converta 5 mensagens binárias para ASCII | 4.3 | 220 | 55 |
| q-basic-5 | **Mapa Mental** | Crie mapa mental sobre energias renováveis | 7.a | 160 | 42 |

#### Tier INTERMEDIÁRIO (Nível 6-10)

| ID | Título | Descrição | ODS | XP | Coins |
|----|--------|-----------|-----|-----|-------|
| q-int-1 | **App Coleta Seletiva** | App Inventor para identificar tipos de lixo | 12.c | 300 | 80 |
| q-int-2 | **Simulador Solar** | Scratch: painel solar que gera energia variável | 7.a | 350 | 90 |
| q-int-3 | **Jogo da Água** | Scratch: jogo educativo sobre economia de água | 13.a | 320 | 85 |
| q-int-4 | **Sensor Virtual** | Simule leitura de sensor LDR no Wokwi | 7.a | 280 | 75 |
| q-int-5 | **Dashboard de Dados** | Crie gráfico de dados ambientais em blocos | 13.a | 340 | 88 |

#### Tier AVANÇADO (Nível 11-15)

| ID | Título | Descrição | ODS | XP | Coins |
|----|--------|-----------|-----|-----|-------|
| q-adv-1 | **Robô Explorador** | LEGO EV3 que navega labirinto autônomo | 4.3 | 400 | 110 |
| q-adv-2 | **Estação Biológica** | Micro:bit monitore pH e temperatura do solo | 13.a | 420 | 115 |
| q-adv-3 | **Weather Station** | Estação meteorológica com display OLED | 13.a | 450 | 120 |
| q-adv-4 | **Alerta de Queda** | Sistema de detecção de quedas acelômetro | 4.3 | 380 | 105 |
| q-adv-5 | **Energia Limpa** | Medidor de consumo com Buzzer alerta | 7.a | 410 | 112 |

#### Tier ESPECIALISTA (Nível 16-20)

| ID | Título | Descrição | ODS | XP | Coins |
|----|--------|-----------|-----|-----|-------|
| q-esp-1 | **Rede Mesh IoT** | ESP8266 comunicação mesh entre 3+ placas | 7.a | 550 | 150 |
| q-esp-2 | **Impressora Autônoma** | G-code gerado por sensor de distância | 12.c | 600 | 160 |
| q-esp-3 | **Smart Farm** | Sistema completo de irrigação inteligente | 12.c | 580 | 155 |
| q-esp-4 | **Monitor Ambiental** | Rede de sensores com telemetria MQTT | 13.a | 520 | 140 |
| q-esp-5 | **Robô Autônomo** | Rover com navegação por sensores | 4.3 | 620 | 165 |

#### Quests SECRETAS (Desbloqueáveis via Terminal)

| ID | Título | Descrição | Código | XP | Coins |
|----|--------|-----------|--------|-----|-------|
| q-sec-1 | **Protocolo Qubit** | Desafio de computação quântica conceitual | QUBIT-42 | 800 | 250 |
| q-sec-2 | **Rede Fantasma** | Descubra dispositivos ocultos na rede | GHOST-NET | 750 | 220 |
| q-sec-3 | **Código Enigma** | Decifre mensagem cifrada de Einstein | E=MC2 | 900 | 300 |

#### Quests de COLABORAÇÃO (Multi-Guilda)

| ID | Título | Descrição | Guildas | XP | Coins |
|----|--------|-----------|---------|-----|-------|
| q-col-1 | **Raid Verde** | Estação meteorológica completa | 3+ | 1000 | 300 |
| q-col-2 | **Reciclagem Eletrônica** | Desmontar e reaproveitar e-waste | 2+ | 800 | 250 |
| q-col-3 | **Maratona Código Ético** | IA ética - debate + implementação | 4+ | 1200 | 400 |

**Tempo Estimado:** 3-4 semanas (criação de conteúdo)

---

### 5.2 Sistema de Mentoria

**Objetivo:** Alunos avançados guiam novatos.

```typescript
// src/types/mentorship.ts
export interface MentorshipProgram {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  startDate: string;
  goals: MentorshipGoal[];
  completedGoals: string[];
  xpBonus: number; // XP ganho por completar mentoria
}

export interface MentorshipGoal {
  id: string;
  title: string;
  description: string;
  type: 'SKILL' | 'QUEST' | 'PROJECT';
  targetId: string; // skillId ou questId
  completed: boolean;
}

// Componentes
// src/components/mentorship/MentorshipDashboard.tsx
// src/components/mentorship/MentorMatchView.tsx
// src/components/mentorship/MentorshipProgress.tsx
// src/components/mentorship/GoalTracker.tsx

// Serviços
// src/services/mentorshipService.ts
export const mentorshipService = {
  async findMentor(menteeId: string, skillNeeded: string): Promise<UserProfile[]> {},
  async createProgram(mentor: string, mentee: string): Promise<string> {},
  async updateGoal(programId: string, goalId: string): Promise<void> {},
  async completeProgram(programId: string): Promise<void> {},
};
```

**Funcionalidades:**
- Matching automático baseado em skills
- Metas de aprendizado rastreadas
- Bônus de XP para mentores
- Badge "Mentor Sênior" por ajudar 5+ alunos
- Sessões de pair programming agendadas

**Tempo Estimado:** 2 semanas

---

### 5.3 Sistema de Desafios Diários

**Objetivo:** Engajamento diário com mini-desafios.

```typescript
// src/types/dailyChallenge.ts
export interface DailyChallenge {
  id: string;
  date: string; // 'YYYY-MM-DD'
  title: string;
  description: string;
  type: 'CODE' | 'QUIZ' | 'PUZZLE' | 'CREATIVE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  timeLimit: number; // minutos
  xpReward: number;
  coinReward: number;
  participants: string[]; // uids
  completions: string[]; // uids que completaram
}

// Exemplos de Desafios Diários
export const DAILY_CHALLENGES = {
  CODE: [
    { title: 'Fibonacci em 5 Linhas', desc: 'Implemente Fibonacci em Arduino em no máximo 5 linhas' },
    { title: 'Bug Hunter', desc: 'Encontre o bug no código fornecido' },
    { title: 'Otimizador', desc: 'Reduza o consumo de memória do sketch' },
  ],
  QUIZ: [
    { title: 'Pergunta rápida ODS', desc: '3 perguntas sobre Objetivos de Desenvolvimento Sustentável' },
    { title: 'Hardware ou Software?', desc: 'Identifique se o componente é hardware ou software' },
    { title: 'Completar Código', desc: 'Preencha as lacunas no código Arduino' },
  ],
  PUZZLE: [
    { title: 'Circuit Builder', desc: 'Monte o circuito mentalmente e selecione a conexão correta' },
    { title: 'Decodificador', desc: 'Converta hexadecimal para ASCII' },
    { title: 'Sequência Lógica', desc: 'Complete a sequência de instruções' },
  ],
  CREATIVE: [
    { title: 'Nome de Guilda', desc: 'Crie o nome mais criativo para uma guilda STEM' },
    { title: 'Badge Designer', desc: 'Descreva uma nova badge imaginária' },
    { title: 'Pitch 30 segundos', desc: 'Escreva o pitch do seu projeto em 30 palavras' },
  ]
};

// Componentes
// src/components/daily/DailyChallengeView.tsx
// src/components/daily/ChallengeCard.tsx
// src/components/daily/ChallengeTimer.tsx
// src/components/daily/ChallengeLeaderboard.tsx
// src/components/daily/StreakCounter.tsx
```

**Gamificação:**
- **Streak de 7 dias**: Badge "Dedicado" + 100 XP bônus
- **Streak de 30 dias**: Badge "Mestre da Consistência" + 500 XP
- **Ranking semanal**: Top 10 jogadores ganham coins extras
- **Desafio relâmpago**: Evento surpresa com prêmios maiores

**Tempo Estimado:** 1-2 semanas

---

## 6. FASE 4: AVANÇADO (PRIORIDADE BAIXA)

### 6.1 PWA (Progressive Web App)

```json
// manifest.json
{
  "name": "IziCodeEdu - Maker Academy",
  "short_name": "IziCode",
  "description": "Plataforma educacional gamificada STEAM",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0d0f18",
  "theme_color": "#00ffaa",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}

// src/service-worker.ts
// - Cache de conteúdo estático
// - Offline support para quests já baixadas
// - Sync de dados quando online
// - Notificações push para Quick Hacks
```

**Tempo Estimado:** 2 semanas

---

### 6.2 Marketplace de Projetos

```typescript
// src/types/marketplace.ts
export interface MarketplaceListing {
  id: string;
  sellerId: string;
  sellerGuild: string;
  title: string;
  description: string;
  category: 'TEMPLATE' | 'CODE' | 'SCHEMATIC' | 'TUTORIAL';
  price: number;
  previewImages: string[];
  downloadUrl: string;
  rating: number;
  sales: number;
  createdAt: Timestamp;
}

// Componentes
// src/components/marketplace/MarketplaceView.tsx
// src/components/marketplace/ListingCard.tsx
// src/components/marketplace/ListingDetail.tsx
// src/components/marketplace/UploadModal.tsx
// src/components/marketplace/RatingStars.tsx
```

**Tempo Estimado:** 3 semanas

---

### 6.3 Integrações Externas

```typescript
// src/integrations/googleClassroom.ts
export const googleClassroomIntegration = {
  async syncRoster(): Promise<void> {},
  async importAssignments(): Promise<void> {},
  async exportGrades(): Promise<void> {},
};

// src/integrations/github.ts
export const githubIntegration = {
  async createRepo(name: string): Promise<string> {},
  async pushCode(code: string, repo: string): Promise<void> {},
  async createPR(title: string, body: string): Promise<string> {},
};

// src/integrations/arduinoCloud.ts
export const arduinoCloudIntegration = {
  async uploadSketch(code: string, board: string): Promise<void> {},
  async getDeviceStatus(): Promise<DeviceStatus> {},
};
```

**Tempo Estimado:** 2-3 semanas

---

## 7. QUESTS PROPOSTAS

### 7.1 Template para Criar Nova Quest

```typescript
// src/data/newQuests.ts
import type { Quest } from '../types';

export const NEW_QUESTS: Quest[] = [
  {
    id: 'q-basic-1',
    title: 'Jardim de Código',
    description: `
      Crie um fluxograma que simule o crescimento de uma planta ao longo de 7 dias.
      
      **Objetivos:**
      1. Mapear etapas: semente → broto → planta
      2. Usar condicionais IF para decisões
      3. Implementar loop WHILE para simulação
      
      **Entregáveis:**
      - Fluxograma no papel ou digital
      - Código em Scratch que implementa a lógica
      - Screenshot do funcionamento
    `,
    tier: 'BASIC',
    requiredSkills: ['logic_unplugged'],
    sdgGoals: ['12.c'],
    xpReward: 150,
    coinReward: 40,
    hardwareRequired: [],
    status: 'ACTIVE',
    validationSteps: [
      'Verificar lógica do fluxograma',
      'Testar código no Scratch',
      'Apresentar resultado ao Game Master'
    ]
  },
  // ... mais quests
];
```

### 7.2 Banco de Quests por Habilidade

| Habilidade | Quests Relacionadas |
|------------|---------------------|
| logic_unplugged | Jardim de Código, Caça ao Bug, Decifra Binário |
| conditionals_basic | Algoritmo da Reciclagem, Mapa Mental |
| scratch_basics | App Coleta Seletiva, Simulador Solar, Jogo da Água |
| app_inventor | App Coleta Seletiva, Dashboard de Dados |
| microbit_starter | Estação Biológica, Weather Station, Alerta de Queda |
| lego_ev3 | Robô Explorador, Robô Autônomo |
| esp8266_advanced | Rede Mesh IoT, Smart Farm, Monitor Ambiental |
| fablab_machining | Impressora Autônoma, Protótipo Customizado |

---

## 8. FERRAMENTAS & INTEGRAÇÕES

### 8.1 Simuladores

| Ferramenta | Uso | Integração |
|------------|-----|------------|
| **Wokwi** | Simulação Arduino/ESP8266 | iframe embed |
| **Tinkercad Circuits** | Circuitos interativos | iframe embed |
| **Scratch Editor** | Programação blocos | API oficial |
| **Tinkercad Codeblocks** | CAD 3D paramétrico | iframe embed |

### 8.2 IDEs Online

| Ferramenta | Uso | Integração |
|------------|-----|------------|
| **Monaco Editor** | Code editor (VS Code) | npm package |
| **CodeMirror** | Code editor alternativo | npm package |
| **Arduino Web Editor** | Compile Arduino online | API |

### 8.3 Analytics

| Ferramenta | Uso | Integração |
|------------|-----|------------|
| **Chart.js** | Gráficos | npm package |
| **Recharts** | Gráficos React | npm package |
| **Google Analytics** | Métricas web | Script tag |

### 8.4 Notificações

| Ferramenta | Uso | Integração |
|------------|-----|------------|
| **Firebase Cloud Messaging** | Push notifications | Firebase SDK |
| **OneSignal** | Push notifications | npm package |
| **React Hot Toast** | In-app notifications | npm package |

---

## 9. METODOLOGIAS PEDAGÓGICAS

### 9.1 ABORDAGEM BLENDED LEARNING

```
┌─────────────────────────────────────────────────────────┐
│                    MODELO BLENDED                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  │ ASSÍNCRONO    │    │ SÍNCRONO     │    │ APLICAÇÃO    │
│  │ (Online)      │ →  │ (Presencial) │ →  │ (Prática)    │
│  ├──────────────┤    ├──────────────┤    ├──────────────┤
│  │ Videoaulas    │    │ Lab Practice │    │ Projeto Real │
│  │ Quizzes       │    │ Pair Code    │    │ Comunidade   │
│  │ Leituras      │    │ Mentoring    │    │ Feira Ciências│
│  └──────────────┘    └──────────────┘    └──────────────┘
│                                                          │
│  Gamificação: +XP por cada fase completada               │
└─────────────────────────────────────────────────────────┘
```

### 9.2 METODOLOGIA SCRUM GAMIFICADA

```
SPRINT CYCLE (2 semanas)
├── Day 1: Sprint Planning
│   ├── Selecionar Quest Principal (+50 XP)
│   └── Selecionar 2 Side Quests (+25 XP cada)
│
├── Day 2-8: Development
│   ├── Daily Standup (5 min, +10 XP por participação)
│   ├── Pair Programming Sessions (+20 XP)
│   └── Code Reviews entre pares (+15 XP)
│
├── Day 9: Sprint Review
│   ├── Demo do projeto (+100 XP)
│   └── Feedback do Game Master (+50 XP)
│
└── Day 10: Retrospective
    ├── Autoavaliação (+30 XP)
    └── Feedback peer (+20 XP)
```

### 9.3 APRENDIZAGEM BASEADA EM PROJETOS (PBL)

```
PROJETO REAL
├── Fase 1: EMPATIA (+100 XP)
│   ├── Entrevistar usuários
│   └── Observar problema real
│
├── Fase 2: DEFINIÇÃO (+100 XP)
│   ├── Mapear requisitos
│   └── Definir escopo
│
├── Fase 3: IDEAÇÃO (+100 XP)
│   ├── Brainstorm solutions
│   └── Selecionar melhor abordagem
│
├── Fase 4: PROTOTIPAGEM (+150 XP)
│   ├── Construir protótipo
│   └── Testar com usuários
│
├── Fase 5: TESTE (+150 XP)
│   ├── Coletar feedback
│   └── Iterar solução
│
└── Fase 6: APRESENTAÇÃO (+200 XP)
    ├── Demo pública
    └── Documentação
```

### 9.4 SISTEMA DE COMPANHEIRISMO

```
BUDDY SYSTEM
├── Aluno Avançado (Nível 10+)
│   ├── 1 Buddy Novato
│   ├── Sessões semanais (30 min)
│   └── +50 XP por sessão completada
│
├── CODE REVIEW ENTRE PARES
│   ├── Aluno A escreve código
│   ├── Aluno B revisa (+20 XP)
│   ├── Aluno A implementa feedback (+30 XP)
│   └── Aprovação final (+50 XP)
│
└── PAIR PROGRAMMING
    ├── Driver: Escreve código
    ├── Navigator: Revisa e sugere
    └── +40 XP para ambos
```

---

## 10. ROADMAP VISUAL

### Timeline de Implementação

```
2026
AGO         SET         OUT         NOV         DEZ         JAN
│           │           │           │           │           │
▼           ▼           ▼           ▼           ▼           ▼
┌─────────────────────┐
│  FASE 1: INFRAESTRUTURA
│  - Firebase Auth     │
│  - Firestore DB      │
│  - React Router      │
└─────────────────────┘
            ┌─────────────────────────────┐
            │  FASE 2: FEATURES ESSENCIAIS
            │  - Wokwi Simulator          │
            │  - Shop System              │
            │  - Chat Integration         │
            │  - GM Dashboard             │
            └─────────────────────────────┘
                        ┌─────────────────────────────────────────┐
                        │  FASE 3: CONTEÚDO & GAMIFICAÇÃO
                        │  - 30+ Novas Quests                     │
                        │  - Sistema de Mentoria                  │
                        │  - Daily Challenges                     │
                        │  - Novas Badges                         │
                        └─────────────────────────────────────────┘
                                            ┌─────────────────────────────────────────┐
                                            │  FASE 4: AVANÇADO
                                            │  - PWA + Offline                       │
                                            │  - Marketplace                         │
                                            │  - Integrações Externas                │
                                            │  - Mobile App                          │
                                            └─────────────────────────────────────────┘
```

### Entregáveis por Fase

| Fase | Entregáveis | Dependências |
|------|-------------|--------------|
| 1 | Auth + DB + Rotas | Nenhuma |
| 2 | Simulador + Loja + Chat | Fase 1 |
| 3 | Quests + Mentoria + Daily | Fase 1 |
| 4 | PWA + Marketplace | Fase 2 |

### Marcos Importantes

| Marco | Data Estimada | Critérios de Aceite |
|-------|---------------|---------------------|
| MVP Funcional | Set 2026 | Auth + DB + 3 views |
| Beta Fechado | Out 2026 | Todas features Fase 1+2 |
| Lançamento v2.0 | Nov 2026 | Todas features Fase 1+2+3 |
| v2.1 | Jan 2027 | PWA + Marketplace |

---

## 11. ANÁLISE CRÍTICA DO PLANO

### 11.1 Pontos Fortes

- Cobertura técnica sólida da migração localStorage → Firebase, com schema, `firestore.rules` e services já esboçados por coleção.
- Roadmap realista, com dependências entre fases explícitas (Fase 2/3 dependem da Fase 1; Fase 4 depende da Fase 2).
- Banco de 20+ quests novas já mapeado por tier e por habilidade (tabela 7.2), o que reduz o maior gargalo de qualquer LMS gamificado: conteúdo.
- Metodologias pedagógicas (Scrum gamificado, PBL, Buddy System) amarradas a recompensas de XP concretas, não apenas descritas em teoria.

### 11.2 Lacunas Estruturais Críticas

| Lacuna | Por que importa | Prioridade |
|---|---|---|
| **Sem entidade Turma/Escola** — o schema Firestore da Fase 1 (`users`, `guilds`, `quests`, `bookings`) é totalmente **flat**: nenhum documento carrega `classId` ou `schoolId`. | Era o primeiro requisito do projeto ("criar turmas"). Sem isso, dois professores usando a plataforma ao mesmo tempo compartilham o mesmo mural de quests, as mesmas guildas e o mesmo inventário de hardware — o sistema não sobrevive a uma segunda turma, quanto mais a uma segunda escola. | 🔴 Crítica — deve preceder a Fase 1, não vir depois dela |
| **Olimpíadas externas ausentes** (OBA, OBAFOG, OBMEP, Olimpíada Scratch, Olimpíada de História/Geografia) | Estavam no escopo original do projeto e são o principal evento de calendário de uma turma de robótica/STEAM em escola brasileira — hoje não existe nenhuma menção no plano. | 🟠 Alta |
| **Chat (4.3) e Marketplace (6.2) sem moderação** | São menores de idade gerando e trocando conteúdo livre em tempo real, sem filtro de linguagem, fila de revisão do Game Master ou botão de denúncia especificados. | 🔴 Crítica antes de habilitar em produção |
| **Consentimento formal do responsável ausente** | `heroContractSigned` já existe no tipo `UserProfile`, mas o plano não define *quem* assina — hoje é o próprio aluno. Para menores de 18 anos, LGPD normalmente exige consentimento do responsável legal para tratamento de dados, especialmente `realName`. | 🔴 Crítica |
| **Moeda "REAL" no `ShopItem.currency`** (seção 4.2) | Introduz venda de itens digitais para crianças/adolescentes dentro de uma ferramenta escolar — implica gateway de pagamento, nota fiscal, ECA e ainda mais exigências de LGPD. Provável fricção com a escola/direção. | 🟡 Recomenda-se remover ou substituir por "Izicoins doados pelo professor" |
| **Integração Wokwi (4.1) tecnicamente incompleta** | Um `<iframe src="https://wokwi.com/projects/new/...">` não recebe `code` nem `board` como props do React — o Wokwi não expõe esse contrato. A integração real precisa do [Wokwi Embed](https://docs.wokwi.com/embed) (projeto salvo com ID fixo) ou da API paga do Wokwi CI para injetar sketches dinamicamente. | 🟡 Corrigir antes de estimar as 2 semanas da Fase 2 |
| **PWA/offline só na Fase 4** | Conectividade instável é a realidade mais comum de laboratórios de escola pública brasileira — deixar isso por último é provável causa de abandono da ferramenta justamente na sala de aula. | 🟡 Considerar antecipar um modo offline mínimo para a Fase 1 |

---

## 12. NOVAS IDEIAS DE IMPLEMENTAÇÃO — PLATAFORMA COMPLETA

### 12.1 Turmas & Escolas (Multi-tenancy) — PRÉ-REQUISITO DA FASE 1

**Objetivo:** permitir que a plataforma sirva várias turmas e escolas ao mesmo tempo sem os dados colidirem — é o que torna isto uma "plataforma", e não um protótipo de uma turma só.

```typescript
// schools/{schoolId}
{
  id: string;
  name: string;
  city: string;
  adminIds: string[]; // coordenação pedagógica
}

// schools/{schoolId}/classes/{classId}
{
  id: string;
  name: string;              // "9º Ano B — Robótica 2026"
  gradeRange: string;        // "6º ao 9º ano" | "Ensino Médio"
  gameMasterIds: string[];   // professores responsáveis
  roomPasscode: string;      // já existe hoje como estado solto no App.tsx
  studentIds: string[];
  createdAt: Timestamp;
  archivedAt: Timestamp | null; // encerramento do ano letivo
}
```

- Toda coleção hoje flat (`guilds`, `quests`, `bookings`, `quickHacks`) passa a viver como subcoleção de `classes/{classId}`, ou a carregar `classId` como campo indexado.
- Um aluno pode pertencer a mais de uma `class` ao longo dos anos (6º ao 2º médio) — o histórico de XP/badges deveria ser vinculado ao **perfil do aluno**, não à turma, para preservar a progressão de RPG ano a ano (ver 12.3).
- O Game Master ganha um seletor de turma ativa no Header; o Admin ganha uma visão cross-turma (ver 12.11).
- **Tempo estimado:** 1-2 semanas, mas deve entrar **dentro** da Fase 1 (redesenha o schema do item 3.1), não depois dela.

### 12.2 Rastreador de Olimpíadas & Competições Externas

**Objetivo:** conectar o que a turma já faz na plataforma às competições reais do calendário (OBA, OBAFOG, OBMEP, Olimpíada Scratch, Olimpíada Brasileira de Empreendedorismo Social, Olimpíadas de Geografia/História) em vez de tratá-las como eventos fora do sistema.

```typescript
// competitions/{competitionId}
export interface ExternalCompetition {
  id: string;
  name: string;                 // "OBA 2026", "OBMEP 2026"
  category: 'ASTRONOMIA' | 'MATEMATICA' | 'ROBOTICA' | 'PROGRAMACAO' | 'EMPREENDEDORISMO' | 'HUMANAS';
  registrationDeadline: string;
  eventDate: string;
  officialUrl: string;
}

// classes/{classId}/competitionEntries/{entryId}
export interface CompetitionEntry {
  competitionId: string;
  studentIds: string[];        // individual ou equipe
  guildId?: string;
  status: 'INSCRITO' | 'CLASSIFICADO' | 'MEDALHA_BRONZE' | 'MEDALHA_PRATA' | 'MEDALHA_OURO' | 'MENCAO_HONROSA';
  resultRegisteredBy: string;  // Game Master confirma o resultado oficial
  xpAwarded: number;           // conversão automática por status (ex: medalha de ouro = +1000 XP + badge exclusiva)
}
```

- O Game Master lança as inscrições no início do ano; um card em "Missões" mostra a competição como uma **Main Quest de calendário fixo** (data de prova, não de entrega livre).
- Ao registrar o resultado oficial, o sistema converte automaticamente em badge exclusiva ("Medalhista OBA 2026") + XP — reaproveita o mesmo `Badge`/XP já existente, sem precisar de tipo novo.
- Serve também como fonte de dados para o Grimório (12.3) e para relatórios da coordenação pedagógica para a direção da escola.

### 12.3 Grimório do Aventureiro (Portfólio Exportável)

**Objetivo:** transformar o histórico de badges/quests/skills em algo que o aluno leva consigo — para uma feira de ciências, uma entrevista de bolsa técnica, ou simplesmente para mostrar aos pais.

- Página pública opcional por aluno (`/grimorio/:adventureName`, com toggle de privacidade — nunca exibe `realName`), reunindo: linha do tempo de quests completadas, skill tree desbloqueada, badges (incluindo as secretas já reveladas), medalhas de olimpíadas (12.2) e projetos de guilda.
- Exportação em PDF estilo "grimório" (mesma estética pixel/CRT do produto) para impressão física em feiras de ciências.
- QR code de verificação no rodapé do PDF, apontando para a versão web — dá credibilidade ao documento fora da plataforma.
- Reaproveita dados que já existem no `UserProfile` hoje; não exige nova coleção, só uma view de agregação + um serviço de renderização de PDF (ex: `@react-pdf/renderer`).

### 12.4 Consentimento do Responsável & Privacidade (LGPD para Menores)

- `heroContractSigned` (já existente) passa a ser assinado pelo **responsável legal**, não pelo aluno: um link/código enviado à família no cadastro, com texto claro sobre quais dados são coletados (`realName`, progresso, presença) e quem tem acesso (`GAME_MASTER`/`ADMIN` da turma, nunca outros alunos).
- Painel do responsável (somente leitura): progresso do filho, badges conquistadas, participação em olimpíadas — sem acesso a chat ou dados de outros alunos.
- Rotina de retenção/anonimização ao final do ano letivo ou ao sair da escola (`classes/{classId}.archivedAt` de 12.1 já dá o gatilho natural).

### 12.5 Confiança & Segurança (Moderação)

- Filtro de palavras impróprias (client-side + Cloud Function) em chat (4.3), propostas de quest e marketplace (6.2) antes de qualquer texto ficar visível para a turma.
- Fila de moderação no Painel do Game Master: toda mensagem/proposta sinalizada aguarda aprovação antes de publicar.
- Botão de denúncia visível em qualquer mensagem/postagem, com notificação imediata ao Game Master da turma.

### 12.6 Ponte Físico-Digital no Laboratório

- Já existe `CuriosityCard.labLocation` ("Bancada de Soldagem", "Cortadora a Laser") — a ideia é colar QR codes físicos reais nesses pontos do laboratório, cada um apontando para uma rota `/scan/:code` que desbloqueia a curiosidade ou inicia uma reserva de máquina (12.1 do plano original) sem o aluno precisar digitar nada.
- Mesmo QR pode "fazer check-in" de equipamento retirado (Arduino, sensor) — fecha o ciclo do inventário: hoje o sistema decrementa estoque na requisição, mas nada registra devolução.

### 12.7 Feedback com IA Real (com guardrails pedagógicos)

Diferente do `questEngine.ts` já implementado (que só **seleciona** quests de um pool fixo, sem gerar texto), esta ideia usa uma API de LLM de verdade para dar **dicas socráticas** sobre a submissão de um aluno — nunca a resposta pronta:

- Aluno anexa código/foto do circuito/descrição do projeto na entrega da quest.
- Um serviço (`src/services/aiFeedbackService.ts`) envia o contexto da quest + a submissão para um modelo de linguagem com um prompt que restringe a resposta a perguntas orientadoras ("Seu sensor está lendo valores negativos — o que isso pode indicar sobre a alimentação do MMA8451?"), nunca a solução.
- O feedback aparece **antes** da validação do Game Master, como uma etapa de autorrevisão — o professor continua sendo quem aprova/dá XP.
- Precisa de um limite de uso por aluno/dia (custo de API) e de log das interações visível ao Game Master, por segurança pedagógica.

### 12.8 Eventos Épicos Formalizados

Hoje só existe um tipo de evento especial (`BossRaidCampaign`, para hackathons). A ideia é generalizar para um `EventMode` reutilizável, cobrindo os outros formatos já citados no escopo original — feira de ciências, aula de campo, noite dos jogos — cada um com sua própria mecânica de pontuação, mas a mesma infraestrutura de "modo evento" (tela cheia, placar ao vivo, papel de "jurado" para convidados externos como pais/comunidade avaliando estandes).

### 12.9 Acessibilidade (a11y)

- Paleta de cores dos badges de ODS (4.3/7.a/12.c/13.a) revisada para contraste e para não depender só de cor (adicionar ícone/padrão) — daltonismo é comum o suficiente numa turma de 30+ alunos para não ser opcional.
- Navegação completa por teclado nos modais (Terminal Hacker, Passcode, Propor Quest) e `prefers-reduced-motion` respeitado no `.crt-overlay` e nas animações de glitch, hoje sempre ativas.
- Suporte a leitor de tela nos componentes com muito ícone/emoji como único rótulo.

### 12.10 Reconhecimento Social Leve ("Kudos")

- Um aluno pode dar um "kudos" (não XP, não competitivo) a um colega por ajuda em sala — baixo custo de implementação (um botão + contador), mas reforça o comportamento de colaboração que o Buddy System (9.4) já descreve em teoria.

### 12.11 Painel Multi-Turma para Admin/Coordenação Pedagógica

- Hoje `UserRole` já inclui `'ADMIN'`, mas nenhuma view é exclusiva dele. Com turmas (12.1) modeladas, o Admin ganha uma visão que soma as métricas do Dashboard do Game Master (4.4) **entre turmas e professores**, para a coordenação pedagógica acompanhar a escola inteira — não só uma sala.

---

## 📎 APÊNDICES

### A. Variáveis de Ambiente

```env
# .env.local
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

# Wokwi
VITE_WOKWI_API_KEY=

# Google Analytics
VITE_GA_TRACKING_ID=
```

### B. Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Iniciar dev server
npm run build        # Build de produção
npm run preview      # Preview do build
npm run lint         # Rodar linter (oxlint)

# Firebase
firebase init        # Inicializar Firebase
firebase deploy      # Deploy functions + hosting
firebase emulators:start  # Emuladores locais

# Testes
npm run test         # Unit tests
npm run test:e2e     # E2E tests
```

### C. Estrutura de Pastas Final

```
src/
├── components/
│   ├── auth/           # Login, Register, ProtectedRoute
│   ├── layout/         # Header, Sidebar, MobileNav
│   ├── profile/        # AdventurerProfile, AvatarCreator
│   ├── guilds/         # GuildsList, GuildDetail, GuildChat
│   ├── skills/         # SkillTree, SkillDetail
│   ├── quests/         # QuestBoard, QuestDetail, QuestPropose
│   ├── hardware/       # Inventory, Troubleshooting, Booking
│   ├── shop/           # ShopView, ItemCard, PurchaseModal
│   ├── simulator/      # WokwiSimulator, CodeEditor
│   ├── analytics/      # Dashboard, Charts, Reports
│   ├── chat/           # ChatPanel, MessageBubble
│   ├── mentorship/     # MentorDashboard, GoalTracker
│   ├── daily/          # DailyChallenge, StreakCounter
│   └── common/         # Button, Modal, Card, Toast
├── contexts/
│   └── AuthContext.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useFirestore.ts
│   └── useLocalStorage.ts
├── services/
│   ├── firebase.ts
│   ├── userService.ts
│   ├── guildService.ts
│   ├── questService.ts
│   ├── bookingService.ts
│   ├── chatService.ts
│   ├── soundEngine.ts
│   └── analytics.ts
├── types/
│   └── index.ts
├── data/
│   ├── mockData.ts
│   ├── newQuests.ts
│   └── shopItems.ts
├── styles/
│   └── pixel.css
├── utils/
│   ├── constants.ts
│   └── helpers.ts
├── integrations/
│   ├── googleClassroom.ts
│   └── github.ts
├── App.tsx
└── main.tsx
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1
- [ ] Configurar projeto Firebase
- [ ] Implementar Firebase Auth
- [ ] Criar Firestore collections
- [ ] Migrar dados do localStorage
- [ ] Implementar React Router
- [ ] Criar ProtectedRoute
- [ ] Testes unitários dos services

### Fase 2
- [ ] Integrar Wokwi Simulator
- [ ] Criar componentes de Shop
- [ ] Implementar chat em tempo real
- [ ] Dashboard do Game Master
- [ ] Testes de integração

### Fase 3
- [ ] Criar 30+ novas quests
- [ ] Sistema de mentoria
- [ ] Desafios diários
- [ ] Novas badges e conquistas
- [ ] Testes de conteúdo

### Fase 4
- [ ] Configurar PWA
- [ ] Service Worker
- [ ] Push notifications
- [ ] Marketplace de projetos
- [ ] Integrações externas

---

**Versão do Documento:** 1.0  
**Última Atualização:** 13/08/2026  
**Autor:** Equipe de Desenvolvimento IziCodeEdu
