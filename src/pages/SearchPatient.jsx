import React, { useState, useEffect } from "react";
import axiosClient from "../config/axios";
import { Delete, Save } from "@material-ui/icons";
const styles = { fontFamily: "Oleo Script" };
import Alerta from "../components/Alerta";

const SearchPatient = () => {
  const [datos, setDatos] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [value, setValue] = useState("");
  const [idToModify, setIdToModify] = useState("");
  const [type, setType] = useState("");
  const [alerta, setAlerta] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [idErase, setIdErase] = useState("");
  const [docToSearch, setDocToSearch] = useState("");
  const [showEditConfirmation, setEditConfirmation] = useState(false);

  useEffect(() => {
    fetchPatients();
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

  const search = () => {
    if (docToSearch !== "") {
      fetchPatient(docToSearch);
    } else {
      fetchPatients();
    }
  };

  const enableEdit = (id, type) => {
    setIsEditable(true);
    setIdToModify(id);
    setType(type);
  };

  const edit = () => {
    setIsEditable(false);
    setEditConfirmation(true);
  };

  const deletePatient = async (id) => {
    setShowConfirmation(true);
    setIdErase(id);
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(`/psychologists/delete-patient/${idErase}`);
      setShowConfirmation(false);
      fetchPatients();
      setAlerta({ message: "Paciente eliminado exitosamente", err: false });
    } catch (error) {
      setAlerta({
        message: "Hubo un error a la hora de eliminar el paciente",
        err: true,
      });
      throw error;
    }
  };

  const fetchPatients = async () => {
    if (localStorage.role === "administrador") {
      try {
        const response = await axiosClient.get(
          "/psychologists/get-admin-patients"
        );
        const patients = response.data;
        setDatos(patients);
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      }
    } else if(localStorage.role === "usuario"){
      try {
        const response = await axiosClient.get(
          `/psychologists/get-psychologist-patients/${localStorage.userEmail}`
        );
        const patients = response.data;
        setDatos(patients);
      } catch (error) {
        console.error("Error al obtener los pacientes:", error);
      }
    }
  };

  const fetchPatient = async (document) => {
    try {
      const response = await axiosClient.get(
        `/psychologists/get-patient-with-doc/${document}`
      );
      const patient = response.data;
      if (Object.keys(patient).length === 0) {
        throw error;
      } else {
        setDatos([patient]);
      }
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
      setAlerta({
        message: "El paciente no esta registrado",
        err: true,
      });
    }
  };

  const rowStyle = {
    backgroundColor: "#DEDEDE",
  };

  const handleNewValue = (event) => {
    setValue(event.target.value);
  };

  const editPatient = async () => {
    try {
      switch (type) {
        case "Nombre":
          await axiosClient.patch(
            `/psychologists/update-patient/${idToModify}`,
            {
              name: value,
            }
          );
          break;
        case "Documento":
          await axiosClient.patch(
            `/psychologists/update-patient/${idToModify}`,
            {
              document_number: value,
            }
          );
          break;
        case "Email":
          if (/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value)) {
            await axiosClient.patch(
              `/psychologists/update-patient/${idToModify}`,
              {
                email: value,
              }
            );
          } else {
            throw error;
          }
          break;
        case "Telefono":
          await axiosClient.patch(
            `/psychologists/update-patient/${idToModify}`,
            {
              phone: value,
            }
          );
          break;
        case "Direccion":
          await axiosClient.patch(
            `/psychologists/update-patient/${idToModify}`,
            {
              address: value,
            }
          );
          break;
        default:
          break;
      }
      setAlerta({
        message: "Cambios guardados exitosamente.",
        err: false,
      });
      setEditConfirmation(false);
      fetchPatients();
    } catch (error) {
      setAlerta({
        message: "Hubo un error en la edicion.",
        err: true,
      });
      throw error;
    }
  };

  const { message } = alerta;

  return (
    <div>
      {message && <Alerta alerta={alerta} />}
      <h1
        className="text-indigo-900 block text-6xl font-bold text-center float-left "
        style={styles}
      >
        Mis <span className="text-black">pacientes</span>
      </h1>
      <div className="float-right w-1/2 focus:outline-none py-2 px-4">
        <input
          type="text"
          placeholder="Documento"
          className=" border w-3/5 p-3  rounded-xl focus:ring-indigo-500 focus:border-indigo-500 mt-5 h-10"
          onChange={(e) => setDocToSearch(e.target.value)}
        />
        <button
          className="bg-black text-white my-5 mx-auto w-1/3 h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200 float-right"
          onClick={() => search()}
        >
          Buscar paciente
        </button>
      </div>

      <table className="table-auto border rounded-xl w-full border-gray-400 px-4 py-2 bg-gray-100 text-gray-800 text-center text-base flex-col sm:flex-row">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Documento</th>
            <th className="px-4 py-2">Correo</th>
            <th className="px-4 py-2">Teléfono</th>
            <th className="px-4 py-2">Dirección</th>
          </tr>
        </thead>
        <tbody className=" bg-slate-500">
          {datos.map((dato, index) => (
            <tr key={index} style={rowStyle}>
              <td className="border px-4 py-2">
                {isEditable && idToModify == dato.id && type == "Nombre" ? (
                  <input
                    className="w-full h-full border-collapse rounded-xl text-center"
                    type="text"
                    defaultValue={dato.name}
                    onChange={handleNewValue}
                  ></input>
                ) : (
                  <label onDoubleClick={() => enableEdit(dato.id, "Nombre")}>
                    {dato.name}
                  </label>
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditable && idToModify == dato.id && type == "Documento" ? (
                  <input
                    className="w-full h-full border-collapse rounded-xl text-center"
                    type="number"
                    defaultValue={dato.document_number}
                    onChange={handleNewValue}
                  ></input>
                ) : (
                  <label onDoubleClick={() => enableEdit(dato.id, "Documento")}>
                    {dato.document_number}
                  </label>
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditable && idToModify == dato.id && type == "Email" ? (
                  <input
                    className="w-full h-full border-collapse rounded-xl text-center"
                    type="email"
                    defaultValue={dato.email}
                    onChange={handleNewValue}
                  ></input>
                ) : (
                  <label onDoubleClick={() => enableEdit(dato.id, "Email")}>
                    {dato.email}
                  </label>
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditable && idToModify == dato.id && type == "Telefono" ? (
                  <input
                    className="w-full h-full border-collapse rounded-xl text-center"
                    type="number"
                    defaultValue={dato.phone}
                    onChange={handleNewValue}
                  ></input>
                ) : (
                  <label onDoubleClick={() => enableEdit(dato.id, "Telefono")}>
                    {dato.phone}
                  </label>
                )}
              </td>
              <td className="border px-4 py-2">
                {isEditable && idToModify == dato.id && type == "Direccion" ? (
                  <input
                    className="w-full h-full border-collapse rounded-xl text-center"
                    type="text"
                    defaultValue={dato.address}
                    onChange={handleNewValue}
                  ></input>
                ) : (
                  <label onDoubleClick={() => enableEdit(dato.id, "Direccion")}>
                    {dato.address}
                  </label>
                )}
              </td>
              <td className="border px-4 py-2 underline text-blue-800 cursor-pointer">
                <Delete
                  className="cursor-pointer float-left"
                  onClick={() => deletePatient(dato.id)}
                />
                {isEditable && idToModify == dato.id ? (
                  <Save className="cursor-pointer float-right" onClick={edit} />
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4">
                Seguro de que quiere borrar el paciente? De la misma manera,
                todas las citas e historias asociadas se eliminaran.
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleDelete}
                >
                  Sí
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setShowConfirmation(false)}
                >
                  No
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showEditConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4">Seguro de que quiere editar este paciente?</p>
              <div className="flex justify-end">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={editPatient}
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

export default SearchPatient;
