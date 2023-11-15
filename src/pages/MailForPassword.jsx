import { useState , useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alerta from "../components/Alerta";
import axiosClient from '../config/axios';


const MailForPassword = () => {
  const [email, setEmail] = useState("");
  const [alerta, setAlerta] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (alerta.message) {
      const timer = setTimeout(() => {
        setAlerta({});
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alerta]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setAlerta({ message: "Se requiere correo electrónico", err:true });
      return;
    }
    if (!email.includes("@") || !email.includes(".")) {
      setAlerta({ message: "Ingrese un correo electrónico válido", err:true});
      return;
    }
    try {
      const url = '/patients/forget-password';

      const response = await axiosClient.patch(
        url,
        { email: email }
      );

      if (response.data.message) {
        setAlerta({ message: response.data.message });
      } else {
        setAlerta({ message: "Error al enviar las instrucciones"});
      }
    } catch (error) {
      if (error.response && error.response.data) {
        // Muestra un mensaje de error específico desde el backend
        setAlerta({ message: error.response.data.error, err:true });
      } else {
        setAlerta({ message: "Error al enviar las instrucciones", err:true });
      }
    }
  };
  return (
    <form
      classaction=""
      className="bg-blue-900 rounded-xl my-1 md:my-2 xl:my-4 w-full sm:w-full md:w-full lg:w-7/8 xl:w-3/4 2xl:w-max 2xl:max-w-xl mx-auto p-8 shadow-lg"
      onSubmit={handleSubmit}
    >
      {" "}
      <Alerta alerta={alerta} />{" "}
      <div className="my-5 mx-5">
        {" "}
        <label className="text-white block text-xl font-bold">
          E-mail
        </label>{" "}
        <input
          type="email"
          placeholder="Introduce tu e-mail"
          className="border w-full p-3 mt-3 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
      </div>
      <input
        type="submit"
        value="Enviar instrucciones"
        className="bg-white my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200"
      />
      <nav className="mt-5 lg:flex lg:justify-between my-5 mx-5 underline">
        {" "}
        <Link className="text-white align-middle" to="/">
          {" "}
          Volver atras{" "}
        </Link>{" "}
      </nav>{" "}
    </form>
  );
};
export default MailForPassword;
