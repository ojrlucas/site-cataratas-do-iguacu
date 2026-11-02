AZ, ES, ME, VE, VE2, CL, TX, SU = '#006ca6', '#013a68', '#004d8b', '#4caf50', '#036800', '#e9eff3', '#1d2a35', '#5b6b78'

def svg(w, h, body):
    return (f'<div class="diagrama"><svg viewBox="0 0 {w} {h}" width="{w}" xmlns="http://www.w3.org/2000/svg">'
            f'<defs><marker id="m" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto"><path d="M0 0 L10 4 L0 8z" fill="{ME}"/></marker></defs>{body}</svg></div>')

def box(x, y, w, h, t, s='', fill=AZ, tc='#fff', stroke=None, dash=False, rx=10):
    st = f' stroke="{stroke}" stroke-width="2"' + (' stroke-dasharray="5 4"' if dash else '') if stroke else ''
    out = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}"{st}/>'
    cy = y + h / 2 + (-5 if s else 4)
    out += f'<text x="{x+w/2}" y="{cy}" text-anchor="middle" font-size="12" font-weight="700" fill="{tc}">{t}</text>'
    if s:
        out += f'<text x="{x+w/2}" y="{cy+16}" text-anchor="middle" font-size="9.5" fill="{tc}" opacity=".88">{s}</text>'
    return out

def frame(x, y, w, h, t, color=VE):
    return (f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="14" fill="none" stroke="{color}" stroke-width="2" stroke-dasharray="6 5"/>'
            f'<text x="{x+12}" y="{y+16}" font-size="10" font-weight="700" fill="{VE2}">{t}</text>')

def arr(x1, y1, x2, y2, label='', dash=False, lx=None, ly=None, both=False):
    d = ' stroke-dasharray="4 3"' if dash else ''
    ms = ' marker-start="url(#m)"' if both else ''
    out = f'<path d="M{x1} {y1} L{x2} {y2}" stroke="{ME}" stroke-width="1.8" fill="none" marker-end="url(#m)"{ms}{d}/>'
    if label:
        lx = lx if lx is not None else (x1 + x2) / 2
        ly = ly if ly is not None else (y1 + y2) / 2 - 5
        out += f'<text x="{lx}" y="{ly}" text-anchor="middle" font-size="9" fill="{TX}" paint-order="stroke" stroke="#fff" stroke-width="3">{label}</text>'
    return out

def pessoa(x, y, nome):
    return (f'<circle cx="{x}" cy="{y}" r="9" fill="none" stroke="{ES}" stroke-width="2"/><path d="M{x} {y+9} V{y+30} M{x-14} {y+18} H{x+14} M{x} {y+30} L{x-11} {y+46} M{x} {y+30} L{x+11} {y+46}" stroke="{ES}" stroke-width="2" fill="none"/>'
            f'<text x="{x}" y="{y+62}" text-anchor="middle" font-size="10" font-weight="700" fill="{ES}">{nome}</text>')

def elipse(cx, cy, rx, ry, t, fill='#fff', stroke=AZ):
    return (f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="{fill}" stroke="{stroke}" stroke-width="1.6"/>'
            f'<text x="{cx}" y="{cy+3.5}" text-anchor="middle" font-size="9.5" fill="{TX}">{t}</text>')

def texto(x, y, t, size=10, bold=False, color=TX, anchor='middle'):
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" font-size="{size}" {"font-weight=\"700\"" if bold else ""} fill="{color}">{t}</text>'

def c4_contexto():
    b = pessoa(70, 40, 'Visitante / Usuário') + pessoa(70, 190, 'Superadmin') + pessoa(70, 330, 'Desenvolvedor')
    b += box(250, 140, 190, 90, 'Cataratas do Iguaçu', 'Sistema web (portfólio de fã)', fill=ES)
    b += box(520, 40, 150, 60, 'Servidor SMTP', 'Mailpit (demo) ou real', fill=CL, tc=ES, stroke=ME)
    b += box(520, 260, 150, 60, 'Google Maps', 'mapa incorporado (iframe)', fill=CL, tc=ES, stroke=ME)
    b += arr(110, 70, 250, 170, 'consulta, compra') + arr(110, 215, 250, 190, 'administra') + arr(110, 345, 250, 215, 'CLI superadmin')
    b += arr(440, 165, 520, 80, 'comprovante') + arr(440, 215, 520, 285, 'exibe mapa', dash=True)
    return svg(700, 400, b)

