import Head from 'next/head';
import { Container } from '@mantine/core';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import NearAuthenticationGuardWithLoginRedirection from '@/components/common/NearAuthenticationGuardWithLoginRedirection';
import DefaultLayout from '@/layouts/default';
import { QueryClient, dehydrate, useQuery } from 'react-query';
import { getAllGrantApplicationsOfUser } from '@/services/apiService';

function Login() {
  const { t } = useTranslation('grants');
  const { data } = useQuery('grants', getAllGrantApplicationsOfUser);

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

export async function getServerSideProps({ locale }: { locale: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery('grants', getAllGrantApplicationsOfUser);

  // get cookies here

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'grants'])),
      dehydratedState: dehydrate(queryClient),
    },
  };
}

export default Login;
