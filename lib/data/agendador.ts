export type Platform = "instagram" | "tiktok" | "youtube" | "linkedin";
export type PostStatus = "agendado" | "publicado" | "falhou" | "rascunho";

export interface PlatformMeta {
  id: Platform;
  label: string;
  icon: string;
  color: string;
  mcp: string;          // nome do MCP/integração
  mcpMethod: string;    // método exato que será chamado
  handle: string;
  connected: boolean;
}

export interface ScheduledPost {
  id: string;
  hook: string;
  angle: string;
  cta: string;
  caption: string;
  platforms: Platform[];
  scheduledAt: string;  // ISO
  status: PostStatus;
  via: Record<Platform, string>; // MCP name per platform
}

// ── Plataformas + pontos de integração MCP ─────────────────────────────────

export const platforms: PlatformMeta[] = [
  {
    id: "instagram",
    label: "Instagram",
    icon: "📸",
    color: "#E1306C",
    mcp: "instagram-graph-mcp",
    mcpMethod: "media.reels.publish",
    handle: "@seucreator",
    connected: true,
  },
  {
    id: "tiktok",
    label: "TikTok",
    icon: "🎵",
    color: "#69C9D0",
    mcp: "tiktok-content-mcp",
    mcpMethod: "video.upload_and_post",
    handle: "@seucreator",
    connected: true,
  },
  {
    id: "youtube",
    label: "YouTube Shorts",
    icon: "▶️",
    color: "#FF0000",
    mcp: "youtube-data-mcp",
    mcpMethod: "videos.insert (shorts)",
    handle: "SeuCreator",
    connected: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: "💼",
    color: "#0A66C2",
    mcp: "linkedin-share-mcp",
    mcpMethod: "ugcPosts.create",
    handle: "Seu Creator",
    connected: true,
  },
];

// ── Hooks pré-existentes para selecionar no agendador ───────────────────────

export const savedHooks = [
  "Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.",
  "Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.",
  "Existe um tipo de post que vende mais do que qualquer anúncio. E não parece propaganda.",
  "Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.",
  "Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3x maior.",
  "[Escrever hook manualmente...]",
];

export const angles = [
  "Revelação de bastidores",
  "Erro que cometi + lição",
  "Comparação antes vs depois",
  "Tutorial passo a passo",
  "Opinião polêmica",
  "Dados e prova social",
  "Storytelling pessoal",
  "Lista numerada",
];

export const ctas = [
  "Salva esse vídeo pra não perder.",
  "Comenta aqui se você já passou por isso.",
  "Segue para mais conteúdo assim todo dia.",
  "Manda esse vídeo pra alguém que precisa ver.",
  "Clica no link da bio para saber mais.",
  "Responde nos comentários: qual é o seu maior desafio?",
];

// ── Fila mockada ─────────────────────────────────────────────────────────────

function iso(daysFromNow: number, hour: number, min = 0): string {
  const d = new Date("2026-06-30T00:00:00-03:00");
  d.setDate(d.getDate() + daysFromNow);
  d.setHours(hour, min, 0, 0);
  return d.toISOString();
}