def c4_conteineres():
    b = pessoa(50, 30, 'Usuário') + pessoa(50, 150, 'Superadmin')
    b += frame(150, 10, 330, 330, 'Docker Compose · rede interna')
    b += box(170, 40, 150, 62, 'nginx', 'estáticos + proxy /api', fill=AZ)
    b += box(330, 40, 135, 62, 'SPA Angular', 'executa no navegador', fill=CL, tc=ES, stroke=AZ)
    b += box(170, 150, 150, 62, 'API Node.js', 'Express 5 · porta 3000', fill=ME)
    b += box(170, 260, 150, 62, 'Mailpit', 'SMTP 1025 · UI 8025', fill=VE)
    b += box(520, 150, 140, 62, 'SQLite', 'volume dados:/data', fill=CL, tc=ES, stroke=ME)
    b += box(520, 260, 140, 62, 'SMTP real', 'opcional (.env)', fill=CL, tc=ES, stroke=ME, dash=True)
    b += arr(90, 60, 170, 70, 'HTTPS', both=True) + arr(320, 71, 330, 71) + arr(245, 102, 245, 150, '/api (HTTP)', lx=285) + arr(320, 181, 520, 181, 'SQL')
    b += arr(245, 212, 245, 260, 'SMTP') + arr(320, 195, 520, 280, 'SMTP', dash=True)
    return svg(700, 345, b)

def c4_componentes():
    b = frame(10, 10, 680, 350, 'Contêiner: API Node.js')
    b += box(30, 40, 150, 46, 'server.js', 'bootstrap, env, listen', fill=ES)
    b += box(30, 110, 150, 46, 'cli.js', 'gestão de superadmin', fill=ES)
    b += box(230, 40, 210, 46, 'app.js · createApp()', 'composição e rotas', fill=ME)
    b += box(230, 110, 100, 46, 'Middlewares', 'helmet · cors · limit', fill=AZ)
    b += box(340, 110, 100, 46, 'Validação', 'Zod (schemas)', fill=AZ)
    b += box(230, 180, 100, 46, 'Rotas públicas', 'parque · lazer · tipos', fill=AZ)
    b += box(340, 180, 100, 46, 'Auth', 'registro · login · me', fill=AZ)
    b += box(230, 250, 100, 46, 'Pedidos', 'compra · QR · reenvio', fill=AZ)
    b += box(340, 250, 100, 46, 'Admin', 'resumo · CRUD', fill=AZ)
    b += box(490, 40, 180, 46, 'db.js', 'esquema + seed (node:sqlite)', fill=VE)
    b += box(490, 110, 180, 46, 'mailer.js', 'nodemailer + HTML', fill=VE)
    b += box(490, 180, 180, 46, 'data.js', 'conteúdo estático inicial', fill=VE)
    b += box(490, 250, 180, 46, 'bcrypt · JWT · QR Code', 'bibliotecas', fill=CL, tc=ES, stroke=ME)
    b += arr(180, 63, 230, 63) + arr(180, 133, 490, 63, dash=True) + arr(440, 63, 490, 63) + arr(440, 133, 490, 133) + arr(335, 86, 335, 110)
    b += arr(335, 156, 335, 180) + arr(335, 226, 335, 250) + arr(440, 273, 490, 273) + arr(440, 203, 490, 203, dash=True)
    return svg(700, 372, b)

