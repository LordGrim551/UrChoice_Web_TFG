import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header/header';
import FriendBar from './FriendBar/FriendBar';
import TabView from './Tabview/tabview'; // Importar el nuevo componente TabView

function HomePage() {
  const [nick, setNick] = useState('');
  const navigate = useNavigate();

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
        {/* Usar el nuevo componente TabView */}
        <TabView />

        <div className="hidden lg:flex w-1/5 max-h-[calc(86vh-48px)] overflow-y-auto">
          <FriendBar />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
