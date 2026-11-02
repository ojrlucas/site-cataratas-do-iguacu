## Cataratas do Iguaçu: homenagem de um fã

Projeto de portfólio criado por um fã para homenagear as Cataratas do Iguaçu. **Não representa o site real do parque, não possui vínculo com o Parque Nacional do Iguaçu e não realiza vendas reais.** Ingressos, preços e e-mails são fictícios.

Front-end em Angular (design original mantido), back-end em Node.js (Express + SQLite), tudo em Docker.

Documentação completa (requisitos, regras de negócio, arquitetura, segurança): [docs/livro/Cataratas-do-Iguacu-Livro-do-Sistema.pdf](docs/livro/Cataratas-do-Iguacu-Livro-do-Sistema.pdf)

## Executando com Docker

```bash
cp .env.example .env
docker compose up --build
```

- Site: http://localhost:8080
- E-mails de teste (Mailpit): http://localhost:8025

Defina `JWT_SECRET` no `.env` com pelo menos 32 caracteres (`openssl rand -hex 32`).

## Superadmin pelo terminal

```bash
docker compose exec backend node src/cli.js superadmin criar --email voce@exemplo.com --nome "Seu Nome"
docker compose exec backend node src/cli.js superadmin atualizar --email voce@exemplo.com --novo-email outro@exemplo.com
docker compose exec backend node src/cli.js superadmin promover --email usuario@exemplo.com
docker compose exec backend node src/cli.js superadmin rebaixar --email usuario@exemplo.com
docker compose exec backend node src/cli.js superadmin listar
```

Sem `--senha`, a senha é solicitada de forma oculta.

## Desenvolvimento local (Node 22.13+)

```bash
cd backend && npm install && npm run dev
cd frontend && npm install && npm start
cd backend && npm test

cd frontend && npm run build
cd e2e && npm install && npx playwright install chromium && npx playwright test
```

## Estrutura

```
backend/    API Express, SQLite, e-mail, CLI e testes
e2e/        Testes ponta a ponta (Playwright)
.github/    Fluxo de CI (testes, build, e2e, Docker)
frontend/   Angular (Home, Sobre, Lazer, Ingressos, Login, Registro, Admin)
docs/livro/ Fontes e PDF do livro do sistema
docker-compose.yml
```
