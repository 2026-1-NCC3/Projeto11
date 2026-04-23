"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listarPacientes } from "@/lib/pacientes";
import { Paciente } from "@/types/paciente";

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscar() {
      try {
        const lista = await listarPacientes();
        setPacientes(lista);
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar pacientes.");
      } finally {
        setCarregando(false);
      }
    }

    buscar();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard" className="text-teal-600 hover:underline">
            ← Voltar ao painel
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Pacientes</h1>
          <Link
            href="/dashboard/pacientes/novo"
            className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            + Novo paciente
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {carregando && <p className="text-gray-600">Carregando...</p>}

          {erro && <p className="text-red-600">{erro}</p>}

          {!carregando && !erro && pacientes.length === 0 && (
            <p className="text-gray-600">
              Nenhum paciente cadastrado ainda. Clique em "Novo paciente" para
              começar.
            </p>
          )}

          {!carregando && pacientes.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {pacientes.map((paciente) => (
                <li key={paciente.id}>
                  <Link
                    href={`/dashboard/pacientes/${paciente.id}`}
                    className="block py-4 hover:bg-gray-50 px-2 -mx-2 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {paciente.nome}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {paciente.telefone}
                          {paciente.email && ` · ${paciente.email}`}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          paciente.ativo
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {paciente.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
