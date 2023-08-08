// material
import { Container } from '@material-ui/core';

import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useLocales from '../../../hooks/useLocales';
import UserFormEdit from './UserFormEdit';

// ----------------------------------------------------------------------

export default function PageUserEdit() {
  const { t } = useLocales();

  return (
    <Page title="User: Edit a user | Minimal-UI">
      <Container>
        <HeaderBreadcrumbs
          heading="Edit user information"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.statics },
            { name: 'User', href: PATH_DASHBOARD.app.users.customer_list },
            { name: t('dashboard.users.edit-user') }
          ]}
        />
        <UserFormEdit />
      </Container>
    </Page>
  );
}
