import diag

def tab(cols, rows, cls='', idcol=True):
    h = ''.join(f'<th>{c}</th>' for c in cols)
    b = ''
    for r in rows:
        tds = ''
        for i, c in enumerate(r):
            if i == 0 and idcol: tds += f'<td class="id">{c}</td>'
            elif isinstance(c, str) and c.startswith('@'): tds += f'<td><span class="pri{" m" if c[1:] in ("Should","Média") else (" c" if c[1:] in ("Could","Baixa") else "")}">{c[1:]}</span></td>'
            else: tds += f'<td>{c}</td>'
        b += f'<tr>{tds}</tr>'
    return f'<table class="{cls}"><thead><tr>{h}</tr></thead><tbody>{b}</tbody></table>'

def fig(src, leg, cls=''):
    return f'<figure class="{cls}"><img src="img/{src}" alt="{leg}"><figcaption>{leg}</figcaption></figure>'

def par(*itens):
    c = ''.join(f'<div><img src="img/{s}" alt="{l}"><figcaption>{l}</figcaption></div>' for s, l in itens)
    return f'<figure class="par">{c}</figure>'

def nota(t, cls=''): return f'<div class="destaque {cls}"><p>{t}</p></div>'

def uc(id_, nome, ator, pre, fluxo, alt, pos, rel):
    f = ''.join(f'<li>{x}</li>' for x in fluxo)
    a = ''.join(f'<li>{x}</li>' for x in alt)
    return (f'<div class="uc"><div class="uc-t"><b>{id_}</b> {nome}</div><table class="uct"><tbody>'
            f'<tr><th>Ator</th><td>{ator}</td></tr><tr><th>Pré-condições</th><td>{pre}</td></tr>'
            f'<tr><th>Fluxo principal</th><td><ol>{f}</ol></td></tr><tr><th>Fluxos alternativos e exceções</th><td><ul>{a}</ul></td></tr>'
            f'<tr><th>Pós-condições</th><td>{pos}</td></tr><tr><th>Rastreio</th><td>{rel}</td></tr></tbody></table></div>')

CAPS = {}

CAPS[1] = ('Introdução', 1, """
<h2 class="s">1.1 Finalidade do documento</h2>
<p>Este livro é a <strong>documentação de sistema</strong> do <em>Cataratas do Iguaçu</em>. Ele reúne, em um único documento, a <strong>especificação de requisitos de software</strong> (SRS), a <strong>descrição da arquitetura</strong> (SAD/SDD), a estratégia de testes, a rastreabilidade e o guia de operação. A estrutura segue as recomendações da <strong>ISO/IEC/IEEE 29148:2018</strong> (engenharia de requisitos), da <strong>ISO/IEC/IEEE 42010:2022</strong> (descrição de arquitetura) e do modelo de qualidade da <strong>ISO/IEC 25010</strong>, adaptadas ao porte de um projeto de portfólio.</p>
""" + nota('<strong>Projeto de fã, apenas portfólio.</strong> O sistema descrito aqui foi criado por um fã, para homenagear as Cataratas do Iguaçu. Ele <strong>não representa o site real</strong> do parque, não tem vínculo com o Parque Nacional do Iguaçu nem com seus órgãos gestores e não realiza vendas reais. Ingressos, preços, pagamentos, e-mails e contatos são fictícios ou ilustrativos. As fotografias do livro provêm do acervo do projeto educacional original, sem créditos de autoria informados no repositório.', 'alerta') + """
<h2 class="s">1.2 Escopo do produto</h2>
""" + tab(['Dentro do escopo','Fora do escopo'], [[
 '<ul><li>Site institucional com informações do parque e atividades de lazer</li><li>Cadastro, autenticação e perfis (usuário e superadmin)</li><li>Venda fictícia de ingressos com QR Code e comprovante por e-mail</li><li>Painel administrativo e CLI de superadmin</li><li>Empacotamento e execução com Docker</li></ul>',
 '<ul><li>Pagamento real e emissão fiscal</li><li>Validação de entrada na portaria (leitura do QR Code)</li><li>Controle de capacidade e calendário por dia</li><li>Redefinição de senha por e-mail</li><li>Qualquer integração oficial com o parque</li></ul>']], idcol=False) + """
<h2 class="s">1.3 Público-alvo e como usar o documento</h2>
""" + tab(['Leitor','Capítulos recomendados'], [
 ['Avaliador / recrutador', '1, 2, 3 e 19 (visão geral, telas e limitações)'],
 ['Analista de requisitos / QA', '4 a 8, 15 e 16 (requisitos, regras, casos de uso, testes, rastreabilidade)'],
 ['Desenvolvedor', '9 a 14 (arquitetura, front-end, API, segurança, e-mail, CLI)'],
 ['Operação / DevOps', '17 (implantação e operação) e 12 (segurança)'],
 ['Designer / UX', '3, 10 e 18 (telas, sistema de design e acessibilidade)']], idcol=False) + """
<h2 class="s">1.4 Convenções</h2>
<ul><li><strong>Identificadores:</strong> RF (requisito funcional), RNF (não funcional), RN (regra de negócio), UC (caso de uso), ADR (decisão arquitetural), TC (caso de teste), R (risco).</li>
<li><strong>Prioridade (MoSCoW):</strong> <em>Must</em> (essencial), <em>Should</em> (importante), <em>Could</em> (desejável).</li>
<li><strong>Critérios de aceitação:</strong> escritos no formato <em>Dado / Quando / Então</em> e verificáveis.</li>
<li><strong>Valores monetários:</strong> sempre fictícios, em reais, armazenados em centavos.</li></ul>
<h2 class="s">1.5 Referências normativas e técnicas</h2>
<p>As normas e guias abaixo orientaram a organização do documento e as decisões técnicas. O texto declara <em>alinhamento</em> às práticas, e não certificação ou conformidade formal. A lista completa está no Apêndice B.</p>
""")

CAPS[2] = ('Visão do produto', 1, """
<h2 class="s">2.1 Problema e oportunidade</h2>
<p>O Parque Nacional do Iguaçu e suas cataratas inspiram um interesse enorme, mas a experiência digital de um visitante envolve várias etapas: entender horários e atrações, escolher ingresso, comprar e levar o comprovante. O projeto propõe uma jornada fluida e bonita para essas etapas e, ao mesmo tempo, serve como <strong>vitrine técnica</strong> de um sistema completo: interface moderna, API segura, painel administrativo, e-mail transacional e operação em contêineres.</p>
""" + par(('parte1.jpg','Cataratas do Iguaçu vistas do alto.'),('parte2.jpg','Quedas e mata atlântica ao redor.')) + """
<h2 class="s">2.2 Partes interessadas</h2>
""" + tab(['Parte interessada','Interesse','Influência'], [
 ['Visitante / usuário', 'Informação clara e compra de ingresso simples, em celular ou computador', 'Alta (define a usabilidade)'],
 ['Superadmin', 'Manter ingressos, preços, atividades; acompanhar pedidos e usuários', 'Alta'],
 ['Desenvolvedor / mantenedor', 'Código legível, testes, execução reproduzível, segurança', 'Alta'],
 ['Avaliador de portfólio', 'Evidências de boas práticas de engenharia e de UX', 'Média'],
 ['Parque Nacional do Iguaçu', 'Não envolvido; o projeto é homenagem e não possui vínculo', 'Nenhuma']]) + """
<h2 class="s">2.3 Perfis de usuário (personas)</h2>
<div class="duas">
<div class="cartao"><h4>Marina, 29 · visitante planejando a viagem</h4><p>Usa o celular, quer ver horários, atividades e comprar ingressos sem se perder. Precisa receber o comprovante no e-mail e abrir o QR Code rapidamente na portaria.</p></div>
<div class="cartao"><h4>Carlos, 41 · superadmin</h4><p>Responde pela operação. Precisa ajustar preços, ativar ou desativar tipos de ingresso, acompanhar pedidos e conceder acesso a outras pessoas de forma controlada.</p></div>
<div class="cartao"><h4>Dev · mantenedor</h4><p>Sobe o sistema com um comando, cria o primeiro superadmin pelo terminal e precisa de logs, healthcheck e testes confiáveis.</p></div>
<div class="cartao"><h4>Ana · avaliadora de portfólio</h4><p>Quer entender rapidamente o que foi construído, como foi decidido e o que ainda é limitação, tudo sustentado por evidências.</p></div>
</div>
<h2 class="s">2.4 Objetivos e indicadores de sucesso</h2>
""" + tab(['ID','Objetivo','Indicador','Meta'], [
 ['OB1','Jornada de compra curta','Passos do usuário logado, do clique em Comprar ao QR Code','3 passos (tipo, quantidade e data, confirmar)'],
 ['OB2','Experiência responsiva','Rolagem horizontal nas telas verificadas','Zero em 390 px e 1280 px'],
 ['OB3','Carregamento leve','Tamanho publicado do front-end','5,1 MB (reduzido de 36 MB após otimizar imagens)'],
 ['OB4','Segurança básica sólida','Itens do OWASP Top 10 com controle aplicado','10 de 10 tratados (cap. 12)'],
 ['OB5','Qualidade verificável','Testes automatizados (API e CLI) e ponta a ponta (interface)','5 de 5 e 12 de 12 aprovados'],
 ['OB6','Operação simples','Comandos para subir o sistema','1 (docker compose up --build)']]) + """
<h2 class="s">2.5 Premissas, restrições e dependências</h2>
""" + tab(['Tipo','Descrição'], [
 ['Premissa', 'Os usuários têm navegador moderno e acesso a e-mail.'],
 ['Premissa', 'Todos os dados e valores são fictícios; não há tratamento de dados reais de clientes.'],
 ['Restrição', 'Sem pagamento real, sem controle de capacidade e sem leitura de QR Code na portaria.'],
 ['Restrição', 'Banco SQLite em arquivo: uma única instância da API por volume de dados.'],
 ['Restrição', 'Node.js 22.13 ou superior (uso do módulo nativo node:sqlite).'],
 ['Dependência', 'Servidor SMTP (Mailpit na demonstração; SMTP real em produção).'],
 ['Dependência', 'Google Maps (iframe) para o mapa de como chegar.'],
 ['Dependência', 'Registro npm e Docker Hub para construir as imagens.']], idcol=False) + """
<h2 class="s">2.6 Riscos do projeto</h2>
<p>Probabilidade (P) e impacto (I) em escala de 1 (baixo) a 3 (alto); severidade = P × I.</p>
""" + tab(['ID','Risco','P','I','Sev.','Resposta'], [
 ['R1','Vazamento de credenciais por segredo fraco ou versionado','2','3','6','JWT_SECRET obrigatório (mín. 32 caracteres) em produção; .env fora do Git'],
 ['R2','Abuso por força bruta no login','2','2','4','Limite de requisições e mensagens genéricas'],
 ['R3','Falha do SMTP impedindo comprovantes','2','2','4','Pedido não é perdido; estado pendente e reenvio'],
 ['R4','Perda de dados do SQLite','1','3','3','Volume persistente e procedimento de backup (cap. 17)'],
 ['R5','Confusão com um site oficial','2','3','6','Aviso de fã em todas as áreas relevantes (RF05) e neste livro'],
 ['R6','Token em localStorage exposto por XSS','1','3','3','CSP estrita; evolução recomendada: cookie HttpOnly'],
 ['R7','Imagens pesadas degradando o carregamento','3','2','6','Mitigado: JPEG otimizado, carregamento sob demanda']]) )

