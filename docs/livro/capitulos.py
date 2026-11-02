ONDA = '<svg class="onda" viewBox="0 0 600 12" preserveAspectRatio="none"><path d="M0 6 Q 25 0 50 6 T 100 6 T 150 6 T 200 6 T 250 6 T 300 6 T 350 6 T 400 6 T 450 6 T 500 6 T 550 6 T 600 6" fill="none" stroke="#b7f0bb" stroke-width="2"/></svg>'

def fig(src, legenda, cls=''):
    return f'<figure class="{cls}"><img src="img/{src}" alt="{legenda}"><figcaption>{legenda}</figcaption></figure>'

def cap(n, titulo, corpo):
    return f'<section class="cap" id="cap{n}"><div class="cap-abre"><div class="num">Capítulo {n}</div><h1>{titulo}</h1>{ONDA}</div>{corpo}</section>'

CAPS = []

CAPS.append(("Introdução", """
<h2 class="s">Propósito</h2>
<p>Este livro documenta, de ponta a ponta, o sistema <strong>Cataratas do Iguaçu</strong>: um site institucional com venda fictícia de ingressos, painel administrativo e envio de comprovantes por e-mail. Ele descreve os requisitos, as regras de negócio, a arquitetura, a segurança, a operação com Docker e o uso do sistema por visitantes e administradores.</p>
<div class="destaque alerta"><p><strong>Projeto de fã, apenas portfólio.</strong> Este sistema foi criado por um fã, para homenagear as Cataratas do Iguaçu e o Parque Nacional do Iguaçu. Ele <strong>não representa o site real</strong> do parque, não possui vínculo com a administração do parque e não realiza vendas reais. Ingressos, preços, e-mails e pagamentos são fictícios e existem somente para demonstrar habilidades de desenvolvimento.</p></div>
<h2 class="s">Origem do projeto</h2>
<p>O ponto de partida foi um projeto educacional do programa Entra21, feito em HTML, CSS, Bootstrap e JavaScript, com o design inspirado no parque. Nesta versão o front-end foi convertido para <strong>Angular</strong>, mantendo a mesma identidade visual (azul das águas, verde da mata, barra lateral com a ilustração do rio), e ganhou um <strong>back-end em Node.js</strong>, banco de dados, autenticação e empacotamento em <strong>Docker</strong>.</p>
<h2 class="s">O que o sistema entrega</h2>
<div class="duas">
<div class="cartao"><h4>Para visitantes</h4><ul><li>Informações do parque: funcionamento, mapa, como chegar</li><li>Atividades de lazer com detalhes</li><li>Cadastro, login e compra de ingressos</li><li>QR Code e comprovante por e-mail</li></ul></div>
<div class="cartao"><h4>Para superadmins</h4><ul><li>Resumo com métricas</li><li>Consulta de pedidos e usuários</li><li>Gestão de tipos de ingresso e preços</li><li>Gestão das atividades de lazer</li></ul></div>
</div>
<h2 class="s">Como ler este livro</h2>
<p>Os capítulos 2 a 4 apresentam o sistema e os requisitos. Os capítulos 5 a 11 aprofundam a parte técnica. O capítulo 12 é o guia prático de execução, e os demais fecham com testes, limitações e glossário. Siglas: <strong>RF</strong> (requisito funcional), <strong>RNF</strong> (requisito não funcional) e <strong>RN</strong> (regra de negócio).</p>
"""))

CAPS.append(("Visão geral e telas", """
<p>O sistema é uma aplicação web responsiva, pensada primeiro para celular e adaptada para telas largas. No desktop, uma barra lateral azul fixa concentra a navegação; no celular, ela vira um cabeçalho com menu.</p>
<h2 class="s">Página inicial</h2>
<p>A página inicial apresenta o título do parque sobre a imagem das cataratas, o botão de compra de ingresso e quatro atalhos informativos: <em>Funcionamento</em>, <em>Como chegar</em> (mapa incorporado), <em>Estacionamento</em> e <em>Mapa</em> do parque.</p>
""" + fig('home.jpg','Página inicial no desktop.') + fig('home-funcionamento.jpg','Painel de funcionamento do parque.') + """
<h2 class="s">Sobre</h2>
<p>Apresenta o parque, sua história e biodiversidade, e destaca o aviso de que o projeto é uma homenagem de fã.</p>
""" + fig('sobre.jpg','Página Sobre, com o aviso de projeto de fã.', 'rec') + """
<h2 class="s">Lazer</h2>
<p>As atividades aparecem em cartões com imagem, título sobre um degradê e resumo da descrição. O botão <em>Ler mais</em> abre uma janela com o texto completo. Nenhum conteúdo ultrapassa os limites do seu cartão: títulos e textos quebram linha e os resumos são limitados a quatro linhas.</p>
""" + fig('lazer.jpg','Grade de atividades de lazer.', 'rec') + """<figure class="par"><div><img src="img/lazer-modal.jpg" alt="Janela de detalhes no desktop"><figcaption>Detalhes no desktop.</figcaption></div><div><img src="img/mobile-lazer-modal.jpg" alt="Janela de detalhes no celular"><figcaption>Detalhes no celular.</figcaption></div></figure>
<h2 class="s">Ingressos</h2>
<p>Cada tipo de ingresso é exibido como um bilhete, com furos laterais e linha pontilhada de destaque, preço em evidência e botão de compra. Usuários não autenticados são levados ao login e retornam à página de ingressos depois de entrar.</p>
""" + fig('ingressos.jpg','Bilhetes e lista de pedidos.', 'rec') + """<figure class="par"><div><img src="img/compra.jpg" alt="Janela de compra"><figcaption>Compra: quantidade, data e total.</figcaption></div><div><img src="img/qr.jpg" alt="QR Code do pedido"><figcaption>QR Code e status do e-mail.</figcaption></div></figure>
<figure class="par"><div><img src="img/mobile-ingressos.jpg" alt="Ingressos no celular"><figcaption>Ingressos e pedidos no celular.</figcaption></div><div><img src="img/mobile-home.jpg" alt="Página inicial no celular"><figcaption>Página inicial no celular.</figcaption></div></figure>
<h2 class="s">Login e cadastro</h2>
<p>As telas de autenticação seguem o design original: formulário em coluna azul com a ilustração da natureza ao fundo e a logo do parque sobre a foto das cataratas.</p>
<figure class="par"><div><img src="img/login.jpg" alt="Tela de login"><figcaption>Login.</figcaption></div><div><img src="img/registro.jpg" alt="Tela de cadastro"><figcaption>Cadastro.</figcaption></div></figure>
<h2 class="s">Modo claro e escuro</h2>
<p>Um botão com ícone de sol e lua alterna o tema. A escolha segue o sistema por padrão, é guardada no navegador e aplicada antes da primeira renderização. A troca acontece com transição suave de cores.</p>
<figure class="par"><div><img src="img/escuro-ingressos.jpg" alt="Ingressos no modo escuro"><figcaption>Ingressos no modo escuro.</figcaption></div><div><img src="img/escuro-mobile.jpg" alt="Lazer no modo escuro, celular"><figcaption>Lazer no modo escuro (celular).</figcaption></div></figure>
<figure><img src="img/escuro-admin.jpg" alt="Painel no modo escuro"><figcaption>Painel administrativo no modo escuro, com contadores animados.</figcaption></figure>
<h2 class="s">Painel administrativo</h2>
<p>Visível apenas para superadmins (item <em>Admin</em> no menu). Reúne cinco abas: Resumo, Pedidos, Usuários, Ingressos e Lazer.</p>
""" + fig('admin-resumo.jpg','Painel administrativo: resumo.') + fig('admin-pedidos.jpg','Painel administrativo: pedidos.') + fig('admin-usuarios.jpg','Painel administrativo: usuários e papéis.') + fig('admin-editar-ingresso.jpg','Edição de um tipo de ingresso.') + """
<figure class="par"><div><img src="img/mobile-admin.jpg" alt="Painel no celular"><figcaption>Painel administrativo no celular (aba Lazer).</figcaption></div></figure>
<h2 class="s">Comprovante por e-mail</h2>
<p>Ao concluir a compra, o sistema envia um e-mail HTML com os dados do pedido e o QR Code embutido como imagem anexada.</p>
""" + fig('email.jpg','E-mail de comprovante de ingresso.','cel')))

