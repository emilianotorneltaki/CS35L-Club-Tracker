import { Navigate, Route, Routes } from 'react-router-dom';
import SearchPage from './pages/SearchPage.jsx';
import ClubPage from './pages/ClubPage.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      {/* Until login/dashboard (MH1, MH2) land, send everyone to search. */}
      <Route path="/" element={<Navigate to="/clubs" replace />} />
      <Route path="/clubs" element={<SearchPage />} />
      <Route path="/clubs/:id" element={<ClubPage />} />
      <Route path="*" element={<main className="page"><p className="status">Page not found</p></main>} />
    </Routes>
  );
}

export default App;
