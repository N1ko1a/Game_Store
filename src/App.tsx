import Game from "./Routes/Game"
import Home from "./Routes/Home"
import Library from "./Routes/Library"
import {Routes, Route} from 'react-router-dom'
function App() {

  return (
    <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="Library" element={<Library/>}/>
            <Route path="Game" element={<Game/>}/>
    </Routes>
  )
}

export default App
