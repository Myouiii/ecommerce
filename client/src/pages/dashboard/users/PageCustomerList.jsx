// icons
import Icon from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
/* eslint-disable prettier/prettier */
import {
  Box,
  Card,
  Button,
  Container,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import { experimentalStyled as styled, useTheme } from '@material-ui/core/styles';
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Page from '../../../components/Page';
import { PATH_DASHBOARD } from '../../../routes/paths';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import useLocales from '../../../hooks/useLocales';
import LoadingScreen from '../../../components/LoadingScreen';
import Label from '../../../components/Label';
import Scrollbar from '../../../components/Scrollbar';
import * as Helper from '../../../helper/listHelper';
import { ImageBrokenIcon } from '../../../assets';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../../components/dashboard/users';
import DetailUser from './PageUserEdit';
import { getAllCustomers, toggleHideUser } from '../../../redux/slices/userSlice';
// ----------------------------------------------------------------------
const ThumbImgStyle = styled('img')(({ theme }) => ({
  width: 64,
  height: 64,
  objectFit: 'cover',
  margin: theme.spacing(0, 2),
  borderRadius: theme.shape.borderRadiusSm
}));

export default function PageCustomerList() {
  const theme = useTheme();
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { list: usersList, isLoading, error } = useSelector((state) => state.user);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('createdAt');
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getAllCustomers());
  }, [dispatch, error]);
  const tableHeads = [
    {
      id: 'fullName',
      numeric: false,
      disablePadding: true,
      label: t('dashboard.users.full-name')
    },
    {
      id: 'gender',
      numeric: false,
      disablePadding: true,
      label: t('dashboard.users.gender')
    },
    {
      id: 'email',
      numeric: false,
      disablePadding: false,
      label: t('dashboard.users.email')
    },
    {
      id: 'phone',
      numeric: true,
      disablePadding: false,
      label: t('dashboard.users.phone')
    },
    {
      id: 'isHide',
      numeric: true,
      disablePadding: false,
      label: t('dashboard.users.status')
    },
    {
      id: 'action',
      numeric: false,
      disablePadding: false
    }
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const handleLockAccount = async (id) => {
    try {
      const result = await dispatch(toggleHideUser(id));
      if (result) {
        enqueueSnackbar(t('dashboard.discounts.updated-success'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('dashboard.discounts.error'), { variant: 'error' });
      }
    } catch (e) {
      enqueueSnackbar(t('dashboard.discounts.error'), { variant: 'error' });
    }
  };

  // Avoid a layout jump when reaching the last page with empty brandsList.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersList.length) : 0;

  if (isLoading) {
    return <LoadingScreen />;
  }
  return (
    <Page title={t('dashboard.users.page-title')}>
      <Container>
        <HeaderBreadcrumbs
          heading={t('dashboard.users.heading')}
          links={[
            { name: t('dashboard.title'), href: PATH_DASHBOARD.root },
            {
              name: t('dashboard.ecommerce'),
              href: PATH_DASHBOARD.root
            },
            { name: t('dashboard.users.customer-list') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.app.users.add}
              startIcon={<Icon icon={plusFill} />}
            >
              {t('dashboard.users.add-user')}
            </Button>
          }
        />
        <Card>
          <UserListToolbar />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table size={dense ? 'small' : 'medium'}>
                <UserListHead
                  headLabel={tableHeads}
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />

                <TableBody>
                  {Helper.stableSort(usersList, Helper.getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const { _id, fullName, gender, avatar, email, phone, status } = row;
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow hover tabIndex={-1} key={_id} sx={{ cursor: 'pointer' }}>
                          {
                            dense ? (
                              <TableCell component="th" id={labelId} scope="row" padding="none">
                                {fullName}
                              </TableCell>
                            ) : (
                              <TableCell component="th" scope="row" padding="nocne">
                                <Box sx={{ py: 2, display: 'flex', alignItems: 'center' }}>
                                  {avatar ? (<ThumbImgStyle alt={fullName} src={avatar} />)
                                    : (<ImageBrokenIcon width={64} height={64} marginRight={2} />)}
                                  <Typography variant="subtitle1" noWrap>
                                    {fullName}
                                  </Typography>
                                </Box>
                              </TableCell>
                            )}
                          <TableCell align='left' style={{ minWidth: 160 }}>
                            {gender}
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 160 }}>
                            {email}
                          </TableCell>
                          <TableCell align="left" style={{ minWidth: 160 }}>
                            {phone}
                          </TableCell>
                          <TableCell align="left">
                            <Label
                              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                              color={status === 'locked' || status === 'inactive' ? 'error' : 'success'}
                            >
                              {t(`dashboard.users.${status === 'locked' || status === 'inactive' ? 'hidden' : 'visible'}`)}
                            </Label>
                          </TableCell>
                          <TableCell align="right" onClick={(event) => event.stopPropagation()}>
                            <UserMoreMenu
                              userId={_id}
                              status={status}
                              onLockAccount={() => handleLockAccount(_id)}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}

                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50, 100]}
              labelRowsPerPage={t('common.rows-per-page')}
              component="div"
              count={usersList.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Box
              sx={{
                px: 3,
                py: 1.5,
                top: 0,
                position: { md: 'absolute' }
              }}
            >
              <FormControlLabel
                control={<Switch checked={dense} onChange={handleChangeDense} />}
                label={t('common.small-padding')}
              />
            </Box>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}
