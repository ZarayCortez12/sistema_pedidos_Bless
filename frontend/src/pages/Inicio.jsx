import { useFormik } from "formik";
import * as yup from "yup";
import { FaIdCard } from "react-icons/fa6";
import { GrSecure } from "react-icons/gr";
import image from "../images/logo-bless.jpg";
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";

const validarDatos = yup.object().shape({
  numero_documento: yup
    .string()
    .matches(/^[0-9]+$/, "Solo se permiten números")
    .required("Debe ingresar un número de identificación"),
  clave: yup.string().required("Debe ingresar una contraseña"),
});

function Inicio() {
  const dispatch = useDispatch();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Organización Bless | Iniciar Sesión";
  }, []);

  const formik = useFormik({
    initialValues: {
      numero_documento: "",
      clave: "",
    },
    validationSchema: validarDatos,
    onSubmit: (values) => {
      setFormSubmitted(true);

      if (Object.keys(formik.errors).length === 0) {
        setLoading(true);
      }

      console.log(values);
    },
  });

  useEffect(() => {
    if (formSubmitted && Object.keys(formik.errors).length > 0) {
      const timer = setTimeout(() => {
        setFormSubmitted(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [formik.errors, formSubmitted]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row max-w-4xl w-full overflow-hidden min-h-[500px]">
        <div className="md:w-1/2 bg-white flex items-center justify-center">
          <div className="relative">
            <img
              src={image}
              alt="Logo Empresa"
              className="relative max-w-full h-auto object-contain z-10 scale-100 -mt-5"
            />
          </div>
        </div>

        <div className="md:w-1/2 bg-[#1a2e4c] p-12 lg:p-14 flex flex-col justify-center relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>

          <div className="mb-8 relative z-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight font-montserrat">
              Bienvenido
            </h2>
            <p className="text-blue-200/70 mt-2 text-sm font-inter">
              Ingresa tus credenciales para continuar
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setFormSubmitted(true);
              formik.handleSubmit(e);
            }}
            className="space-y-5 relative z-10"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-blue-100/80 ml-1 uppercase tracking-wider font-inter">
                Identificación
              </label>
              <div className="relative group mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-300 group-focus-within:text-white transition-colors">
                  <FaIdCard />
                </span>
                <input
                  type="text"
                  name="numero_documento"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                  placeholder="Número de documento"
                  className={`w-full pl-11 pr-4 py-3 bg-white/10 border rounded-xl text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 transition-all duration-300 font-inter${
                    formSubmitted && formik.errors.numero_documento
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-white/20 focus:ring-white/20 focus:bg-white/15"
                  }`}
                  {...formik.getFieldProps("numero_documento")}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-blue-100/80 ml-1 uppercase tracking-wider font-inter">
                Contraseña
              </label>
              <div className="relative group mt-1">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-blue-300 group-focus-within:text-white transition-colors">
                  <GrSecure />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="clave"
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 bg-white/10 border rounded-xl text-white placeholder:text-blue-300/50 focus:outline-none focus:ring-2 transition-all duration-300 ${
                    formSubmitted && formik.errors.clave
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-white/20 focus:ring-white/20 focus:bg-white/15"
                  }`}
                  {...formik.getFieldProps("clave")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-300 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="text-xl" />
                  ) : (
                    <IoEyeOutline className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                !formik.values.numero_documento ||
                !formik.values.clave ||
                !formik.isValid
              }
              className={`w-full font-bold py-3.5 rounded-xl transition-all duration-300 shadow-lg transform flex items-center justify-center mt-4 font-poppins
                            ${
                              loading ||
                              !formik.values.numero_documento ||
                              !formik.values.clave ||
                              !formik.isValid
                                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                : "bg-white text-[#1a2e4c] hover:bg-blue-50 active:scale-[0.98]"
                            }
                        `}
            >
              {loading ? (
                <div className="w-6 h-6 border-3 border-[#1a2e4c] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "ACCEDER"
              )}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-blue-200/40 text-[10px] uppercase tracking-[2px]">
              2026 &bull; Organización Bless
            </p>
          </footer>
        </div>
      </div>
      <ToastContainer theme="colored" />
    </div>
  );
}

export default Inicio;
