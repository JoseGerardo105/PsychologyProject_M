import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alerta from '../components/Alerta';
import axiosClient from '../config/axios';

const Login = () => {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [alerta, setAlerta] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => {
        setAlerta({});
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Intentar iniciar sesión como psicólogo
      const responsePsy = await axiosClient.post('http://psynergiaauth-dev.eba-gndziymq.us-east-1.elasticbeanstalk.com/api/psychologists/login', {
        email: nombre,
        password: password,
      });

      if (responsePsy.data.token) {
        // Guardar datos de sesión de psicólogo
        handleSuccessfulLogin(responsePsy.data, 'psicólogo');
        return;
      }
    } catch (error) {
      // Si falla, intenta iniciar sesión como paciente
      try {
        const responsePat = await axiosClient.post('http://psynergiaauth-dev.eba-gndziymq.us-east-1.elasticbeanstalk.com/api/patients/login', {
          email: nombre,
          password: password,
        });

        if (responsePat.data.token) {
          // Guardar datos de sesión de paciente
          handleSuccessfulLogin(responsePat.data, 'paciente');
          return;
        }
      } catch (error) {
        setAlerta({ message: 'Error al iniciar sesión', err: true });
      }
    }
  };

  const handleSuccessfulLogin = (data, role) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', data.id);
    localStorage.setItem('userEmail', nombre);

    setAlerta({ message: 'Inicio de sesión exitoso', err: false });
    navigate('/home');
  };

  return (
    <>
      <form
        className="bg-blue-900 rounded-xl my-1 md:my-2 xl:my-4 w-full sm:w-full md:w-full lg:w-7/8 xl:w-3/4 2xl:w-max 2xl:max-w-xl mx-auto p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        {alerta.message && <Alerta alerta={alerta} />}

        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">E-mail</label>
          <input
            type="email"
            placeholder="Introduce tu e-mail"
            className="border w-full p-3 mt-3 rounded-xl"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="my-5 mx-5">
          <label className="text-white block text-xl font-bold">Contraseña</label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            className="border w-full p-3 mt-3 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-white my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200"
        />

        <nav className="mt-5 lg:flex lg:justify-between my-5 mx-5 underline">
          <Link className="block text-center text-white" to="/register">
            No tienes una cuenta? <span className="hover:cursor-pointer">Registrate</span>
          </Link>
          <Link className="block text-center text-white" to="/restore-account">
            Olvidé mi contraseña
          </Link>
        </nav>
      </form>
    </>
  );
};

export default Login;
