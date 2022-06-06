import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Alert, Button, Text, Title } from '@mantine/core';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { AlertCircle } from 'tabler-icons-react';

import LoadingAnimation from '@/components/common/LoadingAnimation';
import useAccountSignature from '@/hooks/useAccountSignature';
import useDaoContract from '@/hooks/useDaoContract';
import { validateNearTransactionHash } from '@/services/apiService';
import type { GrantApplicationInterface } from '@/types/GrantApplicationInterface';

function GrantApplicationProposalSubmission({ data, setData }: { data: GrantApplicationInterface | undefined | null; setData: (data: GrantApplicationInterface) => void }) {
  const { t } = useTranslation('grant');
  const router = useRouter();
  const { errorCode } = router.query;

  const { isNearLoading, submitProposal } = useDaoContract();

  const submitGrantProposal = () => {
    submitProposal(data, 0);
  };

  const { transactionHashes } = router.query;
  const grantId = data?.id;
  const apiSignature = useAccountSignature();

  const { isLoading, refetch: fetchValidateTransactionHash } = useQuery(
    ['validate-transaction-hash', apiSignature, grantId, transactionHashes],
    () => {
      return validateNearTransactionHash(apiSignature, { grantId, proposalNearTransactionHash: transactionHashes });
    },
    {
      refetchOnWindowFocus: false,
      enabled: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onSuccess: (updatedGrantData: any) => {
        setData(updatedGrantData);
      },
    },
  );

  useEffect(() => {
    if (transactionHashes && apiSignature && typeof grantId !== 'undefined' && grantId >= 0) {
      fetchValidateTransactionHash();
    }
  }, [transactionHashes, fetchValidateTransactionHash, apiSignature, grantId]);

  if (isLoading) {
    return <LoadingAnimation />;
  }

  return (
    <>
      <Title mb="xl">{t('blockchain.title')}</Title>
      {errorCode && (
        <Alert icon={<AlertCircle size={16} />} title={t('error.tx_error.title')} color="orange" mb="xl">
          {t('error.tx_error.description')}
        </Alert>
      )}
      <Text mb="xl">{t('blockchain.description')}</Text>
      <Button type="submit" color="violet" disabled={isNearLoading} loading={isNearLoading} onClick={submitGrantProposal}>
        {t('blockchain.button')}
      </Button>
    </>
  );
}

export default GrantApplicationProposalSubmission;
