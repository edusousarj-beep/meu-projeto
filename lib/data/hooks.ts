export type HookType =
  | "Contraste"
  | "Lista"
  | "Imperativo"
  | "Curiosidade"
  | "Número"
  | "Identidade"
  | "Medo";

export type Nicho =
  | "Marketing"
  | "Finanças"
  | "Saúde"
  | "Carreira"
  | "Relacionamento"
  | "Produtividade"
  | "Criadores";

export interface Hook {
  id: string;
  hook: string;
  template: string;
  creator: string;
  handle: string;
  views: number;
  saves: number;
  type: HookType;
  nicho: Nicho;
  savedAt: string;
}

export const hooks: Hook[] = [
  {
    id: "1",
    hook: "Eu fiz R$50 mil em 30 dias sem gastar um centavo em anúncios",
    template: "Eu fiz [RESULTADO] em [TEMPO] sem [OBJEÇÃO COMUM]",
    creator: "Pedro Sobral",
    handle: "@pedrosobral",
    views: 4200000,
    saves: 38000,
    type: "Contraste",
    nicho: "Marketing",
    savedAt: "2026-06-28",
  },
  {
    id: "2",
    hook: "Para de postar todo dia. Faz isso em vez disso",
    template: "Para de fazer [HÁBITO COMUM]. Faz [ALTERNATIVA] em vez disso",
    creator: "Camila Renaux",
    handle: "@camilarenaux",
    views: 3800000,
    saves: 29000,
    type: "Imperativo",
    nicho: "Criadores",
    savedAt: "2026-06-25",
  },
  {
    id: "3",
    hook: "7 coisas que eu queria saber antes de criar minha empresa",
    template: "[NÚMERO] coisas que eu queria saber antes de [MARCO]",
    creator: "Thiago Nigro",
    handle: "@thiago.nigro",
    views: 6100000,
    saves: 54000,
    type: "Número",
    nicho: "Finanças",
    savedAt: "2026-06-22",
  },
  {
    id: "4",
    hook: "O Instagram acabou de matar o alcance orgânico. O que fazer agora",
    template: "[PLATAFORMA/EMPRESA] acabou de matar [COISA IMPORTANTE]. O que fazer agora",
    creator: "Aline Midlej",
    handle: "@alinemidlej",
    views: 5300000,
    saves: 47000,
    type: "Curiosidade",
    nicho: "Marketing",
    savedAt: "2026-06-20",
  },
  {
    id: "5",
    hook: "Se você ganha menos de R$10k por mês assiste isso até o fim",
    template: "Se você [SITUAÇÃO DO PÚBLICO] assiste isso até o fim",
    creator: "Primo Rico",
    handle: "@primorico",
    views: 8900000,
    saves: 72000,
    type: "Identidade",
    nicho: "Finanças",
    savedAt: "2026-06-18",
  },
  {
    id: "6",
    hook: "3 erros que fazem seu médico te ignorar na consulta",
    template: "[NÚMERO] erros que fazem [AUTORIDADE] te [CONSEQUÊNCIA NEGATIVA]",
    creator: "Dr. Henrique Vianna",
    handle: "@drhenriquevianna",
    views: 2900000,
    saves: 31000,
    type: "Medo",
    nicho: "Saúde",
    savedAt: "2026-06-15",
  },
  {
    id: "7",
    hook: "A maioria das pessoas vai perder o emprego em 2 anos. Você não precisa ser uma delas",
    template: "A maioria das pessoas vai [PERDA/RISCO]. Você não precisa ser uma delas",
    creator: "Nathalia Arcuri",
    handle: "@nathaliafaz1milhao",
    views: 7200000,
    saves: 61000,
    type: "Medo",
    nicho: "Carreira",
    savedAt: "2026-06-12",
  },
  {
    id: "8",
    hook: "Produtivos fazem isso de manhã. Pessoas mediocres fazem aquilo",
    template: "[GRUPO ASPIRACIONAL] fazem [HÁBITO]. [GRUPO OPOSTO] fazem [ANTI-HÁBITO]",
    creator: "Lucas Inutilismo",
    handle: "@lucasinutilismo",
    views: 5600000,
    saves: 44000,
    type: "Contraste",
    nicho: "Produtividade",
    savedAt: "2026-06-10",
  },
  {
    id: "9",
    hook: "Eu terminei um relacionamento de 5 anos por causa de dinheiro. Aprende com meu erro",
    template: "Eu [DECISÃO DIFÍCIL] por causa de [CAUSA]. Aprende com meu erro",
    creator: "Me Poupe!",
    handle: "@mepoupe",
    views: 4400000,
    saves: 39000,
    type: "Curiosidade",
    nicho: "Relacionamento",
    savedAt: "2026-06-08",
  },
  {
    id: "10",
    hook: "10 aplicativos que vão acabar com sua procrastinação hoje",
    template: "[NÚMERO] [FERRAMENTAS/RECURSOS] que vão acabar com [PROBLEMA] hoje",
    creator: "Ali Abdaal BR",
    handle: "@aliabdaalbr",
    views: 3100000,
    saves: 27000,
    type: "Lista",
    nicho: "Produtividade",
    savedAt: "2026-06-05",
  },
  {
    id: "11",
    hook: "Ninguém te conta o que acontece com seu corpo depois dos 30",
    template: "Ninguém te conta o que acontece com [SUJEITO] depois de [MARCO]",
    creator: "Drauzio Varella",
    handle: "@drauziochannel",
    views: 9800000,
    saves: 88000,
    type: "Curiosidade",
    nicho: "Saúde",
    savedAt: "2026-06-02",
  },
  {
    id: "12",
    hook: "Criadores que ganham 6 dígitos fazem essas 4 coisas diferentes de você",
    template: "[GRUPO ASPIRACIONAL] que [RESULTADO] fazem essas [NÚMERO] coisas diferentes de você",
    creator: "Henrique Carvalho",
    handle: "@henriquecarvalho",
    views: 2700000,
    saves: 25000,
    type: "Contraste",
    nicho: "Criadores",
    savedAt: "2026-05-28",
  },
  {
    id: "13",
    hook: "Por que eu demiti meu chefe com uma mensagem de texto",
    template: "Por que eu [AÇÃO OUSADA] com [MEIO INUSITADO]",
    creator: "Fábio Moraes",
    handle: "@fabiomoraes",
    views: 3600000,
    saves: 33000,
    type: "Curiosidade",
    nicho: "Carreira",
    savedAt: "2026-05-25",
  },
  {
    id: "14",
    hook: "5 sinais de que seu parceiro está sabotando suas finanças",
    template: "[NÚMERO] sinais de que [PESSOA PRÓXIMA] está [SABOTAGEM]",
    creator: "Maíra Lins",
    handle: "@mairalins",
    views: 4100000,
    saves: 36000,
    type: "Medo",
    nicho: "Relacionamento",
    savedAt: "2026-05-20",
  },
  {
    id: "15",
    hook: "Fiz 1000 stories em 1 ano. Aprendi isso sobre o algoritmo",
    template: "Fiz [QUANTIDADE] de [AÇÃO] em [TEMPO]. Aprendi isso sobre [TEMA]",
    creator: "Talita Maia",
    handle: "@talitamaia",
    views: 1900000,
    saves: 21000,
    type: "Número",
    nicho: "Criadores",
    savedAt: "2026-05-15",
  },
];

export const hookTypes: HookType[] = [
  "Contraste",
  "Lista",
  "Imperativo",
  "Curiosidade",
  "Número",
  "Identidade",
  "Medo",
];

export const nichos: Nicho[] = [
  "Marketing",
  "Finanças",
  "Saúde",
  "Carreira",
  "Relacionamento",
  "Produtividade",
  "Criadores",
];

export function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(n);
}
