import type { Platform } from "@/lib/data/agendador";
import { platformMeta } from "@/lib/data/agendador";

export type { Platform };
export { platformMeta };

export type PostStatus = "agendado" | "publicado" | "rascunho" | "falhou";

export interface CalendarPost {
  id: string;
  scheduledAt: string; // ISO
  platforms: Platform[];
  hook: string;
  angle: string;
  cta: string;
  caption: string;
  script: string; // full script
  status: PostStatus;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function iso(year: number, month: number, day: number, hour: number, min = 0) {
  return new Date(year, month - 1, day, hour, min).toISOString();
}

// ── Mock posts for July 2026 (current month) + surrounding ───────────────────

export const posts: CalendarPost[] = [
  // ── June (spillover) ──────────────────────────────────────────────────────
  {
    id: "cal-jun-1",
    scheduledAt: iso(2026, 6, 28, 19, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Fiz uma mudança pequena na estrutura dos meus reels e o alcance dobrou em 3 semanas.",
    angle: "Dados e prova social",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption: "Fiz uma mudança pequena na estrutura dos meus reels e o alcance dobrou em 3 semanas.\n\n📈 Não foi frequência, não foi horário, não foi hashtag. Foi a forma como estruturo os primeiros 5 segundos.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    script: "HOOK (0–3s)\n\"Fiz uma mudança pequena na estrutura dos meus reels e o alcance dobrou em 3 semanas.\"\n\nDESENVOLVIMENTO (3–30s)\n— Mostrar print do analytics antes e depois\n— Explicar: o algoritmo mede 'scroll-stop rate' nos primeiros 5s\n— A mudança: começar com movimento em vez de texto estático\n— Dados: 2.8M views vs. média anterior de 1.1M\n\nCTA (30–35s)\n\"Se você quer o passo a passo completo, segue aqui que vou postar amanhã.\"\n\nNOTAS DE GRAVAÇÃO\n- Fundo neutro, câmera estabilizada\n- Corte rápido no segundo 2 para prender atenção\n- Texto na tela: 'ALCANCE 2× SEM POSTAR MAIS ✅'",
    status: "publicado",
  },
  {
    id: "cal-jun-2",
    scheduledAt: iso(2026, 6, 30, 12, 0),
    platforms: ["instagram"],
    hook: "Existe um tipo de post que vende mais do que qualquer anúncio. E não parece propaganda.",
    angle: "Comparação antes vs depois",
    cta: "Clica no link da bio para saber mais.",
    caption: "Existe um tipo de post que vende mais do que qualquer anúncio. E não parece propaganda.\n\n📊 Eu chamo de conteúdo de transformação — você mostra um antes e depois real, sem roteiro forçado.\n\n🔗 Clica no link da bio para saber mais.",
    script: "HOOK (0–3s)\n\"Existe um tipo de post que vende mais do que qualquer anúncio. E não parece propaganda.\"\n\nDESENVOLVIMENTO (3–45s)\n— Definir: conteúdo de transformação\n— Exemplo 1: antes (dificuldade real) vs depois (resultado concreto)\n— Exemplo 2: mostrar números de conversão (3× mais vendas vs. post de produto)\n— Por que funciona: audiência conclui sozinha sem sentir que está sendo vendida\n\nCTA (45–50s)\n\"Link na bio tem o template que uso para criar esse tipo de conteúdo.\"\n\nNOTAS DE GRAVAÇÃO\n- Usar câmera de mão para look mais autêntico\n- Incluir print real de conversão (pode borrar valores se preferir)\n- Texto na tela: 'VENDE SEM PARECER QUE ESTÁ VENDENDO 🤫'",
    status: "publicado",
  },

  // ── July 2026 ─────────────────────────────────────────────────────────────
  {
    id: "cal-1",
    scheduledAt: iso(2026, 7, 1, 19, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.",
    angle: "Opinião polêmica",
    cta: "Salva esse vídeo pra não perder.",
    caption: "Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.\n\n🔥 Quando você dá tudo de graça, a pessoa não tem incentivo pra comprar. O segredo não é dar menos — é dar diferente.\n\n📌 Salva esse vídeo pra não perder.",
    script: "HOOK (0–3s)\n\"Para de entregar seu melhor conteúdo de graça. Você está treinando sua audiência errado.\"\n\nDESENVOLVIMENTO (3–40s)\n— Abrir com provocação: 'Sei que você discorda. Me ouça por 30 segundos.'\n— Explicar a lógica de gratuidade vs valor percebido\n— Diferença entre conteúdo de atração (gratuito, volumoso) e conteúdo de profundidade (produto)\n— Exemplo: criador que parou de dar templates e dobrou as vendas\n\nCTA (40–45s)\n\"Salva esse vídeo — quando você topar com esse problema, vai querer rever.\"\n\nNOTAS DE GRAVAÇÃO\n- Tom firme mas não agressivo\n- Texto na tela: 'VOCÊ ESTÁ SABOTANDO SEU NEGÓCIO 🚨'\n- Corte no segundo 2 para reaction shot",
    status: "agendado",
  },
  {
    id: "cal-2",
    scheduledAt: iso(2026, 7, 3, 19, 0),
    platforms: ["instagram", "linkedin"],
    hook: "Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.",
    angle: "Revelação de bastidores",
    cta: "Comenta aqui se você já passou por isso.",
    caption: "Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.\n\n🔍 É a estratégia. Vou te mostrar o framework que usei para triplicar meu faturamento reduzindo pela metade os posts.\n\n💬 Comenta aqui se você já passou por isso.",
    script: "HOOK (0–3s)\n\"Se você ainda posta todo dia sem ver resultado, o problema não é a frequência.\"\n\nDESENVOLVIMENTO (3–50s)\n— Mostrar: minha antiga grade de publicação (diária, exaustiva)\n— Revelar: analytics mostrando queda de desempenho médio por excesso de volume\n— Framework dos 3 tipos de post: autoridade / prova / conversão\n— Proporção ideal: 2 autoridade : 2 prova : 1 conversão por semana\n\nCTA (50–55s)\n\"Comenta 'FRAMEWORK' que eu te mando o template completo.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar tela do computador com analytics real\n- Texto na tela: 'O PROBLEMA não é frequência'\n- Ritmo mais lento, explicativo",
    status: "agendado",
  },
  {
    id: "cal-3",
    scheduledAt: iso(2026, 7, 5, 9, 0),
    platforms: ["instagram"],
    hook: "7 coisas que eu queria saber antes de criar meu primeiro produto digital.",
    angle: "Lista numerada",
    cta: "Salva esse vídeo pra não perder.",
    caption: "7 coisas que eu queria saber antes de criar meu primeiro produto digital.\n\n✅ Aprendi da forma mais difícil — gastando tempo e dinheiro à toa. Vai pelo atalho.\n\n📌 Salva esse vídeo pra não perder.",
    script: "HOOK (0–3s)\n\"7 coisas que eu queria saber antes de criar meu primeiro produto digital.\"\n\nDESENVOLVIMENTO (3–60s)\n1. Valide antes de criar — venda a ideia primeiro\n2. O preço diz o valor: não comece barato\n3. Suporte é produto — calcule o tempo\n4. Página de vendas converte mais que stories\n5. Email lista &gt; seguidores de rede social\n6. Afiliados aceleram mais que ads no início\n7. Versão 1.0 feia e publicada &gt; versão perfeita não publicada\n\nCTA (60–65s)\n\"Salva e marca alguém que está prestes a criar o primeiro produto.\"\n\nNOTAS DE GRAVAÇÃO\n- Formato lista, texto na tela para cada item\n- Ritmo rápido: ~8s por item\n- Música animada no fundo",
    status: "agendado",
  },
  {
    id: "cal-4",
    scheduledAt: iso(2026, 7, 7, 19, 0),
    platforms: ["instagram", "tiktok", "youtube"],
    hook: "Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3× maior.",
    angle: "Dados e prova social",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption: "Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3× maior.\n\n📈 Não é trend de música, não é transição elaborada. É algo muito mais simples que todo mundo ignora.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    script: "HOOK (0–3s)\n\"Testei 40 formatos de reel esse ano. Um formato específico está com alcance 3× maior.\"\n\nDESENVOLVIMENTO (3–45s)\n— Contexto: 40 formatos testados de jan a jun 2026\n— O perdedor: vídeos com muita produção (edição pesada, música trending)\n— O vencedor: câmera fixa, fundo clean, fala direta pra câmera, subtítulos grandes\n— Por que funciona: o algoritmo mede retenção total, não aparência\n— Mostrar: comparativo de analytics dos dois tipos\n\nCTA (45–50s)\n\"Segue aqui que toda semana eu publico um teste novo com os dados reais.\"\n\nNOTAS DE GRAVAÇÃO\n- Irônico: gravar esse vídeo exatamente no formato simples que está descrevendo\n- Texto na tela: 'O FORMATO que o IG ama em 2026 📱'\n- Sem trilha sonora — fala direta",
    status: "agendado",
  },
  {
    id: "cal-5",
    scheduledAt: iso(2026, 7, 9, 12, 0),
    platforms: ["instagram"],
    hook: "Erro que faz você perder seguidores todo dia (e você nem sabe que está cometendo).",
    angle: "Medo / urgência implícita",
    cta: "Manda esse vídeo pra alguém que precisa ver.",
    caption: "Erro que faz você perder seguidores todo dia (e você nem sabe que está cometendo).\n\n⚠️ Não é qualidade do vídeo, não é frequência. É o seu perfil fazendo o trabalho sujo por você — do jeito errado.\n\n↗️ Manda esse vídeo pra alguém que precisa ver.",
    script: "HOOK (0–3s)\n\"Erro que faz você perder seguidores todo dia. E você nem sabe que está cometendo.\"\n\nDESENVOLVIMENTO (3–40s)\n— O erro: bio que não responde as 3 perguntas em 3 segundos\n  1. Quem você é? 2. Para quem? 3. Qual o benefício?\n— Dado: perfil com bio otimizada converte 2.4× mais visitantes em seguidores\n— Mostrar exemplo de bio ruim vs. bio boa\n— Aplicar ao vivo: reescrever uma bio em tempo real\n\nCTA (40–45s)\n\"Manda pra um criador amigo que tem esse problema. Você pode estar salvando o negócio dele.\"\n\nNOTAS DE GRAVAÇÃO\n- Abrir mostrando um perfil real com bio problemática (anônimo)\n- Tom de diagnóstico, não de crítica\n- Texto na tela: 'SEU PERFIL ESTÁ AFASTANDO SEGUIDORES ❌'",
    status: "agendado",
  },
  {
    id: "cal-6",
    scheduledAt: iso(2026, 7, 11, 19, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.",
    angle: "Storytelling pessoal",
    cta: "Manda esse vídeo pra alguém que precisa ver.",
    caption: "Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.\n\n🎯 Eu estava trocando tempo por dinheiro numa proporção fixa. O que muda o jogo é alavancagem.\n\n↗️ Manda esse vídeo pra alguém que precisa ver.",
    script: "HOOK (0–3s)\n\"Trabalhei 80 horas por semana por 2 anos. Não fiquei rico. Aqui está o erro.\"\n\nDESENVOLVIMENTO (3–55s)\n— Storytelling: eu em 2022, planilha de horas, exaustão\n— O insight: renda linear vs. renda alavancada\n— As 4 formas de alavancagem (Naval Ravikant adaptado ao contexto BR):\n  1. Capital (dinheiro trabalhando)\n  2. Audiência (conteúdo trabalhando)\n  3. Produto digital (escala sem custo marginal)\n  4. Equipe (tempo de outros)\n— O que mudou quando comecei a pensar em alavancagem\n\nCTA (55–60s)\n\"Manda pra alguém que ainda acha que esforço = dinheiro. Essa pessoa precisa ver isso.\"\n\nNOTAS DE GRAVAÇÃO\n- Tom de reflexão, não de 'guru'\n- Foto ou vídeo antigo para contextualizar a época\n- Texto na tela: 'TRABALHAR MAIS ≠ GANHAR MAIS 💀'",
    status: "agendado",
  },
  {
    id: "cal-7",
    scheduledAt: iso(2026, 7, 14, 9, 0),
    platforms: ["instagram", "linkedin"],
    hook: "Como escrever um título que para o scroll em 0,3 segundos.",
    angle: "Tutorial passo a passo",
    cta: "Salva esse vídeo pra não perder.",
    caption: "Como escrever um título que para o scroll em 0,3 segundos.\n\n📝 Depois de analisar 500 títulos virais, encontrei 4 estruturas que aparecem em 80% deles. Vou te mostrar todas.\n\n📌 Salva esse vídeo pra não perder.",
    script: "HOOK (0–3s)\n\"Como escrever um título que para o scroll em 0,3 segundos.\"\n\nDESENVOLVIMENTO (3–60s)\nAs 4 estruturas:\n1. CONTRASTE: '[grupo A] faz X. [grupo B] faz Y.' → cria tensão\n2. IDENTIDADE: 'Se você [situação específica], isso é pra você'\n3. CURIOSIDADE: 'Ninguém te conta [coisa óbvia que você nunca pensou]'\n4. NÚMERO: '[N] [coisas/erros/segredos] que [resultado concreto]'\n\n— Para cada estrutura: 1 exemplo ruim → 1 exemplo reescrito\n— Mostrar o 'antes' riscado e o 'depois' sublinhado\n\nCTA (60–65s)\n\"Salva esse vídeo. Da próxima vez que for postar, abre aqui e usa uma das 4 estruturas.\"\n\nNOTAS DE GRAVAÇÃO\n- Formato educativo, texto grande na tela\n- Ritmo didático — pausar em cada estrutura\n- Texto na tela: 'TÍTULO que para o scroll ⚡'",
    status: "agendado",
  },
  {
    id: "cal-8",
    scheduledAt: iso(2026, 7, 16, 19, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Cansei de ser produtivo. Fiz isso em vez disso — e minha vida melhorou.",
    angle: "Erro que cometi + lição",
    cta: "Comenta aqui se você já passou por isso.",
    caption: "Cansei de ser produtivo. Fiz isso em vez disso — e minha vida melhorou.\n\n⚠️ Fui obcecado com produtividade por 4 anos. Destruiu minha saúde mental. O que mudou?\n\n💬 Comenta aqui se você já passou por isso.",
    script: "HOOK (0–3s)\n\"Cansei de ser produtivo. Fiz isso em vez disso — e minha vida melhorou.\"\n\nDESENVOLVIMENTO (3–50s)\n— A obsessão: apps, métodos, rituais matinais — 4 anos seguidos\n— O colapso: burnout aos 28 anos, primeira vez que chorei sem motivo aparente\n— O insight: estava sendo eficiente em coisas que não importavam\n— A virada: troquei 'fazer mais' por 'fazer as coisas certas'\n— O que isso significa na prática: lista de 3 tarefas por dia, sem app, sem ritual\n\nCTA (50–55s)\n\"Comenta aqui se você já se sentiu assim. Quero saber se não sou o único.\"\n\nNOTAS DE GRAVAÇÃO\n- Tom vulnerável e honesto\n- Luz mais suave, ambiente mais íntimo\n- Texto na tela: 'EU LARGUEI A PRODUTIVIDADE (e não me arrependo)'",
    status: "agendado",
  },
  {
    id: "cal-9",
    scheduledAt: iso(2026, 7, 18, 19, 0),
    platforms: ["instagram", "tiktok", "youtube"],
    hook: "O Instagram acabou de mudar o algoritmo. Aqui está o que vi nos dados de 47 contas.",
    angle: "Dados e prova social",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption: "O Instagram acabou de mudar o algoritmo. Aqui está o que vi nos dados de 47 contas.\n\n📈 Queda média de 23% no alcance de posts publicados de seg a qua. O que subiu? Conteúdo com retenção alta nos primeiros 5s.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    script: "HOOK (0–3s)\n\"O Instagram acabou de mudar o algoritmo. Aqui está o que vi nos dados de 47 contas.\"\n\nDESENVOLVIMENTO (3–55s)\n— Contexto: análise de 47 contas entre 10K e 2M de seguidores\n— Dado 1: queda de 23% no alcance orgânico de posts de segunda a quarta\n— Dado 2: reels com retenção &gt; 65% nos primeiros 5s tiveram alcance +40%\n— Dado 3: contas que postaram quinta a sábado não foram afetadas\n— Hipótese: IG está priorizando horários de pico de consumo\n— Recomendação: migrar postagens para qui–sáb às 18h–20h por 30 dias e medir\n\nCTA (55–60s)\n\"Segue aqui — na semana que vem trago o update com mais dados.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar prints do analytics de contas reais (anônimas)\n- Tom de jornalista, não de guru\n- Texto na tela: 'MUDANÇA NO ALGORITMO ⚠️ (julho 2026)'",
    status: "agendado",
  },
  {
    id: "cal-10",
    scheduledAt: iso(2026, 7, 21, 9, 0),
    platforms: ["instagram"],
    hook: "Ninguém me avisou que um reel viral pode afundar seu perfil. Aprendi da pior forma.",
    angle: "Storytelling pessoal",
    cta: "Salva esse vídeo pra não perder.",
    caption: "Ninguém me avisou que um reel viral pode afundar seu perfil. Aprendi da pior forma.\n\n🎯 Ganhei 12K seguidores em 3 dias. Parecia ótimo. Mas meu próximo post teve 60% menos alcance.\n\n📌 Salva esse vídeo pra não perder.",
    script: "HOOK (0–3s)\n\"Ninguém me avisou que um reel viral pode afundar seu perfil. Aprendi da pior forma.\"\n\nDESENVOLVIMENTO (3–50s)\n— A história: primeiro reel de 1M de views\n— O efeito colateral: 12K seguidores não qualificados em 3 dias\n— O problema: nova audiência com interesse diferente do nicho → engajamento despenca\n— O resultado: alcance dos próximos 5 posts caiu 60%\n— Como se proteger: antes de um post viral potencial, reforçar a identidade do perfil\n— Estratégia pós-viral: 3 posts de nicho imediatamente após o viral para 'retreinar' o algoritmo\n\nCTA (50–55s)\n\"Salva esse vídeo pra lembrar quando seu viral chegar. Você vai precisar disso.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar print real do analytics com a queda\n- Tom de 'quero te poupar dessa dor'\n- Texto na tela: '1 MILHÃO DE VIEWS → o que ninguém conta depois'",
    status: "rascunho",
  },
  {
    id: "cal-11",
    scheduledAt: iso(2026, 7, 23, 19, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Acorda às 5h não é o segredo das pessoas bem-sucedidas. Eu testei por 6 meses.",
    angle: "Erro que cometi + lição",
    cta: "Comenta aqui se você já passou por isso.",
    caption: "Acorda às 5h não é o segredo das pessoas bem-sucedidas. Eu testei por 6 meses.\n\n⚠️ Minha produtividade não melhorou. Descobri o motivo — e ele vai te surpreender.\n\n💬 Comenta aqui se você já passou por isso.",
    script: "HOOK (0–3s)\n\"Acorda às 5h não é o segredo das pessoas bem-sucedidas. Eu testei por 6 meses.\"\n\nDESENVOLVIMENTO (3–45s)\n— O experimento: acordei às 5h por 180 dias seguidos\n— O que eu esperava: mais foco, mais produção, mais dinheiro\n— O que aconteceu: 2 meses de ganho, 4 meses de queda de performance\n— Por que: o problema não era o horário, era o que eu fazia com o tempo\n— Acordar cedo pra rolar feed = acordar cedo pra nada\n— O insight: o que importa é ter tarefas definidas ANTES de dormir\n\nCTA (45–50s)\n\"Comenta aqui: você acorda cedo e funciona, ou também descobriu que não funciona pra você?\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar foto do alarme às 4:58 (banco de imagens)\n- Tom de experimento pessoal honesto\n- Texto na tela: 'A MENTIRA DO CLUBE DAS 5 DA MANHÃ ⏰'",
    status: "agendado",
  },
  {
    id: "cal-12",
    scheduledAt: iso(2026, 7, 25, 19, 0),
    platforms: ["instagram", "linkedin"],
    hook: "Criadores que ganham 6 dígitos fazem essas 4 coisas diferentes de você.",
    angle: "Comparação antes vs depois",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption: "Criadores que ganham 6 dígitos fazem essas 4 coisas diferentes de você.\n\n📊 Analisei a operação de 30 criadores que chegaram a 6 dígitos em menos de 2 anos. Todas as 4 coisas são contraintuitivas.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    script: "HOOK (0–3s)\n\"Criadores que ganham 6 dígitos fazem essas 4 coisas diferentes de você.\"\n\nDESENVOLVIMENTO (3–60s)\n4 diferenças:\n1. Eles não criam — eles distribuem. O conteúdo é secundário, a distribuição é primária.\n2. Eles monetizam 1 produto bem, não 10 mediocres.\n3. Eles têm email list ativa — não dependem de algoritmo.\n4. Eles terceirizam edição e design antes de terceirizar estratégia.\n\nPara cada item: exemplo de criador 4 dígitos vs. 6 dígitos\n\nCTA (60–65s)\n\"Segue aqui. Amanhã posto o checklist completo de operação de criador 6 dígitos.\"\n\nNOTAS DE GRAVAÇÃO\n- Formato lista com texto na tela\n- Usar linguagem 'pesquisa' para dar credibilidade\n- Texto na tela: '6 DÍGITOS vs 4 DÍGITOS: a diferença real'",
    status: "agendado",
  },
  {
    id: "cal-13",
    scheduledAt: iso(2026, 7, 28, 9, 0),
    platforms: ["instagram", "tiktok"],
    hook: "Deletei 200 posts e meu perfil cresceu 40% no mês seguinte.",
    angle: "Revelação de bastidores",
    cta: "Comenta aqui se você já passou por isso.",
    caption: "Deletei 200 posts e meu perfil cresceu 40% no mês seguinte.\n\n🔍 Parece loucura, mas tem lógica. O algoritmo avalia sua média — posts ruins puxam os bons pra baixo.\n\n💬 Comenta aqui se você já passou por isso.",
    script: "HOOK (0–3s)\n\"Deletei 200 posts e meu perfil cresceu 40% no mês seguinte.\"\n\nDESENVOLVIMENTO (3–50s)\n— O contexto: perfil com 3 anos de posts misturados, nichos variados\n— A hipótese: o algoritmo calcula engajamento médio histórico\n— Posts antigos com baixo desempenho puxam a média pra baixo\n— O experimento: deletar tudo com menos de X% de engajamento\n— Resultado: em 30 dias, alcance subiu 40%, seguidores +800\n— Como fazer: exportar dados do IG, calcular média de engajamento, deletar os piores 30%\n\nCTA (50–55s)\n\"Comenta 'LIMPAR' que eu te mando o passo a passo de como fazer isso com segurança.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar o processo de deletar ao vivo (ou tela gravada)\n- Tom de experimento — não de regra universal\n- Texto na tela: 'DELETEI 200 POSTS 🗑 (e não me arrependo)'",
    status: "agendado",
  },
  {
    id: "cal-14",
    scheduledAt: iso(2026, 7, 30, 19, 0),
    platforms: ["instagram", "tiktok", "youtube", "linkedin"],
    hook: "Meu sistema de criação de conteúdo para 5 plataformas ao mesmo tempo em 6 horas por semana.",
    angle: "Tutorial passo a passo",
    cta: "Salva esse vídeo pra não perder.",
    caption: "Meu sistema de criação de conteúdo para 5 plataformas ao mesmo tempo em 6 horas por semana.\n\n📝 Começo pelo formato mais longo e um fluxo automático deriva os outros. Vou te mostrar o sistema completo.\n\n📌 Salva esse vídeo pra não perder.",
    script: "HOOK (0–3s)\n\"Meu sistema de criação de conteúdo para 5 plataformas ao mesmo tempo em 6 horas por semana.\"\n\nDESENVOLVIMENTO (3–70s)\nO sistema 'Hub and Spoke':\n1. HUB (2h): gravar 1 vídeo longo de 10–15min (YouTube ou podcast)\n2. SPOKE 1 (30min): extrair 5 clips de 30–60s para Reels/TikTok/Shorts\n3. SPOKE 2 (1h): transcrever + condensar em carrossel de 10 slides para LinkedIn\n4. SPOKE 3 (30min): retirar quotes para stories + threads\n5. SPOKE 4 (1h): compilar numa newsletter semanal\n\nFerramenta chave: Descript para transcrição automática + Repurpose.io para distribuição\n\nCTA (70–75s)\n\"Salva esse vídeo — quando você for implementar, vai precisar de cada detalhe.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar o diagrama hub and spoke visualmente\n- Gravar tela mostrando as ferramentas\n- Texto na tela: '5 PLATAFORMAS × 6 HORAS/SEMANA 🗂'",
    status: "rascunho",
  },

  // ── August (spillover) ────────────────────────────────────────────────────
  {
    id: "cal-aug-1",
    scheduledAt: iso(2026, 8, 3, 19, 0),
    platforms: ["instagram"],
    hook: "Por que copywriters ganham mais do que designers — e o que fazer com isso.",
    angle: "Dados e prova social",
    cta: "Segue para mais conteúdo assim todo dia.",
    caption: "Por que copywriters ganham mais do que designers — e o que fazer com isso.\n\n📈 Copy converte. Design impressiona. Testei páginas de vendas por 6 meses. Copy forte venceu em 83% dos casos.\n\n🔔 Segue para mais conteúdo assim todo dia.",
    script: "HOOK (0–3s)\n\"Por que copywriters ganham mais do que designers — e o que fazer com isso.\"\n\nDESENVOLVIMENTO (3–50s)\n— O experimento: 6 meses, 12 páginas de vendas testadas A/B\n— Grupo A: design premium + copy mediano\n— Grupo B: design simples + copy forte\n— Resultado: grupo B venceu em 83% dos testes com margem média de +40% em conversão\n— Por que: o cérebro decide pela lógica+emoção (copy), não pela estética\n— O que fazer: se tiver que escolher, invista em copy primeiro\n\nCTA (50–55s)\n\"Segue aqui. Na próxima semana posto os 5 elementos de copy que uso em todas as minhas páginas.\"\n\nNOTAS DE GRAVAÇÃO\n- Mostrar prints das páginas A e B (sem identificar o cliente)\n- Tom de experimento científico\n- Texto na tela: 'COPY > DESIGN? Os números não mentem 📊'",
    status: "rascunho",
  },
];

// ── helpers ──────────────────────────────────────────────────────────────────

export function getPostsForMonth(year: number, month: number): CalendarPost[] {
  return posts.filter((p) => {
    const d = new Date(p.scheduledAt);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}

export function getPostsByDay(year: number, month: number): Map<number, CalendarPost[]> {
  const map = new Map<number, CalendarPost[]>();
  posts.forEach((p) => {
    const d = new Date(p.scheduledAt);
    if (d.getFullYear() === year && d.getMonth() + 1 === month) {
      const day = d.getDate();
      if (!map.has(day)) map.set(day, []);
      map.get(day)!.push(p);
    }
  });
  return map;
}

export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function fmtFullDate(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
  });
}

export const STATUS_STYLE: Record<PostStatus, { bg: string; dot: string }> = {
  agendado:  { bg: "#c96a3a33", dot: "#c96a3a" },
  publicado: { bg: "#4ade8033", dot: "#4ade80" },
  rascunho:  { bg: "#8a8a8233", dot: "#8a8a82" },
  falhou:    { bg: "#f8717133", dot: "#f87171" },
};
