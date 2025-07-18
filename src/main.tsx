import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import store from './store';
import { SocketProvider } from './components/utils/SocketContext';
import { AuthProvider } from './components/auth/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components/componentStyling/Styles.scss';
import { HashRouter, Routes, Route } from 'react-router-dom';
import InvoicePage from './components/Fees/InvoicePage';

const queryClient = new QueryClient();

console.log('Main.tsx loading, current path:', window.location.hash);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <QueryClientProvider client={queryClient}>
              <Provider store={store}>
                <AuthProvider>
                  <SocketProvider>
                    <App />
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                    />
                  </SocketProvider>
                </AuthProvider>
              </Provider>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          }
        />
        <Route
          path="/invoice"
          element={
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <InvoicePage />
              </AuthProvider>
            </QueryClientProvider>
          }
        />
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message);
});
