import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import {
  RouterProvider,
} from "react-router";
import router from './routers/router.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import AuthProvider from './contexts/Auth/AuthProvider.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
     <RouterProvider router={router} />,
     </ThemeProvider>
     </AuthProvider>
  </StrictMode>,
)