def linhas(rows, cols):
    h = ''.join(f'<th>{c}</th>' for c in cols)
    b = ''
    for r in rows:
        tds = ''
        for i, c in enumerate(r):
            if i == 0: tds += f'<td class="id">{c}</td>'
            elif isinstance(c, str) and c.startswith('@'): tds += f'<td><span class="pri{" m" if c=="@Média" else ""}">{c[1:]}</span></td>'
            else: tds += f'<td>{c}</td>'
        b += f'<tr>{tds}</tr>'
    return f'<table><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

RF = [
 ('RF01','Exibir a página inicial com título do parque, botão de compra e atalhos de Funcionamento, Como chegar, Estacionamento e Mapa.','@Alta'),
 ('RF02','Exibir a página Sobre com a descrição do parque.','@Média'),
 ('RF03','Listar as atividades de lazer em cartões e exibir o detalhe completo em janela modal.','@Alta'),
 ('RF04','Listar os tipos de ingresso ativos, com nome, descrição e preço.','@Alta'),
 ('RF05','Permitir o cadastro de usuário com nome, e-mail, telefone e senha com confirmação.','@Alta'),
 ('RF06','Permitir login por e-mail e senha, mantendo a sessão do usuário.','@Alta'),
 ('RF07','Permitir encerrar a sessão (logout).','@Alta'),
 ('RF08','Oferecer recuperação de senha, com resposta genérica que não revela se o e-mail existe.','@Média'),
 ('RF09','Permitir que o usuário autenticado compre ingressos escolhendo tipo, quantidade e data da visita.','@Alta'),
 ('RF10','Gerar um código único e um QR Code para cada pedido.','@Alta'),
 ('RF11','Enviar por e-mail o comprovante do pedido com o QR Code.','@Alta'),
 ('RF12','Permitir o reenvio do comprovante por e-mail.','@Média'),
 ('RF13','Listar os pedidos do usuário autenticado, com status do envio do e-mail.','@Alta'),
 ('RF14','Redirecionar usuários não autenticados ao login e devolvê-los à página de origem após entrar.','@Média'),
 ('RF15','Exibir ao superadmin um resumo com usuários, pedidos, ingressos vendidos, pedidos do dia e receita.','@Alta'),
 ('RF16','Permitir ao superadmin consultar todos os pedidos.','@Alta'),
 ('RF17','Permitir ao superadmin consultar usuários e alterar o papel entre usuário e superadmin.','@Alta'),
 ('RF18','Permitir ao superadmin criar e editar tipos de ingresso (nome, preço, descrição, imagem e disponibilidade).','@Alta'),
 ('RF19','Permitir ao superadmin criar, editar e excluir atividades de lazer.','@Alta'),
 ('RF20','Permitir ao desenvolvedor cadastrar e alterar superadmins pelo terminal (CLI).','@Alta'),
 ('RF22','Permitir alternar entre tema claro e escuro, respeitando a preferência do sistema e guardando a escolha do usuário.','@Média'),
 ('RF21','Exibir, no rodapé e nas páginas Sobre e Ingressos, o aviso de que se trata de um projeto de fã, sem vínculo com o parque real.','@Alta'),
]
RNF = [
 ('RNF01','Segurança','Senhas com hash bcrypt (custo 12); sessões com JWT assinado em HS256, validade de 7 dias; validação de entrada com Zod; consultas SQL parametrizadas.'),
 ('RNF02','Segurança','Cabeçalhos de segurança (Helmet no Node e nginx): CSP restritiva, X-Frame-Options, nosniff, Referrer-Policy e Permissions-Policy.'),
 ('RNF03','Segurança','Limite de requisições por IP (300/min na API; 50 a cada 15 min nas rotas de autenticação) contra abuso e força bruta.'),
 ('RNF04','Segurança','Mensagens de erro genéricas no login e na recuperação de senha, e tempo de resposta equivalente para usuários inexistentes.'),
 ('RNF05','Segurança','Em produção o servidor se recusa a iniciar sem JWT_SECRET de ao menos 32 caracteres; nenhum segredo fica no repositório.'),
 ('RNF06','Segurança','Contêineres sem privilégios: usuário não root, sistema de arquivos somente leitura no back-end, capabilities removidas e no-new-privileges.'),
 ('RNF07','Desempenho','Rotas carregadas sob demanda (lazy loading), compressão gzip e cache de ativos estáticos.'),
 ('RNF08','Usabilidade','Interface responsiva de 320 px a telas largas, sem rolagem horizontal e sem conteúdo fora dos cartões.'),
 ('RNF09','Acessibilidade','Rótulos ARIA, foco visível, janelas modais fecháveis com Esc, contraste adequado e respeito a prefers-reduced-motion.'),
 ('RNF10','Portabilidade','Execução completa com um único comando (docker compose up --build).'),
 ('RNF11','Confiabilidade','Healthcheck do back-end, reinício automático, dados em volume persistente e falha de e-mail sem perda de pedido.'),
 ('RNF12','Manutenibilidade','Código modular, sem comentários, com nomes expressivos, componentes standalone e testes automatizados do back-end.'),
 ('RNF13','Compatibilidade','Navegadores modernos (Chrome, Edge, Firefox e Safari recentes).'),
 ('RNF15','Usabilidade','Tema claro e escuro com troca suave, aplicado antes da renderização para evitar flash de tema errado.'),
 ('RNF16','Usabilidade','Animações de entrada dos cartões, transição entre páginas, contadores e microinterações, todas desativadas com prefers-reduced-motion.'),
 ('RNF14','Privacidade','Coleta mínima de dados; senhas nunca retornadas pela API; dados e valores são fictícios.'),
]
RN = [
 ('RN01','O e-mail é único no sistema e normalizado para minúsculas.'),
 ('RN02','A senha deve ter entre 8 e 72 caracteres (limite do bcrypt).'),
 ('RN03','O telefone deve conter 10 ou 11 dígitos, com DDD.'),
 ('RN04','Cada pedido comporta de 1 a 10 ingressos de um mesmo tipo.'),
 ('RN05','A data da visita não pode estar no passado (é tolerado o dia anterior em UTC para evitar divergência de fuso).'),
 ('RN06','O total do pedido é calculado no servidor: preço atual do tipo multiplicado pela quantidade; valores do cliente são ignorados.'),
 ('RN07','O pedido guarda o nome do tipo no momento da compra, preservando o histórico caso o tipo seja renomeado.'),
 ('RN08','Somente tipos de ingresso ativos podem ser comprados; tipos inativos somem da vitrine.'),
 ('RN09','Meia-entrada exige documento comprobatório na entrada (regra informativa, sem verificação no sistema).'),
 ('RN10','O código do pedido segue o formato CPI- seguido de 10 caracteres hexadecimais maiúsculos.'),
 ('RN11','Um usuário só consulta, reenvia e gera o QR Code dos próprios pedidos.'),
 ('RN12','O cadastro público sempre cria usuários comuns; o papel de superadmin só é concedido por outro superadmin ou pela CLI.'),
 ('RN13','Um superadmin não pode alterar o próprio papel pelo painel.'),
 ('RN14','A CLI não rebaixa o único superadmin existente sem a opção --forcar.'),
 ('RN15','O parque funciona todos os dias: segunda a sexta das 9h às 16h; sábado e domingo das 8h30 às 16h.'),
 ('RN16','Falha no envio de e-mail não cancela o pedido; ele é marcado como e-mail pendente e pode ser reenviado.'),
 ('RN17','Todos os valores, pagamentos e e-mails do sistema são fictícios e não possuem validade real.'),
 ('RN19','Sem escolha prévia, o tema segue a preferência do sistema operacional; a escolha manual é guardada no navegador e prevalece.'),
 ('RN18','O sistema deve sempre informar que é uma homenagem de fã e não representa o site oficial.'),
]

