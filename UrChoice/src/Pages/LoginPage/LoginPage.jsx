import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css';
import Logo from '../LoginPage/logo.png'; // Esto es para la imagen por defecto del logo

function LogInPage() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImg, setProfileImg] = useState(''); // Nuevo estado para la imagen del perfil
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    console.log('Datos enviados:', { email, password });

    try {
      const response = await fetch('https://railwayserver-production-7692.up.railway.app/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          contra: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Conexión exitosa. Usuario autenticado:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('id_user', data.id_user); // <-- Esta línea es clave


        // Verifica si el servidor devuelve la imagen de perfil
        if (data.img_user) {
          const imageBase64 = `data:image/png;base64,${data.img_user}`;
          setProfileImg(imageBase64);
          console.log('Imagen de perfil cargada:', imageBase64);

          // Espera 5 segundos antes de redirigir
          setTimeout(() => {
            navigate("/HomePage");
          }, 3000);
        } else {
          // Si no hay imagen, navega de inmediato
          navigate("/HomePage");
        }


      } else {
        console.log('Error de autenticación', data);
        navigate("/*", { state: { errorCode: response.status } });
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error('Error de conexión', err);
      setError('Hubo un error al conectarse al servidor');
      navigate("/*", { state: { errorCode } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DotLottieReact className='absolute h-full w-screen' src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className='absolute h-full w-screen rotate-180' src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />

     

      <div className="glass w-full max-w-md p-5 rounded-lg bg-black bg-opacity-60 backdrop-blur-md z-10">
        <div className="profile-container">
          <div className="profile">
            <img
              src={profileImg || Logo}  // Aquí usamos la URL de la imagen de perfil, o una imagen por defecto si no hay imagen
              alt="Perfil"
              className="foto-perfil"
            />
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-4">Iniciar Sesión</h2>

        <form className="space-y-3" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">Contraseña</label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border-0 rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300"
            disabled={loading}
          >


            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>


        </form>

        {error && <div className="mt-4 text-center text-sm text-red-500">{error}</div>}

        <div className="flex items-center mt-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <p className="mx-3 text-sm text-gray-400">O</p>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>

       

        <p className="mt-4 text-center text-sm text-gray-400">
          ¿No tienes una cuenta?{' '}
          <a href="RegisterPage" className="font-medium text-cyan-500 hover:text-cyan-400">Regístrate</a>
        </p>
      </div>
    </div>
  );
}

export default LogInPage;
