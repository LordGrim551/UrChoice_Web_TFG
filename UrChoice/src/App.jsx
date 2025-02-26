import Preloader from '../src/Pages/Preloader/Preloader';
import TapToStart from '../src/Pages/TapToStart/TapToStart';
import InitialPage from '../src/Pages/InitialPage/InitialPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/Tap_to_start" element={<TapToStart />} />
        <Route path="/InitialPage" element={<InitialPage />} />
      </Routes>
    </Router>
  )
}

export default App
