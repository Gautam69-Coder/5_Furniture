import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import { PopupProvider } from './context/PopupContext.jsx'
import { App as AntdApp } from 'antd'

const root = createRoot(document.getElementById('root'));

const app = (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <PopupProvider>
        <AntdApp>
          <App />
        </AntdApp>
      </PopupProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

root.render(
  import.meta.env.DEV ? <StrictMode>{app}</StrictMode> : app
);