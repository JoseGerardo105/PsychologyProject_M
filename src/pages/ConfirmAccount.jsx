import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../config/axios";
import Alerta from "../components/Alerta";

function ConfirmAccount() {
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [charging, setCharging] = useState(true);
  const [alerta, setAlerta] = useState({});

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `patients/confirm/${token}`;
        const { data } = await axiosClient(url);
        setConfirmAccount(true);
        setAlerta({
          message: data.message,
        });
      } catch (error) {
        setAlerta({
          message: "Error, el token ingresado no existe",
          err: true,
        });
      }

      setCharging(false);
    };

    confirmAccount();
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

  return (
    <>
      <div>
        <h1 className="text-indigo-600 font-black text-5xl">
          Confirmación cuenta
        </h1>
        <div className="mt-20 md:mt-28 shadow-lg px-0 py-10 rounded-xl bg-white">
          {!charging && <Alerta alerta={alerta} />}
          {confirmAccount && (
            <div className="flex justify-center">
              <Link
                className="inline-block md:mt-28 text-center my-15 text-white bg-indigo-500 border border-gray-400 shadow px-4 py-2 rounded-lg"
                to="/"
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ConfirmAccount;
