import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../config/axios";
const styles = { fontFamily: "Oleo Script" };
import { Save, ArrowBack } from "@material-ui/icons";
import Alerta from "../components/Alerta";
import { Link } from "react-router-dom";

const WatchHistory = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const patientId = queryParams.get("patientId");
  const [datos, setDatos] = useState([]);
  const [pac, setPac] = useState([]);
  const [nombre, setNombre] = useState("");
  const [doc, setDoc] = useState("");
  const [fechaNac, setFecha] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [showEditConfirmation, setEditConfirmation] = useState(false);
  const [alerta, setAlerta] = useState({});

  useEffect(() => {
    fetchData();
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

  const enableEdition = (type) => {
    setIsEditable(true);
    setType(type);
  };

  const showEditMessage = () => {
    setIsEditable(false);
    setEditConfirmation(true);
  };

  const edit = async () => {
    try {
      switch (type) {
        case "ocupacion":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              ocupation: value,
            }
          );
          break;
        case "genero":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              gender: value,
            }
          );
          break;
        case "estadociv":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              marital_status: value,
            }
          );
          break;
        case "antmed":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              medical_history: value,
            }
          );
          break;
        case "antpsi":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              psychological_history: value,
            }
          );
          break;
        case "plantrat":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              treatment_plan: value,
            }
          );
          break;
        case "observa":
          await axiosClient.patch(
            `/psychologists/update-medical-records/${patientId}`,
            {
              observations: value,
            }
          );
          break;
        default:
          break;
      }
      setAlerta({
        message: "Cambios en la historia guardados exitosamente.",
        err: false,
      });
      setEditConfirmation(false);
      fetchData();
      if (type == "genero" || type == "estadociv") {
        window.location.reload();
      }
    } catch (error) {
      setAlerta({
        message: "Hubo un error en la edicion de la historia.",
        err: true,
      });
      throw error;
    }
    setIsEditable(false);
  };

  const fetchData = async () => {
    try {
      const response = await axiosClient.get(
        `psychologists/get-medical-record/${patientId}`
      );

      const record = response.data;
      setDatos(record);
      await chargePatientName(record.patientid);
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
    }
  };

  const chargePatientName = async (patientId) => {
    try {
      const responsePat = await axiosClient.get(
        `psychologists/get-patient/${patientId}`
      );
      const patient = responsePat.data;
      setPac(patient);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
 
    if (pac.name) {
      setNombre(pac.name);
    }
    if (pac.document_number) {
      setDoc(pac.document_number);
    }
    if (pac.date_of_birth) {
      let fecha = new Date(pac.date_of_birth);
      let fechaFormateada = fecha.toLocaleDateString("es-ES");
      setFecha(fechaFormateada);
    }
  }, [datos, pac]);

  const { message } = alerta;
  return (
    <div>
      <>
        <form
          classaction=""
          className="bg-gray-300 rounded-xl my-2 md:my-4 xl:my-4 w-full sm:w-12/12 md:w-11/12 lg:w-9/12 xl:w-8/12 mx-auto p-8 shadow-lg"
        >
          {message && <Alerta alerta={alerta} />}
          <div>
            <h1
              className="text-black block text-8xl font-bold text-center "
              style={styles}
            >
              Historia
            </h1>
          </div>

          <div>
            {isEditable ? (
              <div
                className="bg-black rounded-xl p-2 cursor-pointer hover:bg-gray-600 float-left"
                style={{ width: "fit-content" }}
                onClick={showEditMessage}
              >
                <Save className="text-white block font-bold text-left text-2xl" />
              </div>
            ) : null}

            <Link to="/home/search-history">
              <div
                className="bg-black rounded-xl p-2 cursor-pointer hover:bg-gray-600 float-right"
                style={{ width: "fit-content" }}
              >
                <ArrowBack className="text-white block font-bold text-left text-2xl" />
              </div>
            </Link>
          </div>

          <div className="my-10 mx-5">
            <div className=" flex justify-between">
              <label className="text-black block text-xl font-bold">
                Nombre
              </label>
              <label className="text-black block text-xl font-bold">
                Documento
              </label>
            </div>
            <input
              type="text"
              defaultValue={nombre}
              className="border w-72 p-3 mt-3 rounded-xl "
              disabled
            />
            <input
              type="text"
              defaultValue={doc}
              className="border w-72 p-3 mt-3 rounded-xl float-right"
              disabled
            />
          </div>
          <div className="my-10 mx-5">
            <div className="flex justify-between">
              <label className="text-black block text-xl font-bold">
                Fecha de Nacimiento
              </label>
              <label className="text-black block text-xl font-bold">
                Ocupacion
              </label>
            </div>
            <input
              type="text"
              defaultValue={fechaNac}
              className="border w-72 p-3 mt-3 rounded-xl"
              disabled
            />
            {isEditable && type == "ocupacion" ? (
              <input
                type="text"
                defaultValue={datos.ocupation}
                className="border w-72 p-3 mt-3 rounded-xl float-right"
                onChange={(e) => setValue(e.target.value)}
              />
            ) : (
              <input
                type="text"
                defaultValue={datos.ocupation}
                className="border w-72 p-3 mt-3 rounded-xl float-right"
                readOnly={true}
                onDoubleClick={() => enableEdition("ocupacion")}
              />
            )}
          </div>
          <div className="my-10 mx-5">
            <div className="flex justify-between">
              <label className="text-black block text-xl font-bold">
                Genero
              </label>
              <label className="text-black block text-xl font-bold">
                Estado civil
              </label>
            </div>
            {isEditable && type == "genero" ? (
              <select
                name="Genero"
                id="Genero"
                className="border w-72 p-3 mt-3 rounded-xl"
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="Masculino">Masculino</option>
                <option value="Femenino">Femenino</option>
                <option value="Otro">NS/NR</option>
              </select>
            ) : (
              <input
                type="text"
                defaultValue={datos.gender}
                className="border w-72 p-3 mt-3 rounded-xl"
                readOnly={true}
                onDoubleClick={() => enableEdition("genero")}
              />
            )}

            {isEditable && type == "estadociv" ? (
              <select
                name="Estado Civil"
                id="Estado Civil"
                className="border w-72 p-3 mt-3 rounded-xl float-right"
                onChange={(e) => setValue(e.target.value)}
              >
                <option value="Soltero">Soltero/a</option>
                <option value="Casado">Casado/a</option>
                <option value="Divorciado">Divorciado/a</option>
                <option value="Viudo">Viudo/a</option>
              </select>
            ) : (
              <input
                type="text"
                defaultValue={datos.marital_status}
                className="border w-72 p-3 mt-3 rounded-xl float-right"
                readOnly={true}
                onDoubleClick={() => enableEdition("estadociv")}
              />
            )}
          </div>
          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">
              Antecedentes medicos
            </label>
            {isEditable && type == "antmed" ? (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Antecedentes medicos"
                defaultValue={datos.medical_history}
                id="antecedentesmed"
                cols="10"
                rows="10"
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
            ) : (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Antecedentes medicos"
                defaultValue={datos.medical_history}
                id="antecedentesmed"
                cols="10"
                rows="10"
                readOnly={true}
                onDoubleClick={() => enableEdition("antmed")}
              ></textarea>
            )}
          </div>

          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">
              Antecedentes psicologicos
            </label>
            {isEditable && type == "antpsi" ? (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Antecedentes psicologicos"
                defaultValue={datos.psychological_history}
                id="antecedentespsi"
                cols="10"
                rows="10"
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
            ) : (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Antecedentes psicologicos"
                defaultValue={datos.psychological_history}
                id="antecedentespsi"
                cols="10"
                rows="10"
                readOnly={true}
                onDoubleClick={() => enableEdition("antpsi")}
              ></textarea>
            )}
          </div>

          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">
              Plan de tratamiento
            </label>
            {isEditable && type == "plantrat" ? (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Plan de tratamiento"
                defaultValue={datos.treatment_plan}
                id="plantrata"
                cols="10"
                rows="10"
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
            ) : (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Plan de tratamiento"
                defaultValue={datos.treatment_plan}
                id="plantrata"
                cols="10"
                rows="10"
                readOnly={true}
                onDoubleClick={() => enableEdition("plantrat")}
              ></textarea>
            )}
          </div>

          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">
              Observaciones
            </label>
            {isEditable && type == "observa" ? (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Observaciones"
                defaultValue={datos.observations}
                id="observaciones"
                cols="10"
                rows="10"
                onChange={(e) => setValue(e.target.value)}
              ></textarea>
            ) : (
              <textarea
                className="border w-full h-20 p-3 mt-3 rounded-xl"
                name="Observaciones"
                defaultValue={datos.observations}
                id="observaciones"
                cols="10"
                rows="10"
                readOnly={true}
                onDoubleClick={() => enableEdition("observa")}
              ></textarea>
            )}
          </div>
        </form>
      </>
      {showEditConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4">Seguro de que quiere editar esta historia?</p>
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={edit}
                >
                  Sí
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setEditConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
