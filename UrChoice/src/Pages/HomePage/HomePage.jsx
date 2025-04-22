import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header/header';
import FriendBar from './FriendBar/FriendBar';
import HomeCategoryCard from './Home_CategoryCard/home_category_card';

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/Tap_to_start');
  };

  return (
    <div className="min-h-screen flex flex-col p-6 gap-4">
      <Header />
      {/* Barra de amigos en pantallas pequeñas (desplazamiento horizontal) */}
      <aside className="w-full flex lg:hidden overflow-x-auto">
        <FriendBar />
      </aside>
      <main className="flex flex-grow gap-4">
        {/* Contenido principal */}
        <div className="category-card w-full h-[calc(86vh-48px)] flex-grow p-4  border-red-600 border-5 rounded-lg overflow-y-auto scrollbar-custom">
          <p className="text-center text-lg font-bold text-gray-700">
            Bienvenido, {nick ? `Nick: ${nick}` : 'Cargando usuario...'}
          </p>
          <HomeCategoryCard  />
          <button
            onClick={handleLogout}
            className="mt-5 py-2 px-4 bg-red-600 border-5  text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Barra de amigos en pantallas grandes (desplazamiento vertical) */}
        <div className="hidden lg:flex w-1/5 max-h-[calc(86vh-48px)] overflow-y-auto">
          <FriendBar />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
