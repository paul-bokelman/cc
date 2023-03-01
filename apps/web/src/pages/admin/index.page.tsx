import type { NextPageWithConfig } from '~/shared/types';
import { DashboardContainer as Page } from '~/shared/components';
import { TbPlus } from 'react-icons/tb';

type Props = {};

const AdminDashboard: NextPageWithConfig<Props> = () => {
  return (
    <Page state="success">
      <Page.Header
        title="Dashboard"
        description="Admin Dashboard"
        // actions={[
        //   { variant: 'primary', children: 'New Club', iconLeft: TbPlus },
        // ]}
      />
      <Page.Section title="Notice" description="Page is unavailable">
        This page is currently under construction
      </Page.Section>
    </Page>
  );
};

AdminDashboard.layout = {
  view: 'dashboard',
  config: {},
};

export default AdminDashboard;