CAPS.append(("Requisitos funcionais", linhas([(a,b,c) for a,b,c in RF], ['ID','Descrição','Prioridade']).replace('<th>ID</th>','<th>ID</th>') + """
<div class="destaque verde"><p>Os requisitos RF01 a RF22 estão implementados e cobertos por testes automatizados (API e CLI) e por verificação manual em desktop e celular.</p></div>
<h2 class="s">Atores</h2>
<table><thead><tr><th>Ator</th><th>Descrição</th></tr></thead><tbody>
<tr><td class="id">Visitante</td><td>Qualquer pessoa sem login; acessa conteúdo público.</td></tr>
<tr><td class="id">Usuário</td><td>Visitante cadastrado e autenticado; compra ingressos e consulta pedidos.</td></tr>
<tr><td class="id">Superadmin</td><td>Usuário com papel superadmin; acessa o painel administrativo.</td></tr>
<tr><td class="id">Desenvolvedor</td><td>Opera o sistema por terminal e Docker; gerencia superadmins pela CLI.</td></tr>
</tbody></table>
<h2 class="s">Casos de uso principais</h2>
<h3 class="s">UC01 · Comprar ingresso</h3>
<ol class="n"><li>O usuário abre <em>Ingressos</em> e escolhe um tipo.</li><li>Se não estiver autenticado, é levado ao login e depois retorna à página.</li><li>Informa quantidade (1 a 10) e data da visita.</li><li>O sistema valida, calcula o total, grava o pedido e gera o código.</li><li>O sistema envia o e-mail com o QR Code e exibe o comprovante.</li></ol>
<p><strong>Fluxo alternativo:</strong> se o envio de e-mail falhar, o pedido permanece válido, o status fica <em>E-mail pendente</em> e o usuário pode reenviar.</p>
<h3 class="s">UC02 · Gerenciar ingressos (superadmin)</h3>
<ol class="n"><li>O superadmin abre <em>Admin → Ingressos</em>.</li><li>Cria um tipo ou edita nome, preço, descrição, imagem e disponibilidade.</li><li>A vitrine pública reflete a mudança imediatamente.</li></ol>
<h3 class="s">UC03 · Cadastrar superadmin (desenvolvedor)</h3>
<ol class="n"><li>O desenvolvedor executa a CLI no contêiner do back-end.</li><li>Informa e-mail, nome e senha (a senha é solicitada de forma oculta).</li><li>O sistema cria o superadmin ou promove o usuário existente.</li></ol>
"""))

CAPS.append(("Requisitos não funcionais e regras de negócio", """
<h2 class="s">Requisitos não funcionais</h2>
""" + linhas(RNF, ['ID','Categoria','Descrição']) + """
<h2 class="s">Regras de negócio</h2>
""" + linhas(RN, ['ID','Regra'])))

