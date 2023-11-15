import { Outlet } from "react-router-dom";
const styles = { fontFamily: "Oleo Script" };
const AuthLayout = () => {
  return (
    <>
      {" "}
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>{" "}
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="true"
      ></link>{" "}
      <link
        href="https://fonts.googleapis.com/css2?family=Oleo+Script&amp;&amp;family=Sofia+Sans:ital,wght@1,100&amp;&amp;display=swap"
        rel="stylesheet"
      ></link>{" "}
      <main className="container mx-auto my-1 md:my-2 xl:my-4 lg:my-16 xl:my-20 p-4 md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 md:gap-24 lg:gap-32">
        {" "}
        <div className="text-slate-950 font-black text-7xl">
          {" "}
          <h1 style={styles}>
            {" "}
            <span className="text-indigo-900">Psy</span>nergia{" "}
          </h1>{" "}
          <br /> <br />{" "}
          <h1 className="align-middle font-normal text-2xl md:text-3xl lg:text-4xl mb-10">
            {" "}
            Tus citas, <br /> tus pacientes, <br />{" "}
            <span className="text-indigo-700 ">
              {" "}
              De una manera <br /> rapida y sencilla.{" "}
            </span>{" "}
          </h1>{" "}
        </div>{" "}
        <Outlet />{" "}
      </main>{" "}
    </>
  );
};
export default AuthLayout;