CAPS[3] = ('Descrição geral e interfaces', 2, """
<h2 class="s">3.1 Perspectiva do produto</h2>
<p>O sistema é uma aplicação web autônoma de três camadas (apresentação, aplicação e dados) acompanhada de uma ferramenta de linha de comando. Ele interage com dois serviços externos: um servidor SMTP, para o envio de comprovantes, e o Google Maps, apenas por <em>iframe</em>. A figura abaixo apresenta o <strong>diagrama de contexto</strong> (C4, nível 1).</p>
""" + diag.c4_contexto() + """
<figcaption class="leg">Figura 3.1 · Diagrama de contexto (C4 nível 1).</figcaption>
<h2 class="s">3.2 Interfaces externas</h2>
""" + tab(['ID','Interface','Descrição'], [
 ['IE1','Interface de usuário','SPA Angular responsiva (celular a desktop), temas claro e escuro, em português do Brasil.'],
 ['IE2','API HTTP/JSON','Endpoints REST sob /api, autenticação por Bearer JWT, erros em { erro, campos } (cap. 11).'],
 ['IE3','SMTP','Envio de e-mail HTML com anexo inline (cid:qrcode). Servidor configurável por variáveis de ambiente.'],
 ['IE4','Google Maps','Iframe incorporado no painel Como chegar, permitido pela CSP (frame-src).'],
 ['IE5','Linha de comando','node src/cli.js superadmin &lt;comando&gt; para gestão de superadmins (cap. 14).']]) + """
<h2 class="s">3.3 Visão geral das telas</h2>
<p>O design mantém a identidade do projeto original: azul das águas, verde da mata, barra lateral com a ilustração do rio no desktop e menu superior no celular. A evolução adicionou tipografia moderna, vidro fosco no hero, cartões com imagem, bilhetes, animações e tema escuro.</p>
""" + fig('home.jpg','Página inicial: título, chamada para compra e atalhos informativos (modo claro).') + fig('lazer.jpg','Lazer: grade responsiva de cartões com imagem, título e resumo.', 'rec') + par(('lazer-modal.jpg','Detalhes de uma atividade no desktop.'),('mobile-lazer-modal.jpg','Detalhes no celular.')) + fig('ingressos.jpg','Ingressos: bilhetes e lista de pedidos do usuário.', 'rec') + par(('compra.jpg','Compra: quantidade, data e total.'),('qr.jpg','Comprovante: QR Code e status do e-mail.')) + par(('login.jpg','Login.'),('registro.jpg','Cadastro.')) + par(('mobile-home.jpg','Home no celular com menu aberto.'),('mobile-ingressos.jpg','Ingressos e pedidos no celular.')) + fig('sobre.jpg','Sobre: texto institucional e aviso de projeto de fã.', 'rec') + """
<h2 class="s">3.4 Modo claro e modo escuro</h2>
<p>Um botão com ícone de sol e lua alterna o tema. Sem escolha prévia, o sistema segue a preferência do sistema operacional; a escolha manual é guardada no navegador e aplicada antes da primeira renderização, evitando o flash de tema errado.</p>
""" + par(('escuro-ingressos.jpg','Ingressos no modo escuro.'),('escuro-mobile.jpg','Lazer no modo escuro (celular).')) + fig('escuro-admin.jpg','Painel administrativo no modo escuro, com contadores animados.') + """
<h2 class="s">3.5 Painel administrativo</h2>
""" + fig('admin-resumo.jpg','Resumo: métricas gerais.') + fig('admin-pedidos.jpg','Pedidos: consulta com status do e-mail.') + fig('admin-editar-ingresso.jpg','Edição de um tipo de ingresso.') + """
<h2 class="s">3.6 Características dos usuários e ambiente</h2>
""" + tab(['Perfil','Papel no sistema','Acesso'], [
 ['Visitante','Consulta conteúdo público','Sem login'],
 ['Usuário','Compra e consulta os próprios pedidos','Cadastro e login'],
 ['Superadmin','Administra ingressos, atividades, pedidos e usuários','Papel superadmin, concedido por outro superadmin ou pela CLI'],
 ['Desenvolvedor','Opera a infraestrutura e a CLI','Acesso ao terminal / Docker']], idcol=False))

RF = [
 ('Conteúdo público', [
  ('RF01','Exibir a página inicial com título, chamada para compra e atalhos de Funcionamento, Como chegar, Estacionamento e Mapa.','@Must','<em>Dado</em> um visitante na página inicial, <em>quando</em> clica em um atalho, <em>então</em> vê o painel correspondente e pode fechá-lo.','UC01'),
  ('RF02','Exibir a página Sobre com a descrição do parque.','@Should','<em>Dado</em> um visitante, <em>quando</em> abre Sobre, <em>então</em> lê o texto institucional e o aviso de projeto de fã.','UC01'),
  ('RF03','Listar as atividades de lazer em cartões e exibir o detalhe completo em janela modal.','@Must','<em>Dado</em> a lista carregada, <em>quando</em> clica em Ler mais, <em>então</em> abre o texto completo, fechável por botão, fundo ou Esc.','UC01'),
  ('RF04','Listar os tipos de ingresso ativos com nome, descrição e preço.','@Must','<em>Dado</em> tipos ativos e inativos, <em>quando</em> abre Ingressos, <em>então</em> só os ativos aparecem, com preço em reais.','UC01'),
  ('RF05','Exibir o aviso de projeto de fã no rodapé e nas páginas Sobre e Ingressos.','@Must','<em>Dado</em> qualquer página com layout, <em>então</em> o rodapé informa que não é o site oficial.','UC01'),
  ('RF06','Permitir alternar entre tema claro e escuro, respeitando a preferência do sistema e guardando a escolha.','@Should','<em>Dado</em> sem escolha prévia, <em>então</em> o tema segue o sistema; <em>quando</em> alterna, <em>então</em> persiste ao recarregar.','UC02'),
 ]),
 ('Conta e acesso', [
  ('RF07','Permitir o cadastro com nome, e-mail, telefone e senha com confirmação.','@Must','<em>Dado</em> dados válidos, <em>quando</em> envia, <em>então</em> a conta é criada e a sessão iniciada; e-mail repetido retorna 409.','UC03'),
  ('RF08','Permitir login por e-mail e senha, mantendo a sessão.','@Must','<em>Dado</em> credenciais corretas, <em>então</em> recebe token; incorretas, <em>então</em> 401 com mensagem genérica.','UC04'),
  ('RF09','Permitir encerrar a sessão.','@Must','<em>Quando</em> clica em Sair, <em>então</em> o token é descartado e o menu volta ao estado público.','UC04'),
  ('RF10','Oferecer recuperação de senha com resposta genérica.','@Could','<em>Dado</em> qualquer e-mail válido, <em>então</em> a resposta é a mesma, exista ou não a conta (simulada).','UC04'),
  ('RF11','Redirecionar visitantes ao login ao tentar comprar e devolvê-los à página de origem.','@Should','<em>Dado</em> visitante em Ingressos, <em>quando</em> clica em comprar e faz login, <em>então</em> retorna a Ingressos.','UC05'),
 ]),
 ('Compra de ingressos', [
  ('RF12','Permitir a compra escolhendo tipo, quantidade (1 a 10) e data da visita.','@Must','<em>Dado</em> usuário logado e dados válidos, <em>então</em> o pedido é criado com total calculado no servidor.','UC05'),
  ('RF13','Gerar código único (CPI-XXXXXXXXXX) e QR Code por pedido.','@Must','<em>Dado</em> um pedido, <em>então</em> há um código único e um QR Code em PNG.','UC05, UC06'),
  ('RF14','Enviar o comprovante com QR Code por e-mail.','@Must','<em>Dado</em> pedido criado, <em>então</em> o e-mail é enviado e o pedido marcado como enviado; se falhar, fica pendente.','UC05'),
  ('RF15','Permitir o reenvio do comprovante.','@Should','<em>Dado</em> um pedido próprio, <em>quando</em> reenvia, <em>então</em> novo e-mail é enviado ou erro 502 é informado.','UC06'),
  ('RF16','Listar os pedidos do usuário com o status do e-mail.','@Must','<em>Dado</em> usuário logado, <em>então</em> vê somente os próprios pedidos, do mais recente ao mais antigo.','UC07'),
 ]),
 ('Administração', [
  ('RF17','Exibir resumo de usuários, pedidos, ingressos vendidos, pedidos do dia e receita.','@Should','<em>Dado</em> superadmin, <em>então</em> vê as cinco métricas; outros papéis recebem 403.','UC08'),
  ('RF18','Permitir ao superadmin consultar todos os pedidos.','@Must','<em>Dado</em> superadmin, <em>então</em> lista pedidos de todos, com cliente e status do e-mail.','UC08'),
  ('RF19','Permitir consultar usuários e alterar o papel (usuário ou superadmin).','@Must','<em>Dado</em> superadmin, <em>quando</em> altera o papel de outro usuário, <em>então</em> vale imediatamente; no próprio usuário é bloqueado.','UC08'),
  ('RF20','Permitir criar e editar tipos de ingresso (nome, preço, descrição, imagem, disponibilidade).','@Must','<em>Dado</em> superadmin, <em>quando</em> salva, <em>então</em> a vitrine pública reflete a mudança.','UC09'),
  ('RF21','Permitir criar, editar e excluir atividades de lazer.','@Should','<em>Dado</em> superadmin, <em>quando</em> salva ou exclui, <em>então</em> a página Lazer reflete a mudança.','UC10'),
 ]),
 ('Operação', [
  ('RF22','Permitir ao desenvolvedor cadastrar e alterar superadmins pelo terminal.','@Must','<em>Dado</em> acesso ao terminal, <em>quando</em> executa a CLI, <em>então</em> cria, atualiza, promove, rebaixa ou lista superadmins.','UC11'),
 ]),
]

