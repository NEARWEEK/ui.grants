import { useState } from 'react';
import type SputnikContractInterface from '@/types/SputnikContractInterface';
import useContract from '@/modules/near-api-react/hooks/useContract';
import { createPayoutProposal } from '@/services/sputnikContractService';
import { CONTRACT_ID } from '@/constants';
import type { GrantApplicationInterface } from '@/types/GrantApplicationInterface';

const useDaoContract = () => {
  const contract: SputnikContractInterface | undefined | null = useContract({
    contractId: CONTRACT_ID,
    contractMethods: {
      changeMethods: ['add_proposal'],
      viewMethods: ['get_policy'],
    },
  });

  const [isNearLoading, setIsNearLoading] = useState(false);

  const submitProposal = (grantData: GrantApplicationInterface | undefined | null, proposalNumber: number) => {
    setIsNearLoading(true);
    if (contract && grantData) {
      createPayoutProposal(contract, grantData, proposalNumber);
    }
  };

  return {
    isNearLoading,
    setIsNearLoading,
    submitProposal,
  };
};

export default useDaoContract;