import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from './app/store.ts'
// Google OAuth provider wraps the React app so components like `GoogleLogin`
// can access the configured client id. this file shows where the client id is injected into the app.
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID as string}>
        {/* The provider makes the client id available to GoogleLogin components. */}
        <App />
      </GoogleOAuthProvider>
    </Provider>
  </StrictMode>
)