def rf_html():
    out = ''
    for mod, itens in RF:
        out += f'<h2 class="s">{mod}</h2>' + tab(['ID','Requisito','Prior.','Critério de aceitação','UC'], [list(i) for i in itens])
    return out

CAPS[4] = ('Requisitos funcionais', 2, """
<p>Os requisitos abaixo são <strong>necessários, verificáveis, não ambíguos e rastreáveis</strong>, conforme a ISO/IEC/IEEE 29148. Cada um possui prioridade MoSCoW, critério de aceitação e vínculo com um caso de uso. A matriz completa de rastreabilidade está no capítulo 16.</p>
""" + rf_html() + nota('<strong>Situação:</strong> os 22 requisitos estão implementados. Os critérios de aceitação são exercitados pelos testes automatizados da API e da CLI (cap. 15) e por verificação scriptada da interface em navegador.', 'verde'))

RNF = [
 ('RNF01','Desempenho','Pacote inicial pequeno e rotas carregadas sob demanda (lazy loading).','Inicial: 660 kB bruto / 125 kB transferidos (JS + CSS); páginas de 1,3 a 10 kB cada','Saída do ng build'),
 ('RNF02','Desempenho','Imagens otimizadas; hero em JPEG progressivo.','cataratas-1.jpg: 466 kB (antes 15,8 MB); pasta publicada: 5,1 MB (antes 36 MB)','Inspeção dos arquivos e du'),
 ('RNF03','Compatibilidade','Funcionar em navegadores modernos.','Verificado em Chromium; Firefox e Safari recentes esperados (CSS e APIs padrão)','Execução scriptada em Chromium'),
 ('RNF04','Usabilidade','Interface responsiva sem rolagem horizontal.','Zero estouro em 390 px e 1280 px, em todas as telas','Script com navegador headless'),
 ('RNF05','Usabilidade','Tema claro e escuro, sem flash na carga.','Tema definido por script externo antes do Angular iniciar; persistência em localStorage','Teste de alternância, recarga e prefers-color-scheme'),
 ('RNF06','Usabilidade','Movimento reduzido respeitado.','Todas as animações desativadas com prefers-reduced-motion','Inspeção do CSS'),
 ('RNF07','Acessibilidade','Boas práticas de WCAG 2.2: rótulos, foco visível, teclado.','Labels em campos, aria-label em ícones, foco visível, Esc fecha janelas','Inspeção; auditoria formal não realizada'),
 ('RNF08','Confiabilidade','Resiliência a falhas de e-mail e reinícios.','Pedido preservado se o SMTP falhar; restart unless-stopped; healthcheck a cada 15 s','Teste de reenvio; configuração do compose'),
 ('RNF09','Segurança','Armazenamento seguro de senhas.','bcrypt custo 12; senha de 8 a 72 caracteres','Teste da CLI e da API; revisão de código'),
 ('RNF10','Segurança','Sessões assinadas e com validade.','JWT HS256 com algoritmo fixado na verificação; validade 7 dias; usuário recarregado do banco a cada requisição','Testes de 401 e de papel'),
 ('RNF11','Segurança','Validação de entrada e consultas seguras.','Zod em todas as rotas; SQL 100% parametrizado; corpo máximo 50 kB','Testes de 400; revisão de código'),
 ('RNF12','Segurança','Proteção contra abuso.','300 req/min por IP na API; 50 por 15 min nas rotas de autenticação','Configuração e inspeção'),
 ('RNF13','Segurança','Cabeçalhos de segurança e CSP restritiva.','CSP default-src self; frame-ancestors none; nosniff; Referrer-Policy no-referrer','Inspeção dos cabeçalhos'),
 ('RNF14','Segurança','Infraestrutura endurecida.','Usuário não root, back-end somente leitura, cap_drop ALL, no-new-privileges, nginx sem privilégios','Inspeção do compose e dos Dockerfiles'),
 ('RNF15','Segurança','Segredos obrigatórios em produção.','Sem JWT_SECRET de 32+ caracteres o servidor não inicia','Execução com e sem a variável'),
 ('RNF16','Manutenibilidade','Código modular, tipado e testado, sem comentários.','Back-end: ~600 linhas em 6 módulos; front-end Angular standalone; 5 testes de API/CLI e 6 cenários E2E (12 execuções)','Revisão; npm test e playwright test'),
 ('RNF17','Portabilidade','Execução reproduzível por contêineres.','docker compose up --build sobe frontend, backend e mailpit','Configuração do compose (build não validado no sandbox)'),
 ('RNF18','Operabilidade','Diagnóstico simples.','GET /api/health; logs no stdout; erros 500 registrados sem vazar detalhes ao cliente','Chamada ao endpoint e inspeção do código'),
 ('RNF19','Privacidade','Minimização e finalidade (LGPD).','Coleta apenas nome, e-mail, telefone e senha (hash); senhas nunca retornam pela API; dados fictícios','Revisão das rotas e do esquema'),
]

CAPS[5] = ('Requisitos não funcionais', 2, """
<p>Os requisitos não funcionais estão classificados pelas características de qualidade da <strong>ISO/IEC 25010</strong>. Cada item traz uma métrica ou evidência observável e o método de verificação, evitando afirmações vagas.</p>
""" + tab(['ID','Característica','Requisito','Métrica / evidência','Verificação'], [list(r) for r in RNF]) + nota('As métricas de tamanho foram obtidas do próprio build. Itens marcados como inspeção não substituem testes de carga ou auditorias formais de acessibilidade e segurança, que ficam como evolução (cap. 19).', 'alerta'))

RN = [
 ('RN01','O e-mail é único no sistema e normalizado para minúsculas.','Evitar contas duplicadas e ambiguidade no login.','RF07, RF08'),
 ('RN02','A senha deve ter de 8 a 72 caracteres.','Resistência mínima a adivinhação; 72 bytes é o limite do bcrypt.','RF07'),
 ('RN03','O telefone deve conter 10 ou 11 dígitos, com DDD.','Padrão telefônico brasileiro.','RF07'),
 ('RN04','Cada pedido comporta de 1 a 10 ingressos de um mesmo tipo.','Limitar abuso e simplificar o comprovante.','RF12'),
 ('RN05','A data da visita não pode estar no passado (tolera-se o dia anterior em UTC).','Evitar compras inválidas sem rejeitar usuários de fusos diferentes.','RF12'),
 ('RN06','O total é calculado no servidor: preço atual do tipo × quantidade.','Integridade financeira; o cliente não define valores.','RF12'),
 ('RN07','O pedido guarda o nome do tipo no momento da compra.','Preservar o histórico se o tipo for renomeado.','RF12, RF16'),
 ('RN08','Somente tipos de ingresso ativos podem ser comprados.','Permitir retirar tipos da vitrine sem apagar histórico.','RF04, RF12, RF20'),
 ('RN09','Meia-entrada exige documento comprobatório na entrada.','Regra do benefício; informativa no sistema.','RF04'),
 ('RN10','O código do pedido segue CPI- + 10 caracteres hexadecimais maiúsculos.','Identificador curto, único e legível.','RF13'),
 ('RN11','Um usuário só consulta, reenvia e gera QR Code dos próprios pedidos.','Confidencialidade (controle de acesso por objeto).','RF15, RF16'),
 ('RN12','O cadastro público sempre cria usuários comuns.','Impedir escalada de privilégio.','RF07'),
 ('RN13','Um superadmin não altera o próprio papel pelo painel.','Evitar perda acidental de acesso administrativo.','RF19'),
 ('RN14','A CLI não rebaixa o único superadmin sem --forcar.','Evitar ficar sem administrador.','RF22'),
 ('RN15','O parque funciona todos os dias: seg-sex 9h-16h; sáb-dom 8h30-16h.','Informação institucional exibida ao visitante.','RF01'),
 ('RN16','Falha no e-mail não cancela o pedido; ele fica pendente e pode ser reenviado.','Disponibilidade da compra independente do SMTP.','RF14, RF15'),
 ('RN17','Valores, pagamentos e e-mails são fictícios e sem validade real.','Natureza de portfólio.','RF05'),
 ('RN18','O sistema deve sempre informar que é homenagem de fã.','Evitar confusão com site oficial (risco R5).','RF05'),
 ('RN19','Sem escolha prévia, o tema segue o sistema; a escolha manual prevalece.','Respeitar preferência do usuário.','RF06'),
]
CAPS[6] = ('Regras de negócio', 2, """
<p>Regras de negócio são políticas do domínio que restringem ou orientam os requisitos. Cada regra traz sua <strong>justificativa</strong> e os requisitos relacionados.</p>
""" + tab(['ID','Regra','Justificativa','Relacionados'], [list(r) for r in RN]))