def implantacao():
    b = frame(10, 10, 680, 320, 'Host (máquina do desenvolvedor / servidor) · Docker Engine')
    b += box(40, 50, 160, 70, 'frontend', 'nginx-unprivileged :8080', fill=AZ)
    b += box(270, 50, 160, 70, 'backend', 'node:22-alpine :3000', fill=ME)
    b += box(500, 50, 160, 70, 'mailpit', ':1025 · :8025', fill=VE)
    b += box(270, 180, 160, 46, 'volume dados', '/data/cataratas.db', fill=CL, tc=ES, stroke=ME)
    b += box(500, 180, 160, 46, 'volume emails', '/data/mailpit.db', fill=CL, tc=ES, stroke=ME)
    b += box(40, 180, 160, 46, 'porta 8080', 'publicada no host', fill=CL, tc=ES, stroke=VE)
    b += box(500, 250, 160, 46, 'porta 8025', 'publicada no host', fill=CL, tc=ES, stroke=VE)
    b += arr(200, 85, 270, 85, '/api') + arr(430, 85, 500, 85, 'SMTP') + arr(350, 120, 350, 180) + arr(580, 120, 580, 180) + arr(120, 120, 120, 180) + arr(580, 226, 580, 250)
    b += texto(30, 312, 'backend: somente leitura · cap_drop ALL · no-new-privileges · usuário node', 10, False, SU, 'start')
    return svg(700, 345, b)

def casos_uso():
    b = pessoa(40, 80, 'Visitante') + pessoa(40, 250, 'Usuário') + pessoa(650, 130, 'Superadmin') + pessoa(650, 300, 'Desenvolvedor')
    b += f'<rect x="110" y="10" width="480" height="400" rx="14" fill="none" stroke="{AZ}" stroke-width="2"/>' + texto(350, 28, 'Sistema Cataratas do Iguaçu', 11, True, AZ)
    items = [(220, 62, 'UC01 Consultar conteúdo'), (480, 62, 'UC02 Alternar tema'), (220, 122, 'UC03 Cadastrar-se'), (480, 122, 'UC04 Entrar / sair'),
             (220, 182, 'UC05 Comprar ingresso'), (480, 182, 'UC06 Ver QR e reenviar e-mail'), (220, 242, 'UC07 Ver meus pedidos'),
             (480, 242, 'UC08 Painel e métricas'), (220, 302, 'UC09 Gerir ingressos'), (480, 302, 'UC10 Gerir lazer'), (350, 362, 'UC11 Gerir superadmins (CLI)')]
    for cx, cy, t in items: b += elipse(cx, cy, 98, 22, t)
    b += arr(76, 90, 122, 70) + arr(76, 100, 122, 122) + arr(76, 105, 130, 125)
    b += arr(76, 260, 122, 190) + arr(76, 265, 122, 250) + arr(76, 255, 125, 130) + arr(76, 255, 400, 190)
    b += arr(614, 150, 570, 250) + arr(614, 150, 570, 310) + arr(614, 160, 400, 310) + arr(614, 320, 430, 365)
    return svg(700, 425, b)

def sequencia_compra():
    cols = [(50, 'Usuário'), (170, 'SPA Angular'), (300, 'nginx'), (420, 'API'), (540, 'SQLite'), (650, 'SMTP')]
    b = ''
    for x, n in cols:
        b += box(x - 42, 6, 84, 26, n, fill=ES, rx=6) + f'<path d="M{x} 32 V330" stroke="#b8c9d6" stroke-width="1.5" stroke-dasharray="4 4"/>'
    msgs = [(50, 170, 58, 'confirma (tipo, qtd, data)'), (170, 300, 88, 'POST /api/pedidos + JWT'), (300, 420, 112, 'proxy_pass'),
            (420, 420, 134, 'valida JWT, Zod, regras'), (420, 540, 158, 'INSERT pedido'), (540, 420, 182, 'id'),
            (420, 650, 206, 'e-mail + QR (anexo cid)'), (650, 420, 230, '250 OK'), (420, 540, 254, 'email_enviado = 1'),
            (420, 170, 280, '201 pedido'), (170, 50, 306, 'QR Code + status do e-mail')]
    for a, c, y, t in msgs:
        if a == c:
            b += f'<path d="M{a} {y-8} h24 v16 h-24" fill="none" stroke="{ME}" stroke-width="1.6" marker-end="url(#m)"/>' + texto(a + 30, y + 3, t, 9, False, TX, 'start')
        else:
            dash = a > c
            b += arr(a, y, c, y, t, dash=dash, ly=y - 5)
    return svg(700, 345, b)

