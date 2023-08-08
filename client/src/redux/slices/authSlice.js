import { createSlice } from '@reduxjs/toolkit';
import * as api from '../../api';
import { regexCons } from '../../constants';

const otpInitialState = {
  isLoading: false,
  isVerifying: false,
  isSent: false,
  isVerified: false,
  isChangingPass: false,
  isChangeSuccess: false,
  error: null,
  emailOrPhone: '',
  token: '',
  confirmResult: null
};

const initialState = {
  otp: otpInitialState
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    startLoadingOtp(state) {
      state.otp.isLoading = true;
      state.otp.isChangeSuccess = false;
      state.otp.error = null;
    },
    startVerifyingOtp(state) {
      state.otp.isVerifying = true;
      state.otp.isChangeSuccess = false;
      state.otp.error = null;
    },
    startChangingPass(state) {
      state.otp.isChangingPass = true;
      state.otp.isChangeSuccess = false;
      state.otp.error = null;
    },
    hasErrorOtp(state, action) {
      state.otp.error = action.payload.error;
      state.otp.isLoading = false;
      state.otp.isVerifying = false;
      state.otp.isVerified = action.payload?.isVerified || false;
      state.otp.isChangeSuccess = false;
    },
    sentEmailOtpSuccess(state, action) {
      state.otp.isSent = true;
      state.otp.error = null;
      state.otp.isLoading = false;
      state.otp.emailOrPhone = action.payload.emailOrPhone;
    },
    sentPhoneOtpSuccess(state, action) {
      state.otp.isSent = true;
      state.otp.error = null;
      state.otp.isLoading = false;
      state.otp.emailOrPhone = action.payload.emailOrPhone;
      state.otp.confirmResult = action.payload.confirmResult;
    },
    checkOtpSuccess(state, action) {
      state.otp.emailOrPhone = action.payload.emailOrPhone;
      state.otp.token = action.payload.token;
      state.otp.isVerifying = false;
      state.otp.isVerified = true;
    },
    changePassViaOtpSuccess(state) {
      state.otp = {
        isLoading: false,
        isVerifying: false,
        isSent: false,
        isVerified: false,
        isChangingPass: false,
        isChangeSuccess: true,
        error: null,
        emailOrPhone: '',
        token: '',
        confirmResult: null
      };
    },
    clearOtpState(state) {
      state.otp = otpInitialState;
    }
  }
});

const { actions, reducer } = authSlice;

export default reducer;

export const clearOtpState = () => (dispatch) => dispatch(actions.clearOtpState());

export const sentOtpViaEmail = (email) => async (dispatch) => {
  try {
    dispatch(actions.startLoadingOtp());
    await api.sendEmailOtp(email);
    dispatch(actions.sentEmailOtpSuccess({ emailOrPhone: email }));
  } catch (e) {
    const error = e?.response?.data || e;
    dispatch(actions.hasErrorOtp({ error, emailOrPhone: email }));
  }
};

export const resendOtp = () => async (dispatch, getState) => {
  const { emailOrPhone } = getState().auth.otp;
  if (regexCons.email.test(emailOrPhone)) {
    dispatch(sentOtpViaEmail(emailOrPhone));
  }
};

export const checkOtpEmail = (email, otp) => async (dispatch) => {
  try {
    dispatch(actions.startVerifyingOtp());
    const { data } = await api.checkEmailOtp(email, otp);
    if (data) {
      await api.verifyEmail(email);
    }
    dispatch(actions.checkOtpSuccess({ emailOrPhone: email, token: data.data.token }));
  } catch (e) {
    dispatch(actions.hasErrorOtp({ error: e?.response?.data || e, emailOrPhone: email }));
  }
};

export const resetPassword = (newPassword) => async (dispatch, getState) => {
  const { emailOrPhone, token } = getState().auth.otp;
  try {
    dispatch(actions.startChangingPass());
    await api.resetPassword(emailOrPhone, token, newPassword);
    dispatch(actions.changePassViaOtpSuccess());
  } catch (e) {
    dispatch(actions.hasErrorOtp({ error: e?.response?.data || e, isVerified: true }));
  }
};

export const verifyEmail = (email) => async (dispatch) => {
  try {
    dispatch(actions.isVerifying());
    await api.verifyEmail(email);
    dispatch(actions.isVerified());
  } catch (e) {
    dispatch(actions.hasErrorOtp({ error: e?.response?.data || e, isVerified: false }));
  }
};
