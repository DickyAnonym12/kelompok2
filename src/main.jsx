import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import { FaqProvider } from './context/FaqContext';
import { StyleProvider } from '@ant-design/cssinjs';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StyleProvider hashPriority="high">
      <FaqProvider>
        <App />
      </FaqProvider>
    </StyleProvider>
  </BrowserRouter>,
)
