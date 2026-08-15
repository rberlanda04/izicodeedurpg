import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { School, PlusCircle, ArrowLeft, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createClass, getSchool, listClassesBySchool } from '../../services/classRepo';
import { Card } from '../../components/stem/Card';
import { Button } from '../../components/stem/Button';
import type { ClassRoom, School as SchoolType } from '../../types';

export const AdminDashboardPage: React.FC = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { profile } = useAuth();
  const [school, setSchool] = useState<SchoolType | null>(null);
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [gradeRange, setGradeRange] = useState('6º ao 9º ano');

  const reload = () => {
    if (!schoolId) return;
    listClassesBySchool(schoolId).then(setClasses);
  };

  useEffect(() => {
    if (!schoolId) return;
    getSchool(schoolId).then(setSchool);
    reload();
  }, [schoolId]);

  if (!schoolId || !profile) return null;

  return (
    <div className="min-h-screen bg-stem-mist">
      <header className="bg-stem-cloud border-b-2 border-stem-line px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <span className="text-xs font-display font-bold text-stem-violet uppercase">Painel Admin</span>
            <h1 className="font-display font-extrabold text-xl text-stem-ink flex items-center gap-2">
              <School className="w-5 h-5 text-stem-violet" /> {school?.name ?? 'Escola'}
            </h1>
          </div>
          <Link to="/app" className="flex items-center gap-1.5 text-sm font-display font-semibold text-stem-teal hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar ao app
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-lg text-stem-ink">Turmas ({classes.length})</h2>
          <Button onClick={() => setShowCreate(true)}>
            <PlusCircle className="w-4 h-4" /> Nova turma
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {classes.map((c) => (
            <Card key={c.id} accent="violet">
              <h3 className="font-display font-bold text-stem-ink">{c.name}</h3>
              <p className="text-sm font-body-stem text-stem-ink-soft">{c.gradeRange}</p>
              <p className="text-xs font-display font-bold text-stem-teal mt-2 tracking-widest">
                Código: {c.roomPasscode}
              </p>
              <p className="flex items-center gap-1.5 text-xs font-body-stem text-stem-ink-soft mt-1">
                <Users className="w-3.5 h-3.5" /> {c.studentIds.length} aluno(s)
              </p>
              <Link
                to={`/gm/${c.id}`}
                className="block mt-3 text-sm font-display font-semibold text-stem-teal hover:underline"
              >
                Abrir painel do Mestre →
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 bg-stem-ink/40 backdrop-blur-sm flex items-center justify-center p-4">
          <Card accent="violet" className="w-full max-w-md">
            <h3 className="font-display font-extrabold text-stem-ink mb-4">Criar nova turma</h3>
            <form
              className="space-y-4"
              onSubmit={async (e) => {
                e.preventDefault();
                if (!name.trim()) return;
                await createClass(schoolId, name, gradeRange, profile.uid);
                setShowCreate(false);
                setName('');
                reload();
              }}
            >
              <input
                required
                placeholder='Nome da turma (ex: "9º Ano B — Robótica 2026")'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-violet"
              />
              <select
                value={gradeRange}
                onChange={(e) => setGradeRange(e.target.value)}
                className="w-full rounded-xl border-2 border-stem-line px-3 py-2.5 font-body-stem outline-none focus:border-stem-violet"
              >
                <option>6º ao 9º ano</option>
                <option>Ensino Médio</option>
              </select>
              <p className="text-xs font-body-stem text-stem-ink-soft">
                Você será cadastrado como Game Master desta turma. Um código de sala é gerado automaticamente.
              </p>
              <div className="flex gap-3">
                <Button type="button" variant="ghost" fullWidth onClick={() => setShowCreate(false)}>
                  Cancelar
                </Button>
                <Button type="submit" fullWidth>
                  Criar turma
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
