import Home from "./Routes/Home"
import Library from "./Routes/Library"
import {Routes, Route} from 'react-router-dom'
function App() {

  return (
    <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="Library" element={<Library/>}/>
    </Routes>
  )
}

export default App
