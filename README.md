# Sundsvalls kommun - SupporManagement Admin-UI

## APIer som anv�nds

| API               | Version |
| ----------------- | ------: |
| SupportManagement |     8.1 |

## Utveckling

### Krav

- Node >= 20 LTS
- Yarn

### Steg f�r steg

1. Klona ner repot

```
git clone git@github.com:Sundsvallskommun/web-app-support-management-admin.git
```

2. Installera dependencies f�r b�de `backend` och `frontend`

```
cd web-app-support-management-admin/frontend
yarn install

cd web-app-support-management-admin/backend
yarn install
```

3. Skapa .env-fil f�r `frontend`

```
cd web-app-support-management-admin/frontend
cp .env-example .env
```

Redigera `.env` f�r behov, f�r utveckling b�r exempelv�rdet fungera.

4. Skapa .env-fil f�r `backend`

```
cd web-app-support-management-admin/backend
cp .env.example.local .env.development.local
cp .env.example.local .env.test.local
```

Redigera `.env.development.local` f�r behov. URLer, nycklar och cert beh�ver fyllas i korrekt.

- `CLIENT_KEY` och `CLIENT_SECRET` m�ste fyllas i f�r att APIerna ska fungera, du m�ste ha en applikation fr�n WSO2-portalen som abonnerar p� de microtj�nster du anropar
- `SAML_ENTRY_SSO` beh�ver pekas till en SAML IDP
- `SAML_IDP_PUBLIC_CERT` ska st�mma �verens med IDPens cert
- `SAML_PRIVATE_KEY` och `SAML_PUBLIC_KEY` beh�ver bara fyllas i korrekt om man k�r mot en riktig IDP

### Spr�kst�d

F�r spr�kst�d anv�nds [next-i18next](https://github.com/i18next/next-i18next).

Spr�kfiler �r placerade i `frontend/public/locales/<locale>/<namespace>.json`.
