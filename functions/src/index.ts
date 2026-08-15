import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({ region: 'southamerica-east1', maxInstances: 10 });

// Production path for AI content generation — requires the Blaze plan.
// Until that's set up, ../../server/aiContentHandler.ts implements the same
// logic as a local Vite dev-server proxy so this works today; keep the two
// in sync if you change prompts/model here.
//
// The NVIDIA API key lives only here, server-side, via Secret Manager — it
// is NEVER sent to or bundled into the frontend. Set with:
//   firebase functions:secrets:set NVIDIA_API_KEY
const NVIDIA_API_KEY = defineSecret('NVIDIA_API_KEY');
const NVIDIA_ENDPOINT = 'https://integrate.api.nvidia.com/v1/chat/completions';
// llama-3.1-8b-instruct: ~1s responses vs 100s+ observed on the 70b model
// for this short structured-JSON use case — worth the smaller model's
// lower ceiling for interactive "Sugerir com IA" buttons in the UI.
const MODEL = 'meta/llama-3.1-8b-instruct';

type ContentKind = 'quest' | 'curiosity' | 'guildIdentity';

interface GenerateContentRequest {
  kind: ContentKind;
  context: Record<string, unknown>;
}

const SINGLE_OBJECT_RULE =
  'Responda com UM ÚNICO objeto JSON — nunca uma lista/array, nunca múltiplas opções ou alternativas.';

const SYSTEM_PROMPTS: Record<ContentKind, string> = {
  quest: `Você cria "missões" (quests) para uma plataforma educacional gamificada de robótica/STEAM para alunos do 6º ano ao Ensino Médio no Brasil (Izicode Maker). Responda SOMENTE com um JSON válido, sem markdown, EXATAMENTE neste formato e respeitando os valores permitidos:
{"title": string, "description": string, "tier": "BASIC"|"INTERMEDIATE"|"ADVANCED"|"SPECIALIST", "sdgGoals": string[], "xpReward": number, "coinReward": number, "hardwareRequired": string[], "validationSteps": string[]}
Regras obrigatórias:
- ${SINGLE_OBJECT_RULE}
- "sdgGoals": 1 a 2 itens, USANDO APENAS estes números exatos (nunca invente outro formato): "2" (Fome Zero), "3" (Saúde e Bem-Estar), "4" (Educação de Qualidade), "9" (Indústria e Inovação), "11" (Cidades Sustentáveis), "12" (Consumo Responsável), "13" (Ação Climática), "16" (Paz e Instituições).
- "xpReward": número entre 150 e 600. "coinReward": número entre 40 e 180.
- "validationSteps": 2 a 3 passos curtos e verificáveis pelo professor.
A missão deve usar o hardware/habilidades já desbloqueados fornecidos no contexto, ser tecnicamente correta, e todo o texto em português do Brasil.`,
  curiosity: `Você cria "cartões de curiosidade" reais e tecnicamente precisos sobre tecnologia/ciência/maker culture para uma plataforma educacional de robótica. Responda SOMENTE com um JSON válido, sem markdown:
{"title": string, "content": string, "xpReward": number}
${SINGLE_OBJECT_RULE} "xpReward": número entre 40 e 90. O conteúdo deve ter 2-4 frases, ser factual e citável, em português do Brasil, relacionado ao local de laboratório fornecido no contexto.`,
  guildIdentity: `Você sugere UMA identidade criativa para uma "guilda" (equipe de projeto) de uma plataforma educacional STEAM gamificada. Responda SOMENTE com um JSON válido, sem markdown:
{"name": string, "motto": string}
${SINGLE_OBJECT_RULE} "name": no máximo 4 palavras. "motto": frase inspiradora com até 10 palavras. Ambos em português do Brasil, relacionados ao tema fornecido no contexto.`
};

const VALID_SDG_GOALS = ['2', '3', '4', '9', '11', '12', '13', '16'];
const VALID_TIERS = ['BASIC', 'INTERMEDIATE', 'ADVANCED', 'SPECIALIST'];

function str(v: unknown, fallback: string): string {
  return typeof v === 'string' && v.trim() ? v.trim() : fallback;
}

