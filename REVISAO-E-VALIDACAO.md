# Saulo Pessoa: site completo V8.3

Atualização de introdução: a apresentação é executada em todo carregamento ou recarregamento da página, sem bloqueio por sessionStorage. Pular, Escape, movimento reduzido e economia de dados continuam respeitados.

Atualização das etapas: Próximo passo seleciona a próxima etapa e expande seu detalhe com animação de 380 ms. A expansão é reproduzida mesmo quando a etapa já estava aberta. Voltar e seleção direta dos ícones preservam comportamento. Reduced motion abre imediatamente. Teste no Ego confirmou duas recargas consecutivas com intro visível mesmo com a flag antiga, expansão de cerca de 30 para 130 px e reabertura animada ao revisitar a etapa.

## Refinamento V8.3

| Antes | Depois | Motivo |
| --- | --- | --- |
| Intro devolvia foco para a logo | Foco retorna ao conteúdo da hero | Evitar a borda de foco automática na marca, preservando foco visível de teclado |
| Menu abria no fluxo da página | Gaveta modal com scrim, Escape e foco contido | Navegação lateral fluida sem deslocar o conteúdo |
| Toggle disparava refresh global com scrollTo(0,0) | Recálculo das instâncias e do traço sem reset global | Preservar o ponto de leitura |
| Seis variedades de frutas | Quatro variedades adicionais e cinco elementos pequenos | Complementar a composição sem disputar atenção |

Gaveta: entrada GSAP 340 ms e saída 230 ms, sem animação em teclado ou reduced motion; largura com 32 px de espaço externo. Navegação fecha antes de rolar até a seção, hash preservado. Scrim, Escape, controle de fechamento e retorno ao disparador. Indicador de foco permanece ao navegar por teclado. Não envia mensagens.

Frutas novas em atlas original transparente, otimizado para WebP de aproximadamente 382 kB. Kiwi e uvas no método, mamão junto aos itens incluídos, cerejas nos depoimentos e kiwi nas dúvidas. Matriz e prompt preservados na entrega. Roxo do método reforçado no shader original.

QA local no Ego: três itens incluídos abrem com rolagem suave ativa, sem chamadas scrollTo e sem sair da posição em desktop; celular registrou apenas arredondamento de cerca de 1 px. Gaveta prende Tab e Shift+Tab, fecha por Escape, devolve foco e navega ao acompanhamento. Reduced motion abre imediatamente. Logo tem borda zero, outline none e foco no hero-content após a intro. Sem overflow nas quatro larguras 1440, 390, 320 e 768. Frutas novas sem cortes horizontais; verificação dos glifos confirma cerejas fora do texto do título.

Axe no documento e na gaveta: zero violações detectadas; inconclusivos preservados. Sem erros JS observados. Limites: sem aparelho físico, Safari, leitor de tela ou envio real de mensagens. Nenhuma dependência de produção instalada. Quiz e destinos comerciais preservados.

Verificação final: clique externo na faixa de 32 px fecha a gaveta, Escape devolve foco ao menu, Tab e Shift+Tab permanecem dentro do modal. Foco da logo após a intro ausente; foco visível de teclado preservado. Sem JavaScript: navegação alternativa com sete links, sete etapas e WhatsApp. HTML autossuficiente conferido com seis folhas de estilo incorporadas, zero scripts externos, novas frutas incorporadas e gaveta funcional.

## Revisão V8.2, 5 de novembro

Correções de composição: frutas reposicionadas fora dos ícones do ciclo; margens de segurança na hero e encerramento; rotação adicional no drift removida. Encerramento mobile passa a conter frutas no fluxo após a mensagem. Saída da introdução recolhe frutas para dentro. Um figo redundante junto aos planos foi removido por falta de espaço útil.

Ciclo com percurso decorativo constante de 18 segundos e pausa local, sem trocar o texto que a pessoa está lendo. Montanha SVG autoral apresenta as três fases do Método Vincere e a trilha acompanha a seleção. Prato central tem vídeo 1080p e rotação lenta em 65 segundos, independente do ponteiro. Linha global com curvas amplas e percurso até o fim da página.

Roxo vivo procedural da V7 reaproveitado no método e encerramento, preservando o restante claro. Superfícies locais são inicializadas ao se aproximar da tela, com resolução de 55%, limite de 1200 por 900 e renderização somente quando visíveis. Pausa, documento oculto, reduced motion e Save Data desligam o movimento. Corrigida inicialização gráfica ao voltar da preferência de movimento reduzido.

Relatórios em carrossel nativo com scroll-snap, botões, teclado, arrasto e ampliação. Relatório físico acessível por disclosure. Subtítulos decorativos removidos; Gama e online ganham destaque antes do CTA. Conteúdo repetido resumido e detalhes das etapas recolhidos. Informações comerciais e quiz.js preservados.

