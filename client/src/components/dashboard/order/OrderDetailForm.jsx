import PropTypes from 'prop-types';
// material
import {
  Autocomplete,
  IconButton,
  Box,
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useSnackbar } from 'notistack';

// hooks
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useLocales from '../../../hooks/useLocales';
// components
import { MotionInView, varFadeInUp } from '../../animate';
import OrderCard from './OrderCard';
import DialogConfirm from '../../dialog/DialogConfirm';
import { InvoiceToolbar } from '../../invoice';

import * as Api from '../../../api';
// ----------------------------------------------------------------------

OrderDetailForm.propTypes = {
  order: PropTypes.any,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  handleUpdate: PropTypes.func,
  actionReOrder: PropTypes.func,
  actionCancelOrder: PropTypes.func
};

// ----------------------------------------------------------------------

export default function OrderDetailForm({ order, open, setOpen, handleUpdate, actionReOrder, actionCancelOrder }) {
  const { t } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { error, orderCancel } = useSelector((state) => state.order);
  const [orderStatus, setOrderStatus] = useState('');
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [hasChange, setHasChange] = useState(false);
  const [openDialogConfirm, setOpenDialogConfirm] = useState(false);
  const [textConfirmCancel, setTextConfirmCancel] = useState('');
  useEffect(() => {
    const text = t('account.order-cancel', { nameInfo: order?.numericId });
    setTextConfirmCancel(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.numericId]);

  const orderStatusPending = [
    {
      label: t('order.status-pending'),
      value: 'pending'
    },
    {
      label: t('order.status-confirmed'),
      value: 'confirmed'
    },
    {
      label: t('order.status-cancelled'),
      value: 'cancelled'
    }
  ];
  const orderStatusConfirmed = [
    {
      label: t('order.status-confirmed'),
      value: 'confirmed'
    },
    {
      label: t('order.status-shipping'),
      value: 'shipping'
    }
  ];
  const orderStatusShipping = [
    {
      label: t('order.status-shipping'),
      value: 'shipping'
    },
    {
      label: t('order.status-completed'),
      value: 'completed'
    }
  ];
  const orderStatusLists = [
    {
      label: t('order.status-pending'),
      value: 'pending'
    },
    {
      label: t('order.status-confirmed'),
      value: 'confirmed'
    },
    {
      label: t('order.status-shipping'),
      value: 'shipping'
    },
    {
      label: t('order.status-completed'),
      value: 'completed'
    },
    {
      label: t('order.status-cancelled'),
      value: 'cancelled'
    }
  ];

  const paymentStatusList = [
    {
      label: t('order.payment-status-pending'),
      value: 'pending'
    },
    {
      label: t('order.payment-status-paid'),
      value: 'paid'
    }
  ];

  const paymentMethodList = [
    {
      label: t('order.payment-method-cash'),
      value: 'cash'
    },
    {
      label: t('order.payment-method-cod'),
      value: 'cod'
    },
    {
      label: t('order.payment-method-vnpay'),
      value: 'vnpay'
    },
    {
      label: t('order.payment-method-momo'),
      value: 'momo'
    }
  ];

  useEffect(() => {
    setOrderStatus(order?.status);
    setPaymentStatus(order?.paymentStatus);
    setPaymentMethod(order?.paymentMethod);
    if (order?.status === 'pending') {
      setOrderStatusList(orderStatusPending);
    } else if (order?.status === 'confirmed') {
      setOrderStatusList(orderStatusConfirmed);
    } else if (order?.status === 'shipping') {
      setOrderStatusList(orderStatusShipping);
    }
    setHasChange(false);
  }, [open]);

  const handleChangeOrderStatus = (event, value) => {
    setOrderStatus(value.value);
    if (value.value !== order.status) {
      setHasChange(true);
    }
  };

  const handleChangePaymentStatus = (event, value) => {
    setPaymentStatus(value.value);
    if (value.value !== order.paymentStatus) {
      setHasChange(true);
    }
  };

  const handleChangePaymentMethod = (event, value) => {
    setPaymentMethod(value.value);
    if (value.value !== order.paymentMethod) {
      setHasChange(true);
    }
  };

  const handleClose = (_event, reason) => {
    if (reason && (reason === 'backdropClick' || reason === 'escapeKeyDown')) {
      return;
    }
    setOpen(false);
  };

  const handleSave = () => {
    handleUpdate(order._id, { status: orderStatus, paymentStatus, paymentMethod });
    setOpen(false);
  };

  const handleReOrder = () => {
    actionReOrder(order._id);
    setOpen(false);
  };

  const handleCancelOrder = () => {
    actionCancelOrder(order._id);
    setOpen(false);
  };
  const handleCancel = () => {
    setOpenDialogConfirm(true);
  };
  useEffect(() => {
    if (error) {
      const mgs = error?.response?.data?.message || 'Có lỗi xảy ra !';
      enqueueSnackbar(mgs, { variant: 'error' });
    }
    if (!error && orderCancel) {
      enqueueSnackbar(t('account.order-cancelled'), { variant: 'success' });
    }
  }, [error, orderCancel]);
  const handleCancelSuccess = () => {
    handleCancelOrder();
    setOpenDialogConfirm(false);
  };
  const handleRePay = async () => {
    try {
      const { data } = await Api.rePayOrder(order._id);
      console.log('data: ', data);
      if (data.data) {
        window.location.href = data.data;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const renderDialogActions = () => {
    if (!handleUpdate) {
      return (
        <Box display="flex" alignItems="center" justifyContent="flex-end" sx={{ height: '100%' }}>
          <Button
            sx={{ mr: 1 }}
            size="large"
            color="inherit"
            variant="outlined"
            onClick={handleCancel}
            disabled={!['pending'].includes(order?.status)}
          >
            Hủy đơn hàng
          </Button>
          <Button
            size="large"
            variant="outlined"
            onClick={handleReOrder}
            // disabled={!['cancelled', 'completed'].includes(order?.status)}
          >
            Tiếp tục mua hàng
          </Button>
        </Box>
      );
    }

    return (
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Autocomplete
            fullWidth
            disableClearable
            options={orderStatusList}
            getOptionLabel={(item) => item?.label}
            value={orderStatusLists.find((item) => item.value === orderStatus)}
            renderInput={(params) => <TextField {...params} label={t('order.order-status')} />}
            onChange={handleChangeOrderStatus}
            disabled={['completed', 'cancelled'].includes(order?.status)}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Autocomplete
            fullWidth
            disableClearable
            options={paymentStatusList}
            getOptionLabel={(item) => item?.label}
            value={paymentStatusList.find((item) => item.value === paymentStatus)}
            renderInput={(params) => <TextField {...params} label={t('order.payment-status')} />}
            onChange={handleChangePaymentStatus}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Autocomplete
            fullWidth
            disableClearable
            options={paymentMethodList}
            getOptionLabel={(item) => item?.label}
            value={paymentMethodList.find((item) => item.value === paymentMethod)}
            renderInput={(params) => <TextField {...params} label={t('order.payment-method')} />}
            onChange={handleChangePaymentMethod}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box display="flex" alignItems="center" sx={{ height: '100%' }}>
            <Button sx={{ mr: 1 }} fullWidth size="large" color="inherit" variant="outlined" onClick={handleClose}>
              {t('common.back')}
            </Button>
            <Button fullWidth size="large" variant="outlined" disabled={!hasChange} onClick={handleSave}>
              {t('common.save')}
            </Button>
          </Box>
        </Grid>
      </Grid>
    );
  };

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={handleClose}>
      <DialogTitle sx={{ pb: '10px' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" marginBottom={2} sx={{ textTransform: 'uppercase', mb: 0 }}>
            {t('account.order')} #{order?.numericId}
          </Typography>
          <IconButton color="inherit" edge="start" onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        {/* {handleUpdate && (
          <Box display="flex" alignItems="center" justifyContent="flex-start">
            <Typography variant="h4" marginBottom={2} sx={{ textTransform: 'uppercase', mb: 0 }}>
              {t('account.orderHandle')} {order?.user?.firstName} {order?.user?.lastName}
            </Typography>
          </Box>
        )} */}
        {handleUpdate && (
          <Box display="flex" alignItems="center" justifyContent="flex-end">
            <InvoiceToolbar invoice={order} />
          </Box>
        )}
      </DialogTitle>
      <DialogContent>
        <MotionInView variants={varFadeInUp}>
          <OrderCard order={order} isShowTitle={false} handleRePay={handleRePay} />
        </MotionInView>
      </DialogContent>
      <DialogActions>
        <Box sx={{ width: '100%' }}>{renderDialogActions()}</Box>
      </DialogActions>
      <DialogConfirm
        open={openDialogConfirm}
        setOpen={setOpenDialogConfirm}
        textContent={textConfirmCancel}
        handleSubmit={handleCancelSuccess}
      />
    </Dialog>
  );
}