CAPS.append(("Arquitetura", """
<p>O sistema segue uma arquitetura em três camadas, executadas em contêineres Docker orquestrados por <code>docker-compose</code>: um servidor <strong>nginx</strong> que entrega o front-end Angular e encaminha chamadas <code>/api</code>, uma <strong>API Node.js</strong> com banco <strong>SQLite</strong> em volume persistente, e um servidor SMTP de testes, o <strong>Mailpit</strong>.</p>
<div class="diagrama"><svg viewBox="0 0 640 330" width="640" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="s" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0 0 L10 4 L0 8z" fill="#004d8b"/></marker></defs>
<rect x="10" y="40" width="110" height="70" rx="12" fill="#e9eff3" stroke="#006ca6" stroke-width="2"/><text x="65" y="71" text-anchor="middle" font-size="13" font-weight="700" fill="#013a68">Navegador</text><text x="65" y="91" text-anchor="middle" font-size="10" fill="#5b6b78">visitante / admin</text>
<rect x="165" y="15" width="210" height="300" rx="14" fill="none" stroke="#4caf50" stroke-width="2" stroke-dasharray="6 5"/><text x="270" y="33" text-anchor="middle" font-size="10" fill="#036800" font-weight="700">Docker Compose</text>
<rect x="185" y="45" width="170" height="60" rx="12" fill="#006ca6"/><text x="270" y="72" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">frontend · nginx</text><text x="270" y="91" text-anchor="middle" font-size="10" fill="#dff">Angular + proxy /api</text>
<rect x="185" y="135" width="170" height="60" rx="12" fill="#004d8b"/><text x="270" y="162" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">backend · Node.js</text><text x="270" y="181" text-anchor="middle" font-size="10" fill="#dff">Express + API REST</text>
<rect x="185" y="235" width="170" height="60" rx="12" fill="#4caf50"/><text x="270" y="262" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">mailpit</text><text x="270" y="281" text-anchor="middle" font-size="10" fill="#fff">SMTP 1025 · UI 8025</text>
<rect x="450" y="130" width="160" height="70" rx="12" fill="#e9eff3" stroke="#004d8b" stroke-width="2"/><text x="530" y="160" text-anchor="middle" font-size="13" font-weight="700" fill="#013a68">SQLite</text><text x="530" y="180" text-anchor="middle" font-size="10" fill="#5b6b78">volume dados:/data</text>
<rect x="450" y="235" width="160" height="60" rx="12" fill="#e9eff3" stroke="#004d8b" stroke-width="2" stroke-dasharray="5 4"/><text x="530" y="262" text-anchor="middle" font-size="13" font-weight="700" fill="#013a68">SMTP real</text><text x="530" y="281" text-anchor="middle" font-size="10" fill="#5b6b78">opcional (.env)</text>
<g stroke="#004d8b" stroke-width="2" fill="none" marker-end="url(#s)"><path d="M120 75 H183"/><path d="M270 105 V133"/><path d="M355 165 H448"/><path d="M270 195 V233"/><path d="M355 185 L448 245" stroke-dasharray="4 3"/></g>
</svg></div>
<h2 class="s">Responsabilidades</h2>
<table><thead><tr><th>Componente</th><th>Tecnologia</th><th>Responsabilidade</th></tr></thead><tbody>
<tr><td class="id">frontend</td><td>Angular 22, Bootstrap 5, CSS próprio, nginx</td><td>Interface, navegação, formulários, guarda de rota do painel; proxy da API.</td></tr>
<tr><td class="id">backend</td><td>Node.js 22, Express 5, SQLite (node:sqlite)</td><td>Regras de negócio, autenticação, API REST, geração de QR Code, e-mails.</td></tr>
<tr><td class="id">mailpit</td><td>Mailpit</td><td>Captura os e-mails em ambiente de demonstração; consulta em http://localhost:8025.</td></tr>
</tbody></table>
<h2 class="s">Fluxo de uma compra</h2>
<div class="diagrama"><svg viewBox="0 0 640 230" width="640" xmlns="http://www.w3.org/2000/svg">
<defs><marker id="f" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0 0 L10 4 L0 8z" fill="#004d8b"/></marker></defs>
<g font-size="11" font-weight="700" fill="#013a68" text-anchor="middle"><text x="70" y="22">Usuário</text><text x="250" y="22">Angular</text><text x="430" y="22">API</text><text x="580" y="22">SMTP</text></g>
<g stroke="#b8c9d6" stroke-width="2" stroke-dasharray="4 4"><path d="M70 30 V220"/><path d="M250 30 V220"/><path d="M430 30 V220"/><path d="M580 30 V220"/></g>
<g stroke="#004d8b" stroke-width="2" marker-end="url(#f)" fill="none"><path d="M70 55 H247"/><path d="M250 85 H427"/><path d="M430 120 H577"/><path d="M427 155 H253"/><path d="M247 185 H73"/></g>
<g font-size="10" fill="#1d2a35"><text x="160" y="50" text-anchor="middle">confirma compra</text><text x="340" y="80" text-anchor="middle">POST /api/pedidos (JWT)</text><text x="505" y="115" text-anchor="middle">e-mail + QR</text><text x="340" y="150" text-anchor="middle">201 pedido</text><text x="160" y="180" text-anchor="middle">QR Code + status</text></g>
</svg></div>
<h2 class="s">Estrutura de pastas</h2>
<pre><code>site-cataratas-do-iguacu/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── Dockerfile
│   ├── src/  app.js  server.js  db.js  data.js  mailer.js  cli.js
│   └── test/ api.test.js  cli.test.js
├── frontend/
│   ├── Dockerfile  nginx.conf
│   └── src/app/
│       ├── core/    api.ts  auth.ts  guards.ts  modal.ts
│       ├── layout/  nav.ts  footer.ts
│       └── pages/   home  sobre  lazer  ingressos  login  registro  admin
└── docs/livro/       fontes deste livro</code></pre>
"""))

