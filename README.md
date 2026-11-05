# Saulo Pessoa

Site completo V7 do nutricionista Saulo Pessoa. Direção visual O traço que acolhe, com fotografia real na abertura, introdução de marca, fundo procedural WebGL e movimento coordenado com GSAP.

## Executar localmente

Site estático, sem instalação de dependências ou etapa de build. Abra index.html no navegador ou sirva esta pasta com um servidor HTTP local.

Com Python instalado:

```sh
python -m http.server 8000
```

Acesse http://localhost:8000.

## Estrutura

- index.html: conteúdo e metadados.
- experience.js e experience.css: introdução, shader, fases do método e motion.
- site.js e site.css: integração, navegação e refinamentos responsivos.
- content.css: estilos das demais seções.
- quiz.js: questionário e encaminhamento por ação explícita.
- assets/: fotografias, fontes, vídeo de 8 segundos em 1920 por 1080, bibliotecas locais e licenças.

## Validação e publicação

Ver REVISAO-E-VALIDACAO.md para verificações e limites. Conferido em desktop, celular simulado e tablet, incluindo questionário, relatórios, teclado, pausa e movimento reduzido. Não validado em aparelho físico ou Safari.

Noindex e robots bloqueando indexação são intencionais nesta versão de revisão. Antes de publicar, revisar esses controles, canonical, sitemap, imagem social, privacidade e rastreamento consentido. Os links de contato usam os destinos oficiais do Saulo. Nenhum contato de teste foi enviado.

Prévia pública: https://cristianlf23.github.io/saulo-pessoa-site/ . Hospedada no GitHub Pages. O domínio oficial continua preservado; esta prévia mantém noindex e bloqueio de indexação.

## Prévia

![Abertura desktop](docs/desktop.png)

## Direitos

Marca, fotografias e conteúdo do cliente não são concedidos para reutilização por terceiros. Fontes e bibliotecas seguem as licenças incluídas em assets/licenses.
