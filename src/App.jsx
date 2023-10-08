import Home from './Routes/Home'
import { Routes,Route } from 'react-router-dom'
import Library from './Routes/Library'

function App() {

    return (
      <div >
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='Library' element={<Library/>} />
      </Routes>
    </div>
    )
}

export default App
