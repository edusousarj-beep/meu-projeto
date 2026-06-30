export type HookPotential = "potencial de hook" | "explicar" | "pular";

export type SourceType =
  | "blog-anthropic"
  | "blog-openai"
  | "blog-google"
  | "x-list"
  | "rss-nicho"
  | "newsletter"
  | "reddit"
  | "hacker-news"
  | "product-hunt"
  | "arxiv"
  | "youtube-trending"
  | "linkedin-trending";

export interface TrendSource {
  id: SourceType;
  label: string;
  icon: string;
  color: string;
  url: string;
  fetchInterval: string; // "daily", "hourly", etc.
  lastFetched: string; // ISO
  itemsFetched: number;
}

export interface TrendItem {
  id: string;
  title: string;
  summary: string;         // 1–2 sentences
  hookSuggestion: string;  // auto-generated hook angle
  source: SourceType;
  sourceLabel: string;
  url: string;
  publishedAt: string;     // ISO
  fetchedAt: string;       // ISO
  tag: HookPotential;
  tagReason: string;       // why this tag was assigned
  engagementSignal: string; // "12K retweets", "Trending #3", etc.
  nicho: string[];
}

export interface DigestJob {
  scheduledAt: string; // "07:00"
  channels: DigestChannel[];
  lastSent: string | null;
  nextSend: string; // ISO
}

export interface DigestChannel {
  id: string;
  type: "slack" | "email";
  label: string;
  destination: string;
  enabled: boolean;
}

// ── Sources ──────────────────────────────────────────────────────────────────

export const sources: TrendSource[] = [
  {
    id: "blog-anthropic",
    label: "Anthropic Blog",
    icon: "🤖",
    color: "#c96a3a",
    url: "https://www.anthropic.com/news",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:00:00Z",
    itemsFetched: 3,
  },
  {
    id: "blog-openai",
    label: "OpenAI Blog",
    icon: "⚡",
    color: "#10a37f",
    url: "https://openai.com/blog",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:01:00Z",
    itemsFetched: 4,
  },
  {
    id: "blog-google",
    label: "Google DeepMind",
    icon: "🔬",
    color: "#4285f4",
    url: "https://deepmind.google/blog",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:02:00Z",
    itemsFetched: 2,
  },
  {
    id: "x-list",
    label: "X · AI List",
    icon: "𝕏",
    color: "#e7e9ea",
    url: "https://x.com/i/lists/ai-trending",
    fetchInterval: "hourly",
    lastFetched: "2026-06-30T11:00:00Z",
    itemsFetched: 18,
  },
  {
    id: "rss-nicho",
    label: "The Rundown AI",
    icon: "📰",
    color: "#7b6ce0",
    url: "https://www.therundown.ai/feed",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:05:00Z",
    itemsFetched: 6,
  },
  {
    id: "newsletter",
    label: "TLDR AI",
    icon: "✉️",
    color: "#5b9de0",
    url: "https://tldr.tech/ai",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T07:00:00Z",
    itemsFetched: 5,
  },
  {
    id: "reddit",
    label: "r/MachineLearning",
    icon: "🔴",
    color: "#ff4500",
    url: "https://reddit.com/r/MachineLearning",
    fetchInterval: "hourly",
    lastFetched: "2026-06-30T11:00:00Z",
    itemsFetched: 10,
  },
  {
    id: "hacker-news",
    label: "Hacker News",
    icon: "🟠",
    color: "#ff6600",
    url: "https://news.ycombinator.com",
    fetchInterval: "hourly",
    lastFetched: "2026-06-30T11:00:00Z",
    itemsFetched: 8,
  },
  {
    id: "product-hunt",
    label: "Product Hunt",
    icon: "🐱",
    color: "#da552f",
    url: "https://producthunt.com",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:10:00Z",
    itemsFetched: 5,
  },
  {
    id: "arxiv",
    label: "arXiv · cs.AI",
    icon: "📄",
    color: "#b31b1b",
    url: "https://arxiv.org/list/cs.AI/recent",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:15:00Z",
    itemsFetched: 12,
  },
  {
    id: "youtube-trending",
    label: "YouTube · Trending Tech",
    icon: "▶️",
    color: "#ff0000",
    url: "https://youtube.com/feed/trending?bp=AI",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:20:00Z",
    itemsFetched: 7,
  },
  {
    id: "linkedin-trending",
    label: "LinkedIn · Trending",
    icon: "💼",
    color: "#0a66c2",
    url: "https://linkedin.com/feed/trending",
    fetchInterval: "daily",
    lastFetched: "2026-06-30T06:25:00Z",
    itemsFetched: 6,
  },
];