function strArray(v: unknown, fallback: string[]): string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string') && v.length > 0 ? v : fallback;
}

function clampNumber(v: unknown, min: number, max: number, fallback: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

// Prompt instructions alone aren't reliable enough for fields the UI's type
// system depends on — repair the model's output rather than trust it
// blindly. Keep in sync with server/aiContentHandler.ts's sanitize().
function sanitize(kind: ContentKind, parsed: Record<string, unknown>): unknown {
  if (kind === 'quest') {
    const sdgGoals = strArray(parsed.sdgGoals, []).filter((g) => VALID_SDG_GOALS.includes(g));
    return {
      title: str(parsed.title, 'Missão Maker'),
      description: str(parsed.description, ''),
      tier: VALID_TIERS.includes(parsed.tier as string) ? parsed.tier : 'BASIC',
      sdgGoals: sdgGoals.length > 0 ? sdgGoals : ['4'],
      xpReward: clampNumber(parsed.xpReward, 150, 600, 300),
      coinReward: clampNumber(parsed.coinReward, 40, 180, 80),
      hardwareRequired: strArray(parsed.hardwareRequired, []),
      validationSteps: strArray(parsed.validationSteps, ['Apresentar o resultado ao Game Master.'])
    };
  }
  if (kind === 'curiosity') {
    return {
      title: str(parsed.title, 'Curiosidade Maker'),
      content: str(parsed.content, ''),
      xpReward: clampNumber(parsed.xpReward, 40, 90, 50)
    };
  }
  return {
    name: str(parsed.name, 'Guilda Sem Nome'),
    motto: str(parsed.motto, 'Unidos pela tecnologia!')
  };
}

// Finds and parses the first complete top-level JSON value (object or
// array), by brace/bracket depth-counting rather than a greedy regex —
// unwraps to the first element if the model returns an array despite the
// single-object instruction. Keep in sync with
// server/aiContentHandler.ts's extractFirstJsonValue().
function extractFirstJsonValue(raw: string): Record<string, unknown> {
  const trimmed = raw.trim();
  const start = trimmed.search(/[[{]/);
  if (start === -1) throw new Error('Nenhum JSON encontrado na resposta do modelo.');

  const open = trimmed[start];
  const close = open === '{' ? '}' : ']';
  let depth = 0;
  let end = -1;
  for (let i = start; i < trimmed.length; i++) {
    if (trimmed[i] === open) depth++;
    else if (trimmed[i] === close) {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  if (end === -1) throw new Error('JSON incompleto na resposta do modelo.');

  const parsed = JSON.parse(trimmed.slice(start, end + 1));
  if (Array.isArray(parsed)) {
    const first = parsed.find((item) => item && typeof item === 'object');
    if (!first) throw new Error('Lista vazia na resposta do modelo.');
    return first as Record<string, unknown>;
  }
  return parsed as Record<string, unknown>;
}

export const generateContent = onCall(
  { secrets: [NVIDIA_API_KEY] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'É preciso estar autenticado para gerar conteúdo.');
    }

    const { kind, context } = request.data as GenerateContentRequest;
    const systemPrompt = SYSTEM_PROMPTS[kind];
    if (!systemPrompt) {
      throw new HttpsError('invalid-argument', `Tipo de conteúdo desconhecido: ${kind}`);
    }

    const response = await fetch(NVIDIA_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${NVIDIA_API_KEY.value()}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Contexto: ${JSON.stringify(context ?? {})}` }
        ],
        temperature: 0.8,
        top_p: 0.9,
        max_tokens: 700
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('NVIDIA API error', response.status, errText);
      throw new HttpsError('internal', 'Não foi possível gerar o conteúdo agora. Tente de novo em instantes.');
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const raw = data.choices?.[0]?.message?.content ?? '';

    try {
      const parsed = extractFirstJsonValue(raw);
      return { kind, result: sanitize(kind, parsed) };
    } catch {
      console.error('Failed to parse model output as JSON:', raw);
      throw new HttpsError('internal', 'O modelo retornou um formato inesperado. Tente de novo.');
    }
  }
);
