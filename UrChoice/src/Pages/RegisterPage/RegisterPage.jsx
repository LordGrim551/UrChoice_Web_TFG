import UrChoiceLogo from '../RegisterPage/LogoTodoSVG.svg';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../RegisterPage/RegisterPage.css';
import Logo from '../LoginPage/logo.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [nick, setNick] = useState('');
  const [img, setImg] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadImageAsBase64 = async () => {
      try {
        const response = await fetch(Logo);
        const blob = await response.blob();
  
        const reader = new FileReader();
        reader.onloadend = () => {
          setImg(reader.result.split(',')[1]);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error al cargar la imagen como Base64:', error);
      }
    };
  
    loadImageAsBase64();
  }, []);

  // Función para validar el formato del correo electrónico
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Validar el correo electrónico antes de continuar
    if (!validateEmail(email)) {
      toast.error('Por favor ingresa un correo electrónico válido', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    console.log('Datos enviados:', { email, nick, img, password });

    try {
      const response = await fetch('https://railwayserver-production-7692.up.railway.app/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, 
          nick: nick,
          img: img,
          contra: password, 
        }),
      });
      
      const data = await response.json();

      if (response.ok) {
        console.log('Cuenta creada con éxito:', data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        localStorage.setItem('id_user', data.id_user);
       
        setImg(Logo);
        console.log(Logo);
        navigate("/HomePage");
      } else {
        console.log('Error al registrar', data);
        setError(data.message || 'Error al crear cuenta');
      }
    } catch (err) {
      console.error('Error de conexión', err);
      toast.error('Hubo un error al conectarse al servidor', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* Animaciones de fondo */}
      <DotLottieReact className="absolute h-full w-screen" src="https://lottie.host/9ad2756e-5d0c-4e48-be43-d964c37daea0/lz10b4JsWT.lottie" loop autoplay />
      <DotLottieReact className="absolute h-full w-screen rotate-180" src="https://lottie.host/8f385097-1fd9-4e6b-8d84-ab7bb31d37db/nLLINWcew3.lottie" loop autoplay />
      
      {/* Contenedor de Toast */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      {/* Logo */}
      <img src={UrChoiceLogo} className="logo UrChoice" alt="UrChoice logo" />
      
      {/* Formulario de registro */}
      <div className=" glass w-full max-w-sm p-4 rounded-lg bg-black bg-opacity-60 backdrop-blur-md z-10">
        <h2 className="text-xl font-bold text-white text-center mb-4">Crear Cuenta</h2>
        
        <form className="space-y-3" onSubmit={handleRegister}>
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-300 mb-1">
              Nombre de Usuario
            </label>
            <input
              type="text"
              id="username"
              name="username"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="Tu nombre de usuario"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="nombre@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="mt-0.5 text-xs text-gray-400">Mínimo 6 caracteres</p>
          </div>
          
          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-gray-300 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-cyan-500 text-white text-sm"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          
         
          
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-1.5 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-cyan-500 transition-all duration-300"
            >
              {loading ? 'Cargando...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
        
        {error && <p className="mt-2 text-red-500 text-center text-sm">{error}</p>}

        <div className="flex items-center mt-4">
          <div className="flex-1 h-px bg-gray-700"></div>
          <p className="mx-2 text-xs text-gray-400">O</p>
          <div className="flex-1 h-px bg-gray-700"></div>
        </div>
        
        <div className="mt-4 text-center text-xs text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="font-medium text-cyan-500 hover:text-cyan-400">
            Iniciar Sesión
          </a>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;