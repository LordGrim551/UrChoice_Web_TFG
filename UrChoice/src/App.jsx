import Preloader from '../src/Pages/Preloader/Preloader';
import TapToStart from '../src/Pages/TapToStart/TapToStart';
import InitialPage from '../src/Pages/InitialPage/InitialPage';
import LogInPage from '../src/Pages/LoginPage/LoginPage';
import RegisterPage from '../src/Pages/RegisterPage/RegisterPage';
import HomePage from '../src/Pages/HomePage/HomePage';
import Error from '../src/Pages/Error/Error';
import Game from '../src/Pages/GamePage/Game';
import Individual from '../src/Pages/GamePage/IndividualGame';
import Biblioteca from './Pages/HomePage/Header/Biblioteca/biblioteca';
import { BrowserRouter as Router, Route, Routes,  } from 'react-router-dom';




function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/Tap_to_start" element={<TapToStart />} />
        <Route path="/InitialPage" element={<InitialPage />} />
        <Route path="/LogInPage" element={<LogInPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/GamePage" element={<Game />} />
        <Route path="/IndividualGame" element={<Individual />} />
        <Route path="/Biblioteca" element={<Biblioteca />} />
        {/* <Route path="/GamePage/:id" element={<Game />} /> */}
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App