CAPS.append(("Front-end Angular", """
<h2 class="s">Visão geral</h2>
<p>O front-end usa <strong>Angular</strong> com componentes <em>standalone</em>, sinais (<code>signal</code>, <code>computed</code>) para estado e formulários reativos. Cada página é carregada sob demanda por <code>loadComponent</code>, mantendo o pacote inicial pequeno. O visual original foi preservado: o CSS do projeto antigo e o Bootstrap foram mantidos, e um sistema de componentes visuais novo (cartões, bilhetes, janelas, botões, tabelas) foi adicionado por cima, usando variáveis CSS.</p>
<h2 class="s">Rotas</h2>
<table><thead><tr><th>Rota</th><th>Componente</th><th>Acesso</th></tr></thead><tbody>
<tr><td class="id">/</td><td>Home</td><td>Público</td></tr>
<tr><td class="id">/sobre</td><td>Sobre</td><td>Público</td></tr>
<tr><td class="id">/lazer</td><td>Lazer</td><td>Público</td></tr>
<tr><td class="id">/ingressos</td><td>Ingressos</td><td>Público (compra exige login)</td></tr>
<tr><td class="id">/login · /registre-se</td><td>Login · Registro</td><td>Público, sem menu lateral</td></tr>
<tr><td class="id">/admin</td><td>Admin</td><td>Somente superadmin (<code>adminGuard</code>)</td></tr>
</tbody></table>
<h2 class="s">Módulos centrais</h2>
<table><thead><tr><th>Arquivo</th><th>Função</th></tr></thead><tbody>
<tr><td class="id">core/api.ts</td><td>Serviço HTTP tipado com todos os endpoints e as interfaces de dados.</td></tr>
<tr><td class="id">core/auth.ts</td><td>Sessão em sinais, login, cadastro, logout, atualização do perfil e interceptor que anexa o JWT e encerra a sessão em respostas 401.</td></tr>
<tr><td class="id">core/guards.ts</td><td>Guarda do painel e função <code>destinoSeguro</code>, que impede redirecionamentos abertos.</td></tr>
<tr><td class="id">core/modal.ts</td><td>Janela modal reutilizável: fecha com Esc, com clique no fundo e possui papel ARIA de diálogo.</td></tr>
<tr><td class="id">layout/nav.ts</td><td>Barra lateral e menu móvel; exibe o item Admin apenas para superadmins.</td></tr>
<tr><td class="id">layout/footer.ts</td><td>Rodapé com contatos vindos da API e o aviso de projeto de fã.</td></tr>
</tbody></table>
<h2 class="s">Sistema de design</h2>
<div class="duas">
<div class="cartao"><h4>Paleta</h4><ul><li>Azul #006ca6, #004d8b e #013a68 (águas)</li><li>Verde #4caf50 e #036800 (mata)</li><li>Fundo #e9eff3 e texto #1d2a35</li></ul></div>
<div class="cartao"><h4>Componentes</h4><ul><li><code>.cartao</code>: imagem com degradê e título sobreposto</li><li><code>.ingresso</code>: bilhete com furos e linha pontilhada</li><li><code>.modal-cartao</code>, <code>.btn-cpi</code>, <code>.tabela</code></li></ul></div>
</div>
<h3 class="s">Responsividade</h3>
<p>As grades usam <code>repeat(auto-fill, minmax(min(100%, 290px), 1fr))</code>, de modo que cada cartão ocupa no máximo a largura disponível. Os contêineres têm <code>min-width: 0</code> e <code>overflow-wrap: anywhere</code>, as tabelas rolam dentro do próprio quadro e as imagens de cartão são recortadas com <code>object-fit: cover</code>. A verificação automatizada com navegador headless confirmou ausência de rolagem horizontal em todas as telas em 390 px e 1280 px de largura.</p>
<h3 class="s">Tema claro e escuro</h3>
<p>O serviço <code>Tema</code> grava <code>data-tema</code> na raiz do documento e a escolha em <code>localStorage</code>. Um pequeno script externo (<code>tema-init.js</code>, compatível com a CSP) define o tema antes do Angular iniciar, evitando o flash. Todas as cores de superfície, texto, bordas e chips vêm de variáveis CSS (<code>--superficie</code>, <code>--titulo</code>, <code>--borda</code>, entre outras) redefinidas em <code>[data-tema="escuro"]</code>.</p>
<h3 class="s">Animações e microinterações</h3>
<ul><li>Entrada dos cartões com revelação ao rolar (<code>IntersectionObserver</code>) e atraso escalonado.</li><li>Transição suave entre páginas e entrada do título e da barra de atalhos.</li><li>Elevação, brilho deslizante e zoom da imagem ao passar o mouse nos cartões.</li><li>Esqueletos de carregamento, avisos (toasts) animados e contadores numéricos no painel.</li><li>Botão de tema com troca rotativa entre sol e lua.</li><li>Tudo é desativado quando o usuário prefere movimento reduzido.</li></ul>
<h3 class="s">Acessibilidade</h3>
<ul><li>Rótulos <code>aria-label</code> em links, botões de ícone e janelas.</li><li>Anel de foco visível e campos associados a rótulos.</li><li>Animações desativadas com <code>prefers-reduced-motion</code>.</li><li>Contraste alto entre texto e fundo nos cartões e botões.</li></ul>
"""))

CAPS.append(("Back-end Node.js e API", """
<h2 class="s">Tecnologias</h2>
<p>Express 5 com módulos ES, <code>node:sqlite</code> (SQLite embutido no Node 22), <code>bcryptjs</code>, <code>jsonwebtoken</code>, <code>zod</code>, <code>helmet</code>, <code>express-rate-limit</code>, <code>qrcode</code> e <code>nodemailer</code>. A função <code>createApp</code> recebe banco, segredo e serviço de e-mail por injeção, o que permite testes sem rede.</p>
<h2 class="s">Endpoints</h2>
<table><thead><tr><th>Método</th><th>Rota</th><th>Acesso</th><th>Descrição</th></tr></thead><tbody>
<tr><td class="id">GET</td><td>/api/health</td><td>Público</td><td>Verificação de saúde</td></tr>
<tr><td class="id">GET</td><td>/api/parque</td><td>Público</td><td>Funcionamento, contatos, localização e redes</td></tr>
<tr><td class="id">GET</td><td>/api/atividades</td><td>Público</td><td>Atividades de lazer</td></tr>
<tr><td class="id">GET</td><td>/api/ingressos/tipos</td><td>Público</td><td>Tipos de ingresso ativos</td></tr>
<tr><td class="id">POST</td><td>/api/auth/registro</td><td>Público</td><td>Cadastro; retorna token e usuário</td></tr>
<tr><td class="id">POST</td><td>/api/auth/login</td><td>Público</td><td>Login; retorna token e usuário</td></tr>
<tr><td class="id">POST</td><td>/api/auth/esqueci-senha</td><td>Público</td><td>Resposta genérica de recuperação</td></tr>
<tr><td class="id">GET</td><td>/api/auth/me</td><td>Usuário</td><td>Perfil atual, incluindo o papel</td></tr>
<tr><td class="id">POST</td><td>/api/pedidos</td><td>Usuário</td><td>Cria pedido e envia e-mail</td></tr>
<tr><td class="id">GET</td><td>/api/pedidos</td><td>Usuário</td><td>Lista os próprios pedidos</td></tr>
<tr><td class="id">GET</td><td>/api/pedidos/:id/qrcode</td><td>Usuário</td><td>Pedido com QR Code (data URL)</td></tr>
<tr><td class="id">POST</td><td>/api/pedidos/:id/reenviar</td><td>Usuário</td><td>Reenvia o comprovante</td></tr>
<tr><td class="id">GET</td><td>/api/admin/resumo</td><td>Superadmin</td><td>Métricas gerais</td></tr>
<tr><td class="id">GET</td><td>/api/admin/pedidos</td><td>Superadmin</td><td>Pedidos de todos os usuários</td></tr>
<tr><td class="id">GET · PATCH</td><td>/api/admin/usuarios[/:id]</td><td>Superadmin</td><td>Lista usuários; altera papel</td></tr>
<tr><td class="id">GET · POST · PUT</td><td>/api/admin/tipos[/:id]</td><td>Superadmin</td><td>Gestão de tipos de ingresso</td></tr>
<tr><td class="id">POST · PUT · DELETE</td><td>/api/admin/atividades[/:id]</td><td>Superadmin</td><td>Gestão de atividades</td></tr>
</tbody></table>
<h2 class="s">Exemplo de requisição</h2>
<pre><code>POST /api/pedidos
Authorization: Bearer &lt;token&gt;
Content-Type: application/json

{ "tipoId": "inteira", "quantidade": 2, "dataVisita": "2026-11-15" }

201 Created
{ "id": 1, "codigo": "CPI-8F3A21C9D0", "tipoNome": "Inteira",
  "quantidade": 2, "dataVisita": "2026-11-15",
  "totalCentavos": 20000, "emailEnviado": true }</code></pre>
<h2 class="s">Tratamento de erros</h2>
<p>Todos os erros retornam JSON no formato <code>{ "erro": "mensagem", "campos": { ... } }</code>. Os códigos usados são 400 (validação), 401 (não autenticado), 403 (sem permissão), 404 (não encontrado), 409 (e-mail já cadastrado), 429 (limite de requisições), 502 (falha de e-mail no reenvio) e 500 (erro interno, sem detalhes ao cliente).</p>
"""))

