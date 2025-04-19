import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa el hook useNavigate
import Header from './Header/header'; // Asegúrate de que la ruta sea correcta



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
    <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-grow">
      {/* Aquí tu contenido principal */}
           {/* <DotLottieReact className="absolute h-full w-screen z-negative" src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className="absolute h-full w-screen rotate-180 z-negative" src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />
      <img src={UrChoiceLogo} className="logo UrChoice" alt="React logo" />
      <div id="trapeziums-group">
        <div id="trapezium-Test">
          <p className="text-l font-bold z-10 text-center pt-5">BIENVENIDO YA ESTÁS DENTRO</p>
        </div>
        <div id="trapezium-Test">
        
          <p className="text-l font-bold z-10 text-center pt-5">{nick ? `Nick: ${nick}` : 'Cargando usuario...'}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="mt-5 py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Cerrar sesión
      </button> */}
    </main>
  </div>
  
 
  );
}

export default HomePage;
