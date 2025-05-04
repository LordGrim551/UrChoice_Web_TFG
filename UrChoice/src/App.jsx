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
import TabView from './Pages/HomePage/Tabview/tabview'; // Añade esta importación
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Preloader />} />
        <Route path="/Tap_to_start" element={<TapToStart />} />
        <Route path="/InitialPage" element={<InitialPage />} />
        <Route path="/LogInPage" element={<LogInPage />} />
        <Route path="/RegisterPage" element={<RegisterPage />} />
        
        {/* Rutas anidadas para el layout de HomePage */}
        <Route path="/HomePage" element={<HomePage />}>
          <Route index element={<TabView />} /> {/* Usa el componente importado */}
          <Route path="biblioteca" element={<Biblioteca />} />
        </Route>
        
        <Route path="/GamePage" element={<Game />} />
        <Route path="/IndividualGame" element={<Individual />} />
        <Route path="/*" element={<Error />} />
      </Routes>
    </Router>
  )
}

export default App;