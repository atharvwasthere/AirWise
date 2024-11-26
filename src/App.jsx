import './App.css'
import { ThemeProvider } from './components/ThemeProvider'
import Landing from './pages/Landing'
function App() {

  return (
    <>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <div className='min-h-screen w-full flex  overflow-x-hidden'>
          <Landing />
        </div>
      </ThemeProvider>
    </>
  )
}

export default App