CAPS.append(("Banco de dados", """
<p>O banco é SQLite, com chaves estrangeiras ativas e modo WAL. O esquema é criado automaticamente na primeira execução e os dados iniciais (dois tipos de ingresso e seis atividades de lazer) são semeados apenas quando as tabelas estão vazias.</p>
<div class="diagrama"><svg viewBox="0 0 640 300" width="640" xmlns="http://www.w3.org/2000/svg">
<g font-size="10">
<rect x="10" y="20" width="190" height="150" rx="10" fill="#fff" stroke="#006ca6" stroke-width="2"/><rect x="10" y="20" width="190" height="26" rx="10" fill="#006ca6"/><text x="105" y="38" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">usuarios</text>
<text x="20" y="64">id · PK</text><text x="20" y="80">nome</text><text x="20" y="96">email · único</text><text x="20" y="112">telefone</text><text x="20" y="128">senha_hash</text><text x="20" y="144">papel · usuario | superadmin</text><text x="20" y="160">criado_em</text>
<rect x="250" y="20" width="200" height="190" rx="10" fill="#fff" stroke="#006ca6" stroke-width="2"/><rect x="250" y="20" width="200" height="26" rx="10" fill="#006ca6"/><text x="350" y="38" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">pedidos</text>
<text x="260" y="64">id · PK</text><text x="260" y="80">codigo · único</text><text x="260" y="96">usuario_id · FK</text><text x="260" y="112">tipo_id</text><text x="260" y="128">tipo_nome</text><text x="260" y="144">quantidade</text><text x="260" y="160">data_visita</text><text x="260" y="176">total_centavos</text><text x="260" y="192">email_enviado · criado_em</text>
<rect x="490" y="20" width="140" height="150" rx="10" fill="#fff" stroke="#4caf50" stroke-width="2"/><rect x="490" y="20" width="140" height="26" rx="10" fill="#4caf50"/><text x="560" y="38" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">tipos_ingresso</text>
<text x="500" y="64">id · PK</text><text x="500" y="80">nome</text><text x="500" y="96">preco_centavos</text><text x="500" y="112">imagem</text><text x="500" y="128">descricao</text><text x="500" y="144">ativo</text>
<rect x="490" y="200" width="140" height="90" rx="10" fill="#fff" stroke="#4caf50" stroke-width="2"/><rect x="490" y="200" width="140" height="26" rx="10" fill="#4caf50"/><text x="560" y="218" text-anchor="middle" fill="#fff" font-weight="700" font-size="12">atividades</text>
<text x="500" y="244">id · titulo · imagem</text><text x="500" y="260">alt · descricao</text><text x="500" y="276">ordem</text>
</g>
<path d="M200 96 H250" stroke="#004d8b" stroke-width="2"/><text x="212" y="90" font-size="10" fill="#004d8b" font-weight="700">1</text><text x="238" y="90" font-size="10" fill="#004d8b" font-weight="700">N</text>
<path d="M450 112 H490" stroke="#004d8b" stroke-width="2" stroke-dasharray="4 3"/>
</svg></div>
<h2 class="s">Decisões de modelagem</h2>
<ul><li><strong>Valores em centavos</strong> (inteiros), evitando erros de ponto flutuante.</li><li><strong>Papel com restrição CHECK</strong>: apenas <code>usuario</code> ou <code>superadmin</code>.</li><li><strong>tipo_nome no pedido</strong>: preserva o histórico se o tipo for renomeado (RN07).</li><li><strong>tipo_id sem chave estrangeira</strong>: tipos nunca são excluídos, apenas desativados.</li><li><strong>email_enviado</strong>: base da regra RN16 e do reenvio.</li></ul>
<h2 class="s">Persistência</h2>
<p>O arquivo <code>cataratas.db</code> fica no volume Docker <code>dados</code>, montado em <code>/data</code>. Para um backup basta copiar o arquivo com o contêiner parado, ou usar <code>docker compose cp</code>.</p>
"""))

CAPS.append(("Segurança", """
<p>A segurança foi tratada como requisito de primeira classe, em camadas, seguindo as recomendações do OWASP Top 10.</p>
<table><thead><tr><th>Risco</th><th>Controle aplicado</th></tr></thead><tbody>
<tr><td class="id">Injeção SQL</td><td>Todas as consultas usam parâmetros (<code>?</code>); nenhuma concatenação de entrada.</td></tr>
<tr><td class="id">XSS</td><td>Angular escapa dados por padrão; CSP bloqueia scripts externos e inline; e-mails escapam todo texto vindo do usuário.</td></tr>
<tr><td class="id">Autenticação fraca</td><td>bcrypt custo 12; senha de 8 a 72 caracteres; JWT HS256 com algoritmo fixado na verificação; validade de 7 dias; usuário recarregado do banco a cada requisição (mudanças de papel valem na hora).</td></tr>
<tr><td class="id">Enumeração de contas</td><td>Login e recuperação de senha devolvem mensagens genéricas; hash falso é comparado quando o e-mail não existe, igualando o tempo de resposta.</td></tr>
<tr><td class="id">Força bruta e abuso</td><td>Limite de 300 requisições/min por IP na API e 50 a cada 15 min nas rotas de autenticação.</td></tr>
<tr><td class="id">Controle de acesso</td><td>Middleware de superadmin em todas as rotas administrativas; pedidos filtrados pelo dono (RN11); o admin não altera o próprio papel.</td></tr>
<tr><td class="id">Validação de entrada</td><td>Esquemas Zod em todas as rotas; corpo limitado a 50 kB; caminho de imagem restrito ao padrão <code>imagens/arquivo</code>.</td></tr>
<tr><td class="id">Clickjacking</td><td><code>frame-ancestors 'none'</code> e <code>X-Frame-Options: DENY</code>.</td></tr>
<tr><td class="id">Redirecionamento aberto</td><td><code>destinoSeguro</code> aceita apenas caminhos internos iniciados por uma única barra.</td></tr>
<tr><td class="id">Exposição de informação</td><td>Erros 500 sem detalhes; <code>X-Powered-By</code> removido; <code>server_tokens off</code> no nginx.</td></tr>
<tr><td class="id">Segredos</td><td>JWT_SECRET exigido em produção (mínimo de 32 caracteres); <code>.env</code> ignorado pelo Git.</td></tr>
<tr><td class="id">Infraestrutura</td><td>Usuário não root; sistema de arquivos somente leitura no back-end; <code>cap_drop: ALL</code>; <code>no-new-privileges</code>; nginx sem privilégios; API não exposta fora da rede interna.</td></tr>
</tbody></table>
<div class="destaque alerta"><p><strong>Ponto de atenção.</strong> O token fica no <code>localStorage</code>, o que o torna acessível a scripts caso ocorra XSS. A CSP estrita reduz essa superfície. Em um sistema real, o ideal seria cookie <code>HttpOnly</code> com proteção CSRF, além de HTTPS obrigatório, que deve ser provido por um proxy reverso na frente do compose.</p></div>
<h2 class="s">Recomendações de implantação</h2>
<ul><li>Gerar JWT_SECRET com <code>openssl rand -hex 32</code>.</li><li>Publicar atrás de HTTPS (por exemplo, Caddy ou Traefik) e adicionar HSTS.</li><li>Usar SMTP autenticado real e trocar o remetente.</li><li>Executar backups periódicos do volume <code>dados</code>.</li></ul>
"""))

