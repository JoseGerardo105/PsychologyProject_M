import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Alerta from "../components/Alerta";
import axiosClient from "../config/axios";

const ResetPasswordForEnter = () => {
  const [password, setPassword] = useState("");
  const [rewritePassword, setRewritePassword] = useState("");
  const [alerta, setAlerta] = useState({});
  const [validToken, setValidToken] = useState(false);
  const [changedPassword, setChangedPassword] = useState(false);

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const comprobeToken = async () => {
      try {
        const url = `/patients/forget-password/${token}`;
        await axiosClient(url);
        setAlerta({ message: "Coloca tu nueva contraseña" });
        setValidToken(true);
      } catch (error) {
        setAlerta({
          message: "Hubo un error con el enlace",
          err: true,
        });
      }
    };

    comprobeToken();
  }, []);

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
    if (password !== rewritePassword) {
      setAlerta({ message: "Las contraseñas no coinciden. ", err: true });
      return;
    }
    if (password.length < 8) {
      setAlerta({
        message: "La contraseña no es lo suficientemente larga. Debe tener minimo 8 caracteres",
        err: true,
      });
      return;
    }

    try {
      const url = `/patients/forget-password/${token}`;
      const { data } = await axiosClient.post(url, { password });
      setAlerta({
        message: data.message,
      });
    setAlerta({ message: "Contraseña modificada correctamente", err: false });

      setChangedPassword(true);
    } catch (error) {
      setAlerta({
        message: error.response.data.message,
        err: true,
      });
    }

  };

  return (
    <div style={{ height: "70vh" }}>
      {alerta.message && <Alerta alerta={alerta} />}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {validToken && (
          <form
            onSubmit={handleSubmit}
            className="bg-blue-900 rounded-xl my-28 w-max shadow-lg"
          >
            <div className="my-10 mx-5">
              <label className="text-white block text-xl font-bold">
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Introduce tu nueva contraseña"
                className="border w-full p-3 mt-3 rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="my-5 mx-5">
              <label className="text-white block text-xl font-bold">
                Confirmacion
              </label>
              <input
                type="password"
                placeholder="Confirma tu contraseña"
                className="border w-full p-3 mt-3 rounded-xl"
                value={rewritePassword}
                onChange={(e) => setRewritePassword(e.target.value)}
              />
            </div>

            <input
              type="submit"
              value="Confirmar"
              className="bg-white my-5 mx-40 rounded-xl font-normal mt-5 w-64 h-10 hover:cursor-pointer hover:bg-gray-200"
            />
          </form>
        )}
      </div>

          {changedPassword && 
          
          <div className="flex justify-center">
              <Link
                className="inline-block md:mt-1 text-center my-15 text-white bg-indigo-700 border border-gray-400 shadow px-4 py-2 rounded-lg"
                to="/"
              >
                Iniciar sesión
              </Link>
            </div>
            }
      
    </div>
  );
};

export default ResetPasswordForEnter;
