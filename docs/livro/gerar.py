import re, subprocess, pathlib, os
import conteudo as C
base = pathlib.Path(__file__).parent
ONDA = '<svg class="onda" viewBox="0 0 600 12" preserveAspectRatio="none"><path d="M0 6 Q 25 0 50 6 T 100 6 T 150 6 T 200 6 T 250 6 T 300 6 T 350 6 T 400 6 T 450 6 T 500 6 T 550 6 T 600 6" fill="none" stroke="#b7f0bb" stroke-width="2"/></svg>'
LETRAS = ['Parte I', 'Parte II', 'Parte III', 'Parte IV']

def capitulo(n):
    titulo, parte, corpo = C.CAPS[n]
    faixa = (n - 1) % 5 + 1
    estilo = f'background-image: linear-gradient(135deg, rgba(0,108,166,.86), rgba(1,58,104,.92)), url(img/faixa{faixa}.jpg)'
    return f'<section class="cap" id="cap{n}"><div class="cap-abre" style="{estilo}"><div class="num">Capítulo {n}</div><h1>{titulo}</h1>{ONDA}</div>{corpo}</section>'

def apendice(letra):
    titulo, corpo = C.APEND[letra]
    estilo = 'background-image: linear-gradient(135deg, rgba(0,108,166,.86), rgba(1,58,104,.92)), url(img/faixa3.jpg)'
    return f'<section class="cap"><div class="cap-abre" style="{estilo}"><div class="num">Apêndice {letra}</div><h1>{titulo}</h1>{ONDA}</div>{corpo}</section>'

def abertura_parte(i):
    rot, tit, img, desc, caps = C.PARTES[i]
    lista = ''.join(f'<li>{n:02d} · {C.CAPS[n][0]}</li>' for n in caps)
    return (f'<section class="parte"><div class="foto" style="background-image:url(img/{img})"></div><div class="veu"></div>'
            f'<div class="conteudo"><div class="rotulo">{rot}</div><h1>{tit}</h1><p>{desc}</p><ul>{lista}</ul></div></section>')

def toc(pag):
    itens = ''
    for i, (rot, tit, _, _, caps) in enumerate(C.PARTES):
        itens += f'<li class="parte-li"><span class="n"></span><span class="t">{rot} · {tit}</span><span class="p">{pag.get(rot, "")}</span></li>'
        for n in caps:
            itens += f'<li><span class="n">{n:02d}</span><span class="t">{C.CAPS[n][0]}</span><span class="p">{pag.get(n, "")}</span></li>'
    for l in ('A', 'B'):
        itens += f'<li><span class="n">{l}</span><span class="t">{C.APEND[l][0]}</span><span class="p">{pag.get(l, "")}</span></li>'
    return f'<section class="toc"><h2>Sumário</h2><ol>{itens}</ol></section>'

def controle():
    return """<section class="folha" style="justify-content:flex-start"><h2 style="font-size:22pt;color:#013a68;margin:0 0 4pt;padding-bottom:6pt;border-bottom:3pt solid #4caf50">Controle do documento</h2>
<table class="ctrl"><tbody>
<tr><td>Título</td><td>Cataratas do Iguaçu · Documentação de Sistema (SRS, arquitetura, testes e operação)</td></tr>
<tr><td>Código</td><td>CPI-DOC-001</td></tr><tr><td>Versão</td><td>2.2</td></tr><tr><td>Data</td><td>2 de novembro de 2026</td></tr>
<tr><td>Situação</td><td>Versão final do portfólio</td></tr><tr><td>Autoria</td><td>Fã do parque, autor do projeto</td></tr>
<tr><td>Produto descrito</td><td>Sistema web Cataratas do Iguaçu, v1.0 (front-end Angular, API Node.js, Docker)</td></tr>
<tr><td>Normas de referência</td><td>ISO/IEC/IEEE 29148:2018, ISO/IEC/IEEE 42010:2022, ISO/IEC 25010, modelo C4</td></tr>
<tr><td>Classificação</td><td>Público. Projeto de portfólio, sem vínculo com o Parque Nacional do Iguaçu.</td></tr>
<tr><td>Fontes</td><td>Pasta docs/livro do repositório (gerar.py regenera o PDF)</td></tr></tbody></table>
<h3 class="s">Histórico de revisões</h3>
<table><thead><tr><th>Versão</th><th>Data</th><th>Descrição</th></tr></thead><tbody>
<tr><td class="id">0.1</td><td>2026-11-02</td><td>Migração do site HTML para Angular e criação do back-end Node.js.</td></tr>
<tr><td class="id">1.0</td><td>2026-11-02</td><td>Primeiro livro: visão geral, requisitos, arquitetura e operação.</td></tr>
<tr><td class="id">2.0</td><td>2026-11-02</td><td>Reestruturação conforme ISO/IEC/IEEE 29148 e 42010: partes, critérios de aceitação, casos de uso, diagramas C4 e UML, ADRs, modelo de ameaças, plano de testes e matriz de rastreabilidade.</td></tr><tr><td class="id">2.1</td><td>2026-11-02</td><td>Testes ponta a ponta versionados (Playwright), fluxo de CI e correção de acessibilidade (WCAG 2.5.3); rastreabilidade atualizada.</td></tr>
<tr><td class="id">2.2</td><td>2026-11-02</td><td>Refatoração em camadas (back-end e front-end), estilos consolidados, ESLint nos três projetos, imagens otimizadas e 12 testes de API, CLI e unidade; ADR-11, ADR-12 e convenções de código.</td></tr>
</tbody></table>
<div class="aviso-grande" style="margin-top:14pt"><h2 style="font-size:14pt">Aviso importante</h2>
<p>Este documento e o sistema que ele descreve foram criados por um <strong>fã</strong>, como <strong>homenagem</strong> às Cataratas do Iguaçu e ao Parque Nacional do Iguaçu, Patrimônio Mundial Natural da UNESCO. O sistema <strong>não representa um site real</strong> das Cataratas do Iguaçu, não é mantido, aprovado ou endossado pelo parque ou por qualquer órgão responsável e <strong>trata-se apenas de um portfólio</strong>. Ingressos, preços, pagamentos, e-mails e contatos são fictícios ou ilustrativos; nenhuma compra real é realizada. Para informações oficiais, consulte sempre os canais oficiais do parque. As fotografias pertencem ao acervo do projeto educacional original, sem créditos de autoria informados.</p></div></section>"""

