import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Stack, TextField, IconButton, InputAdornment, Alert } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
import useLocales from '../../../hooks/useLocales';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

export default function RegisterForm({ onSendOtp }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { register, errMessage, user, reInitialize } = useAuth();
  const isMountedRef = useIsMountedRef();
  const { t, currentLang } = useLocales();
  const [messageDisplay, setMessageDisplay] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, t('auth.first-name-min'))
      .max(32, t('auth.first-name-max'))
      .required(t('auth.first-name-required')),
    lastName: Yup.string()
      .min(2, t('auth.last-name-min'))
      .max(32, t('auth.last-name-max'))
      .required(t('auth.last-name-required')),
    email: Yup.string().email(t('auth.email-invalid')).required(t('auth.email-required')),
    password: Yup.string()
      .min(6, t('auth.password-min'))
      .max(32, t('auth.password-max'))
      .required(t('auth.password-required'))
  });
  useEffect(() => {
    if (errMessage) {
      setMessageDisplay(errMessage?.[currentLang.value] || errMessage);
    } else {
      setMessageDisplay('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errMessage]);
  useEffect(() => {
    reInitialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setErrors, setSubmitting }) => {
      try {
        const response = await register(values);
        if (!response?.success) {
          setSubmitting(false);
        } else if (response?.success) {
          const { email } = values;
          onSendOtp(email);
          enqueueSnackbar('Register success', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        }
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      } catch (error) {
        if (isMountedRef.current) {
          setErrors({ afterSubmit: error.response.data.message });
          setSubmitting(false);
        }
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  const renderNameInput = () => {
    if (currentLang.value === 'vi') {
      return (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            fullWidth
            label={t('auth.last-name')}
            {...getFieldProps('lastName')}
            error={Boolean(touched.lastName && errors.lastName)}
            helperText={touched.lastName && errors.lastName}
          />
          <TextField
            fullWidth
            label={t('auth.first-name')}
            {...getFieldProps('firstName')}
            error={Boolean(touched.firstName && errors.firstName)}
            helperText={touched.firstName && errors.firstName}
          />
        </Stack>
      );
    }
    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <TextField
          fullWidth
          label={t('auth.first-name')}
          {...getFieldProps('firstName')}
          error={Boolean(touched.firstName && errors.firstName)}
          helperText={touched.firstName && errors.firstName}
        />

        <TextField
          fullWidth
          label={t('auth.last-name')}
          {...getFieldProps('lastName')}
          error={Boolean(touched.lastName && errors.lastName)}
          helperText={touched.lastName && errors.lastName}
        />
      </Stack>
    );
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>} */}
          {messageDisplay && <Alert severity="error">{messageDisplay}</Alert>}
          {renderNameInput()}

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label={t('auth.email')}
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label={t('auth.password')}
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
            {t('auth.register')}
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
