import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import Header from './Header/header';
import FriendBar from './FriendBar/FriendBar';
import TabView from './Tabview/tabview';

function HomePage() {
  const [nick, setNick] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setNick(parsedUser.nick_user);
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
      }
    } else {
      console.log('No se encontró el usuario en el localStorage');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col p-6 gap-4">
      <Header />
      <aside className="w-full flex lg:hidden overflow-x-auto">
        <FriendBar />
      </aside>

      <main className="flex flex-grow gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: location.pathname.includes('biblioteca') ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: location.pathname.includes('biblioteca') ? -50 : 50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="flex-1"
          >
            <Outlet /> {/* Esto renderizará TabView o Biblioteca */}
          </motion.div>
        </AnimatePresence>

        <div className="hidden lg:flex w-1/5 max-h-[calc(86vh-48px)] overflow-y-auto">
          <FriendBar />
        </div>
      </main>
    </div>
  );
}

export default HomePage;