CAPS[7] = ('Casos de uso', 2, """
<p>O diagrama abaixo (UML) apresenta os atores e os casos de uso. A seguir, os casos principais são especificados com pré-condições, fluxos e pós-condições.</p>
""" + diag.casos_uso() + '<figcaption class="leg">Figura 7.1 · Diagrama de casos de uso (UML).</figcaption>' + """
<h2 class="s">7.1 Catálogo</h2>
""" + tab(['ID','Caso de uso','Ator','RF'], [
 ['UC01','Consultar conteúdo (home, sobre, lazer, ingressos)','Visitante','RF01-RF05'],['UC02','Alternar tema','Visitante, Usuário','RF06'],
 ['UC03','Cadastrar-se','Visitante','RF07'],['UC04','Entrar e sair; recuperar senha','Visitante, Usuário','RF08-RF10'],
 ['UC05','Comprar ingresso','Usuário','RF11-RF14'],['UC06','Ver QR Code e reenviar e-mail','Usuário','RF13, RF15'],
 ['UC07','Ver meus pedidos','Usuário','RF16'],['UC08','Painel, métricas, pedidos e usuários','Superadmin','RF17-RF19'],
 ['UC09','Gerir tipos de ingresso','Superadmin','RF20'],['UC10','Gerir atividades de lazer','Superadmin','RF21'],
 ['UC11','Gerir superadmins pela CLI','Desenvolvedor','RF22']]) + """
<h2 class="s">7.2 Especificações</h2>
""" + uc('UC03','Cadastrar-se','Visitante','Não autenticado; e-mail ainda não cadastrado.',
 ['Abre Registre-se e preenche nome, e-mail, telefone, senha e confirmação.','O front valida os campos e envia POST /api/auth/registro.','A API valida (Zod), normaliza o e-mail e aplica bcrypt à senha.','A API cria o usuário com papel usuario e devolve token e perfil.','O sistema inicia a sessão e redireciona ao destino seguro.'],
 ['E-mail já cadastrado: 409 "Já existe uma conta com este e-mail".','Dados inválidos (senha curta, telefone inválido, senhas diferentes): 400 com a mensagem do primeiro erro.','Limite de requisições excedido: 429.'],
 'Usuário criado com papel usuario e sessão ativa.','RF07; RN01, RN02, RN03, RN12') + uc('UC05','Comprar ingresso','Usuário','Autenticado; ao menos um tipo ativo.',
 ['Em Ingressos, escolhe um tipo e clica em Comprar.','Define a quantidade (1 a 10) e a data da visita; o total é exibido.','Confirma; o front envia POST /api/pedidos com token.','A API valida, calcula o total, gera o código CPI-XXXXXXXXXX e grava o pedido.','A API gera o QR Code e envia o e-mail de comprovante.','O front exibe o QR Code, o status do e-mail e um aviso de confirmação.'],
 ['Visitante sem login: redirecionado ao login e devolvido a Ingressos (RF11).','Tipo inexistente ou inativo: 400.','Data no passado: 400.','Falha do SMTP: pedido mantido, status pendente e opção de reenviar (RN16).'],
 'Pedido persistido; e-mail enviado ou pendente.','RF11-RF14; RN04-RN08, RN10, RN16') + uc('UC06','Ver QR Code e reenviar e-mail','Usuário','Pedido próprio existente.',
 ['Em Meus pedidos, clica em QR Code para abrir o comprovante.','Clica em Reenviar e-mail.','A API envia novamente e atualiza o status.','O front mostra um aviso de sucesso.'],
 ['Pedido de outro usuário ou inexistente: 404.','SMTP indisponível: 502 com mensagem para tentar mais tarde.'],
 'Status do e-mail atualizado quando o envio tem sucesso.','RF13, RF15; RN11, RN16') + uc('UC09','Gerir tipos de ingresso','Superadmin','Autenticado com papel superadmin.',
 ['Abre Admin → Ingressos e escolhe Novo tipo ou Editar.','Preenche nome, preço em reais, descrição, imagem e disponibilidade.','Salva; o front envia POST ou PUT para /api/admin/tipos.','A API valida e persiste; a vitrine pública reflete a mudança.'],
 ['Usuário comum: 403.','Preço negativo, imagem fora do padrão ou textos curtos: 400.','Tipo inativo deixa de ser vendável sem apagar pedidos antigos (RN08).'],
 'Tipo criado ou atualizado.','RF20; RN08') + uc('UC11','Gerir superadmins pela CLI','Desenvolvedor','Acesso ao terminal do back-end e ao arquivo de dados.',
 ['Executa node src/cli.js superadmin criar --email ... --nome ....','A CLI solicita a senha de forma oculta se --senha não for informada.','A CLI valida e grava (ou promove o usuário existente).','Usa atualizar, promover, rebaixar ou listar quando necessário.'],
 ['Senha fora de 8 a 72 caracteres: erro.','E-mail já usado ao atualizar: erro.','Rebaixar o único superadmin sem --forcar: erro (RN14).'],
 'Superadmin criado ou alterado; efeito imediato na API.','RF22; RN12, RN14'))

CAPS[8] = ('Modelo de dados', 2, """
<h2 class="s">8.1 Diagrama entidade-relacionamento</h2>
""" + diag.der() + '<figcaption class="leg">Figura 8.1 · Modelo entidade-relacionamento.</figcaption>' + """
<h2 class="s">8.2 Dicionário de dados</h2>
<h3 class="s">usuarios</h3>
""" + tab(['Coluna','Tipo','Restrições','Descrição'], [
 ['id','INTEGER','PK, autoincremento','Identificador'],['nome','TEXT','NOT NULL','Nome completo (mín. 3 caracteres na entrada)'],
 ['email','TEXT','NOT NULL, UNIQUE','E-mail em minúsculas (RN01)'],['telefone','TEXT','NOT NULL, padrão vazio','10 ou 11 dígitos (RN03)'],
 ['senha_hash','TEXT','NOT NULL','Hash bcrypt (custo 12)'],['papel','TEXT','NOT NULL, CHECK (usuario|superadmin)','Perfil de acesso'],
 ['criado_em','TEXT','NOT NULL, padrão CURRENT_TIMESTAMP','Data de criação (UTC)']]) + '<h3 class="s">pedidos</h3>' + tab(['Coluna','Tipo','Restrições','Descrição'], [
 ['id','INTEGER','PK','Identificador'],['codigo','TEXT','NOT NULL, UNIQUE','CPI- + 10 hexadecimais (RN10)'],
 ['usuario_id','INTEGER','NOT NULL, FK → usuarios.id','Dono do pedido'],['tipo_id','TEXT','NOT NULL','Slug do tipo (referência lógica)'],
 ['tipo_nome','TEXT','NOT NULL','Nome do tipo na data da compra (RN07)'],['quantidade','INTEGER','NOT NULL','1 a 10 (RN04, validado na API)'],
 ['data_visita','TEXT','NOT NULL','AAAA-MM-DD'],['total_centavos','INTEGER','NOT NULL','Total calculado no servidor (RN06)'],
 ['email_enviado','INTEGER','NOT NULL, padrão 0','0 pendente, 1 enviado (RN16)'],['criado_em','TEXT','NOT NULL, padrão CURRENT_TIMESTAMP','Data de criação']]) + '<h3 class="s">tipos_ingresso e atividades</h3>' + tab(['Tabela.coluna','Tipo','Descrição'], [
 ['tipos_ingresso.id','TEXT PK','Slug gerado a partir do nome'],['tipos_ingresso.nome / descricao','TEXT','Textos exibidos na vitrine'],
 ['tipos_ingresso.preco_centavos','INTEGER','Preço em centavos (0 a 1.000.000)'],['tipos_ingresso.imagem','TEXT','Caminho imagens/arquivo'],
 ['tipos_ingresso.ativo','INTEGER','1 vendável, 0 oculto (RN08)'],['atividades.id','TEXT PK','Slug do título'],
 ['atividades.titulo / descricao / alt','TEXT','Conteúdo do cartão e texto alternativo'],['atividades.imagem','TEXT','Caminho imagens/arquivo'],
 ['atividades.ordem','INTEGER','Ordem de exibição']]) + """
<h2 class="s">8.3 Ciclo de vida do envio do comprovante</h2>
""" + diag.estados_email() + '<figcaption class="leg">Figura 8.2 · Estados do envio de e-mail de um pedido.</figcaption>' + """
<h2 class="s">8.4 Decisões de modelagem</h2>
<ul><li><strong>Dinheiro em centavos inteiros:</strong> elimina erros de ponto flutuante.</li><li><strong>tipo_nome no pedido:</strong> desacopla o histórico de edições futuras do catálogo.</li><li><strong>tipo_id sem chave estrangeira:</strong> tipos nunca são removidos, apenas desativados.</li><li><strong>Semente condicional:</strong> dados iniciais só entram se a tabela estiver vazia, preservando edições do admin.</li><li><strong>Persistência:</strong> arquivo cataratas.db no volume dados, em modo WAL com chaves estrangeiras ativas.</li></ul>
""")

ADR = [
 ('ADR-01','Angular standalone com sinais','Conversão do projeto HTML/Bootstrap para Angular, com estado local simples.','React, Vue','Menos boilerplate (sem NgModules), rotas com lazy loading, tipagem forte.'),
 ('ADR-02','Express 5 no back-end','API pequena, ecossistema maduro, requisito de Node.js.','Fastify, NestJS','Composição simples via createApp; menos estrutura imposta.'),
 ('ADR-03','SQLite via node:sqlite','Portfólio sem serviço de banco externo; execução simples.','PostgreSQL, better-sqlite3','Zero dependência nativa; limita a uma instância; migrar para PostgreSQL é evolução prevista.'),
 ('ADR-04','Sessão com JWT (HS256, 7 dias)','API stateless e simples de consumir pela SPA.','Sessão em servidor, cookie HttpOnly','Token em localStorage (risco R6); usuário recarregado do banco para refletir mudanças de papel.'),
 ('ADR-05','Validação com Zod na borda','Uma fonte de verdade de regras, mensagens claras.','Validação manual, Joi','Erros 400 padronizados com campos.'),
 ('ADR-06','Mesmo domínio via nginx','Front e API na mesma origem evitam CORS e simplificam a CSP.','Domínios separados','Um único ponto de entrada; API não exposta diretamente.'),
 ('ADR-07','Mailpit como SMTP de demonstração','Mostrar e-mails sem enviar nada à internet.','Mailhog, serviço real','Troca por SMTP real apenas com variáveis de ambiente.'),
 ('ADR-08','Contêineres endurecidos','Reduzir superfície de ataque.','Contêineres padrão','Back-end somente leitura; exige volume para /data.'),
 ('ADR-09','Dinheiro em centavos','Exatidão financeira.','Decimal em ponto flutuante','Conversão apenas na camada de apresentação.'),
 ('ADR-10','CLI para superadmin','Não existir credencial padrão nem rota pública de promoção.','Usuário seed fixo, variável de ambiente','Operação exige acesso ao terminal; senha oculta no prompt.'),
]

