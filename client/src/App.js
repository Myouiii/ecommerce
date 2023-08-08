import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// routes

import Router from './routes';
// theme
import ThemeConfig from './theme';
// hooks
import { useAuth, useInterval } from './hooks';
// components
import RtlLayout from './components/RtlLayout';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import ThemePrimaryColor from './components/ThemePrimaryColor';
import NotistackProvider from './components/NotistackProvider';

import { syncCart } from './redux/slices/cartSlice';
import { sendTrackingData } from './redux/slices/userBehaviorSlice';
import './App.css';
// eslint-disable-next-line prettier/prettier
const isDevMode = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development');

// ----------------------------------------------------------------------

export default function App() {
  const dispatch = useDispatch();
  const { isInitialized, isAuthenticated } = useAuth();

  useInterval(
    () => {
      dispatch(sendTrackingData());
    },
    isDevMode ? 10000 : 50000
  );

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      dispatch(syncCart(isAuthenticated));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, isAuthenticated]);

  return (
    <>
      <div id="back-to-top-anchor" />
      <ThemeConfig>
        <ThemePrimaryColor>
          <RtlLayout>
            <NotistackProvider>
              <ScrollToTop />
              {isInitialized ? <Router /> : <LoadingScreen />}
            </NotistackProvider>
          </RtlLayout>
        </ThemePrimaryColor>
      </ThemeConfig>
    </>
  );
}
