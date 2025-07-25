import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext'; // Adjust path
import { Toaster } from 'react-hot-toast';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <>
//     <App />
//     <Toaster position="top-right" reverseOrder={false} />
//   </>
// );

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <AuthProvider>
    <App />

<Toaster position="top-right" reverseOrder={false} />
  </AuthProvider>
  </StrictMode>
)
