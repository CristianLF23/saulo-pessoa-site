# Saulo Pessoa: site completo V7

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
