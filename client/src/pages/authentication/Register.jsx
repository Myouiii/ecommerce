// material
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { Alert, Button, Box, Card, Link, Container, Stack, Typography } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// hooks
import { useDispatch, useSelector } from 'react-redux';
import {
  checkOtpEmail,
  clearOtpState,
  resendOtp as resendOtpAction,
  sentOtpViaEmail
} from '../../redux/slices/authSlice';
import { regexCons } from '../../constants';
import { useLocales } from '../../hooks';
// routes
import { PATH_AUTH } from '../../routes/paths';
// layouts
import AuthLayout from '../../layouts/AuthLayout';
// components
import Page from '../../components/Page';
import { MHidden } from '../../components/@material-extend';
import AuthWithSocial from '../../components/authentication/AuthWithSocial';
import { CustomPhoneInput } from '../../components/@input';
import { RegisterForm } from '../../components/authentication/register';
import { OtpInputForm } from '../../components/authentication/verify-code';

// assets
import { CheckIcon } from '../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  const { t, currentLang } = useLocales();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [country, setCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMgs, setErrorMgs] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {
    emailOrPhone: account,
    isLoading: isHandlingOtp,
    isVerifying,
    isSent,
    token,
    isVerified,
    isChangeSuccess,
    error: otpError
  } = useSelector((state) => state.auth.otp);

  useEffect(() => {
    if (!otpError) {
      setErrorMgs(null);
    } else {
      console.log('otpError: ', otpError);
      setErrorMgs(otpError?.message?.[currentLang.value] || 'Lỗi');
    }
  }, [currentLang.value, otpError]);

  const handleSendOtp = (emailOrPhone) => {
    if (regexCons.email.test(emailOrPhone)) {
      dispatch(sentOtpViaEmail(emailOrPhone));
    }
  };
  const handleResentOtp = () => {
    dispatch(resendOtpAction());
  };

  const handleVerifyOtp = (otpCode) => {
    if (regexCons.email.test(account)) {
      dispatch(checkOtpEmail(account, otpCode));
      if (token) {
        console.log('token: ', token);
      }
    }
  };

  const handleGotoLogin = (_event) => {
    dispatch(clearOtpState());
    navigate(PATH_AUTH.login);
  };

  const renderBody = () => {
    if (!isSent) {
      return (
        <>
          <RegisterForm onSendOtp={handleSendOtp} />
        </>
      );
    }
    if (!isVerified) {
      return (
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom>
            {t('auth.send-otp-success')}
          </Typography>
          <Typography>{t('auth.send-otp-desc')}</Typography>

          <OtpInputForm onResentOtp={handleResentOtp} onVerifyOtp={handleVerifyOtp} isLoading={isVerifying} />
        </Box>
      );
    }
    return (
      <Box sx={{ textAlign: 'center' }}>
        <CheckIcon sx={{ mb: 5, mx: 'auto', height: 160 }} />

        <Typography variant="h3" gutterBottom sx={{ mb: 3 }}>
          {t('auth.account-verify')}
        </Typography>

        <Button fullWidth size="large" onClick={handleGotoLogin} variant="contained">
          {t('auth.login').toUpperCase()}
        </Button>
      </Box>
    );
  };
  return (
    <RootStyle title={t('auth.page-title.register')}>
      <AuthLayout>
        {t('auth.already-have-account')} &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to={PATH_AUTH.login}>
          {t('auth.login')}
        </Link>
      </AuthLayout>

      <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            {t('auth.register-salutation')}
          </Typography>
          <img alt="register" src="/static/illustrations/illustration_register.png" />
        </SectionStyle>
      </MHidden>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              {t('auth.register-title')}
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>{t('auth.register-subtitle')}</Typography>
          </Box>
          <Box sx={{ mb: 5 }}>
            <AuthWithSocial isLogin={false} />
          </Box>
          {renderBody()}
          {errorMgs && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {errorMgs}
            </Alert>
          )}
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            {t('auth.accept-terms')}&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              {t('auth.tos')}
            </Link>
            &nbsp;{t('common.and')}&nbsp;
            <Link underline="always" sx={{ color: 'text.primary' }}>
              {t('auth.privacy-policy')}
            </Link>
            .
          </Typography>

          <MHidden width="smUp">
            <Typography variant="subtitle2" sx={{ mt: 3, textAlign: 'center' }}>
              {t('auth.already-have-account')}&nbsp;
              <Link to={PATH_AUTH.login} component={RouterLink}>
                {t('auth.login')}
              </Link>
            </Typography>
          </MHidden>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
