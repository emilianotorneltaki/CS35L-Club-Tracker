import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import ClubSignup from './pages/ClubSignup'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/club/signup" element={<ClubSignup />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
