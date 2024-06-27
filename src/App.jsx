import { useState } from 'react'
import './App.css'
import MainComponent from './components/MainComponent/MainComponent'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h3>Hlloe</h3>
      <MainComponent></MainComponent>

    </>
  )
}

export default App
