import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import axiosClient from "../config/axios";

const Login = () => {
  const [nombre, getNombre] = useState("");
  const [password, getPassword] = useState("");
  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;
  const [alerta, setAlerta] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => {
        setAlerta({});
      }, 8000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alerta]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nombre === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Iniciar sesión como administrador
      localStorage.setItem("token", "admin-token"); // Puedes generar un token de administrador específico aquí
      localStorage.setItem("role", "administrador");
      localStorage.setItem("userId", "admin-id"); // Puedes asignar un ID de administrador específico aquí
      localStorage.setItem("userEmail", "admin@admin.com");

      setAlerta({ msg: "Inicio de sesión exitoso", err: false });
      navigate("/home");
      return;
    }
    try {
      // Intentar iniciar sesión como psicólogo
      let url =
        "http://psynergiaauth-dev.eba-gndziymq.us-east-1.elasticbeanstalk.com/api/patients/login";
      let response = await axiosClient.post(url, {
        email: nombre,
        password: password,
      });

      // Verificar si se obtuvo un token en alguna de las respuestas
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        // Determinar el rol basado en qué endpoint fue exitoso
        const role = url.includes("/psychologists/login")
          ? "psicologo"
          : "paciente";
        localStorage.setItem("role", role);
        localStorage.setItem("userId", response.data.id);
        localStorage.setItem("userEmail", nombre);

        setAlerta({ message: "Inicio de sesión exitoso", err: false });
        navigate("/home");
      } else {
        setAlerta({ message: "Error al iniciar sesión", err: true });
      }
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "Error al iniciar sesión";
      setAlerta({ message: errorMsg, err: true });
    }
  };
  const { message } = alerta;

  return (
    <>
      <form
        classaction=""
        className="bg-blue-900 rounded-xl my-1 md:my-2 xl:my-4 w-full sm:w-full md:w-full lg:w-7/8 xl:w-3/4 2xl:w-max 2xl:max-w-xl mx-auto p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        {message && <Alerta alerta={alerta} />}

        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">E-mail</label>
          <input
            type="email"
            placeholder="Introduce tu e-mail"
            className="border w-full p-3 mt-3 rounded-xl"
            value={nombre}
            onChange={(e) => getNombre(e.target.value)}
          />
        </div>
        <div className="my-5 mx-5">
          <label className="text-white block text-xl font-bold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            className="border w-full p-3 mt-3 rounded-xl"
            value={password}
            onChange={(e) => getPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Iniciar Sesión"
          className="bg-white my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200"
        />

        <nav className="mt-5 lg:flex lg:justify-between my-5 mx-5 underline">
          <Link className="block text-center text-white" to="/register">
            No tienes una cuenta?{" "}
            <span className=" hover:cursor-pointer">Registrate</span>
          </Link>
          <Link className="block text-center text-white" to="/restore-account">
            Olvide mi contraseña
          </Link>
        </nav>
      </form>
    </>
  );
};

export default Login;
