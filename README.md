# Praticità — Cardápio Online Angular

Projeto Angular para o cardápio online da **Praticità Doces e Salgados**.

## Stack

- Angular
- Persistência inicial em `localStorage`
- Estrutura preparada para futura API Node.js + MongoDB

## Rodar localmente

```bash
npm install
npm start
```

Acesse:

```txt
http://localhost:4200
```

## Áreas do sistema

```txt
/                         Cardápio público
/produto/:slug             Detalhe público do produto
/admin                     Dashboard administrativo
/admin/categorias          CRUD de categorias
/admin/produtos            CRUD de produtos
/admin/produtos/novo       Novo produto
/admin/produtos/:id        Editar produto, variações e opções
/admin/configuracoes       Dados comerciais
/admin/importar-exportar   Backup JSON
```

## Persistência

Os dados são salvos em:

```txt
localStorage['praticita:menu-data']
```

O acesso ao `localStorage` está isolado no repositório:

```txt
src/app/core/repositories/local-storage-menu.repository.ts
```

Os componentes consomem somente:

```txt
MenuService
```

Isso permite trocar a persistência por API no futuro sem reescrever as telas.

## Migração futura para Node.js + MongoDB

Na etapa 2, implementar:

```txt
src/app/core/repositories/api-menu.repository.ts
```

e alterar o provider em:

```txt
src/app/app.config.ts
```

De:

```ts
{ provide: MENU_REPOSITORY, useClass: LocalStorageMenuRepository }
```

Para:

```ts
{ provide: MENU_REPOSITORY, useClass: ApiMenuRepository }
```

## Observações comerciais

Alguns dados extraídos do PDF precisam de validação antes de produção:

- Preços e medidas de alguns bolos simples.
- Informação visual de R$ 47,00/kg na página de sobremesas.
- Regra especial de pastel/kibe a partir de 50 unidades.

## Backup

No painel, use:

```txt
/admin/importar-exportar
```

para exportar/importar o JSON do cardápio.
# praticita-cardapio-online
# praticita-admin
