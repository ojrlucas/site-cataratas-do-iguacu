## Cataratas do Iguaçu: homenagem de um fã

Projeto de portfólio criado por um fã para homenagear as Cataratas do Iguaçu. **Não representa o site real do parque, não possui vínculo com o Parque Nacional do Iguaçu e não realiza vendas reais.** Ingressos, preços e e-mails são fictícios.

Front-end em Angular, back-end em Node.js (Express + SQLite) e execução com Docker.

Documentação completa: [docs/livro/Cataratas-do-Iguacu-Livro-do-Sistema.pdf](docs/livro/Cataratas-do-Iguacu-Livro-do-Sistema.pdf)

## Executando

```bash
cp .env.example .env
docker compose up --build
```

Site em http://localhost:8080 e e-mails de teste em http://localhost:8025. Defina `JWT_SECRET` no `.env` com pelo menos 32 caracteres.

## Estrutura

```
backend/    API Express, SQLite, e-mail e testes
frontend/   Angular
e2e/        Testes ponta a ponta
docs/livro/ Documentação do sistema
```
