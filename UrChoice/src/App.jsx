import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

// Lazy loading de las páginas
const Preloader = lazy(() => import('../src/Pages/Preloader/Preloader'));
const TapToStart = lazy(() => import('../src/Pages/TapToStart/TapToStart'));
const InitialPage = lazy(() => import('../src/Pages/InitialPage/InitialPage'));
const LogInPage = lazy(() => import('../src/Pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../src/Pages/RegisterPage/RegisterPage'));
const HomePage = lazy(() => import('../src/Pages/HomePage/HomePage'));
const ErrorPage = lazy(() => import('../src/Pages/Error/Error'));
const Game = lazy(() => import('../src/Pages/GamePage/Game'));
const Individual = lazy(() => import('../src/Pages/GamePage/IndividualGame'));
const Biblioteca = lazy(() => import('./Pages/HomePage/Header/Biblioteca/biblioteca'));
const User = lazy(() => import('./Pages/HomePage/Header/User/User'));
const TabView = lazy(() => import('./Pages/HomePage/Tabview/tabview'));
const LandingPage = lazy(() => import('./Pages/LandingPage/LandingPage'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Cargando...</div>}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Preloader" element={<Preloader />} />
          <Route path="/Tap_to_start" element={<TapToStart />} />
          <Route path="/InitialPage" element={<InitialPage />} />
          <Route path="/LogInPage" element={<LogInPage />} />
          <Route path="/RegisterPage" element={<RegisterPage />} />

          <Route path="/HomePage" element={<HomePage />}>
            <Route index element={<TabView />} />
            <Route path="Biblioteca" element={<Biblioteca />} />
            <Route path="User" element={<User />} />
          </Route>

          <Route path="/GamePage" element={<Game />} />
          <Route path="/IndividualGame" element={<Individual />} />
          <Route path="/*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
