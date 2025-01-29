import './App.css'
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from './components/ThemeProvider'
import Landing from './pages/Landing'
import Trip from './pages/Trip'

function App() {

  return (
    <>
      <BrowserRouter>
        <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
          <Routes>

            <Route path='/' element={
              <div className='min-h-screen w-full flex  overflow-x-hidden'>
                <Landing />
              </div>
            } />
            <Route path='/trip' element={
              <div className='min-h-screen w-full flex  overflow-x-hidden'>
                <Trip/>
              </div>
            }
            />

          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </>
  )
}

export default App