export const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s])) as Record<SourceType, TrendSource>;

// ── Digest job ────────────────────────────────────────────────────────────────

export const digestJob: DigestJob = {
  scheduledAt: "07:00",
  lastSent: "2026-06-29T07:00:00-03:00",
  nextSend: "2026-07-01T07:00:00-03:00",
  channels: [
    { id: "slack-1", type: "slack", label: "Slack · #content-radar", destination: "#content-radar", enabled: true },
    { id: "email-1", type: "email", label: "Email pessoal", destination: "edu@exemplo.com.br", enabled: true },
    { id: "slack-2", type: "slack", label: "Slack · #geral", destination: "#geral", enabled: false },
  ],
};

// ── Items ─────────────────────────────────────────────────────────────────────

function ago(minutes: number): string {
  const d = new Date("2026-06-30T11:30:00Z");
  d.setMinutes(d.getMinutes() - minutes);
  return d.toISOString();
}

export const items: TrendItem[] = [
  // ── potencial de hook ──────────────────────────────────────────────────────
  {
    id: "t1",
    title: "Claude 4 Opus ultrapassa GPT-5 em benchmark de raciocínio longo",
    summary: "A Anthropic publicou resultados mostrando que Claude 4 Opus supera GPT-5 em tarefas de raciocínio com contexto acima de 100K tokens, com margem de 18 pontos percentuais no MMLU-Pro.",
    hookSuggestion: "A IA que 'perdeu' pra OpenAI acabou de bater o GPT-5 onde mais importa — e ninguém tá falando sobre isso.",
    source: "blog-anthropic",
    sourceLabel: "Anthropic Blog",
    url: "#",
    publishedAt: ago(40),
    fetchedAt: ago(35),
    tag: "potencial de hook",
    tagReason: "Comparativo de IAs sempre gera debate. Ângulo de 'virada inesperada' tem alto potencial de engajamento.",
    engagementSignal: "Trending #1 no X por 2h",
    nicho: ["IA", "Criadores", "Marketing"],
  },
  {
    id: "t2",
    title: "OpenAI lança o2 Mini: modelo compacto que roda no celular sem internet",
    summary: "A OpenAI anunciou o o2 Mini, um modelo de 3B parâmetros otimizado para execução on-device em smartphones Android e iOS sem necessidade de conexão com a internet.",
    hookSuggestion: "Você vai ter uma IA completa no seu celular sem precisar de Wi-Fi. Isso muda tudo pra criadores de conteúdo.",
    source: "blog-openai",
    sourceLabel: "OpenAI Blog",
    url: "#",
    publishedAt: ago(90),
    fetchedAt: ago(85),
    tag: "potencial de hook",
    tagReason: "Impacto direto no dia a dia do público. Hook de 'isso muda tudo pra você' é universalmente engajante.",
    engagementSignal: "42K retweets · 8.1K comentários",
    nicho: ["IA", "Produtividade", "Criadores"],
  },
  {
    id: "t3",
    title: "Pesquisa: 67% dos freelancers brasileiros usam IA diariamente — mas só 12% declaram para clientes",
    summary: "Levantamento com 4.200 freelancers brasileiros revelou que a maioria usa ferramentas de IA no trabalho cotidiano, mas esconde isso dos clientes por medo de desvalorização.",
    hookSuggestion: "67% dos freelancers usam IA todo dia. Quase nenhum conta pro cliente. Isso vai explodir em algum momento.",
    source: "rss-nicho",
    sourceLabel: "The Rundown AI",
    url: "#",
    publishedAt: ago(180),
    fetchedAt: ago(170),
    tag: "potencial de hook",
    tagReason: "Dado específico + tensão social + relevância imediata para o nicho de criadores e profissionais liberais.",
    engagementSignal: "1.2K upvotes no LinkedIn",
    nicho: ["Finanças", "Carreira", "IA"],
  },
  {
    id: "t4",
    title: "Google DeepMind apresenta Gemini 2.5 Ultra com capacidade de gerar vídeo de 10 minutos",
    summary: "O novo Gemini 2.5 Ultra consegue gerar vídeos coerentes de até 10 minutos a partir de um texto, com qualidade próxima à de produções humanas básicas.",
    hookSuggestion: "IA agora gera 10 minutos de vídeo do zero. O trabalho do editor de vídeo nunca mais vai ser o mesmo.",
    source: "blog-google",
    sourceLabel: "Google DeepMind",
    url: "#",
    publishedAt: ago(240),
    fetchedAt: ago(230),
    tag: "potencial de hook",
    tagReason: "Impacto direto na profissão de criadores de vídeo. Gatilho de medo + oportunidade = engajamento alto.",
    engagementSignal: "Trending #2 no X · 28K retweets",
    nicho: ["IA", "Criadores", "Produtividade"],
  },
  {
    id: "t5",
    title: "Thread viral: 'Demiti meu social media e substituí por 3 agentes de IA. Resultado depois de 90 dias'",
    summary: "Empreendedor publicou thread detalhando como substituiu uma equipe de social media por agentes de IA, documentando o impacto em engajamento, custo e qualidade ao longo de 90 dias.",
    hookSuggestion: "Esse cara demitiu o social media e colocou 3 IAs no lugar. 90 dias depois: os números são assustadores.",
    source: "x-list",
    sourceLabel: "X · AI List",
    url: "#",
    publishedAt: ago(320),
    fetchedAt: ago(310),
    tag: "potencial de hook",
    tagReason: "Narrativa de experimento real + números concretos + controvérsia sobre substituição de empregos = viral.",
    engagementSignal: "18.4K retweets · 3.2K bookmarks",
    nicho: ["IA", "Criadores", "Marketing"],
  },

  // ── explicar ───────────────────────────────────────────────────────────────
  {
    id: "t6",
    title: "Paper: 'Constitutional AI v3' — novo método da Anthropic para alinhar modelos sem RLHF",
    summary: "Artigo técnico descreve a terceira versão do Constitutional AI, uma abordagem que reduz dependência de feedback humano usando princípios declarativos para guiar o treinamento.",
    hookSuggestion: "A Anthropic criou uma forma de treinar IA sem precisar de humanos avaliando cada resposta. Deixa eu te explicar em 60 segundos.",
    source: "arxiv",
    sourceLabel: "arXiv · cs.AI",
    url: "#",
    publishedAt: ago(400),
    fetchedAt: ago(390),
    tag: "explicar",
    tagReason: "Conteúdo técnico que precisa de tradução para o público geral. Bom para formato 'eu explico o que os experts não vão te contar'.",
    engagementSignal: "4.8K downloads em 6h",
    nicho: ["IA", "Criadores"],
  },
  {
    id: "t7",
    title: "Meta lança Llama 4 com licença comercial totalmente aberta",
    summary: "A Meta disponibilizou o Llama 4 com permissão para uso comercial irrestrito, incluindo criação de produtos e serviços sem royalties, impactando o mercado de LLMs proprietários.",
    hookSuggestion: "A Meta acabou de dar de graça o que a OpenAI cobra caro. O que isso significa pra você como criador.",
    source: "newsletter",
    sourceLabel: "TLDR AI",
    url: "#",
    publishedAt: ago(500),
    fetchedAt: ago(490),
    tag: "explicar",
    tagReason: "Notícia importante mas precisa de contexto para ressoar com não-técnicos. Formato 'o que isso significa pra você' funciona bem.",
    engagementSignal: "Trending #4 HN · 892 pts",
    nicho: ["IA", "Produtividade"],
  },
  {
    id: "t8",
    title: "Estudo: modelos de linguagem desenvolvem 'personalidade' consistente após fine-tuning prolongado",
    summary: "Pesquisadores da Stanford documentaram que LLMs submetidos a fine-tuning extensivo desenvolvem traços comportamentais estáveis que persistem mesmo após tentativas de reset via prompt.",
    hookSuggestion: "Cientistas descobriram que IAs desenvolvem personalidade própria depois de um certo ponto de treinamento. Isso é fascinante e assustador.",
    source: "arxiv",
    sourceLabel: "arXiv · cs.AI",
    url: "#",
    publishedAt: ago(560),
    fetchedAt: ago(550),
    tag: "explicar",
    tagReason: "Tema filosoficamente rico que conecta ciência com questões cotidianas sobre IA. Formato 'deixa eu te explicar' funciona.",
    engagementSignal: "6.2K shares no LinkedIn",
    nicho: ["IA"],
  },
  {
    id: "t9",
    title: "Ferramenta: Cursor AI lança modo 'Autopilot' que codifica projetos inteiros de forma autônoma",
    summary: "O Cursor lançou o Autopilot Mode, capaz de receber uma especificação em linguagem natural e desenvolver um projeto completo de software sem intervenção humana intermediária.",
    hookSuggestion: "Esse app de programação agora escreve o projeto inteiro sozinho. O desenvolvedor júnior como profissão pode estar com os dias contados.",
    source: "product-hunt",
    sourceLabel: "Product Hunt",
    url: "#",
    publishedAt: ago(620),
    fetchedAt: ago(610),
    tag: "explicar",
    tagReason: "Impacto profissional concreto. Precisa de contextualização para audiência não-técnica antes de virar hook.",
    engagementSignal: "#1 Product Hunt do dia · 3.4K votos",
    nicho: ["IA", "Carreira", "Produtividade"],
  },
  {
    id: "t10",
    title: "OpenAI eleva preço do ChatGPT Plus para $30/mês — terceiro aumento em 18 meses",
    summary: "O ChatGPT Plus passará de $20 para $30 mensais a partir de agosto de 2026, marcando o terceiro reajuste desde o lançamento do plano pago em 2023.",
    hookSuggestion: "O ChatGPT ficou mais caro de novo. Aqui estão as alternativas gratuitas que fazem a mesma coisa (ou melhor).",
    source: "x-list",
    sourceLabel: "X · AI List",
    url: "#",
    publishedAt: ago(680),
    fetchedAt: ago(670),
    tag: "explicar",
    tagReason: "Notícia que gera insatisfação. O formato 'alternativas' transforma reclamação em conteúdo útil com alto potencial de save.",
    engagementSignal: "31K retweets · 9.8K comentários raivosos",
    nicho: ["IA", "Finanças", "Produtividade"],
  },

  // ── pular ──────────────────────────────────────────────────────────────────
  {
    id: "t11",
    title: "Conferência NeurIPS 2026 anuncia local e data para edição anual",
    summary: "A NeurIPS 2026 acontecerá em Vancouver, Canadá, entre os dias 7 e 13 de dezembro, com submissões abertas a partir de maio.",
    hookSuggestion: "",
    source: "newsletter",
    sourceLabel: "TLDR AI",
    url: "#",
    publishedAt: ago(720),
    fetchedAt: ago(710),
    tag: "pular",
    tagReason: "Relevante apenas para academia. Sem impacto para audiência de criadores de conteúdo.",
    engagementSignal: "240 compartilhamentos",
    nicho: ["IA"],
  },
  {
    id: "t12",
    title: "Benchmark HELM atualizado com 3 novos conjuntos de dados de avaliação",
    summary: "O grupo CRFM de Stanford adicionou três novos conjuntos de dados ao benchmark HELM, focados em raciocínio matemático e compreensão de código.",
    hookSuggestion: "",
    source: "arxiv",
    sourceLabel: "arXiv · cs.AI",
    url: "#",
    publishedAt: ago(800),
    fetchedAt: ago(790),
    tag: "pular",
    tagReason: "Técnico demais para o público geral. Sem narrativa acessível óbvia.",
    engagementSignal: "180 downloads",
    nicho: ["IA"],
  },
  {
    id: "t13",
    title: "Hugging Face recebe aporte de $300M com valuation de $5B",
    summary: "A plataforma de modelos open-source Hugging Face fechou nova rodada de investimento liderada pelo fundo Sequoia Capital, atingindo valuation de $5 bilhões.",
    hookSuggestion: "",
    source: "hacker-news",
    sourceLabel: "Hacker News",
    url: "#",
    publishedAt: ago(860),
    fetchedAt: ago(850),
    tag: "pular",
    tagReason: "Notícia de VC sem ângulo imediato para criadores de conteúdo. Pode virar explicar em semana mais calma.",
    engagementSignal: "712 pts HN",
    nicho: ["IA"],
  },
  {
    id: "t14",
    title: "Reddit r/artificial atinge 5 milhões de membros",
    summary: "A comunidade r/artificial do Reddit cruzou a marca de 5 milhões de membros, tornando-se o maior subreddit dedicado exclusivamente à inteligência artificial.",
    hookSuggestion: "",
    source: "reddit",
    sourceLabel: "r/MachineLearning",
    url: "#",
    publishedAt: ago(920),
    fetchedAt: ago(910),
    tag: "pular",
    tagReason: "Marco numérico sem relevância direta para audiência criadora. Sem tensão ou utilidade.",
    engagementSignal: "4.2K upvotes",
    nicho: ["IA"],
  },
  {
    id: "t15",
    title: "Microsoft anuncia integração do Copilot no Excel com suporte a tabelas de 10M linhas",
    summary: "A atualização do Microsoft 365 Copilot permitirá análise de planilhas com até 10 milhões de linhas usando linguagem natural, sem necessidade de fórmulas complexas.",
    hookSuggestion: "",
    source: "linkedin-trending",
    sourceLabel: "LinkedIn · Trending",
    url: "#",
    publishedAt: ago(980),
    fetchedAt: ago(970),
    tag: "pular",
    tagReason: "Relevante para analistas de dados mas sem ângulo para criadores de conteúdo geral.",
    engagementSignal: "8.7K compartilhamentos no LinkedIn",
    nicho: ["IA", "Produtividade"],
  },
  // Additional items for variety
  {
    id: "t16",
    title: "YouTube anuncia AI Dubbing para criadores: tradução automática com voz clonada em 30 idiomas",
    summary: "O YouTube lançará AI Dubbing para canais qualificados, permitindo dublagem automática de vídeos preservando a voz original do criador em até 30 idiomas diferentes.",
    hookSuggestion: "O YouTube vai dublar seus vídeos com a sua voz em 30 idiomas automaticamente. Isso é o fim das barreiras de idioma para criadores.",
    source: "youtube-trending",
    sourceLabel: "YouTube · Trending Tech",
    url: "#",
    publishedAt: ago(280),
    fetchedAt: ago(270),
    tag: "potencial de hook",
    tagReason: "Impacto direto e imediato para criadores de conteúdo. Muda a distribuição global de conteúdo radicalmente.",
    engagementSignal: "Trending #1 YouTube Creator Insider · 54K likes",
    nicho: ["Criadores", "IA", "Marketing"],
  },
  {
    id: "t17",
    title: "Estudo MIT: pessoas que usam IA para escrever perdem 23% da velocidade de digitação em 6 meses",
    summary: "Pesquisadores do MIT acompanharam 1.400 profissionais por seis meses e constataram que o uso frequente de IA para redação reduziu significativamente a fluência e velocidade de escrita própria.",
    hookSuggestion: "Usar IA pra escrever pode estar te fazendo perder uma habilidade que você nunca vai recuperar. Os dados do MIT são preocupantes.",
    source: "reddit",
    sourceLabel: "r/MachineLearning",
    url: "#",
    publishedAt: ago(450),
    fetchedAt: ago(440),
    tag: "potencial de hook",
    tagReason: "Paradoxo: ferramenta de produtividade com efeito colateral. Gera debate forte. Dado de instituição credível amplifica.",
    engagementSignal: "22K upvotes Reddit · 9.4K comentários",
    nicho: ["IA", "Produtividade", "Carreira"],
  },
  {
    id: "t18",
    title: "LinkedIn revela: posts com 'perspectiva humana' cresceram 340% em alcance vs. posts identificados como gerados por IA",
    summary: "Dados internos do LinkedIn, divulgados pelo VP de Produto, mostram que posts onde o autor compartilha experiência pessoal têm 340% mais alcance do que conteúdo identificado pelo algoritmo como gerado por IA.",
    hookSuggestion: "O LinkedIn está punindo conteúdo de IA e premiando experiência humana. Os dados internos que eles liberaram são reveladores.",
    source: "linkedin-trending",
    sourceLabel: "LinkedIn · Trending",
    url: "#",
    publishedAt: ago(540),
    fetchedAt: ago(530),
    tag: "explicar",
    tagReason: "Dado relevante para criadores no LinkedIn, mas requer contextualização sobre o que significa 'perspectiva humana' na prática.",
    engagementSignal: "14.2K compartilhamentos no LinkedIn",
    nicho: ["Criadores", "Marketing", "IA"],
  },
  {
    id: "t19",
    title: "Novo modelo de precificação de tokens da Anthropic beneficia contextos longos",
    summary: "A Anthropic anunciou mudança na estrutura de preços da API, reduzindo o custo por token de saída em 40% para chamadas com contexto acima de 32K tokens.",
    hookSuggestion: "",
    source: "blog-anthropic",
    sourceLabel: "Anthropic Blog",
    url: "#",
    publishedAt: ago(1100),
    fetchedAt: ago(1090),
    tag: "pular",
    tagReason: "Relevante apenas para desenvolvedores que pagam pela API. Sem gancho para criadores de conteúdo.",
    engagementSignal: "1.8K retweets técnicos",
    nicho: ["IA"],
  },
  {
    id: "t20",
    title: "TikTok testa 'IA Creator Mode': roteiros, legendas e thumbnails gerados em 1 clique",
    summary: "O TikTok está testando com criadores selecionados uma suite de IA que gera roteiro, legenda, hashtags e opções de thumbnail automaticamente a partir de um tema inserido pelo criador.",
    hookSuggestion: "O TikTok está testando uma função que escreve seu roteiro, sua legenda e escolhe sua thumbnail. Isso vai nivelar ou destruir criadores pequenos?",
    source: "product-hunt",
    sourceLabel: "Product Hunt",
    url: "#",
    publishedAt: ago(200),
    fetchedAt: ago(195),
    tag: "potencial de hook",
    tagReason: "Impacto direto na profissão. Abre debate sobre 'IA vai me substituir?' — tema com engajamento garantido no nicho de criadores.",
    engagementSignal: "#2 Product Hunt · 2.8K votos",
    nicho: ["Criadores", "IA", "Marketing"],
  },
];

// ── Computed ─────────────────────────────────────────────────────────────────

export const TAG_STYLE: Record<HookPotential, { bg: string; text: string; border: string }> = {
  "potencial de hook": { bg: "#c96a3a22", text: "#c96a3a", border: "#c96a3a44" },
  "explicar":          { bg: "#5b9de022", text: "#5b9de0", border: "#5b9de044" },
  "pular":             { bg: "#8a8a8215", text: "#8a8a82", border: "#8a8a8230" },
};

export function fmtAgo(iso: string): string {
  const diffMs = new Date("2026-06-30T11:30:00Z").getTime() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 60) return `${mins}min atrás`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h atrás`;
  return `${Math.floor(hours / 24)}d atrás`;
}

export const topHooks = items
  .filter((i) => i.tag === "potencial de hook")
  .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
