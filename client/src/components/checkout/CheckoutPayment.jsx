// icons
import { Icon } from '@iconify/react';
import arrowIosBackFill from '@iconify/icons-eva/arrow-ios-back-fill';
// form validation
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { Grid, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import { useLayoutEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useSelector, useDispatch } from 'react-redux';
import { useLocales } from '../../hooks';
// components
import CheckoutSummary from './CheckoutSummary';
import CheckoutBillingInfo from './CheckoutBillingInfo';
import CheckoutPaymentMethods from './CheckoutPaymentMethods';

import { createOrder, backStepOrder } from '../../redux/slices/orderSlice';

import * as typeUtils from '../../utils/typeUtils';

// ----------------------------------------------------------------------

export default function CheckoutPayment() {
  const { t } = useLocales();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { orderInfo, isLoading: isCreatingOrder, orderCreated, error } = useSelector((state) => state.order);

  useLayoutEffect(() => {
    if (error) {
      enqueueSnackbar(error?.response?.data?.message || 'Có lỗi', { variant: 'error' });
      return;
    }

    if (orderCreated) {
      if (typeUtils.isNotEmptyStr(orderCreated._id)) {
        let redirect = `/order/${orderCreated._id}`;
        if (orderCreated.paymentUrl) {
          redirect = orderCreated.paymentUrl;
        }
        window.open(redirect, '_self');
        localStorage.removeItem('orderLocalStorage');
        enqueueSnackbar('Đặt hàng thành công!', { variant: 'success' });
      } else {
        enqueueSnackbar('Hệ thống bận, vui lòng thử lại !', { variant: 'error' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCreated, error]);

  const paymentOpts = [
    {
      value: 'vnpay',
      title: t('cart.payment-method-vnpay'),
      description: t('cart.payment-method-vnpay-desc'),
      icons: ['/static/icons/ic_vnpay.svg']
    },
    {
      value: 'momo',
      title: t('cart.payment-method-momo'),
      description: t('cart.payment-method-momo-desc'),
      icons: ['/static/icons/ic_momo.svg']
    },
    {
      value: 'paypal',
      title: t('cart.payment-method-paypal'),
      description: t('cart.payment-method-paypal-desc'),
      icons: ['/static/icons/ic_paypal.svg'],
      isDevelop: true
    }
  ];

  if (orderInfo.isReceiveAtStore) {
    paymentOpts.splice(0, 0, {
      value: 'cash',
      title: t('cart.payment-method-cash'),
      description: t('cart.payment-method-cash-desc'),
      icons: []
    });
  } else {
    paymentOpts.splice(0, 0, {
      value: 'cod',
      title: t('cart.payment-method-cod'),
      description: t('cart.payment-method-cod-desc'),
      icons: []
    });
  }

  const handleBackStep = () => {
    dispatch(backStepOrder());
  };

  const handlePayment = async (values) => {
    dispatch(createOrder(values));
  };

  const PaymentSchema = Yup.object().shape({
    paymentMethod: Yup.mixed().required(t('cart.payment-method-required'))
  });

  const formik = useFormik({
    initialValues: {
      paymentMethod: 'cash' || 'cod'
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        await handlePayment(values);
      } catch (error) {
        setSubmitting(false);
        setErrors(error.response.data.message);
      }
    }
  });

  const { handleSubmit } = formik;

  return (
    <FormikProvider value={formik}>
      <Form
        autoComplete="off"
        noValidate
        onSubmit={handleSubmit}
        onKeyPress={(e) => {
          if (e.which === 13) {
            e.preventDefault();
          }
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <CheckoutPaymentMethods formik={formik} paymentOptions={paymentOpts} />
          </Grid>

          <Grid item xs={12} md={4}>
            <CheckoutBillingInfo orderInfo={orderInfo} onBackStep={handleBackStep} />
            <CheckoutSummary showDetail />
            {orderInfo.paymentMethod === 'cod' || orderInfo.paymentMethod === 'cash' ? (
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isCreatingOrder}>
                {t('cart.order.action')}
              </LoadingButton>
            ) : (
              <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isCreatingOrder}>
                {t('cart.order.pay')}
              </LoadingButton>
            )}
            <Button
              type="button"
              size="small"
              fullWidth
              color="inherit"
              onClick={handleBackStep}
              startIcon={<Icon icon={arrowIosBackFill} />}
              sx={{ mt: 3 }}
            >
              {t('common.back')}
            </Button>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
