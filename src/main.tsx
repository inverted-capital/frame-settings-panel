import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ArtifactFrame } from '@artifact/client/react'
import { HOST_SCOPE } from '@artifact/client/api'
import App from './App.tsx'
import { defaultData as defaultSettings } from './hooks/useSettings.ts'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ArtifactFrame
      mockRepos={{ mock: { main: { 'settings.json': defaultSettings } } }}
      mockFrameProps={{
        target: { did: HOST_SCOPE.did, repo: 'mock', branch: 'main' }
      }}
    >
      <App />
    </ArtifactFrame>
  </StrictMode>
)
