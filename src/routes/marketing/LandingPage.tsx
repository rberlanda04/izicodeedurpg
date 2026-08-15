import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import {
  Map,
  Bot,
  Users,
  Globe2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  School,
  GraduationCap,
  UserCircle,
  Key
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/stem/Button';
import { Card } from '../../components/stem/Card';
import { ToolBadgeRow } from '../../components/stem/ToolBadge';

const FEATURES = [
  {
    icon: Map,
    title: 'Trilha estilo Duolingo',
    description:
      'Habilidades e missões viram um único caminho visual. O aluno vê exatamente o próximo passo, não uma lista de tarefas soltas.'
  },
  {
    icon: Bot,
    title: 'Motor de missões com IA',
    description:
      'Sugestões de missões geradas por IA a partir do que a turma já desbloqueou — com um catálogo real de projetos como base, não texto genérico.'
  },
  {
    icon: Users,
    title: 'Guildas com papéis de Scrum',
    description:
      'Equipes de projeto de verdade: Scrum Master, Dev, Maker, Product Owner. Trabalho em grupo com estrutura, não só "formem grupos".'
  },
  {
    icon: Globe2,
    title: 'Portais de desafios reais',
    description: 'OBI, OBR, FIRST LEGO League, Technovation Girls e outras — com link oficial, não só o nome.'
  },
  {
    icon: ShieldCheck,
    title: 'Multi-turma, com permissões reais',
    description:
      'Cada escola, cada turma, cada papel (aluno/professor/admin) isolado de verdade no banco — não é só um layout diferente por cima dos mesmos dados.'
  },
  {
    icon: Sparkles,
    title: 'Ferramentas reais, não genéricas',
    description: 'Arduino, Scratch, Micro:bit, Tinkercad, Python, Raspberry Pi, Lego WeDo — cada missão linka pra ferramenta de verdade.'
  }
];

const AUDIENCES = [
  {
    icon: School,
    title: 'Para escolas',
    description:
      'Um painel admin pra coordenar várias turmas e professores no mesmo laboratório, sem depender de planilha solta.'
  },
  {
    icon: GraduationCap,
    title: 'Para professores',
    description:
      'Você aprova as missões, concede XP ao vivo e dispara desafios relâmpago — o jogo só avança com sua validação.'
  },
  {
    icon: UserCircle,
    title: 'Para alunos',
    description: 'Um código de sala e já tá dentro — sem formulário longo, sem fricção antes da primeira missão.'
  }
];

const SHOWCASE_TOOLS = [
  'Arduino',
  'Scratch',
  'Micro:bit',
  'Tinkercad',
  'Python',
  'Raspberry Pi',
  'Makey Makey',
  'App Inventor',
  'Lego WeDo 2.0',
  'Canva'
];

export const LandingPage: React.FC = () => {
  const { firebaseUser, loading } = useAuth();
  if (!loading && firebaseUser) return <Navigate to="/app" replace />;

  return (
    <div className="min-h-screen bg-stem-mist">
      {/* Nav */}
      <header className="sticky top-0 z-40 bg-stem-cloud/90 backdrop-blur border-b-2 border-stem-line">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/marketing/robot-logo.png" alt="" className="w-9 h-9" />
            <span className="font-display font-extrabold text-lg text-stem-teal">Izicode Maker</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/entrar" className="text-sm font-display font-semibold text-stem-ink-soft hover:text-stem-ink px-3 py-2">
              Entrar
            </Link>
            <Link to="/cadastro">
              <Button>Criar conta</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-display font-bold uppercase tracking-wide text-stem-teal bg-stem-teal/10 px-3 py-1.5 rounded-full">
            Robótica & STEAM em formato de RPG
          </span>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl text-stem-ink mt-4 leading-tight text-balance">
            Sua aula de robótica vira uma <span className="text-stem-teal">trilha de aventura</span>
          </h1>
          <p className="font-body-stem text-base text-stem-ink-soft mt-5 max-w-lg">
            Do 6º ano ao Ensino Médio: alunos desbloqueiam habilidades reais (Arduino, Scratch, Micro:bit, Python...)
            completando missões baseadas em projetos maker de verdade, em equipes com papéis de Scrum, validadas
            pelo professor a cada etapa.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <Link to="/cadastro">
              <Button>
                Começar agora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/entrar">
              <Button variant="ghost">
                <Key className="w-4 h-4" /> Já tenho código de sala
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-stem-violet/10 rounded-[2rem] -rotate-2" aria-hidden="true" />
          <img
            src="/marketing/screenshot-trilha.png"
            alt="Trilha de habilidades do Izicode Maker, mostrando nós de missões concluídas e disponíveis"
            className="relative rounded-2xl border-2 border-stem-line shadow-xl w-full"
          />
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-3xl text-stem-ink text-balance">
            Não é um LMS com selo de gamificação
          </h2>
          <p className="font-body-stem text-stem-ink-soft mt-3">
            É construído em cima de uma árvore de habilidades de verdade, um catálogo real de projetos maker, e
            permissões que realmente isolam turmas — não é decoração por cima de planilhas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <Card key={title} accent="teal">
              <Icon className="w-8 h-8 text-stem-teal" />
              <h3 className="font-display font-bold text-stem-ink mt-3">{title}</h3>
              <p className="font-body-stem text-sm text-stem-ink-soft mt-1.5">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Screenshots */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center mb-10">
          <div>
            <h2 className="font-display font-extrabold text-3xl text-stem-ink text-balance">
              Missões com tutorial completo, não só um título
            </h2>
            <p className="font-body-stem text-stem-ink-soft mt-3 max-w-md">
              Cada missão do mural traz materiais, esquema de ligação e código comentado — o aluno abre "Ver
              tutorial completo" e tem o passo a passo real, alinhado à BNCC e aos ODS da ONU.
            </p>
          </div>
          <img
            src="/marketing/screenshot-missoes.png"
            alt="Mural de missões com cards de projetos reais, logos de ferramentas e badges de ODS"
            className="rounded-2xl border-2 border-stem-line shadow-lg w-full"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          <img
            src="/marketing/screenshot-portais.png"
            alt="Página de Portais de Desafios com logos de olimpíadas e competições reais"
            className="rounded-2xl border-2 border-stem-line shadow-lg w-full lg:order-1"
          />
          <div>
            <h2 className="font-display font-extrabold text-3xl text-stem-ink text-balance">
              Conectado às competições que já existem
            </h2>
            <p className="font-body-stem text-stem-ink-soft mt-3 max-w-md">
              OBI, OBR, FIRST LEGO League, Technovation Girls, Scratch Day e mais — com link oficial de cada uma,
              pra turma não descobrir tarde demais que perdeu a inscrição.
            </p>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="font-display font-extrabold text-2xl text-stem-ink">Ferramentas reais, não ícones genéricos</h2>
        <p className="font-body-stem text-sm text-stem-ink-soft mt-2 max-w-md mx-auto">
          Cada badge linka pro site oficial da ferramenta.
        </p>
        <div className="flex justify-center mt-6">
          <ToolBadgeRow tools={SHOWCASE_TOOLS} />
        </div>
      </section>

      {/* Audiences */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="font-display font-extrabold text-3xl text-stem-ink text-center mb-10">Feito pra três papéis, não um só</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {AUDIENCES.map(({ icon: Icon, title, description }) => (
            <Card key={title} accent="violet" className="text-center">
              <Icon className="w-9 h-9 text-stem-violet mx-auto" />
              <h3 className="font-display font-bold text-stem-ink mt-3">{title}</h3>
              <p className="font-body-stem text-sm text-stem-ink-soft mt-1.5">{description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Card accent="coral" className="py-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-stem-ink text-balance">
            Pronto pra transformar sua próxima aula numa missão?
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link to="/cadastro">
              <Button>
                Criar conta grátis <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/entrar">
              <Button variant="ghost">Entrar</Button>
            </Link>
          </div>
        </Card>
      </section>

      <footer className="border-t-2 border-stem-line py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <img src="/marketing/robot-logo.png" alt="" className="w-6 h-6" />
            <span className="font-display font-bold text-sm text-stem-ink">Izicode Maker</span>
          </div>
          <p className="font-body-stem text-xs text-stem-ink-soft">© 2026 Izicode Maker. Plataforma educacional STEAM.</p>
        </div>
      </footer>
    </div>
  );
};
