import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {mineStore} from "./store/mineStore.ts";
import {Provider} from "mobx-react";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider mineStore={mineStore}>
          <App />
      </Provider>
  </StrictMode>,
)
