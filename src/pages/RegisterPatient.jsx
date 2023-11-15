import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/axios";
const styles = { fontFamily: "Oleo Script" };

const RegisterPatient = () => {
  const [nombre, setNombre] = useState("");
  const [tipodoc, setTipoDoc] = useState(1);
  const [edad, setEdad] = useState("");
  const [documento, setDocumento] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const createPatient = async (patientData) => {
    try {
      const url = "/psychologists/create-patients";

      const response = await axiosClient.post(url, patientData);
      if (response.status !== 201) {
        throw new Error("Error al crear el paciente");
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    return emailRegex.test(email);
  };

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
    if (!nombre.trim()) {
      errorMessages.nombre = "El nombre es obligatorio";
    }
    if (!documento.trim()) {
      errorMessages.documento = "El documento es obligatorio";
    } else if (tipodoc !== 4 && isNaN(documento)) {
      errorMessages.documento = "El documento debe ser un número";
    }
    if (!edad.trim()) {
      errorMessages.edad = "La fecha de nacimiento es obligatoria";
    } else if (age < 5) {
      errorMessages.age = "La edad mínima permitida es 5 años";
    }
    if (!email.trim()) {
      errorMessages.email = "El correo electrónico es obligatorio";
    } else if (!validateEmail(email)) {
      errorMessages.email = "El formato del correo electrónico es inválido";
    }
    if (!telefono.trim()) {
      errorMessages.telefono = "El teléfono es obligatorio";
    } else if (isNaN(telefono) || telefono.length < 7 || telefono.length > 10) {
      errorMessages.telefono =
        "El teléfono debe contener entre 7 y 10 caracteres numericos";
    }
    if (!direccion.trim()) {
      errorMessages.direccion = "La dirección es obligatoria";
    }
    if (Object.keys(errorMessages).length > 0) {
      setErrors(errorMessages);
      return;
    }
    const patientData = {
      nombre,
      tipodoc,
      documento,
      date_of_birth: edad,
      email,
      telefono,
      direccion,
    };
    try {
      await createPatient(patientData);
      setErrors({});
      navigate("/home");
    } catch (error) {
      setErrors({ submit: "Error al crear el paciente" });
    }
  };

  return (
    <>
      {" "}
      <form
        className="bg-gray-300 rounded-xl my-2 md:my-4 xl:my-4 w-full sm:w-12/12 md:w-11/12 lg:w-9/12 xl:w-8/12 mx-auto p-8 shadow-lg"
        onSubmit={handleSubmit}
      >
        {" "}
        <div>
          {" "}
          <h1
            className="text-indigo-900 block text-8xl font-bold text-center "
            style={styles}
          >
            Registrar <span className="text-black">paciente</span>{" "}
          </h1>{" "}
        </div>{" "}
        <div className="my-8 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">Nombre</label>
          <input
            type="text"
            placeholder="Nombre del paciente"
            className="border w-full p-3 mt-3 rounded-xl"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />{" "}
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>{" "}
        <div className="my-5 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">
            Documento{" "}
          </label>{" "}
          <select
            name="Tipo"
            id="Tipo"
            className="border w-1/4 p-3 mt-3 rounded-xl"
            value={tipodoc}
            onChange={(e) => setTipoDoc(parseInt(e.target.value))}
          >
            <option value={1}>Cedula de Ciudadania</option>
            <option value={2}>Tarjeta de Identidad</option>{" "}
            <option value={3}>Cedula de Extranjeria</option>{" "}
            <option value={4}>Pasaporte</option>{" "}
          </select>
          <input
            type="text"
            placeholder="Num. de identidad"
            className="border w-3/4 p-3 mt-3 rounded-xl"
            value={documento}
            onChange={(e) => setDocumento(e.target.value)}
          />{" "}
          {errors.documento && (
            <p className="text-red-500 text-xs mt-1">{errors.documento}</p>
          )}{" "}
        </div>{" "}
        <div className="my-5 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">
            Fecha de nacimiento
          </label>{" "}
          <input
            type="date"
            placeholder="Fecha nacimiento"
            className="border w-full p-3 mt-3 rounded-xl"
            value={edad}
            onChange={(e) => setEdad(e.target.value)}
          />{" "}
          {errors.edad && (
            <p className="text-red-500 text-xs mt-1">{errors.edad}</p>
          )}
          {/* {" "} */}
          {errors.age && (
            <p className="text-red-500 text-xs mt-1">{errors.age}</p>
          )}
        </div>{" "}
        <div className="my-5 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">
            Correo
          </label>{" "}
          <input
            type="e-mail"
            placeholder="E-mail del paciente"
            className="border w-full p-3 mt-3 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />{" "}
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}{" "}
        </div>{" "}
        <div className="my-5 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">
            Telefono
          </label>{" "}
          <input
            type="text"
            placeholder="Telefono del paciente"
            className="border w-full p-3 mt-3 rounded-xl"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
          />{" "}
          {errors.telefono && (
            <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
          )}{" "}
        </div>{" "}
        <div className="my-5 mx-5">
          {" "}
          <label className="text-black block text-xl font-bold">
            Direccion{" "}
          </label>{" "}
          <input
            type="text"
            placeholder="Direccion del paciente"
            className="border w-full p-3 mt-3 rounded-xl"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
          />{" "}
          {errors.direccion && (
            <p className="text-red-500 text-xs mt-1">{errors.direccion}</p>
          )}{" "}
        </div>{" "}
        <input
          type="submit"
          value="Registrar"
          className="bg-black my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-200 text-white"
        />{" "}
        {errors.submit && (
          <p className="text-red-500 text-center mt-1">{errors.submit}</p>
        )}{" "}
      </form>{" "}
    </>
  );
};

export default RegisterPatient;
