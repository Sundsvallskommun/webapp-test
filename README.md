# Sundsvalls kommun - Suppor Management Admin User Gui

## APIer som används

| API               | Version |
| ----------------- | ------: |
| SupportManagement |    10.2 |

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg för steg

1. Klona ner repot

```
git clone git@github.com:Sundsvallskommun/web-app-support-management-admin.git
```

2. Installera dependencies för både `backend` och `frontend`

```
cd web-app-support-management-admin/frontend
yarn install

cd web-app-support-management-admin/backend
yarn install
```

3. Skapa .env-fil för `frontend`

```
cd web-app-support-management-admin/frontend
cp .env-example .env
```

Redigera `.env` för behov, för utveckling bör exempelvärdet fungera.

4. Skapa .env-fil för `backend`

```
cd web-app-support-management-admin/backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

Redigera `.env.development.local` för behov. URLer, nycklar och cert behöver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` måste fyllas i för att APIerna ska fungera, samt att en applikation i WSO2-portalen som abonnerar på de microtjänster som anropas måste finnas
- `SAML_ENTRY_SSO` behöver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska stämma överens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` behöver bara fyllas i korrekt om man kör mot en riktig IDP

### Språkstöd

För språkstöd används [next-i18next](https://github.com/i18next/next-i18next).

Språkfiler är placerade i `frontend/public/locales/<locale>/<namespace>.json`.
