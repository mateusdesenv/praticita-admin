# Integração do frontend com a API Node + MongoDB

Este frontend foi ajustado para consumir a API por `API_BASE_URL` em `.env`.

## Configuração local

Crie ou edite `.env` na raiz do projeto:

```env
API_BASE_URL=http://localhost:3000/api
PERSISTENCE_MODE=api
API_ADMIN_TOKEN=
```

Depois rode:

```bash
npm install
npm run start
```

O script `npm run start` executa `scripts/generate-environment.mjs` antes do Angular subir. Esse script lê `.env` e gera `src/environments/environment.ts`.

## Build de produção

```bash
API_BASE_URL=https://sua-api.vercel.app/api npm run build
```

Ou altere o `.env` antes do build:

```env
API_BASE_URL=https://sua-api.vercel.app/api
PERSISTENCE_MODE=api
API_ADMIN_TOKEN=
```

Então rode:

```bash
npm run build
```

## Arquivos alterados

- `src/app/core/repositories/api-menu.repository.ts`
- `src/app/app.config.ts`
- `src/environments/environment.ts`
- `.env`
- `.env.example`
- `scripts/generate-environment.mjs`
- `package.json`

## Endpoints consumidos

A base configurada em `API_BASE_URL` deve expor:

- `GET /menu-data`
- `PUT /menu-data`
- `DELETE /menu-data`
- `GET /menu-data/export`
- `POST /menu-data/import`
- `POST /menu-data/reset`

Com `API_BASE_URL=http://localhost:3000/api`, por exemplo, o frontend chama `http://localhost:3000/api/menu-data`.

## Nota sobre token administrativo

`API_ADMIN_TOKEN` foi deixado opcional porque token embutido no Angular fica exposto no bundle público. Para produção real, o correto é autenticação de usuário/sessão no admin, não segredo estático no frontend.