QA local no Ego: desktop, 390, 320 e tablet 768 sem overflow; sete etapas e quatro relatórios presentes; frutas do ciclo sem sobreposição com ícones. Clique e seleção da montanha chegam ao topo; órbita se move sem alterar a seleção e pausa local congela o percurso. Vídeo confirma 1920 por 1080; rotação muda com o tempo e pausa global a congela. Carrossel por botão, Home/End, arrasto e modal conferidos sem abrir relatório ao arrastar. Reduced motion no carregamento mantém zero ScrollTriggers e mídia sem src; reativação inicializa shader claro e roxo. Sem JavaScript mantém sete etapas, três fases, quatro relatórios e WhatsApp.

Varredura axe sem violações detectadas, com inconclusivos preservados. Sem erros JS observados nas coletas. Sem aparelho físico, Safari, leitor de tela ou envio de mensagens. O limite de render é uma escolha de implementação, não uma medição de FPS.

Arquivos principais: index.html, experience.js, v8.js, v82.css e v82.js. Nenhuma dependência de produção ou asset de referência externo adicionado.

Coleta final em 1440, 390, 320 e 768: nenhum overflow, nenhuma fruta de conteúdo fora da largura da tela e nenhum cruzamento entre frutas e ícones do ciclo; frutas finais dentro da seção. Rótulos decorativos e mouse da hero: zero ocorrências. Atendimento tem 14 px antes do CTA. Texto visível no main passou de 1378 para 1098 palavras nesta coleta; conteúdo aprofundado continua disponível nos disclosures. QA final axe: zero violações detectadas; limites e inconclusivos mantidos nos JSONs.

## Refinamento V8.1

CTA flutuante Falar com o Saulo usa o WhatsApp oficial. O controle de movimento fica no rodapé. Sete ícones SVG autorais representam as etapas do acompanhamento; o arco e um marcador acompanham a seleção, com transição interrompível e reversível. Ícone central e destaque dos passos se atualizam juntos. Altura dos painéis é calculada pela maior etapa.

A linha contínua agora percorre a altura real de toda a página, em vez de permanecer no fundo fixo. A ponta acompanha a rolagem e chega ao final do rodapé, com atualização após mudança de conteúdo e largura. O percurso fica nas margens para preservar a leitura. Corrigida sobreposição de ilustração no texto do CTA final.

Ego: clique, End pelo teclado, troca rápida de etapas, percurso em quatro capítulos e final da página conferidos; sem erros JavaScript observados. Desktop 1440, celulares 390 e 320 sem overflow. CTA visível e endereço correto. Pausa pelo rodapé produz zero ScrollTriggers. Movimento reduzido desliga animações mantendo seleção das etapas e WhatsApp. Sem JavaScript mantém sete artigos e contato. Axe local final sem violações detectadas; resultados inconclusivos continuam registrados. Sem envio de mensagem, aparelho físico ou Safari.

## Revisão Nutrir a vida

Revisão solicitada pelo usuário: mais alegria, profundidade no acompanhamento, informações recuperadas, ilustração botânica profissional e coreografia pela página. Site oficial e Engrena reinspecionados no Ego. Engrena forneceu o princípio de montagem e revelação, sem reutilização de sua identidade ou código.

Ciclo com sete passos, navegação por botões e setas do teclado, Home e End, controles anterior/próximo e apoio a gesto horizontal no diagrama. Primeiro atendimento explica avaliação de cerca de uma hora e entrega do plano em cerca de quarenta minutos. Método mantém Entender, Vencer e Viver, com manutenção. Avaliação física volta com os dois exemplos autorizados do site original. Questionário e destinos preservados; quiz.js não foi alterado.

Introdução de 4,4 segundos com logo original, seis ilustrações, texto HTML e íris SVG; pular, Escape, replay e segurança de sete segundos. Rolagem nativa, sem pin no celular. Shader claro com fallback, trajetória desenhada, deslocamentos discretos nas margens, relatórios, planos e fotografia. Texto mantém opacidade total durante as entradas para preservar contraste. O prato não reage ao mouse.

Verificação V8 no Ego: 1440, 768, 390 e 320 sem overflow; imagens carregadas. Menu, ciclo por clique e teclado, três perguntas do exemplo e atualização da escala, modal de relatório e abertura da triagem conferidos. Vídeo 1920 por 1080, oito segundos, em reprodução na seção, pausa geral e pausa fora dela verificadas. Pausa geral resulta em zero ScrollTriggers; retomada reconstrói a coreografia. Sem JavaScript: sete passos e três fases visíveis. Movimento reduzido: intro oculta, replay oculto, canvas oculto, vídeo sem src e zero ScrollTriggers.