CAPS[9] = ('Arquitetura', 3, """
<p>A arquitetura é descrita com o <strong>modelo C4</strong> (contexto, contêineres, componentes) e uma visão de implantação, atendendo ao princípio da ISO/IEC/IEEE 42010 de apresentar o sistema por <em>visões</em> voltadas às preocupações de cada parte interessada.</p>
<h2 class="s">9.1 Contêineres (C4 nível 2)</h2>
""" + diag.c4_conteineres() + '<figcaption class="leg">Figura 9.1 · Diagrama de contêineres.</figcaption>' + tab(['Contêiner','Tecnologia','Responsabilidade'], [
 ['nginx','nginx-unprivileged 1.27','Entrega os estáticos do Angular, aplica cabeçalhos de segurança e encaminha /api.'],
 ['SPA Angular','Angular 22, Bootstrap 5','Interface, formulários, estado de sessão e tema, guarda de rota do painel.'],
 ['API Node.js','Node 22, Express 5','Regras de negócio, autenticação, API REST, QR Code, e-mail.'],
 ['SQLite','node:sqlite','Persistência em arquivo no volume dados.'],
 ['Mailpit','axllent/mailpit','Caixa de entrada de demonstração (UI na porta 8025).']]) + """
<h2 class="s">9.2 Componentes da API (C4 nível 3)</h2>
""" + diag.c4_componentes() + '<figcaption class="leg">Figura 9.2 · Componentes do back-end.</figcaption>' + """
<p>A função <code>createApp({ db, jwtSecret, mailer, staticDir, rateLimitMax })</code> recebe suas dependências por <strong>injeção</strong>. Isso permite testar a API com banco em memória e um e-mail simulado, sem rede. O <code>server.js</code> apenas lê o ambiente e compõe as peças reais.</p>
<h2 class="s">9.3 Visão de implantação</h2>
""" + diag.implantacao() + '<figcaption class="leg">Figura 9.3 · Implantação com Docker Compose.</figcaption>' + """
<h2 class="s">9.4 Fluxo de uma compra</h2>
""" + diag.sequencia_compra() + '<figcaption class="leg">Figura 9.4 · Diagrama de sequência da compra (UC05).</figcaption>' + """
<h2 class="s">9.5 Decisões arquiteturais (ADR)</h2>
""" + tab(['ID','Decisão','Contexto / motivo','Alternativas','Consequências'], [list(a) for a in ADR]) + """
<h2 class="s">9.6 Estrutura do repositório</h2>
<pre><code>site-cataratas-do-iguacu/
├── docker-compose.yml        .env.example
├── backend/   Dockerfile
│   ├── src/   app.js  server.js  db.js  data.js  mailer.js  cli.js
│   └── test/  api.test.js  cli.test.js
├── e2e/       playwright.config.js  tests/fluxos.spec.js
├── .github/workflows/ci.yml
├── frontend/  Dockerfile  nginx.conf  proxy.conf.json
│   ├── public/  imagens/  tema-init.js
│   └── src/app/ core/ (api, auth, guards, modal, tema, toast, reveal, contar)
│                layout/ (nav, footer)   pages/ (home, sobre, lazer,
│                ingressos, login, registro, admin)
└── docs/livro/  fontes e PDF deste documento</code></pre>
""")

CAPS[10] = ('Front-end Angular', 3, """
<h2 class="s">10.1 Organização</h2>
<p>O front-end usa <strong>componentes standalone</strong>, <strong>sinais</strong> (<code>signal</code>, <code>computed</code>) para estado local e <strong>formulários reativos</strong>. As páginas são carregadas sob demanda por <code>loadComponent</code>, mantendo o pacote inicial enxuto (RNF01).</p>
""" + tab(['Rota','Componente','Acesso'], [
 ['/','Home','Público'],['/sobre','Sobre','Público'],['/lazer','Lazer','Público'],['/ingressos','Ingressos','Público (compra exige login)'],
 ['/login, /registre-se','Login, Registro','Público, sem menu lateral'],['/admin','Admin','Superadmin (adminGuard)']]) + """
<h2 class="s">10.2 Módulos centrais</h2>
""" + tab(['Arquivo','Função'], [
 ['core/api.ts','Serviço HTTP tipado com todos os endpoints e as interfaces de dados.'],
 ['core/auth.ts','Sessão em sinais, login, cadastro, logout, atualização do perfil e interceptor (anexa JWT, encerra a sessão em 401).'],
 ['core/guards.ts','adminGuard e destinoSeguro (impede redirecionamento aberto).'],
 ['core/modal.ts','Janela modal acessível: Esc, clique no fundo, papel de diálogo.'],
 ['core/tema.ts','Alternância e persistência do tema claro/escuro.'],
 ['core/toast.ts','Avisos flutuantes com fechamento automático.'],
 ['core/reveal.ts, contar.ts','Revelação ao rolar (IntersectionObserver) e contador numérico animado.'],
 ['layout/nav.ts, footer.ts','Menu lateral/superior com item ativo; rodapé com contatos e aviso de fã.']]) + """
<h2 class="s">10.3 Sistema de design</h2>
<div class="duas">
<div class="cartao"><h4>Cores e tokens</h4><ul><li>Azuis #0a7ab8, #006ca6, #004d8b e #013a68 (águas)</li><li>Verdes #58c162, #2f9a46 e #036800 (mata)</li><li>Variáveis CSS de superfície, texto, borda e chip, redefinidas no tema escuro</li></ul></div>
<div class="cartao"><h4>Tipografia</h4><ul><li>Fraunces (serifa) em títulos</li><li>Inter (variável) no texto e na interface</li><li>Fontes empacotadas no build, sem CDN</li></ul></div>
<div class="cartao"><h4>Componentes</h4><ul><li>Cartão com imagem, degradê e título sobreposto</li><li>Bilhete com furos e linha pontilhada</li><li>Modal, botões, abas em cápsula, tabelas, métricas, toasts</li></ul></div>
<div class="cartao"><h4>Movimento</h4><ul><li>Entrada escalonada ao rolar</li><li>Transição entre páginas, esqueletos, contadores</li><li>Tudo desativado com movimento reduzido</li></ul></div>
</div>
<h2 class="s">10.4 Responsividade</h2>
<p>As grades usam <code>repeat(auto-fill, minmax(min(100%, 290px), 1fr))</code>; contêineres têm <code>min-width: 0</code> e <code>overflow-wrap: anywhere</code>; tabelas rolam dentro do próprio quadro; imagens de cartão usam <code>object-fit: cover</code>. Assim, nenhum conteúdo ultrapassa os limites do seu cartão. Verificado sem rolagem horizontal em 390 px e 1280 px.</p>
<h2 class="s">10.5 Tema claro e escuro</h2>
<p>O serviço <code>Tema</code> grava <code>data-tema</code> na raiz do documento e a escolha em <code>localStorage</code>. O script externo <code>tema-init.js</code> (compatível com a CSP, que proíbe scripts inline) define o tema antes do Angular iniciar, evitando o flash. A troca usa uma transição curta de cores.</p>
""")

CAPS[11] = ('Back-end e API', 3, """
<h2 class="s">11.1 Pipeline de requisição</h2>
<p><code>helmet</code> (cabeçalhos e CSP) → <code>cors</code> → <code>express.json</code> (limite de 50 kB) → limitador de taxa (300/min por IP) → rotas. Nas rotas de autenticação aplica-se um segundo limite (50 por 15 min). Rotas protegidas passam por <code>auth</code> (valida o JWT e carrega o usuário) e, no painel, pelo middleware de superadmin. Um tratador de erros final converte exceções em JSON padronizado.</p>
<h2 class="s">11.2 Contrato da API</h2>
""" + tab(['Método','Rota','Acesso','Descrição'], [
 ['GET','/api/health','Público','Verificação de saúde'],['GET','/api/parque','Público','Funcionamento, contatos, localização, redes'],
 ['GET','/api/atividades','Público','Atividades de lazer'],['GET','/api/ingressos/tipos','Público','Tipos de ingresso ativos'],
 ['POST','/api/auth/registro','Público','Cadastro; retorna token e usuário (201)'],['POST','/api/auth/login','Público','Login (200) ou 401'],
 ['POST','/api/auth/esqueci-senha','Público','Resposta genérica'],['GET','/api/auth/me','Usuário','Perfil atual com papel'],
 ['POST','/api/pedidos','Usuário','Cria pedido e envia e-mail (201)'],['GET','/api/pedidos','Usuário','Lista os próprios pedidos'],
 ['GET','/api/pedidos/:id/qrcode','Usuário','Pedido com QR Code (data URL PNG)'],['POST','/api/pedidos/:id/reenviar','Usuário','Reenvia o comprovante'],
 ['GET','/api/admin/resumo','Superadmin','Métricas gerais'],['GET','/api/admin/pedidos','Superadmin','Pedidos de todos (até 500)'],
 ['GET, PATCH','/api/admin/usuarios[/:id]','Superadmin','Lista; altera papel'],['GET, POST, PUT','/api/admin/tipos[/:id]','Superadmin','Gestão de tipos de ingresso'],
 ['POST, PUT, DELETE','/api/admin/atividades[/:id]','Superadmin','Gestão de atividades']]) + """
<h2 class="s">11.3 Exemplo</h2>
<pre><code>POST /api/pedidos
Authorization: Bearer &lt;token&gt;
{ "tipoId": "inteira", "quantidade": 2, "dataVisita": "2026-11-15" }

201 Created
{ "id": 1, "codigo": "CPI-8F3A21C9D0", "tipoNome": "Inteira", "quantidade": 2,
  "dataVisita": "2026-11-15", "totalCentavos": 20000, "emailEnviado": true }</code></pre>
<h2 class="s">11.4 Códigos de resposta e erros</h2>
<p>Erros seguem o formato <code>{ "erro": "mensagem", "campos": { ... } }</code>.</p>
""" + tab(['Código','Uso'], [
 ['400','Validação de entrada, tipo inexistente, data no passado, JSON inválido'],['401','Token ausente, inválido ou expirado; credenciais incorretas'],
 ['403','Acesso restrito a superadmin'],['404','Recurso inexistente ou de outro usuário'],['409','E-mail já cadastrado'],
 ['429','Limite de requisições excedido'],['502','Falha no envio de e-mail durante o reenvio'],['500','Erro interno (sem detalhes ao cliente)']]) + """
<h2 class="s">11.5 Regras de validação (Zod)</h2>
""" + tab(['Entrada','Regras'], [
 ['Registro','nome ≥ 3; e-mail válido (minúsculo); telefone 10-11 dígitos; senha 8-72; confirmação igual'],
 ['Login','e-mail válido; senha 1-72'],['Pedido','tipoId existente e ativo; quantidade inteira 1-10; dataVisita AAAA-MM-DD'],
 ['Tipo de ingresso','nome 2-60; preço inteiro 0-1.000.000 centavos; descrição 5-600; imagem imagens/arquivo; ativo booleano'],
 ['Atividade','título 2-60; descrição 10-1500; imagem imagens/arquivo']]))

