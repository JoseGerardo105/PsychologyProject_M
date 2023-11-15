import React, { useState, useEffect } from "react";
import { Autocomplete } from "@material-ui/lab";
import { TextField } from "@material-ui/core";
import axiosClient from "../config/axios";
import Alerta from "../components/Alerta";
const styles = { fontFamily: "Oleo Script" };

const CreateHistory = () => {
  const [patientId, setPatientId] = useState("");
  const [doc, setDoc] = useState("");
  const [edad, setEdad] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [genero, setGenero] = useState("Masculino");
  const [estadocivil, setEstadoCivil] = useState("Soltero");
  const [antMed, setAntMed] = useState("");
  const [antPsi, setAntPsi] = useState("");
  const [plan, setPlan] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [patientError, setPatientError] = useState("");
  const [alerta, setAlerta] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorMessages = {};
    const today = new Date();
    const birthDate = new Date(edad);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (!patientId) {
      setPatientError("Por favor, selecciona un paciente.");
    } else {
      setPatientError("");
    }
    if (!doc.trim()) errorMessages.doc = "El documento es obligatorio";
    if (!edad.trim()) {
      errorMessages.edad = "La fecha de nacimiento es obligatoria";
    } else if (age < 5) {
      errorMessages.age = "La edad mínima permitida es 5 años";
    }
    if (!ocupacion.trim()) {
      errorMessages.ocupacion = "La ocupación es obligatoria";
    } else if (/\d/.test(ocupacion)) {
      errorMessages.ocupacion =
        "La ocupación no debe contener caracteres numéricos";
    }
    if (!genero.trim()) errorMessages.genero = "El género es obligatorio";
    if (!estadocivil.trim())
      errorMessages.estadocivil = "El estado civil es obligatorio";
    if (!antMed.trim())
      errorMessages.antMed = "Los antecedentes médicos son obligatorios";
    if (!antPsi.trim())
      errorMessages.antPsi = "Los antecedentes psicológicos son obligatorios";
    if (!plan.trim())
      errorMessages.plan = "El plan de tratamiento es obligatorio";
    if (!observaciones.trim())
      errorMessages.observaciones = "Las observaciones son obligatorias";
    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }
    const newPatient = patients && patients.find((p) => p.id === patientId);
    try {
      const medicalRecordData = {
        patient_id: newPatient.id,
        ocupation: ocupacion,
        gender: genero,
        marital_status: estadocivil,
        medical_history: antMed,
        psychological_history: antPsi,
        treatment_plan: plan,
        observations: observaciones,
      };
      await axiosClient.post(
        "/psychologists/create-medical-records",
        medicalRecordData
      );
      setAlerta({
        message: "Historia creada exitosamente",
        err: false,
      });
      setErrors({});
    } catch (error) {
      setErrors({ submitError: "Error al crear la historia" });
      setAlerta({
        message: "Hubo un error a la hora de crear la historia",
        err: true,
      });
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await axiosClient.get(`/psychologists/get-psychologist-patients/${localStorage.userEmail}`);
      const patients = response.data;
      setPatients(patients);

      return patients;
    } catch (error) {
      console.error('error',error);
    }
  };
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

  const { message } = alerta;

  return (
    <>
      {" "}
      <form
        className="bg-gray-300 rounded-xl my-2 md:my-4 xl:my-4 w-full sm:w-12/12 md:w-11/12 lg:w-9/12 xl:w-8/12 mx-auto p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        {message && <Alerta alerta={alerta} />}{" "}
        <div>
          {" "}
          <div>
            {" "}
            <h1
              className="text-indigo-900 block text-8xl font-bold text-center "
              style={styles}
            >
              {" "}
              Nueva <span className="text-black">historia</span>{" "}
            </h1>{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <div className="flex justify-between">
              {" "}
              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Paciente:{" "}
                </label>{" "}
                <Autocomplete
                  id="patientId"
                  className=" w-full  mt-2 rounded-xl"
                  options={patients}
                  getOptionLabel={(option) => (option ? option.name : "")}
                  value={patients.find((p) => p.id === patientId) || null}
                  onChange={(event, newValue) => {
                    const fechaNacimiento = new Date(newValue.date_of_birth);
                    const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10);
                    setPatientId(newValue ? newValue.id : null);
                    setDoc(newValue ? newValue.document_number : "");
                    setEdad(newValue ? fechaFormateada : "");

                    if (newValue) {
                      setPatientError("");
                    }
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      style={{ backgroundColor: "white" }}
                    />
                  )}
                />
                {patientError && (
                  <p className="text-red-500 text-xs mt-1">{patientError}</p>
                )}{" "}
              </div>{" "}

              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Documento{" "}
                </label>{" "}
                <input
                  type="text"
                  placeholder="N. de documento"
                  className="border w-full p-3 mt-3 rounded-xl"
                  value={doc}
                  //onChange={(e) => setDoc(e.target.value)}
                  readOnly
                />{" "}
                {errors.doc && (
                  <p className="text-red-500 text-xs mt-1">{errors.doc}</p>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}

          <div className="my-5 mx-5">
            {" "}
            <div className="flex justify-between">
              {" "}
              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Fecha de nacimiento{" "}
                </label>{" "}
                <input
                  type="date"
                  placeholder="Fecha de nacimiento"
                  className="border w-full p-3 mt-3 rounded-xl"
                  value={edad}
                  readOnly
                  // onChange={(e) => setEdad(e.target.value)}
                />{" "}
                {errors.edad && (
                  <p className="text-red-500 text-xs mt-1">{errors.edad}</p>
                )}
                {errors.age && (
                  <p className="text-red-500 text-xs mt-1">{errors.age}</p>
                )}
              </div>{" "}
              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Ocupacion{" "}
                </label>{" "}
                <input
                  type="text"
                  placeholder="Ocupacion"
                  className="border w-full p-3 mt-3 rounded-xl"
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                />{" "}
                {errors.ocupacion && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.ocupacion}
                  </p>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <div className="flex justify-between">
              {" "}
              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Genero{" "}
                </label>{" "}
                <select
                  name="Genero"
                  id="Genero"
                  className="border w-full p-3 mt-3 rounded-xl"
                  value={genero}
                  onChange={(e) => setGenero(e.target.value)}
                >
                  {" "}
                  <option value="Masculino">Masculino</option>{" "}
                  <option value="Femenino">Femenino</option>{" "}
                  <option value="Otro">NS/NR</option>{" "}
                </select>{" "}
                {errors.genero && (
                  <p className="text-red-500 text-xs mt-1">{errors.genero}</p>
                )}{" "}
              </div>{" "}
              <div className="w-5/12">
                {" "}
                <label className="text-black block text-xl font-bold">
                  {" "}
                  Estado civil{" "}
                </label>{" "}
                <select
                  name="EstadoCivil"
                  id="EstadoCivil"
                  className="border w-full p-3 mt-3 rounded-xl"
                  value={estadocivil}
                  onChange={(e) => setEstadoCivil(e.target.value)}
                >
                  <option value="Soltero">Soltero/a</option>{" "}
                  <option value="Casado">Casado/a</option>{" "}
                  <option value="Divorciado">Divorciado/a</option>{" "}
                  <option value="Viudo">Viudo/a</option>{" "}
                </select>
                {errors.estadocivil && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.estadocivil}
                  </p>
                )}{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <label className="text-black block text-xl font-bold">
              {" "}
              Antecedentes médicos{" "}
            </label>{" "}
            <textarea
              className="border w-full h-20 p-3 mt-3 rounded-xl"
              name="Antecedentes medicos"
              placeholder="Introduce los antecedentes médicos..."
              id="antecedentesmed"
              cols="30"
              rows="10"
              value={antMed}
              onChange={(e) => setAntMed(e.target.value)}
            ></textarea>{" "}
            {errors.antMed && (
              <p className="text-red-500 text-xs mt-1">{errors.antMed}</p>
            )}{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <label className="text-black block text-xl font-bold">
              {" "}
              Antecedentes psicológicos{" "}
            </label>{" "}
            <textarea
              className="border w-full h-20 p-3 mt-3 rounded-xl"
              name="Antecedentes psicológicos"
              placeholder="Introduce los antecedentes psicológicos..."
              id="antecedentespsi"
              cols="30"
              rows="10"
              value={antPsi}
              onChange={(e) => setAntPsi(e.target.value)}
            ></textarea>{" "}
            {errors.antPsi && (
              <p className="text-red-500 text-xs mt-1">{errors.antPsi}</p>
            )}{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <label className="text-black block text-xl font-bold">
              {" "}
              Plan de tratamiento{" "}
            </label>{" "}
            <textarea
              className="border w-full h-20 p-3 mt-3 rounded-xl"
              name="Plan de tratamiento"
              placeholder="Plan de tratamiento"
              id="plantrata"
              cols="30"
              rows="10"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            ></textarea>{" "}
            {errors.plan && (
              <p className="text-red-500 text-xs mt-1">{errors.plan}</p>
            )}{" "}
          </div>{" "}
          <div className="my-5 mx-5">
            {" "}
            <label className="text-black block text-xl font-bold">
              {" "}
              Observaciones{" "}
            </label>{" "}
            <textarea
              className="border w-full h-20 p-3 mt-3 rounded-xl"
              name="Observaciones"
              placeholder="Observaciones"
              id="observaciones"
              cols="30"
              rows="10"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            ></textarea>{" "}
            {errors.observaciones && (
              <p className="text-red-500 text-xs mt-1">
                {errors.observaciones}
              </p>
            )}{" "}
          </div>{" "}
          <input
            type="submit"
            value="Registrar historia"
            className="bg-black my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200 text-white"
          />{" "}
          {errors.submit && (
            <p className="text-red-500 text-xs mt-1">{errors.submitError}</p>
          )}{" "}
        </div>{" "}
      </form>{" "}
    </>
  );
};

export default CreateHistory;
