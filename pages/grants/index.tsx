import Head from 'next/head';
import { Container } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NearAuthenticationGuardWithLoginRedirection from '@/components/common/NearAuthenticationGuardWithLoginRedirection';
import DefaultLayout from '@/layouts/default';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { getAllGrantApplicationsOfUser } from '@/services/apiService';
import type { NextApiRequest } from 'next';
import { parseCookies } from '@/utilities/parseCookies';
import { COOKIE_SIGNATURE_KEY } from '@/constants';
import { useAccountSignature } from '@/hooks/useAccountSignature';

function Login() {
  const { t } = useTranslation('grants');
  const apiSignature = useAccountSignature();
  const { data } = useQuery(['grants', apiSignature], () => getAllGrantApplicationsOfUser(apiSignature));

  return (
    <DefaultLayout>
      <>
        <Head>
          <title>{t('title')}</title>
        </Head>
        <NearAuthenticationGuardWithLoginRedirection>
          <>
            <Container>Grants</Container>
            <div>{data && data[0].nearId}</div>
          </>
        </NearAuthenticationGuardWithLoginRedirection>
      </>
    </DefaultLayout>
  );
}

export async function getServerSideProps({ req, locale }: { req: NextApiRequest; locale: string }) {
  const queryClient = new QueryClient();
  const data = parseCookies(req);
  const apiSignature = data[COOKIE_SIGNATURE_KEY] ? JSON.parse(data[COOKIE_SIGNATURE_KEY]) : null;

  await queryClient.prefetchQuery(['grants', apiSignature], () => getAllGrantApplicationsOfUser(apiSignature));

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'grants'])),
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Login;
