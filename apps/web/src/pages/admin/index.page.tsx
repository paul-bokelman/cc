import type { NextPageWithConfig } from '~/shared/types';
import { DashboardHeader } from '~/shared/components';
import { TbPlus } from 'react-icons/tb';

type Props = {};

const AdminDashboard: NextPageWithConfig<Props> = () => {
  return (
    <DashboardHeader
      title="Dashboard"
      description="Admin Dashboard"
      actions={[{ variant: 'primary', children: 'New Club', iconLeft: TbPlus }]}
    />
  );
};

AdminDashboard.layout = {
  view: 'dashboard',
  config: {},
};

export default AdminDashboard;