CAPS.append(("E-mail de comprovante", """
<p>Ao concluir o pedido, o back-end gera o QR Code em PNG (contendo código, tipo, quantidade e data) e envia um e-mail HTML via SMTP, com o QR Code embutido como anexo inline (<code>cid:qrcode</code>), o que funciona nos principais clientes de e-mail sem depender de imagens remotas.</p>
<h2 class="s">Conteúdo do e-mail</h2>
<ul><li>Assunto: <em>Seu ingresso - Parque Nacional do Iguaçu (CPI-XXXXXXXXXX)</em>.</li><li>Saudação com o nome do usuário, escapado contra HTML.</li><li>Tabela com código, ingresso, data e total.</li><li>QR Code e orientação sobre meia-entrada.</li><li>Rodapé informando que é um projeto de estudo com valores fictícios.</li></ul>
<h2 class="s">Configuração</h2>
<table><thead><tr><th>Variável</th><th>Padrão no compose</th><th>Uso</th></tr></thead><tbody>
<tr><td class="id">SMTP_HOST</td><td>mailpit</td><td>Servidor SMTP</td></tr>
<tr><td class="id">SMTP_PORT</td><td>1025</td><td>Porta</td></tr>
<tr><td class="id">SMTP_SECURE</td><td>false</td><td>TLS implícito (porta 465)</td></tr>
<tr><td class="id">SMTP_USER · SMTP_PASS</td><td>vazio</td><td>Credenciais</td></tr>
<tr><td class="id">MAIL_FROM</td><td>Cataratas do Iguaçu &lt;nao-responda@...&gt;</td><td>Remetente</td></tr>
<tr><td class="id">PUBLIC_URL</td><td>http://localhost:8080</td><td>Link do site no e-mail</td></tr>
</tbody></table>
<h2 class="s">Comportamento em falhas</h2>
<p>O envio tem tempos limite de conexão. Se falhar, o erro é registrado no log, o pedido continua válido e é marcado como <em>E-mail pendente</em> (RN16). O usuário pode usar <em>Reenviar</em> na lista de pedidos ou na janela do QR Code.</p>
<div class="destaque verde"><p><strong>Demonstração:</strong> com o compose padrão, todos os e-mails ficam retidos no Mailpit e podem ser lidos em <code>http://localhost:8025</code>; nenhum e-mail sai para a internet.</p></div>
"""))

CAPS.append(("Superadmin e CLI", """
<h2 class="s">Painel administrativo</h2>
<p>Usuários com papel <code>superadmin</code> veem o item <em>Admin</em> no menu e acessam <code>/admin</code>. A rota é protegida no front-end pelo <code>adminGuard</code> e, de forma definitiva, na API, que responde 403 para qualquer outro papel.</p>
<table><thead><tr><th>Aba</th><th>Funções</th></tr></thead><tbody>
<tr><td class="id">Resumo</td><td>Usuários, pedidos, ingressos vendidos, pedidos do dia e receita fictícia.</td></tr>
<tr><td class="id">Pedidos</td><td>Tabela com código, cliente, ingresso, data, total e status do e-mail.</td></tr>
<tr><td class="id">Usuários</td><td>Lista com quantidade de pedidos e troca de papel (exceto o próprio).</td></tr>
<tr><td class="id">Ingressos</td><td>Criar e editar tipos: nome, preço, descrição, imagem e disponibilidade.</td></tr>
<tr><td class="id">Lazer</td><td>Criar, editar e excluir atividades.</td></tr>
</tbody></table>
<h2 class="s">CLI para o desenvolvedor</h2>
<p>O desenvolvedor cadastra e altera superadmins diretamente no terminal, sem depender de interface ou de credenciais padrão. A senha, quando omitida, é solicitada de forma oculta, evitando que apareça no histórico do shell.</p>
<table><thead><tr><th>Comando</th><th>Efeito</th></tr></thead><tbody>
<tr><td class="id">criar</td><td>Cria um superadmin (ou promove usuário existente). Opções: <code>--email</code>, <code>--nome</code>, <code>--senha</code>, <code>--telefone</code>.</td></tr>
<tr><td class="id">atualizar</td><td>Altera nome, e-mail (<code>--novo-email</code>), telefone ou senha de um superadmin.</td></tr>
<tr><td class="id">promover</td><td>Torna um usuário existente superadmin.</td></tr>
<tr><td class="id">rebaixar</td><td>Remove o papel; bloqueia o último superadmin sem <code>--forcar sim</code>.</td></tr>
<tr><td class="id">listar</td><td>Lista os superadmins cadastrados.</td></tr>
</tbody></table>
<h3 class="s">Uso com Docker</h3>
<pre><code>docker compose exec backend node src/cli.js superadmin criar \\
  --email admin@exemplo.com --nome "Admin Geral"

docker compose exec backend node src/cli.js superadmin atualizar \\
  --email admin@exemplo.com --novo-email root@exemplo.com

docker compose exec backend node src/cli.js superadmin promover --email maria@exemplo.com
docker compose exec backend node src/cli.js superadmin rebaixar --email maria@exemplo.com
docker compose exec backend node src/cli.js superadmin listar</code></pre>
<h3 class="s">Uso local</h3>
<pre><code>cd backend
node src/cli.js superadmin criar --email admin@exemplo.com --nome "Admin Geral"</code></pre>
<p>Como a API recarrega o usuário do banco a cada requisição, mudanças de papel feitas pela CLI valem imediatamente, sem reiniciar serviços.</p>
"""))

