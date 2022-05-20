import createProposalDescription from '@/utilities/createProposalDescription';

const createPayoutProposal = async (contract: any, grantData: any, payoutNumber: number) => {
  const description = createProposalDescription(grantData.projectName, payoutNumber, grantData.projectDescription);
  const policy = await contract.get_policy();

  contract.add_proposal(
    {
      proposal: {
        description,
        kind: {
          Transfer: {
            token_id: '',
            receiver_id: grantData.nearId,
            amount: grantData.nearFundingAmount,
          },
        },
      },
    },
    '30000000000000',
    policy.proposal_bond.toString(),
  );
};

// eslint-disable-next-line import/prefer-default-export
export { createPayoutProposal };