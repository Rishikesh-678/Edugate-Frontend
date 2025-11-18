import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import './index.css';

// Error boundary for uncaught errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  document.body.innerHTML = '<div style="padding: 20px; color: #d32f2f;"><h1>Something went wrong</h1><p>' + event.error?.message + '</p></div>';
});

const root = document.getElementById('root');
if (!root) {
  document.body.innerHTML = '<div style="padding: 20px; color: #d32f2f;"><h1>Root element not found</h1></div>';
} else {
  try {
    ReactDOM.createRoot(root).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('React initialization error:', error);
    root.innerHTML = '<div style="padding: 20px; color: #d32f2f;"><h1>Failed to load application</h1><p>' + error?.message + '</p></div>';
  }
}