CAPS.append(("Docker e implantação", """
<h2 class="s">Serviços</h2>
<table><thead><tr><th>Serviço</th><th>Imagem</th><th>Porta</th><th>Observações</th></tr></thead><tbody>
<tr><td class="id">frontend</td><td>Build em Node 22 Alpine; execução em nginx-unprivileged</td><td>8080</td><td>Entrega o Angular e faz proxy de /api; aguarda o back-end saudável.</td></tr>
<tr><td class="id">backend</td><td>Node 22 Alpine</td><td>interna 3000</td><td>Usuário node; somente leitura; volume <code>dados</code>; healthcheck.</td></tr>
<tr><td class="id">mailpit</td><td>axllent/mailpit</td><td>8025</td><td>Caixa de entrada de demonstração.</td></tr>
</tbody></table>
<h2 class="s">Executando</h2>
<pre><code>cp .env.example .env
# edite JWT_SECRET (openssl rand -hex 32)
docker compose up --build</code></pre>
<table><thead><tr><th>Endereço</th><th>Descrição</th></tr></thead><tbody>
<tr><td class="id">http://localhost:8080</td><td>Site</td></tr>
<tr><td class="id">http://localhost:8025</td><td>Mailpit (e-mails enviados)</td></tr>
</tbody></table>
<h2 class="s">Criando o primeiro superadmin</h2>
<pre><code>docker compose exec backend node src/cli.js superadmin criar \\
  --email voce@exemplo.com --nome "Seu Nome"</code></pre>
<h2 class="s">Desenvolvimento sem Docker</h2>
<pre><code>cd backend  &amp;&amp; npm install &amp;&amp; npm run dev
cd frontend &amp;&amp; npm install &amp;&amp; npm start
cd backend  &amp;&amp; npm test</code></pre>
<p>O servidor de desenvolvimento do Angular (porta 4200) encaminha <code>/api</code> para a porta 3000 por meio de <code>proxy.conf.json</code>. Requer Node 22.13 ou superior.</p>
<h2 class="s">Operação</h2>
<ul><li><strong>Logs:</strong> <code>docker compose logs -f backend</code>.</li><li><strong>Parar:</strong> <code>docker compose down</code> (mantém os volumes). Use <code>-v</code> apenas para apagar os dados.</li><li><strong>Atualizar:</strong> <code>docker compose up --build -d</code>.</li></ul>
<div class="destaque alerta"><p><strong>Observação de validação.</strong> A verificação dos Dockerfiles não pôde ser concluída no ambiente de desenvolvimento deste projeto, porque o contêiner de build não tinha acesso ao registro npm. A aplicação, os testes e o build do Angular foram executados e validados diretamente; recomenda-se executar <code>docker compose up --build</code> em uma máquina com internet para a primeira conferência.</p></div>
"""))

CAPS.append(("Testes e qualidade", """
<h2 class="s">Testes automatizados</h2>
<p>O back-end possui testes com o executor nativo do Node (<code>node --test</code>), executados com banco em memória e um serviço de e-mail simulado, sem rede.</p>
<table><thead><tr><th>Teste</th><th>Cobertura</th></tr></thead><tbody>
<tr><td class="id">Conteúdo público</td><td>Health, parque, atividades e tipos de ingresso.</td></tr>
<tr><td class="id">Registro e login</td><td>Validações, e-mail duplicado, normalização, credenciais erradas e perfil.</td></tr>
<tr><td class="id">Pedidos e QR Code</td><td>Autenticação, tipo inexistente, data passada, total, e-mail enviado, reenvio, QR Code e 404.</td></tr>
<tr><td class="id">Superadmin</td><td>403 para usuário comum, 401 sem token, resumo, listas, criação e edição de tipos e atividades.</td></tr>
<tr><td class="id">CLI</td><td>Criar, atualizar, promover, rebaixar, listar, senha curta e proteção do último superadmin.</td></tr>
</tbody></table>
<pre><code>cd backend &amp;&amp; npm test
# tests 5 · pass 5 · fail 0</code></pre>
<h2 class="s">Verificação do front-end</h2>
<p>Um roteiro automatizado com navegador headless percorreu, em 1280 px e 390 px, cadastro, login com retorno à página de origem, compra, QR Code, painel administrativo e janelas de edição, registrando erros de console e rolagem horizontal. O resultado final foi zero erros e zero estouros de largura.</p>
<h2 class="s">Boas práticas adotadas</h2>
<ul><li>Separação de camadas e injeção de dependências na API.</li><li>Validação na borda (Zod) e regras críticas calculadas no servidor.</li><li>Tipagem estrita no Angular e interfaces compartilhadas.</li><li>Código sem comentários, com nomes autoexplicativos.</li><li>Commits pequenos e descritivos, com histórico do projeto.</li></ul>
"""))

CAPS.append(("Limitações e evolução", """
<h2 class="s">Limitações conhecidas</h2>
<ul><li>Pagamento é fictício: nenhum gateway é integrado.</li><li>Recuperação de senha é simulada: não há envio de link de redefinição.</li><li>O QR Code identifica o pedido, mas não há leitor ou validação de entrada.</li><li>Não há controle de capacidade diária do parque.</li><li>Sessão baseada em token no navegador (ver capítulo de segurança).</li><li>SQLite atende bem a um portfólio, mas não a múltiplas instâncias.</li></ul>
<h2 class="s">Possíveis evoluções</h2>
<div class="duas">
<div class="cartao"><h4>Produto</h4><ul><li>Redefinição de senha por e-mail</li><li>Leitor de QR Code para portaria</li><li>Capacidade e calendário por data</li><li>Internacionalização (inglês e espanhol)</li></ul></div>
<div class="cartao"><h4>Engenharia</h4><ul><li>Cookie HttpOnly e proteção CSRF</li><li>PostgreSQL e migrações versionadas</li><li>Testes de ponta a ponta no CI</li><li>Observabilidade e logs estruturados</li></ul></div>
</div>
"""))

CAPS.append(("Glossário", """
<table><thead><tr><th>Termo</th><th>Significado</th></tr></thead><tbody>
<tr><td class="id">Angular</td><td>Framework de front-end em TypeScript.</td></tr>
<tr><td class="id">API REST</td><td>Interface de comunicação sobre HTTP usando recursos e verbos.</td></tr>
<tr><td class="id">bcrypt</td><td>Algoritmo de hash de senhas com custo configurável.</td></tr>
<tr><td class="id">CLI</td><td>Interface de linha de comando.</td></tr>
<tr><td class="id">CSP</td><td>Content Security Policy: política que limita as origens de conteúdo da página.</td></tr>
<tr><td class="id">Docker Compose</td><td>Ferramenta que descreve e executa múltiplos contêineres.</td></tr>
<tr><td class="id">JWT</td><td>JSON Web Token: credencial assinada usada para sessões.</td></tr>
<tr><td class="id">Mailpit</td><td>Servidor SMTP de testes com caixa de entrada web.</td></tr>
<tr><td class="id">Papel</td><td>Perfil de acesso do usuário: usuário ou superadmin.</td></tr>
<tr><td class="id">QR Code</td><td>Código de barras bidimensional lido por câmeras.</td></tr>
<tr><td class="id">RF · RNF · RN</td><td>Requisito funcional, requisito não funcional e regra de negócio.</td></tr>
<tr><td class="id">SMTP</td><td>Protocolo de envio de e-mails.</td></tr>
<tr><td class="id">SQLite</td><td>Banco de dados relacional em arquivo.</td></tr>
<tr><td class="id">Superadmin</td><td>Usuário com acesso ao painel administrativo.</td></tr>
</tbody></table>
"""))
