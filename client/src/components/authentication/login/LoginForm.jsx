import { Link as RouterLink } from 'react-router-dom';
// form validation
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// icons
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import { Link, Stack, Alert, TextField, IconButton, InputAdornment } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
// import useIsMountedRef from '../../../hooks/useIsMountedRef';
// routes
import { PATH_AUTH } from '../../../routes/paths';
//
import { MIconButton } from '../../@material-extend';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login, errMessage, isAuthenticated, reInitialize } = useAuth();
  const { t, currentLang } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);
  const [messageDisplay, setMessageDisplay] = useState('');
  const [errorVerify, setErrorVerify] = useState('');
  const LoginSchema = Yup.object().shape({
    account: Yup.string().required(t('auth.account-invalid')),
    password: Yup.string().required(t('auth.password-invalid'))
  });
  useEffect(() => {
    if (errMessage) {
      if (errMessage?.[currentLang.value] === t('auth.not-active')) {
        setErrorVerify(errMessage?.[currentLang.value] || errorVerify);
      } else {
        setMessageDisplay(errMessage?.[currentLang.value] || errMessage);
      }
    } else {
      setErrorVerify('');
      setMessageDisplay('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errMessage]);
  useEffect(() => {
    reInitialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const formik = useFormik({
    initialValues: { account: '', password: '' },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values.account, values.password);

        if (!isAuthenticated && !response?.success) {
          setSubmitting(false);
        } else if (isAuthenticated && response?.success) {
          enqueueSnackbar('Login success', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          setSubmitting(true);
        }
      } catch (error) {
        setMessageDisplay(error?.message);
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          {/* {errors.afterSubmit && <Alert severity="error">{errors.afterSubmit}</Alert>} */}
          {messageDisplay && <Alert severity="error">{messageDisplay}</Alert>}
          {errorVerify && (
            <Alert severity="error">
              {`${errorVerify}. Vui lòng xác thực tại `}
              <Link component={RouterLink} variant="error" to={PATH_AUTH.verify}>
                đây.
              </Link>
            </Alert>
          )}
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label={t('auth.account')}
            {...getFieldProps('account')}
            error={Boolean(touched.account && errors.account)}
            helperText={touched.account && errors.account}
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
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          {/* always auto remember */}
          {/* <FormControlLabel
            control={<Checkbox {...getFieldProps('remember')} checked={values.remember} />}
            label={t('auth.remember-me')}
          /> */}

          <Link component={RouterLink} variant="subtitle2" to={PATH_AUTH.resetPassword}>
            {t('auth.forgot-password')}
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSubmitting}>
          {t('auth.login')}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