export const queue: ScheduledPost[] = [
  {
    id: "p1",
    hook: "Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.",
    angle: "Opinião polêmica",
    cta: "Salva esse vídeo pra não perder.",
    caption:
      "Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.\n\nQuando você dá tudo de graça, a pessoa não tem incentivo pra comprar. O segredo não é dar menos — é dar diferente.\n\n📌 Salva esse vídeo pra não perder.",
    platforms: ["instagram", "tiktok"],
    scheduledAt: iso(1, 19, 0),
    status: "agendado",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "tiktok-content-mcp → video.upload_and_post",
      youtube: "",
      linkedin: "",
    },
  },
  {
    id: "p2",
    hook: "Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.",
    angle: "Revelação de bastidores",
    cta: "Comenta aqui se você já passou por isso.",
    caption:
      "Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.\n\nÉ a estratégia. Hoje eu mostro o framework que usei para triplicar meu faturamento reduzindo pela metade os posts.\n\n💬 Comenta aqui se você já passou por isso.",
    platforms: ["instagram", "linkedin"],
    scheduledAt: iso(3, 12, 0),
    status: "agendado",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "",
      youtube: "",
      linkedin: "linkedin-share-mcp → ugcPosts.create",
    },
  },
  {
    id: "p3",
    hook: "Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3x maior.",
    angle: "Dados e prova social",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption:
      "Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3x maior.\n\nNão é trend de música, não é transição elaborada, não é texto animado. É algo muito mais simples.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    platforms: ["instagram", "tiktok", "youtube"],
    scheduledAt: iso(5, 18, 0),
    status: "agendado",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "tiktok-content-mcp → video.upload_and_post",
      youtube: "youtube-data-mcp → videos.insert (shorts)",
      linkedin: "",
    },
  },
  {
    id: "p4",
    hook: "Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.",
    angle: "Storytelling pessoal",
    cta: "Manda esse vídeo pra alguém que precisa ver.",
    caption:
      "Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.\n\nEu estava trocando tempo por dinheiro numa proporção fixa. O que muda o jogo é alavancagem — e eu descobri isso da pior forma.\n\n↗️ Manda esse vídeo pra alguém que precisa ver.",
    platforms: ["instagram", "tiktok", "linkedin"],
    scheduledAt: iso(-1, 19, 0),
    status: "publicado",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "tiktok-content-mcp → video.upload_and_post",
      youtube: "",
      linkedin: "linkedin-share-mcp → ugcPosts.create",
    },
  },
  {
    id: "p5",
    hook: "Existe um tipo de post que vende mais do que qualquer anúncio.",
    angle: "Comparação antes vs depois",
    cta: "Clica no link da bio para saber mais.",
    caption:
      "Existe um tipo de post que vende mais do que qualquer anúncio. E não parece propaganda.\n\nEu chamo de conteúdo de transformação — você mostra um antes e um depois real, sem roteiro forçado.\n\n🔗 Clica no link da bio para saber mais.",
    platforms: ["instagram"],
    scheduledAt: iso(-3, 12, 0),
    status: "publicado",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "",
      youtube: "",
      linkedin: "",
    },
  },
  {
    id: "p6",
    hook: "Fiz uma mudança pequena na estrutura dos meus reels e o alcance dobrou em 3 semanas.",
    angle: "Tutorial passo a passo",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption:
      "Fiz uma mudança pequena na estrutura dos meus reels e o alcance dobrou em 3 semanas.\n\nNão foi frequência, não foi horário, não foi hashtag. Foi a forma como eu estruturo os primeiros 5 segundos.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    platforms: ["instagram", "tiktok"],
    scheduledAt: iso(-5, 18, 30),
    status: "falhou",
    via: {
      instagram: "instagram-graph-mcp → media.reels.publish",
      tiktok: "tiktok-content-mcp → video.upload_and_post",
      youtube: "",
      linkedin: "",
    },
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

export function generateCaption(hook: string, angle: string, cta: string): string {
  if (!hook || !angle || !cta) return "";
  const emojiMap: Record<string, string> = {
    "Revelação de bastidores": "🔍",
    "Erro que cometi + lição": "⚠️",
    "Comparação antes vs depois": "📊",
    "Tutorial passo a passo": "📝",
    "Opinião polêmica": "🔥",
    "Dados e prova social": "📈",
    "Storytelling pessoal": "🎯",
    "Lista numerada": "✅",
  };
  const emoji = emojiMap[angle] ?? "💡";
  return `${hook}\n\n${emoji} Ângulo: ${angle} — desenvolvimento do conteúdo aqui.\n\n${cta}`;
}

export function fmtSchedule(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    weekday: "short", day: "2-digit", month: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export const platformMeta = Object.fromEntries(
  platforms.map((p) => [p.id, p])
) as Record<Platform, PlatformMeta>;
