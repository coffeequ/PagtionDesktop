import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route, HashRouter } from 'react-router-dom'
import Login from './Routes/login.tsx'
import DocumentPage from './Routes/document.tsx'
import { ThemeProvider } from './providers/theme-providers.tsx'
import { Toaster } from 'sonner'
import DocumentPageDynamic from './Routes/dynamicDocument.tsx'
import StartDocumentPage from './Routes/startDocument.tsx'
import ModalProvider from './providers/modal-providers.tsx'

createRoot(document.getElementById('root')!).render(
  <ThemeProvider>
    <Toaster position="bottom-center"/>
    <ModalProvider/>
    <StrictMode>
      <HashRouter>
        <Routes>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/document' element={<DocumentPage/>}>
            <Route path='/document/startPage' element={<StartDocumentPage/>}></Route>
            <Route path='/document/:id' element={<DocumentPageDynamic/>}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </StrictMode>
  </ThemeProvider>
)
