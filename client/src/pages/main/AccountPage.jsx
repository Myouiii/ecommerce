import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { useMediaQuery, Box, Container, Stack, Tab, Tabs, Typography } from '@material-ui/core';
// icons
import { Icon } from '@iconify/react';
import baselineLocationOn from '@iconify/icons-ic/baseline-location-on';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// hooks
import useQuery from '../../hooks/useQuery';
import useLocales from '../../hooks/useLocales';
// components
import Page from '../../components/Page';
import { AccountGeneral, AccountAddressBook, AccountChangePassword } from '../../components/account';
import OrderHistoryPage from './OrderHistoryPage';

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(10),
  backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 100 : 800]
}));

// ----------------------------------------------------------------------

export default function AccountPage() {
  const { t } = useLocales();

  const navigate = useNavigate();
  const query = useQuery();
  const tabSlug = query.get('tab');

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const [currentTab, setCurrentTab] = useState(tabSlug || 'info');

  useEffect(() => {
    if (tabSlug) {
      setCurrentTab(tabSlug);
    }
  }, [tabSlug]);

  const tabOpts = [
    {
      label: t('account.info'),
      value: 'info',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <AccountGeneral />
    },
    {
      label: t('account.order'),
      value: 'orders',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <OrderHistoryPage />
    },
    {
      label: t('account.address-book'),
      value: 'address-book',
      icon: <Icon icon={baselineLocationOn} width={20} height={20} />,
      component: <AccountAddressBook />
    },
    {
      label: t('account.change-password'),
      value: 'change-password',
      icon: <Icon icon={roundVpnKey} width={20} height={20} />,
      component: <AccountChangePassword />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(`?tab=${newValue}`);
  };

  return (
    <Page title={t('home.page-title')} id="move_top">
      <ContentStyle>
        <Container maxWidth="lg">
          <Stack spacing={5} direction={isMobile ? 'column' : 'row'}>
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              orientation={isMobile ? 'horizontal' : 'vertical'}
              allowScrollButtonsMobile
              onChange={handleChangeTab}
            >
              {tabOpts.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  label={
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: isMobile ? 'center' : 'start',
                        alignContent: 'center',
                        width: '100%'
                      }}
                    >
                      {tab.icon}
                      <Typography variant="body2" sx={{ ml: 2 }}>
                        {tab.label}
                      </Typography>
                    </Box>
                  }
                  // icon={tab.icon}
                  value={tab.value}
                  sx={{ justifyContent: 'flex-start' }}
                />
              ))}
            </Tabs>

            {tabOpts.map((tab) => {
              const isMatched = tab.value === currentTab;
              return (
                isMatched && (
                  <Box sx={{ flex: 1 }} key={tab.value}>
                    {tab.component}
                  </Box>
                )
              );
            })}
          </Stack>
        </Container>
      </ContentStyle>
    </Page>
  );
}
