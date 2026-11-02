## 🌊 Site Institucional Cataratas do Iguaçu

Site institucional fictício do Parque Nacional do Iguaçu (projeto educacional Entra21).
Front-end em **Angular** (design original mantido: Bootstrap + CSS próprio) e back-end em **Node.js** (Express + SQLite), empacotados em **Docker**.

Projeto Figma: https://www.figma.com/design/FbTv7fyuP7kDdv6qgzyicu/Parque-Nacional-do-Igua%C3%A7u?node-id=0-1&t=dUj65HaNXLgTcdQg-1

## 🚀 Executando com Docker

```bash
cp .env.example .env   # edite JWT_SECRET
docker compose up --build
```

Acesse http://localhost:8080. O nginx serve o Angular e faz proxy de `/api` para o back-end; o banco SQLite fica no volume `dados`.

## 🧑‍💻 Desenvolvimento local (Node 22.13+)

```bash
cd backend && npm install && npm run dev      # API em :3000
cd frontend && npm install && npm start       # Angular em :4200 (proxy para /api)
cd backend && npm test                        # testes da API
```

## 📁 Estrutura

```
backend/    API Express (auth JWT, atividades, ingressos, pedidos + QR Code)
frontend/   Angular (Home, Sobre, Lazer, Ingressos, Login, Registro)
docker-compose.yml
```

## 🔌 API

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/parque`, `/api/atividades`, `/api/ingressos/tipos` | Conteúdo público |
| POST | `/api/auth/registro`, `/api/auth/login`, `/api/auth/esqueci-senha` | Autenticação |
| GET | `/api/auth/me` | Usuário logado |
| POST/GET | `/api/pedidos` | Comprar / listar ingressos (autenticado) |
| GET | `/api/pedidos/:id/qrcode` | QR Code do pedido |

Os pagamentos e valores são fictícios (site de estudos).