def estados_email():
    b = f'<circle cx="40" cy="80" r="9" fill="{ES}"/>'
    b += box(110, 55, 150, 50, 'Pedido criado', 'email_enviado = 0', fill=AZ)
    b += box(330, 10, 160, 50, 'E-mail pendente', 'falha SMTP', fill='#fff1cf', tc='#7a5200', stroke='#e0a800')
    b += box(330, 100, 160, 50, 'E-mail enviado', 'email_enviado = 1', fill='#dff3e1', tc=VE2, stroke=VE)
    b += arr(49, 80, 110, 80) + arr(260, 70, 330, 38, 'SMTP falha', ly=42) + arr(260, 90, 330, 124, 'SMTP ok', ly=121)
    b += arr(410, 60, 410, 100, 'reenviar (ok)', lx=450, ly=84) + f'<path d="M490 30 q 40 0 40 25 t -40 20" fill="none" stroke="{ME}" stroke-width="1.8" marker-end="url(#m)"/>' + texto(560, 60, 'reenviar (falha)', 9, False, TX, 'start')
    b += arr(490, 125, 560, 125, 'reenviar (ok)', lx=525, ly=118) + f'<circle cx="575" cy="125" r="9" fill="none" stroke="{ES}" stroke-width="2"/><circle cx="575" cy="125" r="5" fill="{ES}"/>'
    return svg(640, 170, b)

def der():
    def tab(x, y, w, nome, campos, cor=AZ):
        h = 30 + 17 * len(campos)
        o = f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="#fff" stroke="{cor}" stroke-width="2"/><rect x="{x}" y="{y}" width="{w}" height="26" rx="10" fill="{cor}"/><rect x="{x}" y="{y+14}" width="{w}" height="12" fill="{cor}"/>'
        o += texto(x + w / 2, y + 18, nome, 12, True, '#fff')
        for i, c in enumerate(campos): o += texto(x + 10, y + 46 + 17 * i, c, 9.5, False, TX, 'start')
        return o
    b = tab(10, 20, 200, 'usuarios', ['id · PK · AUTOINCREMENT', 'nome · NOT NULL', 'email · UNIQUE · NOT NULL', 'telefone · NOT NULL', 'senha_hash · NOT NULL', 'papel · CHECK (usuario|superadmin)', 'criado_em · DEFAULT now'])
    b += tab(260, 20, 210, 'pedidos', ['id · PK', 'codigo · UNIQUE', 'usuario_id · FK → usuarios.id', 'tipo_id · (referência lógica)', 'tipo_nome · snapshot', 'quantidade', 'data_visita', 'total_centavos', 'email_enviado · 0|1', 'criado_em'])
    b += tab(520, 20, 170, 'tipos_ingresso', ['id · PK (slug)', 'nome', 'preco_centavos', 'imagem', 'descricao', 'ativo · 0|1'], VE2)
    b += tab(520, 190, 170, 'atividades', ['id · PK (slug)', 'titulo', 'imagem', 'alt', 'descricao', 'ordem'], VE2)
    b += arr(210, 110, 260, 110) + texto(222, 104, '1', 10, True, ME) + texto(248, 104, 'N', 10, True, ME)
    b += arr(470, 120, 520, 120, dash=True) + texto(482, 114, 'N', 10, True, ME) + texto(508, 114, '1', 10, True, ME)
    return svg(710, 300, b)

def matriz_risco():
    cel = lambda t, c: f'<td style="background:{c};text-align:center;font-size:8pt;font-weight:700">{t}</td>'
    return ''