Axe local: zero violações detectadas na coleta final. Itens inconclusivos preservados no JSON, sem alegar certificação WCAG. Sem erros JavaScript observados na coleta. Não testado em aparelho físico, Safari, leitor de tela ou recebimento real de mensagens; nenhum envio de teste realizado. Desempenho do shader tem resolução reduzida e limite de atualização no código, sem medição conclusiva de FPS.

Assets: atlas botânico original gerado na ferramenta integrada, otimizado para WebP de aproximadamente 543 kB e reutilizado por sprites CSS. Nenhuma dependência de produção ou geração no Flow adicionada. Fontes e bibliotecas locais mantêm licenças arquivadas. Prévia pública mantém noindex, domínio oficial e destinos comerciais.

Arquivos principais da revisão: index.html, experience.js, v8.css, v8.js, dois relatórios de avaliação física e botanical-atlas.webp.

## Histórico de verificação da V7

4 de novembro de 2026. Implementação local para revisão, sem publicação.

## Resultado

Direção O traço que acolhe aprovada na V6 expandida para o site completo. A foto real do Saulo, seu nome, registro e apresentação pessoal protagonizam a primeira dobra. Prato transferido para seção Alimentação e vida real. Biografia usa outra foto real já autorizada, em evento profissional.

Mantidos introdução de marca de 1,7 segundo, replay, pausa, shader procedural original e continuidade da linha pela navegação. Método com três etapas interativas. Acompanhamento semanal, demonstração de pergunta, relatórios ampliáveis, planos e avulsa, história e formação, depoimentos do site oficial, 12 dúvidas e contatos.

## Flow em 1080p

Vídeo existente selecionado no Flow e exportado na opção 1080p Aprimorada. Arquivo baixado com 4.083.699 bytes; ffprobe confirmou 1920 por 1080. É o aprimoramento do vídeo previamente gerado, não uma captura original produzida nativamente em 1080p. Não foi disparada nova geração.

Loop preparado localmente a partir do arquivo 1080p: 8 segundos, 192 quadros a 24 fps, 1920 por 1080, H264, nenhuma faixa de áudio, 2.726.208 bytes. Primeiro e último quadros usam o mesmo estado da fonte. Arquivo original preservado e dados de processamento em assets/loop-render.json. Nenhum download em 720p nesta rodada.

A versão de fonte carrega o MP4 apenas quando a seção se torna visível. O arquivo autossuficiente de revisão incorpora os recursos para abrir sem servidor; seu tamanho não equivale ao carregamento da versão de hospedagem.

## Verificações no Ego

Desktop 1440, celular 390 e 320 e tablet 768, sem overflow horizontal observado. A foto do Saulo está na abertura e o prato não está na hero. CTA principal termina próximo de 457 px no celular de 390. A foto começa aproximadamente em 564 px, com rosto visível na primeira tela de 844 px.

Menu abre e fecha ao navegar. Questionário completo percorrido com dados fictícios e sem envio, chegando à consulta avulsa. Resultados dos quatro planos conferidos. Pesos, regra especial da avulsa, desempate no semestral, nomes, duração, consultas e destino Typebot preservados. Formato da mensagem WhatsApp da triagem preservado.

Relatório abre com legenda correta e fecha por Escape. FAQ expande. Vídeo em reprodução confirmou videoWidth 1920 e videoHeight 1080; pausa manual, retomada e pausa fora da seção confirmadas. Transformação do prato não mudou com movimento do cursor.

Nove paradas iniciais de teclado com foco visível. Movimento reduzido: sem introdução, vídeo sem src, canvas escondido e zero ScrollTriggers. Sem JavaScript: mensagem, contatos, imagem de reserva e as três fases do método disponíveis.

Axe 4.14.0: zero violações detectadas na coleta de desktop. Nós de contraste inconclusivos mantidos no JSON; cores das superfícies claras foram revisadas, inclusive a seção de medicação. Não é certificação WCAG.

## Limitações e publicação

Não testado em aparelho físico, Safari, leitor de tela ou recebimento real de mensagens. Nenhum contato de teste enviado. Sem medição conclusiva de FPS; orçamento do shader é o da V6, com resolução reduzida e limite de atualização no código, não promessa de taxa alcançada.

Noindex e robots bloqueando indexação são intencionais na prévia. Metadados e imagem social local preparados. A URL da imagem social aponta para o domínio final e ainda não está publicada; o auditor estático registra essa pendência. Ao executar o auditor na rota local /site-v7, ele também procura robots/sitemap na raiz do servidor do workspace; os arquivos corretos estão na raiz do pacote do site. Identificação do Saulo repetida na abertura e biografia é intencional. Antes de publicar: validar indexação, robots/sitemap, canonical, URLs sociais, política de privacidade e rastreamento consentido. A política continua apontando para a página atual do Saulo.

Nenhuma dependência de produção instalada. Fontes OFL e GSAP locais com licenças na entrega. Site oficial e versões anteriores preservados.