STRIDE = [
 ('Spoofing (falsificação)','Login de outro usuário','Hash bcrypt, limite de tentativas, JWT assinado com algoritmo fixado, mensagens genéricas','Sem MFA'),
 ('Tampering (adulteração)','Preço e total do pedido','Total calculado no servidor; SQL parametrizado; validação Zod','Baixo'),
 ('Repudiation (repúdio)','Negar uma compra ou ação administrativa','Pedidos persistidos com data e dono','Sem trilha de auditoria de ações do admin'),
 ('Information disclosure (vazamento)','Dados de outros usuários; hashes; versão do servidor','Pedido filtrado por dono; hash nunca retorna; X-Powered-By removido; erros 500 genéricos','Token em localStorage'),
 ('Denial of service (negação)','Inundar a API ou o login','Limite por IP; corpo de 50 kB; healthcheck e restart','Sem proteção distribuída'),
 ('Elevation of privilege (elevação)','Usuário virar superadmin','Cadastro sempre cria usuario; papel só por admin ou CLI; middleware em /api/admin; usuário recarregado a cada requisição','Baixo'),
]
OWASP = [
 ('A01 Quebra de controle de acesso','Middleware de superadmin; pedidos filtrados por dono; guarda de rota no front como conveniência.'),
 ('A02 Falhas criptográficas','bcrypt custo 12; JWT HS256 com segredo longo obrigatório; HTTPS recomendado na borda.'),
 ('A03 Injeção','SQL parametrizado; validação Zod; Angular escapa saídas; e-mail escapa HTML.'),
 ('A04 Design inseguro','Regras de negócio no servidor; modelo de ameaças STRIDE; endpoints mínimos.'),
 ('A05 Configuração incorreta','Helmet, CSP restritiva, nginx com cabeçalhos, contêineres endurecidos, segredos por ambiente.'),
 ('A06 Componentes vulneráveis','Dependências mínimas e fixadas por lockfile; npm audit sem vulnerabilidades no momento da entrega.'),
 ('A07 Falhas de identificação e autenticação','Limite de taxa nas rotas de autenticação; política de senha; hash falso contra enumeração.'),
 ('A08 Falhas de integridade de software e dados','Builds com npm ci (lockfile); imagens oficiais; sem scripts remotos (CSP).'),
 ('A09 Falhas de registro e monitoramento','Logs de erro no stdout; healthcheck. Evolução: auditoria de ações administrativas.'),
 ('A10 SSRF','A API não busca URLs informadas pelo usuário.'),
]
CAPS[12] = ('Segurança', 3, """
<p>A segurança foi tratada em camadas e de forma <strong>orientada a ameaças</strong>: primeiro o modelo STRIDE, depois o mapeamento com o OWASP Top 10 (2021) e, por fim, as recomendações de implantação.</p>
<h2 class="s">12.1 Modelo de ameaças (STRIDE)</h2>
""" + tab(['Ameaça','Cenário','Controles','Risco residual'], [list(r) for r in STRIDE]) + """
<h2 class="s">12.2 Mapeamento OWASP Top 10 (2021)</h2>
""" + tab(['Categoria','Controle aplicado'], [list(r) for r in OWASP]) + """
<h2 class="s">12.3 Privacidade e LGPD</h2>
<ul><li><strong>Finalidade e minimização:</strong> coleta somente nome, e-mail, telefone e senha (em hash), apenas para cadastro e compra.</li><li><strong>Segurança:</strong> senhas nunca são retornadas; comunicação deve ocorrer sobre HTTPS na borda.</li><li><strong>Natureza do projeto:</strong> os dados são fictícios e o sistema não deve receber dados pessoais reais em produção sem política de privacidade, base legal e canal de atendimento ao titular (Lei 13.709/2018).</li></ul>
<h2 class="s">12.4 Cabeçalhos aplicados</h2>
""" + tab(['Cabeçalho','Valor','Objetivo'], [
 ['Content-Security-Policy',"default-src 'self'; script-src 'self'; frame-ancestors 'none'; frame-src google.com; object-src 'none'",'Bloquear scripts externos e embutir o sistema em outros sites'],
 ['X-Content-Type-Options','nosniff','Impedir interpretação incorreta de tipos'],['X-Frame-Options','DENY','Clickjacking'],
 ['Referrer-Policy','no-referrer','Não vazar URLs'],['Permissions-Policy','geolocation, camera e microfone desativados','Reduzir permissões do navegador']]) + nota('<strong>Pontos de atenção.</strong> (1) O token fica em <code>localStorage</code>; em produção o ideal é cookie <code>HttpOnly</code> com proteção CSRF. (2) HTTPS e HSTS devem ser providos por um proxy reverso na frente do compose. (3) Não há MFA nem trilha de auditoria administrativa.', 'alerta') + """
<h2 class="s">12.5 Recomendações de implantação</h2>
<ul><li>Gerar JWT_SECRET com <code>openssl rand -hex 32</code> e mantê-lo fora do Git.</li><li>Publicar atrás de HTTPS (Caddy, Traefik ou nginx) com HSTS.</li><li>Usar SMTP autenticado real, fazer backups do volume dados e restringir o acesso ao terminal do host.</li></ul>
""")

CAPS[13] = ('E-mail e comprovante', 3, """
<p>Ao concluir o pedido, a API gera o QR Code (PNG, com código, tipo, quantidade e data) e envia um e-mail HTML via SMTP. O QR Code vai como <strong>anexo inline</strong> (<code>cid:qrcode</code>), o que funciona nos principais clientes sem depender de imagens remotas.</p>
""" + fig('email.jpg','E-mail de comprovante de ingresso.','cel') + """
<h2 class="s">13.1 Conteúdo</h2>
<ul><li>Assunto: <em>Seu ingresso - Parque Nacional do Iguaçu (CPI-XXXXXXXXXX)</em>.</li><li>Saudação com o nome do usuário, escapado contra HTML.</li><li>Tabela com código, ingresso, data da visita e total.</li><li>QR Code e orientação sobre meia-entrada.</li><li>Rodapé informando que é projeto de estudo com valores fictícios.</li></ul>
<h2 class="s">13.2 Configuração</h2>
""" + tab(['Variável','Padrão no compose','Uso'], [
 ['SMTP_HOST','mailpit','Servidor SMTP (vazio: apenas registra no log)'],['SMTP_PORT','1025','Porta'],['SMTP_SECURE','false','TLS implícito (porta 465)'],
 ['SMTP_USER / SMTP_PASS','vazio','Credenciais'],['MAIL_FROM','Cataratas do Iguaçu &lt;nao-responda@...&gt;','Remetente'],['PUBLIC_URL','http://localhost:8080','Link do site no e-mail']]) + """
<h2 class="s">13.3 Comportamento em falhas</h2>
<p>O transporte tem tempos limites de conexão e leitura. Em caso de erro, o log registra a falha, o pedido continua válido e fica <em>pendente</em> (RN16). O usuário pode reenviar pela lista de pedidos ou pela janela do QR Code. Em demonstração, os e-mails ficam retidos no Mailpit (porta 8025) e nenhum e-mail sai para a internet.</p>
""")

CAPS[14] = ('Administração e CLI', 3, """
<h2 class="s">14.1 Painel administrativo</h2>
<p>Usuários com papel <code>superadmin</code> veem o item <em>Admin</em> e acessam <code>/admin</code>. A rota é protegida no front pelo <code>adminGuard</code> e, de forma definitiva, na API (403 para outros papéis).</p>
""" + tab(['Aba','Funções'], [
 ['Resumo','Usuários, pedidos, ingressos vendidos, pedidos do dia e receita fictícia, com contadores animados.'],
 ['Pedidos','Código, cliente, ingresso, data, total e status do e-mail.'],
 ['Usuários','Quantidade de pedidos e troca de papel (exceto o próprio).'],
 ['Ingressos','Criar e editar tipos: nome, preço, descrição, imagem e disponibilidade.'],
 ['Lazer','Criar, editar e excluir atividades.']]) + """
<h2 class="s">14.2 CLI do desenvolvedor</h2>
<p>O desenvolvedor gerencia superadmins diretamente no terminal, sem credencial padrão e sem rota pública (ADR-10). A senha, quando omitida, é solicitada de forma oculta, evitando o histórico do shell.</p>
""" + tab(['Comando','Efeito'], [
 ['criar','Cria superadmin (ou promove usuário existente). Opções --email, --nome, --senha, --telefone.'],
 ['atualizar','Altera nome, e-mail (--novo-email), telefone ou senha de um superadmin.'],
 ['promover','Torna um usuário existente superadmin.'],['rebaixar','Remove o papel; bloqueia o último superadmin sem --forcar sim.'],['listar','Lista os superadmins.']]) + """
<pre><code>docker compose exec backend node src/cli.js superadmin criar \\
  --email admin@exemplo.com --nome "Admin Geral"
docker compose exec backend node src/cli.js superadmin atualizar \\
  --email admin@exemplo.com --novo-email root@exemplo.com
docker compose exec backend node src/cli.js superadmin promover --email maria@exemplo.com
docker compose exec backend node src/cli.js superadmin listar</code></pre>
<p>Como a API recarrega o usuário do banco a cada requisição, mudanças de papel feitas pela CLI valem imediatamente.</p>
""")

