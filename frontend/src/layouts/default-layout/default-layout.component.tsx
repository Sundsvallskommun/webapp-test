import { CookieConsent, Link } from '@sk-web-gui/react';
import Head from 'next/head';
import NextLink from 'next/link';
import { MainPageSidebar } from '../../components/main-page-sidebar/main-page-sidebar.component';
import { useTranslation } from 'next-i18next';

export default function DefaultLayout({ title }) {
  const applicationName = process.env.NEXT_PUBLIC_APP_NAME;
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={applicationName} />
      </Head>
      <div className="flex min-h-screen h-full overflow-hidden">
        <MainPageSidebar/>
      </div>
      <CookieConsent
        title={t('layout:cookies.title', { app: process.env.NEXT_PUBLIC_APP_NAME })}
        body={
          <p>
            {t('layout:cookies.description')}{' '}
            <NextLink href="/kakor" passHref legacyBehavior>
              <Link>{t('layout:cookies.read_more')}</Link>
            </NextLink>
          </p>
        }
        cookies={[
          {
            optional: false,
            displayName: t('layout:cookies.necessary.displayName'),
            description: t('layout:cookies.necessary.description'),
            cookieName: 'necessary',
          },
          {
            optional: true,
            displayName: t('layout:cookies.func.displayName'),
            description: t('layout:cookies.func.description'),
            cookieName: 'func',
          },
          {
            optional: true,
            displayName: t('layout:cookies.stats.displayName'),
            description: t('layout:cookies.stats.description'),
            cookieName: 'stats',
          },
        ]}
        resetConsentOnInit={false}
        onConsent={() => {
          // NOTE: do stuff with cookies?
        }}
      />
    </>
  );
}