import React from 'react';
import { ExternalLink, Calendar, Users, Globe2 } from 'lucide-react';
import { Card } from '../../components/stem/Card';
import { CHALLENGE_PORTALS } from '../../data/challengePortals';

export const PortaisPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-extrabold text-2xl text-stem-ink flex items-center gap-2">
          <Globe2 className="w-6 h-6 text-stem-teal" /> Portais de Desafios
        </h1>
        <p className="font-body-stem text-sm text-stem-ink-soft max-w-2xl">
          Olimpíadas e competições reais de tecnologia abertas para sua turma. Fale com o Game Master para se
          inscrever oficialmente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {CHALLENGE_PORTALS.map((portal) => (
          <Card key={portal.id} accent="teal" className="flex flex-col">
            <div className="flex items-start gap-3">
              {portal.logo ? (
                <img
                  src={portal.logo}
                  alt=""
                  className="w-12 h-12 rounded-xl object-contain bg-stem-mist p-1 shrink-0"
                />
              ) : (
                <span className="text-3xl shrink-0">{portal.icon}</span>
              )}
              <div>
                <h3 className="font-display font-bold text-stem-ink leading-tight">{portal.name}</h3>
                <p className="text-xs font-body-stem text-stem-ink-soft">{portal.org}</p>
              </div>
            </div>

            <p className="text-sm font-body-stem text-stem-ink-soft mt-3 flex-1">{portal.description}</p>

            {(portal.audience || portal.calendar) && (
              <div className="mt-4 space-y-1.5 text-xs font-body-stem text-stem-ink-soft">
                {portal.audience && (
                  <p className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-stem-violet shrink-0" /> {portal.audience}
                  </p>
                )}
                {portal.calendar && (
                  <p className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stem-amber shrink-0" /> {portal.calendar}
                  </p>
                )}
              </div>
            )}

            {portal.url ? (
              <a
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-display font-bold text-stem-teal hover:underline"
              >
                Site oficial <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <p className="mt-4 text-xs font-body-stem text-stem-ink-soft italic">
                Consulte o Game Master para o link de inscrição.
              </p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
