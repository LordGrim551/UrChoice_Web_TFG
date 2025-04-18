import { useState } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Link, useNavigate } from 'react-router-dom';
import '../LoginPage/LoginPage.css';
import UrChoiceLogo from '../LoginPage/LogoTodoSVG.svg';
import Logo from '../LoginPage/logo.png'; // Esto es para la imagen por defecto del logo
import RegisterPage from '../RegisterPage/RegisterPage';
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

        // Verifica si el servidor devuelve la imagen de perfil
        if (data.img_user) {
          const imageBase64 = `data:image/png;base64,${data.img_user}`;
          setProfileImg(imageBase64);
          console.log('Imagen de perfil cargada:', imageBase64);

          // Espera 5 segundos antes de redirigir
          setTimeout(() => {
            navigate("/HomePage");
          }, 5000);
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

      <img src={UrChoiceLogo} className="logo UrChoice" alt="UrChoice logo" />

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

        <div className="mt-4 grid grid-cols-2 gap-3">
          {/* Botones sociales */}
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-white py-2 px-3 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-100">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.545 10.239v3.821h5.445c-0.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866 0.549 3.921 1.453l2.814-2.814c-1.787-1.676-4.188-2.707-6.735-2.707-5.523 0-10 4.477-10 10s4.477 10 10 10c8.396 0 10.201-7.835 9.685-11.696l-9.685-0.001z" />
            </svg>
            Google
          </button>
          <button type="button" className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3b5998] py-2 px-3 text-sm font-medium text-white shadow-sm hover:bg-[#324d84]">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
            </svg>
            Facebook
          </button>
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
