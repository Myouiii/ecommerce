// material
import { Container } from '@material-ui/core';
// utils
// routes
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import useAuth from '../../../hooks/useAuth';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import UserFormEdit from './UserFormEdit';
import { clearData } from '../../../redux/slices/userSlice';

// ----------------------------------------------------------------------

export default function PageProfileUser() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(clearData());
  }, [dispatch]);

  return (
    <Page title="User: Create a new user | Minimal-UI">
      <Container>
        <HeaderBreadcrumbs
          heading="Information"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.general.statics },
            { name: 'User', href: PATH_DASHBOARD.app }
          ]}
        />
        <UserFormEdit user={user} />
      </Container>
    </Page>
  );
}
