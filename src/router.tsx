import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LandingPage } from './routes/marketing/LandingPage';
import { LoginView } from './routes/auth/LoginView';
import { RegisterView } from './routes/auth/RegisterView';
import { OnboardingView } from './routes/auth/OnboardingView';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AppIndexResolver } from './routes/app/AppIndexResolver';
import { ClassLayout } from './routes/app/ClassLayout';
import { OverworldPage } from './routes/app/OverworldPage';
import { TrilhaPage } from './routes/app/TrilhaPage';
import { MissoesPage } from './routes/app/MissoesPage';
import { GuildasPage } from './routes/app/GuildasPage';
import { LabPage } from './routes/app/LabPage';
import { CuriosidadesPage } from './routes/app/CuriosidadesPage';
import { HackathonPage } from './routes/app/HackathonPage';
import { PortaisPage } from './routes/app/PortaisPage';
import { PerfilPage } from './routes/app/PerfilPage';
import { GmDashboardPage } from './routes/gm/GmDashboardPage';
import { AdminDashboardPage } from './routes/admin/AdminDashboardPage';
import { EventsListPage } from './routes/hackathon/EventsListPage';
import { CreateEventPage } from './routes/hackathon/CreateEventPage';
import { EventHubPage } from './routes/hackathon/EventHubPage';
import { EventStaffPage } from './routes/hackathon/EventStaffPage';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/entrar', element: <LoginView /> },
  { path: '/cadastro', element: <RegisterView /> },

  {
    element: <ProtectedRoute />,
    children: [
      { path: '/onboarding', element: <OnboardingView /> },
      { path: '/app', element: <AppIndexResolver /> },
      { path: '/eventos', element: <EventsListPage /> },
      { path: '/eventos/novo', element: <CreateEventPage /> },
      { path: '/eventos/:eventId', element: <EventHubPage /> },
      { path: '/eventos/:eventId/staff', element: <EventStaffPage /> },
      {
        path: '/app/:classId',
        element: <ClassLayout />,
        children: [
          { index: true, element: <OverworldPage /> },
          { path: 'mundo', element: <OverworldPage /> },
          { path: 'trilha', element: <TrilhaPage /> },
          { path: 'missoes', element: <MissoesPage /> },
          { path: 'guildas', element: <GuildasPage /> },
          { path: 'lab', element: <LabPage /> },
          { path: 'curiosidades', element: <CuriosidadesPage /> },
          { path: 'hackathon', element: <HackathonPage /> },
          { path: 'portais', element: <PortaisPage /> },
          { path: 'perfil', element: <PerfilPage /> }
        ]
      }
    ]
  },

  {
    element: <ProtectedRoute requireRole="GAME_MASTER" matchParam="classId" />,
    children: [{ path: '/gm/:classId', element: <GmDashboardPage /> }]
  },

  {
    element: <ProtectedRoute requireRole="ADMIN" matchParam="schoolId" />,
    children: [{ path: '/admin/:schoolId', element: <AdminDashboardPage /> }]
  },

  { path: '*', element: <Navigate to="/" replace /> }
]);
