import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import Header from './Header/header'; // Asegúrate de que la ruta sea correcta
import FriendBar from './FriendBar/FriendBar';

function HomePage() {
  const [nick, setNick] = useState('');
  const navigate = useNavigate(); // Inicializa el hook de navegación

  useEffect(() => {
    // Verifica si el usuario existe en el localStorage
    const user = localStorage.getItem('user');

    if (user) {
      try {
        // Intenta parsear el valor solo si no es undefined o vacío
        console.log('Datos de usuario:', user);
        const parsedUser = JSON.parse(user);
        setNick(parsedUser.nick_user); // Asumimos que el campo "nick" existe en el objeto user
        console.log('Usuario parseado:', parsedUser);
      } catch (error) {
        console.error('Error al parsear el usuario:', error);
      }
    } else {
      console.log('No se encontró el usuario en el localStorage');
    }
  }, []); // Solo se ejecuta una vez al cargar el componente

  const handleLogout = () => {
    // Eliminar token y datos de usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir a la página de login
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
        <div className="flex-grow p-4 border-red-600 border-1 rounded-lg">
          <p className="text-center text-lg font-bold text-gray-700">
            Bienvenido, {nick ? `Nick: ${nick}` : 'Cargando usuario...'}
          </p>
          <button
            onClick={handleLogout}
            className="mt-5 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Barra de amigos en pantallas grandes (desplazamiento vertical) */}
        <div className="hidden lg:flex w-1/5 overflow-y-auto max-h-[calc(100vh-96px)]">
          <FriendBar />
        </div>
      </main>
    </div>
  );
}

export default HomePage;
