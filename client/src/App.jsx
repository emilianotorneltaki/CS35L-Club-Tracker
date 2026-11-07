import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'
import ClubSignup from './pages/ClubSignup'
import ClubLogin from './pages/ClubLogin'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/club/signup" element={<ClubSignup />}></Route>
        <Route path="/club/login" element={<ClubLogin />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
