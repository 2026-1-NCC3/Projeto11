"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Maya RPG</h1>
            <p className="text-gray-600">Logado como: {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Sair
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Bem-vinda à sua clínica
          </h2>
          <p className="text-gray-600 mb-6">
            Aqui você vai gerenciar pacientes, prontuários e exercícios.
          </p>

          <Link
            href="/dashboard/pacientes"
            className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            Ver pacientes
          </Link>
        </div>
      </div>
    </div>
  );
}
