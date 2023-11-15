import React, { useEffect, useState } from "react";
import axiosClient from "../config/axios";
import { Delete } from "@material-ui/icons";
import { Link } from "react-router-dom";
import Alerta from "../components/Alerta";
const styles = { fontFamily: "Oleo Script" };

const SearchHistory = () => {
  const [datos, setDatos] = useState([]);
  const [alerta, setAlerta] = useState({});
  const [docToSearch, setDocToSearch] = useState("");
  const [showEraseConfirmation, setEraseConfirmation] = useState(false);
  const [idErase, setIdErase] = useState("");

  const fetchPatient = async (patientId) => {
    try {
      const response = await axiosClient.get(
        `/psychologists/get-patient/${patientId}`
      );
      const patient = response.data;
      return patient;
    } catch (error) {
      console.error("Error al obtener el paciente:", error);
      return null;
    }
  };

  const fetchMedicalRecords = async () => {
    try {
      let response = null;
      if(localStorage.role === 'administrador'){
        response = await axiosClient.get(
        "/psychologists/get-admin-medical-records"
      );
      } else if(localStorage.role === 'usuario') {
        response = await axiosClient.get(
          `/psychologists/get-psychologist-medical-records/${localStorage.userEmail}`
        );
      }
      
      const medicalRecords = response.data;
      for (let record of medicalRecords) {
        let patient = await fetchPatient(record.patient_id);
        record.name = patient.name;
        record.document_number = patient.document_number;
      }

      setDatos(medicalRecords);
      return medicalRecords;
    } catch (error) {
      console.error("Error al obtener los registros médicos:", error);
    }
  };

  const fetchMedicalRecByDocument = async (document) => {
    try {
      const response = await axiosClient.get(
        `/psychologists/get-medical-record-with-doc/${document}`
      );
      const medicalRecords = response.data;
      for (let i = 0; i < medicalRecords.length; i++) {
        let record = medicalRecords[i];
        let patient = await fetchPatient(record.patientid);
        record.name = patient.name;
        record.document_number = patient.document_number;
      }
      setDatos(medicalRecords);
      return medicalRecords;
    } catch (error) {
      console.error("Error al obtener los pacientes:", error);
      setAlerta({
        message: "La historia no existe",
        err: true,
      });
    }
  };

  useEffect(() => {
    fetchMedicalRecords();
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

  const deleteHistory = async (id) => {
    setEraseConfirmation(true);
    setIdErase(id);
  };

  const handleDelete = async () => {
    try {
      await axiosClient.delete(
        `/psychologists/delete-medical-record/${idErase}`
      );
      setEraseConfirmation(false);
      fetchMedicalRecords();
      setAlerta({ message: "Historia eliminada exitosamente", err: false });
    } catch (error) {
      setAlerta({
        message: "Hubo un error al eliminar la historia",
        err: true,
      });
      throw error;
    }
  };

  const rowStyle = {
    backgroundColor: "#DEDEDE",
  };

  const search = () => {
    if (docToSearch !== "") {
      fetchMedicalRecByDocument(docToSearch);
    } else {
      fetchMedicalRecords();
    }
  };

  const { message } = alerta;

  return (
    <div>
      {message && <Alerta alerta={alerta} />}
      <h1
        className="text-indigo-900 block text-6xl font-bold text-center float-left"
        style={styles}
      >
        Mis <span className="text-black">historias</span>
      </h1>
      <div className="float-right w-1/3 focus:outline-none py-2 px-4">
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
          Buscar historia
        </button>
      </div>
      <table className="table-auto w-full border-gray-400 px-4 py-2 bg-gray-100 text-gray-800 text-center text-base flex-col sm:flex-row">
        <thead>
          <tr>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Documento</th>
            <th className="px-4 py-2">Historias</th>
          </tr>
        </thead>

        <tbody className="bg-slate-500">
          {datos.map((dato, index) => (
            <tr key={index} style={rowStyle}>
              <td className="border px-4 py-2">{dato.name}</td>
              <td className="border px-4 py-2">{dato.document_number}</td>
              <td className="border px-4 py-2 underline cursor-pointer">
                <Link to={`/home/watch-history?patientId=${dato.id}`}>
                  Ver historia
                </Link>
              </td>
              <td>
                <Delete
                  className="cursor-pointer"
                  onClick={() => deleteHistory(dato.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showEraseConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow">
              <p className="mb-4">Seguro de que quiere borrar esta historia?</p>
              <div className="flex justify-end">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={handleDelete}
                >
                  Sí
                </button>
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                  onClick={() => setEraseConfirmation(false)}
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

export default SearchHistory;
