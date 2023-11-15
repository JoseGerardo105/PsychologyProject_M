import React from "react";

function ChangePasswordInAccount() {
  return (
    <>
      <form
        classaction=""
        className="bg-gray-300 rounded-xl my-1 md:my-2 xl:my-4 w-full  lg:w-7/8 2xl:w-4/5 mx-auto p-8 shadow-lg"
      >
        <div>
          <h1 className="text-black block text-6xl font-bold text-center ">
            Cambiar Contraseña
          </h1>
        </div>

        <div>
          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">Introduce tu contraseña</label>
            <input
              type="password"
              placeholder="Introduce tu nueva contraseña"
              className="border w-full p-3 mt-3 rounded-xl"
            />
          </div>
          <div className="my-10 mx-5">
            <label className="text-black block text-xl font-bold">Confirma tu contraseña</label>
            <input
              type="password"
              placeholder="Confirma tu contraseña"
              className="border w-full p-3 mt-3 rounded-xl"
            />
          </div>
          <input
          type="submit"
          value="Cambiar contraseña"
          className="bg-black my-5 mx-auto w-full h-10 rounded-xl font-normal mt-5 hover:cursor-pointer hover:bg-gray-700 text-white"
        />
        </div>
      </form>
    </>
  );
}

export default ChangePasswordInAccount;
