import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

// Component Imports
import Navbar from './components/navbar/Navbar'
import Jobs from './components/jobs/Jobs'

import { useState } from 'react'

// CSS
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Navbar />
      <Jobs />
    </div>
  )
}
export default App
