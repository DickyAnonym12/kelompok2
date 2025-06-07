import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { FaqProvider } from './context/FaqContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <FaqProvider>
      <App />
    </FaqProvider>
  </BrowserRouter>,
)
