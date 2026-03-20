import { QUESTIONS_BASE, PHRASES_BASE, PRAYER_ACTIONS, PRAYER_SUBJECTS, PRAYER_CONTEXTS, PANIC_MESSAGES, WARFARE_MESSAGES } from '../data/content';

const history = new Set();

const PERSONAL_TEMPLATES = [
  "En este momento sagrado, pon en Sus manos la situación de: [ITEM].",
  "Levanta un clamor especial por [ITEM]. Sé que Él tiene el control absoluto.",
  "Visualiza la victoria del cielo ahora mismo sobre [ITEM]. No dejes de creer.",
  "Declaramos que Su gloria y protección rodean ahora a [ITEM]. Persiste.",
  "Pide al Espíritu Santo que traiga revelación y paz sobre [ITEM]. Él te escucha.",
  "No sueltes la bendición de [ITEM]. Sigue intercediendo con fuerza.",
  "Hoy Dios te dice que Su gracia le basta a [ITEM]. Confía profundamente.",
  "Que tu fe se active ahora por [ITEM]. El Padre se deleita en tu petición.",
  "Entrega de nuevo a [ITEM] en el altar del Rey. Su amor lo cubre todo.",
  "Intercede con autoridad: Declaramos rompimiento y sanidad para [ITEM]."
];

const PREFIXES = ["En la paz de este momento, ", "Desde el fondo de tu corazón, responde: ", "Con sinceridad, ", "Escucha Su voz y responde: "];
const STARTERS = ["Recuerda siempre: ", "Nunca olvides que ", "Hoy el Espíritu te dice: ", "Graba esto en tu corazón: "];

const generateSingleItem = (type) => {
  if (type === 'question') {
    const base = QUESTIONS_BASE[Math.floor(Math.random() * QUESTIONS_BASE.length)];
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    return `${prefix}${base.charAt(0).toLowerCase()}${base.slice(1)}`;
  }
  if (type === 'phrase') {
    const base = PHRASES_BASE[Math.floor(Math.random() * PHRASES_BASE.length)];
    const start = STARTERS[Math.floor(Math.random() * STARTERS.length)];
    return `${start}${base.charAt(0).toLowerCase()}${base.slice(1)}`;
  }
  if (type === 'point') {
    const act = PRAYER_ACTIONS[Math.floor(Math.random() * PRAYER_ACTIONS.length)];
    const sub = PRAYER_SUBJECTS[Math.floor(Math.random() * PRAYER_SUBJECTS.length)];
    const ctx = PRAYER_CONTEXTS[Math.floor(Math.random() * PRAYER_CONTEXTS.length)];
    return `${act} ${sub} ${ctx}.`;
  }
  return PHRASES_BASE[0];
};

export const getPanicContent = () => {
  return { type: 'S.O.S ESPIRITUAL', text: PANIC_MESSAGES[Math.floor(Math.random() * PANIC_MESSAGES.length)] };
};

export const getRandomContent = (userPetitions = [], isWarfareMode = false) => {
  // MODO GUERRA: 70% de probabilidad de mensajes de guerra si está activo
  if (isWarfareMode && Math.random() < 0.7) {
    const msg = WARFARE_MESSAGES[Math.floor(Math.random() * WARFARE_MESSAGES.length)];
    return { type: 'GUERRA ESPIRITUAL', text: msg };
  }

  if (userPetitions.length > 0 && Math.random() < 0.3) {
    const petition = userPetitions[Math.floor(Math.random() * userPetitions.length)];
    const template = PERSONAL_TEMPLATES[Math.floor(Math.random() * PERSONAL_TEMPLATES.length)];
    return { type: 'PETICIÓN PERSONAL', text: template.replace("[ITEM]", petition) };
  }

  const types = ['phrase', 'question', 'point'];
  const type = types[Math.floor(Math.random() * types.length)];
  let item = generateSingleItem(type);
  let attempts = 0;
  while (history.has(item) && attempts < 10) {
    item = generateSingleItem(type);
    attempts++;
  }
  history.add(item);
  if (history.size > 50) history.clear();
  
  const displayType = type === 'phrase' ? 'FRASE' : (type === 'question' ? 'PREGUNTA' : 'ORACIÓN');
  return { type: displayType, text: item };
};
