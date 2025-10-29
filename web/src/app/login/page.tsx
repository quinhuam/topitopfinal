"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implementar autenticación real (NextAuth o endpoint propio)
    // Por ahora, redirige al dashboard tras "login"
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 xl:w-1/3 bg-white flex flex-col justify-center items-center p-8 sm:p-12 order-2 lg:order-1">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-center">
            <img src="/images/logocatalogo-DOgmBwgp.jpg" alt="Topitop Catalogo Logo" className="w-50 mb-8" />
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-1">Bienvenida a Topitop catálogo</h2>
          <p className="text-gray-600 mb-6">Si ya eres asociada y tienes una cuenta creada</p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="dni">
                Iniciar sesión
              </label>
              <input className="appearance-none bg-transparent border-b-2 w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:border-red-500" id="dni" type="text" placeholder="D.N.I" />
            </div>
            <div className="relative">
              <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="password">
                Contraseña
              </label>
              <input className="appearance-none bg-transparent border-b-2 w-full py-2 px-1 text-gray-700 leading-tight focus:outline-none focus:border-red-500" id="password" type={passwordVisible ? "text" : "password"} placeholder="**************" />
              <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center text-sm leading-5">
                <span className="h-5 w-5 text-gray-500">{passwordVisible ? "🙈" : "👁️"}</span>
              </button>
            </div>
            <Link className="inline-block align-baseline text-xs text-gray-500 hover:text-red-600" href="#">
              ¿Olvidaste tu contraseña?
            </Link>

            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300" type="submit">
              INGRESA A TU CUENTA
            </button>
          </form>

          <p className="text-xs text-gray-500 mt-6">
            Si necesitas ayuda, escríbenos a nuestra línea de <a href="#" className="underline">Whatsapp aquí</a>
          </p>
        </div>
      </div>

      <div className="relative w-full lg:w-1/2 xl:w-2/3 bg-cover bg-center order-1 lg:order-2 min-h-[300px] lg:min-h-screen" style={{ backgroundImage: "url('/images/port-2.jpg')" }}>
        <div className="absolute top-0 right-0 p-6 flex space-x-6 w-full justify-end">
          <Link href="#" className="font-bold text-gray-800 hover:text-red-600">AFÍLIATE</Link>
          <Link href="#" className="font-bold text-gray-800 hover:text-red-600">CONTÁCTANOS</Link>
        </div>
      </div>
    </div>
  );
}