CAPS[15] = ('Estratégia e plano de testes', 4, """
<h2 class="s">15.1 Estratégia</h2>
""" + tab(['Nível','Abordagem','Ferramenta','Situação'], [
 ['API (integração)','Servidor real em porta efêmera, banco em memória, e-mail simulado','node --test (nativo)','Automatizado, no repositório'],
 ['CLI','Execução da função run() contra banco em memória','node --test','Automatizado, no repositório'],
 ['Interface ponta a ponta','Cadastro, login com retorno, compra, QR, painel, tema e responsividade, em desktop (1280 px) e celular (390 px)','Playwright (Chromium), pasta e2e','Automatizado, no repositório'],
 ['Integração contínua','Testes da API, build do Angular, ponta a ponta, npm audit, docker compose config e build','GitHub Actions (.github/workflows/ci.yml)','Definido; executa a cada push, ainda não executado no GitHub'],
 ['Infraestrutura','Build das imagens e subida do compose','Docker (no CI)','Não validado no ambiente de entrega (sem acesso ao registro npm); coberto pelo CI']]) + """
<h2 class="s">15.2 Casos de teste automatizados</h2>
""" + tab(['ID','Caso','Resultado esperado','RF / RN'], [
 ['TC01','Conteúdo público','Health ok; 6 atividades; 2 tipos ativos; contatos do parque','RF01-RF04'],
 ['TC02','Cadastro com confirmação diferente','400','RF07; RN02'],['TC03','Cadastro válido com e-mail em maiúsculas','201; e-mail salvo em minúsculas','RF07; RN01'],
 ['TC04','Cadastro com e-mail repetido','409','RF07; RN01'],['TC05','Login com senha errada / correta','401 / 200 com token; /auth/me retorna o perfil','RF08'],
 ['TC06','Acesso sem token','401','RF08'],['TC07','Pedido sem token','401','RF12'],
 ['TC08','Pedido com tipo inexistente ou data passada','400','RF12; RN05, RN08'],['TC09','Pedido válido (3 × meia)','201; total 15.000 centavos; e-mail enviado','RF12-RF14; RN06'],
 ['TC10','Reenvio e QR Code','200; segundo e-mail; QR em data URL PNG; pedido alheio 404','RF13, RF15; RN11'],
 ['TC11','Painel com usuário comum / sem token','403 / 401','RF17-RF21'],['TC12','Painel com superadmin','Resumo e listas corretos','RF17-RF19'],
 ['TC13','Criar tipo; entrada inválida','201 com slug; 400','RF20'],['TC14','Desativar tipo','Some da vitrine pública','RF20; RN08'],
 ['TC15','Criar e excluir atividade','Lista pública reflete (7, depois 6)','RF21'],
 ['TC16','CLI: criar, atualizar, promover, rebaixar, listar','Papéis e dados conforme comandos','RF22; RN12'],
 ['TC17','CLI: senha curta; último superadmin; usuário inexistente','Erros específicos','RF22; RN02, RN14']]) + """
<h2 class="s">15.3 Cenários ponta a ponta (Playwright)</h2>
""" + tab(['ID','Cenário','Verificações','RF'], [
 ['ES01','Páginas públicas','Seis rotas carregam sem erro de console e sem rolagem horizontal','RF01-RF05; OB2'],
 ['ES02','Lazer','Cartão abre os detalhes e fecha com Esc','RF03'],
 ['ES03','Tema','Alterna, persiste após recarregar e segue prefers-color-scheme','RF06'],
 ['ES04','Cadastro e compra','Compra sem login leva ao login com retorno; cadastro, retorno a Ingressos, compra, QR Code e pedido listado','RF07, RF11-RF16'],
 ['ES05','Validação de formulário','Senhas diferentes bloqueiam o cadastro','RF07; RN02'],
 ['ES06','Painel administrativo','Usuário comum é barrado; superadmin criado pela CLI acessa, percorre as abas e cria uma atividade','RF17-RF22']]) + """
<p>Cada cenário roda em dois perfis (desktop e celular), totalizando 12 execuções.</p>
<h2 class="s">15.4 Resultado</h2>
<pre><code>cd backend &amp;&amp; npm test
# tests 5 · pass 5 · fail 0

cd e2e &amp;&amp; npx playwright test
# 12 passed (6 cenários × 2 perfis)</code></pre>
<h2 class="s">15.5 Defeitos encontrados pelos testes</h2>
<p>A verificação em navegador real revelou e corrigiu defeitos que a leitura do código não mostrava: o hero sobrepondo o menu, ícones do botão de tema deslocados por CSS legado, campos do login acinzentados no tema escuro e rótulos acessíveis (<code>aria-label</code>) que substituíam o texto visível de links e campos, contrariando o critério 2.5.3 da WCAG (rótulo no nome).</p>
<h2 class="s">15.6 Lacunas e plano</h2>
<ul><li>Executar o fluxo de CI no GitHub e acompanhar o resultado a cada alteração.</li><li>Testes de carga e de segurança (SAST); a varredura de dependências (npm audit) já faz parte do CI.</li><li>Auditoria de acessibilidade (WCAG 2.2) com ferramentas automatizadas e leitor de tela.</li></ul>
""")

TRACE = [
 ('RF01-RF04','UC01','RN08, RN15','GET /api/parque, /atividades, /ingressos/tipos','TC01, TC14, ES01'),
 ('RF05','UC01','RN17, RN18','estático (rodapé, Sobre, Ingressos)','ES01'),
 ('RF06','UC02','RN19','local (localStorage)','ES03'),
 ('RF07','UC03','RN01-RN03, RN12','POST /api/auth/registro','TC02-TC04, ES04, ES05'),
 ('RF08-RF09','UC04','—','POST /api/auth/login, GET /me','TC05, TC06'),
 ('RF10','UC04','—','POST /api/auth/esqueci-senha','Inspeção (sem teste automatizado)'),
 ('RF11','UC05','—','local (returnUrl seguro)','ES04'),
 ('RF12','UC05','RN04-RN08, RN10','POST /api/pedidos','TC07-TC09, ES04'),
 ('RF13-RF15','UC05, UC06','RN10, RN11, RN16','GET /pedidos/:id/qrcode, POST /reenviar','TC09, TC10, ES04'),
 ('RF16','UC07','RN11','GET /api/pedidos','TC09, TC10, ES04'),
 ('RF17-RF19','UC08','RN13','GET /admin/resumo, /pedidos, /usuarios; PATCH /usuarios/:id','TC11, TC12, ES06'),
 ('RF20','UC09','RN08','GET, POST, PUT /api/admin/tipos','TC13, TC14, ES06'),
 ('RF21','UC10','—','POST, PUT, DELETE /api/admin/atividades','TC15, ES06'),
 ('RF22','UC11','RN12, RN14','CLI','TC16, TC17, ES06'),
]
CAPS[16] = ('Matriz de rastreabilidade', 4, """
<p>A matriz liga cada requisito a seus casos de uso, regras de negócio, pontos de implementação e casos de teste, permitindo analisar o impacto de mudanças e comprovar cobertura.</p>
""" + tab(['Requisito','Caso de uso','Regras','Implementação','Verificação'], [list(r) for r in TRACE]) + nota('<strong>Cobertura:</strong> 22 de 22 requisitos funcionais possuem caso de uso; 21 têm verificação automatizada (API, CLI ou ponta a ponta). A exceção é o RF10 (recuperação de senha simulada), verificado apenas por inspeção.', 'verde'))

CAPS[17] = ('Implantação e operação', 4, """
<h2 class="s">17.1 Serviços</h2>
""" + tab(['Serviço','Imagem','Porta','Observações'], [
 ['frontend','Build em Node 22 Alpine; execução em nginx-unprivileged','8080','Entrega o Angular e faz proxy de /api; aguarda o back-end saudável.'],
 ['backend','Node 22 Alpine','3000 (interna)','Usuário node, somente leitura, volume dados, healthcheck.'],
 ['mailpit','axllent/mailpit','8025','Caixa de entrada de demonstração.']]) + """
<h2 class="s">17.2 Execução</h2>
<pre><code>cp .env.example .env
# edite JWT_SECRET (openssl rand -hex 32)
docker compose up --build
docker compose exec backend node src/cli.js superadmin criar --email voce@exemplo.com --nome "Seu Nome"</code></pre>
<p>Site em <code>http://localhost:8080</code> e e-mails de demonstração em <code>http://localhost:8025</code>.</p>
<h2 class="s">17.3 Variáveis de ambiente</h2>
""" + tab(['Variável','Obrigatória','Descrição'], [
 ['JWT_SECRET','Sim (produção)','Segredo de assinatura; 32 caracteres ou mais'],['PORT','Não','Porta publicada do site (8080)'],
 ['MAILPIT_PORT','Não','Porta da UI do Mailpit (8025)'],['PUBLIC_URL','Não','URL do site usada no e-mail'],
 ['SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS','Não','SMTP real (padrão: Mailpit)'],['MAIL_FROM','Não','Remetente'],
 ['DATA_DIR','Não','Pasta do banco (padrão /data no contêiner)']]) + """
<h2 class="s">17.4 Operação</h2>
""" + tab(['Tarefa','Comando'], [
 ['Logs da API','docker compose logs -f backend'],['Parar mantendo dados','docker compose down'],['Atualizar','docker compose up --build -d'],
 ['Apagar dados (destrutivo)','docker compose down -v'],
 ['Backup do banco','docker compose stop backend; docker compose cp backend:/data/cataratas.db ./backup.db; docker compose start backend'],
 ['Verificar saúde','curl http://localhost:8080/api/health']]) + """
<h2 class="s">17.5 Diagnóstico</h2>
""" + tab(['Sintoma','Causa provável','Ação'], [
 ['Compose recusa subir: defina JWT_SECRET','Variável ausente','Criar .env a partir de .env.example'],
 ['API reinicia em loop','JWT_SECRET curto (< 32) em produção','Gerar segredo com openssl rand -hex 32'],
 ['Comprovante pendente','SMTP indisponível ou mal configurado','Verificar SMTP_*; usar Reenviar; consultar os logs'],
 ['Nada na caixa do Mailpit','SMTP_HOST aponta para outro servidor','Usar SMTP_HOST=mailpit na demonstração'],
 ['Erro 429','Limite de requisições','Aguardar a janela e reduzir a frequência'],
 ['Painel inacessível','Usuário não é superadmin','Promover pela CLI (promover --email ...)']]) + nota('<strong>Validação de infraestrutura.</strong> Os Dockerfiles e o compose foram escritos e revisados, mas o build completo não pôde ser concluído no ambiente de desenvolvimento deste projeto, porque o contêiner de build não tinha acesso ao registro npm. Antes de publicar, execute <code>docker compose up --build</code> em uma máquina com internet.', 'alerta'))

