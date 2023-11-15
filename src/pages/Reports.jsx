import React, { useState, useEffect } from "react";
import axiosClient from "../config/axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import Modal from "../components/Modal";

const oleo = { fontFamily: "Oleo Script" };

const Reports = () => {
  const [datos, setDatos] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [salary, setSalary] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSalary(0);
    if(localStorage.role === 'usuario'){
      fetchPsychologistAgeReport();
    } else if (localStorage.role === 'administrador'){
      fetchAdminAgeReport();
    }

  }, []);

  const generateIcomeReport = () => {
    if (!startDate || !endDate) {
      setShowModal(true);
    } else {
      // Lógica para generar el reporte
      if(localStorage.role === 'usuario'){
        fetchPsychologistIcomeReport();
      } else if (localStorage.role === 'administrador'){
        fetchAdminIcomeReport();
      }
    }
  };

  //Reportes de edad para el administrador
  const fetchAdminAgeReport = async () => {
    try {
      const response = await axiosClient.get(
        "/psychologists/get-patients-by-age-admin"
      );
      const reports = response.data;
      setDatos(reports);
    } catch (error) {
      console.error(
        "Error al obtener el reporte de pacientes por su edad:",
        error
      );
    }
  };

  //Reportes de edad para un psicólogo
  const fetchPsychologistAgeReport = async () => {
    try {
      const response = await axiosClient.get(
        `/psychologists/get-patients-by-age-user/${localStorage.userEmail}`
      );
      const reports = response.data;
      setDatos(reports);
    } catch (error) {
      console.error(
        "Error al obtener el reporte de pacientes por su edad:",
        error
      );
    }
  };

  //Reportes de ingresos para el administrador
  const fetchAdminIcomeReport = async () => {
    const email = localStorage.userEmail;
    try {
      const response = await axiosClient.get(
        `/psychologists/get-income-by-appointments-admin?start_date=${startDate}&end_date=${endDate}`
      );
      const reports = response.data[0].totalIncomeSum;
      setSalary(reports);
    } catch (error) {
      console.error("Error al obtener el reporte de ingresos:", error);
    }
  };


  //Reportes de ingresos para un psicólogo
  const fetchPsychologistIcomeReport = async () => {
    const email = localStorage.userEmail;
    try {
      const response = await axiosClient.get(
        `/psychologists/get-income-by-appointments-psychologist?start_date=${startDate}&end_date=${endDate}&psychologist_email=${email}`
      );
      const reports = response.data[0].totalIncomeSum;
      setSalary(reports);
    } catch (error) {
      console.error("Error al obtener el reporte de ingresos:", error);
    }
  };

  const countValues = datos.map((item) => item.count);

  const pacientesPorEdad = countValues;
  // const ingresosGenerales = ;

  const pacientesPorEdadChart = {
    labels: ["0-20", "21-40", "41-60", "61-80", "80-100"],
    datasets: [
      {
        label: "Pacientes por edad",
        data: pacientesPorEdad,
        backgroundColor: "rgba(12, 59, 104, 0.8)",
        borderColor: "rgba(12, 59, 104, 1)",
        borderWidth: 1,
      },
    ],
  };

  const opciones = {
    scales: {
      y: {
        max: 30,
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  const styles = {
    fontFamily: "Oleo Script",
    fontSize: "24px",
    lineHeight: "36px",
    background: "#f0f0f0",
    padding: "20px",
    textAlign: "center",
  };

  return (
    <div style={{ background: "#f0f0f0" }} className="rounded-xl">
      <h1 style={oleo} className="text-8xl text-indigo-900">
        Reportes
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      ></div>
      <hr className="border-solid border-2 border-black" />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "3rem",
        }}
      >
        <div style={{ width: "45%" }}>
          <h2
            style={oleo}
            className="text-6xl text-indigo-900 align-content-center"
          >
            Pacientes por edad
          </h2>
          <Bar data={pacientesPorEdadChart} options={opciones} />
        </div>
        <hr
          style={{
            border: "none",
            borderLeft: "2px solid black",
            height: "300px",
            margin: "0 2rem",
          }}
        />
        <div style={{ width: "45%" }}>
          <h2 style={oleo} className="text-6xl text-indigo-900">
            Ingresos generales
          </h2>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              height: "60px",
              marginLeft: "10px",
            }}
          >
            <h3 className="text-2xl">Rango de fechas</h3>
          </div>
          <div
            style={{ display: "flex", alignItems: "center", height: "60px" }}
          >
            <input
              type="date"
              placeholder="Fecha inicial"
              style={{ width: "140px" }}
              className="border w-full p-3 mt-3 rounded-xl"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <div style={{ marginLeft: "10px" }}></div>
            <input
              type="date"
              placeholder="Fecha nacimiento"
              style={{ width: "140px" }}
              className="border w-full p-3 mt-3 rounded-xl"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            <div>
              <button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "#101010", // Color de fondo azul
                  color: "white", // Texto blanco
                  border: "none", // Sin borde
                  // padding: "10px", // Espacio interno
                  padding: "10px",
                  borderRadius: "5px", // Bordes redondeados
                  cursor: "pointer", // Cambio de cursor al pasar por encima
                  lineHeight: "1",
                }}
                // onClick={() => generateReport()}
                onClick={generateIcomeReport}
                // onClick={generarReporte}
              >
                Generar reporte
              </button>

              {showModal && (
                <div
                  style={{
                    backgroundColor: "#F5A9A9",
                    padding: "10px 5px ",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Modal title="Ingrese las fechas de inicio y fin">
                    <button
                      style={{
                        backgroundColor: "#FE2E2E",
                        color: "white",
                        borderRadius: "5px",
                        cursor: "pointer",
                        padding: "2px 10px ",
                      }}
                      onClick={() => setShowModal(false)}
                    >
                      Cerrar
                    </button>
                  </Modal>
                </div>
              )}
            </div>
          </div>
          <div style={{ ...oleo, fontSize: "1.5rem", lineHeight: "1.2", padding:'50px' }}>
            Los ingresos han sido de ${salary}.
          </div>
        </div>
      </div>
      <hr className="border-solid border-2 border-black" />
      <p
        style={{ ...styles, fontStyle: "italic", marginTop: "20px" }}
        className="rounded-xl"
      >
        En Psynergia nos preocupamos por tu profesión.
      </p>
    </div>
  );
};

export default Reports;
