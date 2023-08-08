// form validation
import * as Yup from 'yup';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { Box, Button, TextField, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { Link as RouterLink } from 'react-router-dom';
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import { useLocales } from '../../../hooks';

import { regexCons } from '../../../constants';

// ----------------------------------------------------------------------

export default function VerifyCodeForm({ onSendOtp, isSending }) {
  const { t } = useLocales();

  const VerifySchema = Yup.object().shape({
    email: Yup.string()
      .required(t('auth.email-required'))
      .test('test-name', (value, { createError }) => {
        // email
        if (regexCons.email.test(value)) {
          return true;
        }
        return createError({ message: t('auth.email-invalid') });
      })
  });

  const formik = useFormik({
    initialValues: {
      email: ''
    },
    validationSchema: VerifySchema,
    onSubmit: async (values) => {
      const { email } = values;
      onSendOtp(email);
    }
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            {...getFieldProps('email')}
            type="text"
            label={t('auth.email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <Box display="flex" justifyContent="center">
            <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
              {t('common.back').toUpperCase()}
            </Button>
            <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={isSending}>
              {t('auth.send-otp').toUpperCase()}
            </LoadingButton>
          </Box>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
