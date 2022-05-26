import { Grid } from '@mantine/core';

import FormEdit from '@/components/grant-application-form/FormEdit';
import FormSummary from '@/components/grant-application-form/FormSummary';
import type { GrantApplicationInterface } from '@/types/GrantApplicationInterface';

function GrantApplicationForm({ data, setData }: { data: GrantApplicationInterface | undefined | null; setData: (data: GrantApplicationInterface) => void }) {
  return (
    <Grid gutter="xl" mb="xl">
      <Grid.Col span={8}>
        <FormEdit data={data} setData={setData} />
      </Grid.Col>
      <Grid.Col span={4}>
        <FormSummary data={data} setData={setData} />
      </Grid.Col>
    </Grid>
  );
}

export default GrantApplicationForm;