def html(pag):
    corpo = ''
    for i, (rot, tit, img, desc, caps) in enumerate(C.PARTES):
        corpo += abertura_parte(i) + ''.join(capitulo(n) for n in caps)
    corpo += apendice('A') + apendice('B')
    return f'''<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><title>Cataratas do Iguaçu - Documentação de Sistema</title><link rel="stylesheet" href="livro.css"><style>.toc li.parte-li {{ margin-top: 7pt; background: #eaf2f8; border-bottom: 2pt solid #4caf50; padding: 5pt 6pt; }} .toc li.parte-li .t {{ color: #036800; text-transform: uppercase; font-size: 9.5pt; letter-spacing: 1pt; }} .toc li {{ padding: 3.6pt 0; font-size: 10pt; }}</style></head><body>
<section class="capa"><div class="foto"></div><div class="veu"></div><div class="conteudo">
<img class="logo" src="img/logo.png" alt="Logo">
<span class="selo">Projeto de fã · Portfólio</span>
<h1>Cataratas<strong>do Iguaçu</strong></h1>
<p class="sub">Documentação de sistema: especificação de requisitos, arquitetura, segurança, testes e operação</p>
<div class="faixa"><b>Uma homenagem de fã.</b> Este sistema não representa o site real das Cataratas do Iguaçu nem o Parque Nacional do Iguaçu. É exclusivamente um projeto de portfólio, com dados e vendas fictícios. · Versão 2.2 · 2 de novembro de 2026</div>
</div></section>
{controle()}
{toc(pag)}
{corpo}
<section class="final"><img src="img/logo.png" alt="Logo"><h2 style="color:#013a68;margin:0 0 8pt">Obrigado por visitar</h2>
<p>Este projeto nasceu do carinho por um dos lugares mais impressionantes do Brasil. Que as quedas do Iguaçu continuem inspirando.</p>
<p style="font-size:9pt;color:#5b6b78">Projeto de fã e portfólio. Não representa o site real das Cataratas do Iguaçu.</p></section>
</body></html>'''

def render(pag, saida):
    (base / 'livro.html').write_text(html(pag), encoding='utf-8')
    js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://{base}/livro.html', {{ waitUntil: 'networkidle' }});
await p.pdf({{ path: '{saida}', preferCSSPageSize: true, printBackground: true }}); await b.close(); }})();"""
    (base / '.render.js').write_text(js)
    root = subprocess.check_output(['npm', 'root', '-g']).decode().strip()
    subprocess.check_call(['node', str(base / '.render.js')], env={**os.environ, 'NODE_PATH': root})

saida = base / 'Cataratas-do-Iguacu-Livro-do-Sistema.pdf'
render({}, saida)
n = int(re.search(r'Pages:\s+(\d+)', subprocess.check_output(['pdfinfo', str(saida)]).decode()).group(1))
pag = {}
for pg in range(1, n + 1):
    t = subprocess.check_output(['pdftotext', '-f', str(pg), '-l', str(pg), '-layout', str(saida), '-']).decode()
    m = re.search(r'^\s*CAP[ÍI]TULO\s+(\d+)\s*$', t, re.M)
    if m: pag[int(m.group(1))] = pg
    m = re.search(r'^\s*AP[ÊE]NDICE\s+([AB])\s*$', t, re.M)
    if m: pag[m.group(1)] = pg
    for rot in LETRAS:
        linhas = [l.replace(' ', '') for l in t.splitlines()]
        if rot.upper().replace(' ', '') in linhas and rot not in pag: pag[rot] = pg
print(pag)
render(pag, saida)
(base / '.render.js').unlink()
print(n)
