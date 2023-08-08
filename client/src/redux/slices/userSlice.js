import { createSlice } from '@reduxjs/toolkit';
import * as api from '../../api';
import { USER } from '../../constants';

const initialState = {
  isLoading: false,
  hasError: false,
  error: null,
  list: [],
  user: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    stopLoading(state) {
      state.isLoading = false;
    },
    hasError(state, action) {
      state.error = action.payload;
      state.hasError = true;
      state.isLoading = false;
    },
    getAllUsers(state, action) {
      state.list = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    getUser(state, action) {
      state.user = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    createUser(state, action) {
      return {
        ...state,
        list: [action.payload, ...state.list],
        hasError: false,
        isLoading: false
      };
    },
    updateUserInfo(state, action) {
      return {
        ...state,
        list: state.list.map((cat) => (cat._id === action.payload._id ? action.payload : cat)),
        hasError: false,
        isLoading: false
      };
    },
    toggleHideSuccess(state, action) {
      state.isLoading = false;
      state.list = state.list.map((p) => (p._id === action.payload._id ? { ...p, status: action.payload.status } : p));
    },
    clearData(state, action) {
      state.user = null;
      state.list = [];
      state.isLoading = false;
      state.hasError = false;
    }
  }
});

const { actions, reducer } = userSlice;

export default reducer;

export const getAllCustomers = () => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    const { data } = await api.getAllCustomers();
    dispatch(actions.getAllUsers(data.data));
  } catch (e) {
    console.error('Error when get posts in actions/users/getAllUsers', e);
    dispatch(actions.hasError(e?.response?.data || e));
  }
};
export const getAllStaffs = () => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    const { data } = await api.getAllStaffs();
    dispatch(actions.getAllUsers(data.data));
  } catch (e) {
    console.error('Error when get posts in actions/users/getAllUsers', e);
    dispatch(actions.hasError(e?.response?.data || e));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    const { data } = await api.getOneUser(id);
    dispatch(actions.getUser(data.data));
  } catch (e) {
    console.error('Error when get posts in actions/users/getUser', e);
    dispatch(actions.hasError(e?.response?.data || e));
  }
};
export const createUser = (formData, newUser) => async (dispatch) => {
  try {
    let data = null;
    dispatch(actions.startLoading());
    if (newUser.role === USER.ROLE[2]) {
      data = await api.createUser(formData);
    } else {
      data = await api.createStaff(formData);
    }
    dispatch(actions.createUser(data.data.data));
  } catch (e) {
    console.error('Error when get posts in actions/users/createUser', e);
    dispatch(actions.hasError(e?.response?.data || e));
  }
};
export const updateUser = (id, updateUser) => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    const { data } = await api.updateUser(id, updateUser);
    dispatch(actions.updateUserInfo(data.data));
  } catch (e) {
    console.error('Error when get posts in actions/users/updateUser', e);
    dispatch(actions.hasError(e?.response?.data || e));
  }
};

export const toggleHideUser = (id) => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    const { data } = await api.toggleHideUser(id);
    dispatch(actions.toggleHideSuccess(data.data));
    return data;
  } catch (e) {
    dispatch(actions.hasError(e?.response?.data || e));
  }
};
export const clearData = () => async (dispatch) => {
  try {
    dispatch(actions.startLoading());
    dispatch(actions.clearData());
  } catch (e) {
    dispatch(actions.hasError(e?.response?.data || e));
  }
};