CAPS[18] = ('Experiência do usuário e acessibilidade', 4, """
<h2 class="s">18.1 Heurísticas de Nielsen</h2>
""" + tab(['Heurística','Como é atendida'], [
 ['Visibilidade do status do sistema','Esqueletos de carregamento, botões com estado (Processando...), status do e-mail, toasts de confirmação.'],
 ['Correspondência com o mundo real','Linguagem em português, bilhetes com furos e linha pontilhada, vocabulário do parque.'],
 ['Controle e liberdade','Fechar janelas por botão, fundo ou Esc; cancelar compra; alternar tema.'],
 ['Consistência e padrões','Sistema de design único, mesmos botões, cartões e modais em todas as telas.'],
 ['Prevenção de erros','Quantidade limitada de 1 a 10; data mínima; senha com mostrar/ocultar; confirmação ao excluir atividade.'],
 ['Reconhecimento em vez de memorização','Ícones junto ao texto, item de menu ativo, breadcrumbs implícitos pelo título.'],
 ['Flexibilidade e eficiência','Retorno automático à página de origem após login; reenvio rápido do comprovante.'],
 ['Design estético e minimalista','Hierarquia tipográfica, espaço em branco, imagem como protagonista.'],
 ['Ajuda a reconhecer e corrigir erros','Mensagens específicas junto aos campos e avisos claros em falhas de e-mail.'],
 ['Ajuda e documentação','Textos de apoio nas páginas e este documento.']]) + """
<h2 class="s">18.2 Acessibilidade (WCAG 2.2)</h2>
""" + tab(['Prática','Aplicação','Situação'], [
 ['Texto alternativo','Imagens de conteúdo com alt descritivo','Aplicado'],
 ['Rótulos de formulário','label associado a cada campo; aria-label complementar','Aplicado'],
 ['Navegação por teclado e foco','Foco visível; Esc fecha janelas; botões nativos','Aplicado'],
 ['Semântica e ARIA','role="dialog", aria-modal, aria-live em avisos, aria-pressed no tema','Aplicado'],
 ['Movimento reduzido','prefers-reduced-motion desativa animações','Aplicado'],
 ['Tamanho de alvos e reflow','Botões de 38 a 44 px; layout fluido sem rolagem horizontal','Aplicado'],
 ['Nome acessível contém o texto visível (2.5.3)','aria-label redundantes removidos; links e campos usam o texto visível ou label','Aplicado'],
 ['Operação por teclado','Botão de menu e "Esqueceu sua senha?" focáveis e acionáveis por Enter','Aplicado'],
 ['Contraste de cores','Paleta com texto claro sobre azul escuro e escuro sobre claro','Verificação visual; medição formal pendente'],
 ['Auditoria com leitor de tela','—','Pendente']]) + nota('Este documento não declara conformidade formal com a WCAG. As práticas acima foram aplicadas e inspecionadas, e a auditoria completa consta como evolução.', 'alerta'))

CAPS[19] = ('Riscos residuais, limitações e evolução', 4, """
<h2 class="s">19.1 Limitações conhecidas</h2>
""" + tab(['ID','Limitação','Impacto','Tratamento sugerido'], [
 ['L1','Pagamento fictício','Sem receita real','Integrar gateway e conciliar pedidos'],
 ['L2','Recuperação de senha simulada','Usuário não consegue redefinir a senha sozinho','Tokens de uso único por e-mail'],
 ['L3','QR Code sem validação na portaria','Sem controle de uso do ingresso','App/portal de leitura e estado "utilizado"'],
 ['L4','Sem controle de capacidade por dia','Venda ilimitada','Estoque por data'],
 ['L5','Token em localStorage','Exposição em caso de XSS','Cookie HttpOnly + CSRF'],
 ['L6','SQLite com uma instância','Escala limitada','PostgreSQL e migrações versionadas'],
 ['L7','Sem trilha de auditoria administrativa','Pouca rastreabilidade de ações do admin','Registro de eventos administrativos'],
 ['L8','Build do Docker não validado no sandbox','Risco de ajuste fino na primeira execução','CI já define o build; executar em máquina com internet']]) + """
<h2 class="s">19.2 Roteiro de evolução</h2>
<div class="duas">
<div class="cartao"><h4>Produto</h4><ul><li>Redefinição de senha por e-mail</li><li>Leitor de QR Code e baixa do ingresso</li><li>Calendário e capacidade por data</li><li>Internacionalização (inglês e espanhol)</li></ul></div>
<div class="cartao"><h4>Engenharia</h4><ul><li>Integração contínua com testes ponta a ponta</li><li>PostgreSQL e migrações</li><li>Cookie HttpOnly, CSRF e HSTS</li><li>Observabilidade e logs estruturados</li></ul></div>
</div>
<h2 class="s">19.3 Lições do projeto</h2>
<ul><li>Documentar requisitos com critérios verificáveis tornou os testes diretos.</li><li>Medir e verificar em navegador real antes de afirmar: o build apontou imagens de 15 MB (agora centenas de kB) e a interface revelou defeitos invisíveis na leitura do código.</li></ul>
""")

APEND = {
 'A': ('Glossário', """
""" + tab(['Termo','Significado'], [
 ['ADR','Registro de decisão arquitetural.'],['API REST','Interface de comunicação sobre HTTP com recursos e verbos.'],['bcrypt','Algoritmo de hash de senhas com custo configurável.'],
 ['C4','Modelo de diagramas de arquitetura: contexto, contêineres, componentes e código.'],['CLI','Interface de linha de comando.'],
 ['CSP','Content Security Policy: política que limita as origens de conteúdo.'],['Docker Compose','Descrição e execução de múltiplos contêineres.'],
 ['JWT','JSON Web Token: credencial assinada usada para sessões.'],['LGPD','Lei Geral de Proteção de Dados (Lei 13.709/2018).'],
 ['Mailpit','Servidor SMTP de testes com caixa de entrada web.'],['MoSCoW','Técnica de priorização: Must, Should, Could, Won\'t.'],
 ['OWASP','Comunidade que mantém guias de segurança de aplicações.'],['Papel','Perfil de acesso: usuário ou superadmin.'],
 ['QR Code','Código bidimensional lido por câmeras.'],['RF / RNF / RN','Requisito funcional, não funcional e regra de negócio.'],
 ['SAD / SDD / SRS','Descrição de arquitetura, de projeto e especificação de requisitos de software.'],['SMTP','Protocolo de envio de e-mails.'],
 ['SPA','Aplicação de página única.'],['STRIDE','Modelo de ameaças: Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege.'],
 ['Superadmin','Usuário com acesso ao painel administrativo.'],['WCAG','Diretrizes de acessibilidade para conteúdo web.']])),
 'B': ('Referências', """
""" + tab(['Referência','Uso neste documento'], [
 ['ISO/IEC/IEEE 29148:2018 · Systems and software engineering, Life cycle processes, Requirements engineering','Estrutura e qualidade dos requisitos (SRS)'],
 ['ISO/IEC/IEEE 42010:2022 · Architecture description','Visões de arquitetura e preocupações das partes interessadas'],
 ['ISO/IEC 25010 · Systems and software Quality Requirements and Evaluation (SQuaRE), quality model','Classificação dos requisitos não funcionais'],
 ['Simon Brown · The C4 model for visualising software architecture','Diagramas de contexto, contêineres e componentes'],
 ['Michael Nygard · Documenting Architecture Decisions','Formato dos ADRs'],
 ['OWASP Top 10 (2021) e OWASP ASVS','Mapeamento de controles de segurança'],
 ['Microsoft STRIDE · Threat modeling','Modelo de ameaças'],
 ['W3C · Web Content Accessibility Guidelines (WCAG) 2.2','Práticas de acessibilidade'],
 ['Jakob Nielsen · 10 Usability Heuristics for User Interface Design','Avaliação de UX'],
 ['RFC 7519 · JSON Web Token (JWT); RFC 5321 · SMTP','Sessões e e-mail'],
 ['Lei nº 13.709/2018 (LGPD)','Privacidade e proteção de dados'],
 ['Documentação oficial: Angular, Node.js, Express, Docker, nginx, SQLite','Tecnologias do projeto']], idcol=False) + """
<p>As normas são citadas como orientação de boas práticas. O documento não alega certificação ou conformidade formal com nenhuma delas.</p>"""),
}

PARTES = [
 ('Parte I','Contexto e visão do produto','parte1.jpg','Por que o sistema existe, para quem e com quais limites.',[1,2]),
 ('Parte II','Especificação de requisitos','parte2.jpg','O que o sistema deve fazer: telas, requisitos, regras, casos de uso e dados.',[3,4,5,6,7,8]),
 ('Parte III','Projeto e implementação','parte3.jpg','Como o sistema é construído: arquitetura, front-end, API, segurança, e-mail e administração.',[9,10,11,12,13,14]),
 ('Parte IV','Qualidade, operação e encerramento','parte4.jpg','Como sabemos que funciona e como operar: testes, rastreabilidade, implantação, UX e limitações.',[15,16,17,18,19]),
]
