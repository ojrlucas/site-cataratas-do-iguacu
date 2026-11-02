import re, subprocess, sys, pathlib
from capitulos import CAPS, cap
base = pathlib.Path(__file__).parent

def toc(paginas):
    itens = ''.join(f'<li><span class="n">{i+1:02d}</span><span class="t">{t}</span><span class="p">{paginas.get(i+1, "")}</span></li>' for i, (t, _) in enumerate(CAPS))
    return f'<section class="toc"><h2>Sumário</h2><ol>{itens}</ol></section>'

def html(paginas):
    corpo = ''.join(cap(i+1, t, c) for i, (t, c) in enumerate(CAPS))
    return f'''<!doctype html><html lang="pt-br"><head><meta charset="utf-8"><title>Cataratas do Iguaçu - Livro do Sistema</title><link rel="stylesheet" href="livro.css"></head><body>
<section class="capa"><div class="foto"></div><div class="veu"></div><div class="conteudo">
<img class="logo" src="img/logo.png" alt="Logo">
<span class="selo">Projeto de fã · Portfólio</span>
<h1>Cataratas<strong>do Iguaçu</strong></h1>
<p class="sub">Livro do sistema: documentação, requisitos, regras de negócio, arquitetura e operação</p>
<div class="faixa"><b>Uma homenagem de fã.</b> Este sistema não representa o site real das Cataratas do Iguaçu nem o Parque Nacional do Iguaçu. É exclusivamente um projeto de portfólio, com dados e vendas fictícios.</div>
</div></section>
<section class="folha"><div class="aviso-grande"><h2>Aviso importante</h2>
<p>Este livro e o sistema que ele descreve foram criados por um <strong>fã</strong>, como <strong>homenagem</strong> às Cataratas do Iguaçu, uma das maiores maravilhas naturais do mundo, e ao Parque Nacional do Iguaçu, Patrimônio Mundial Natural da UNESCO.</p>
<p>O sistema <strong>não representa um site real</strong> das Cataratas do Iguaçu, não é mantido, aprovado ou endossado pelo parque ou por qualquer órgão responsável, e <strong>trata-se apenas de um portfólio</strong>. Ingressos, preços, pagamentos, e-mails e dados de contato exibidos são fictícios ou meramente ilustrativos. Nenhuma compra real é realizada.</p>
<p>Para informações oficiais, horários, valores e compra de ingressos, consulte sempre os canais oficiais do parque.</p>
<p class="dados">Versão 1.0 · 2 de novembro de 2026 · Front-end Angular · Back-end Node.js · Docker</p></div></section>
{toc(paginas)}
{corpo}
<section class="final"><img src="img/logo.png" alt="Logo"><h2 style="color:#013a68;margin:0 0 8pt">Obrigado por visitar</h2>
<p>Este projeto nasceu do carinho por um dos lugares mais impressionantes do Brasil. Que as quedas do Iguaçu continuem inspirando.</p>
<p style="font-size:9pt;color:#5b6b78">Projeto de fã e portfólio. Não representa o site real das Cataratas do Iguaçu.</p></section>
</body></html>'''

def render(paginas, saida):
    (base / 'livro.html').write_text(html(paginas), encoding='utf-8')
    js = f"""const {{ chromium }} = require('playwright');
(async () => {{ const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://{base}/livro.html', {{ waitUntil: 'networkidle' }});
await p.pdf({{ path: '{saida}', preferCSSPageSize: true, printBackground: true }}); await b.close(); }})();"""
    (base / '.render.js').write_text(js)
    root = subprocess.check_output(['npm', 'root', '-g']).decode().strip()
    subprocess.check_call(['node', str(base / '.render.js')], env={**__import__('os').environ, 'NODE_PATH': root})

saida = base / 'Cataratas-do-Iguacu-Livro-do-Sistema.pdf'
render({}, saida)
n = int(re.search(r'Pages:\s+(\d+)', subprocess.check_output(['pdfinfo', str(saida)]).decode()).group(1))
paginas = {}
for pg in range(1, n + 1):
    t = subprocess.check_output(['pdftotext', '-f', str(pg), '-l', str(pg), '-layout', str(saida), '-']).decode()
    m = re.search(r'^\s*CAP[ÍI]TULO\s+(\d+)\s*$', t, re.M)
    if m: paginas[int(m.group(1))] = pg
print(paginas)
render(paginas, saida)
(base / '.render.js').unlink()
print(subprocess.check_output(['pdfinfo', str(saida)]).decode())
