import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import axiosClient from "../config/axios";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setPasswordConfirm] = useState("");

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
    if ([nombre, email, password, repetirPassword].includes("")) {
      setAlerta({ message: "Hay valores vacios", err: true });
      return;
    }

    if (password !== repetirPassword) {
      setAlerta({ message: "Las contraseñas no coinciden. ", err: true });
      return;
    }
    if (password.length < 8) {
      setAlerta({
        message:
          "La contraseña no es lo suficientemente larga. Debe tener minimo 8 caracteres",
        err: true,
      });
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_LOGIN_AND_REGISTER}/patients`;
      const response = await axiosClient.post(url, {
        name: nombre,
        email: email,
        password: password,
      });

      // Verifica si la respuesta contiene "Paciente registrado"
      if (response.data["Paciente registrado"]) {
        setAlerta({
          message:
            "Cuenta creada exitosamente. Revisa tu email para confirmar el registro",
          err: false,
        });
      } else {
        setAlerta({ message: "Error al crear cuenta", err: true });
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setAlerta({ message: error.response.data.msg, err: true });
      } else {
        setAlerta({ message: "Error al crear cuenta", err: true });
      }
    }
  };

  const { message } = alerta;

  return (
    <>
      <form
        action=""
        className="bg-blue-900 rounded-xl my-1 md:my-2 xl:my-4 mx-auto p-8 shadow-lg w-full max-w-3xl"
        onSubmit={handleSubmit}
      >
        <div className="alert-space" style={{ minHeight: "10px" }}>
          {" "}
          {/* Espacio reservado para la alerta */}
          {alerta.message && <Alerta alerta={alerta} />}
        </div>

        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">Nombre</label>
          <input
            type="text"
            placeholder="Introduce tu nombre"
            className="border w-full p-3 mt-3 rounded-xl"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">Email</label>
          <input
            type="email"
            placeholder="Introduce tu e-mail"
            className="border w-full p-3 mt-3 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">
            Contraseña
          </label>
          <input
            type="password"
            placeholder="Introduce tu contraseña"
            className="border w-full p-3 mt-3 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="my-10 mx-5">
          <label className="text-white block text-xl font-bold">
            Verficacion Contraseña
          </label>
          <input
            type="password"
            placeholder="Verifica tu contraseña"
            className="border w-full p-3 mt-3 rounded-xl"
            value={repetirPassword}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </div>

        <input
          type="submit"
          value="Crear Cuenta"
          className="bg-white my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200"
        />

        <nav className="mt-5 lg:flex lg:justify-between my-5 mx-5 underline">
          <Link className="text-white align-middle" to="/">
            Ya tienes una cuenta? Inicia sesion.
          </Link>
        </nav>
      </form>
    </>
  );
};

export default Register;
