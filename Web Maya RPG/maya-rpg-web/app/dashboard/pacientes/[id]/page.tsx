"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { buscarPacientePorId } from "@/lib/pacientes";
import { Paciente } from "@/types/paciente";

export default function DetalhePacientePage() {
  const params = useParams();
  const id = params.id as string;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscar() {
      try {
        const p = await buscarPacientePorId(id);
        if (!p) {
          setErro("Paciente não encontrado.");
        } else {
          setPaciente(p);
        }
      } catch (err) {
        console.error(err);
        setErro("Erro ao carregar paciente.");
      } finally {
        setCarregando(false);
      }
    }

    buscar();
  }, [id]);

  const formatarData = (dataIso: string) => {
    const [ano, mes, dia] = dataIso.split("-");
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/dashboard/pacientes"
            className="text-teal-600 hover:underline"
          >
            ← Voltar para a lista
          </Link>
        </div>

        {carregando && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">Carregando...</p>
          </div>
        )}

        {erro && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-red-600">{erro}</p>
          </div>
        )}

        {paciente && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {paciente.nome}
                </h1>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${
                    paciente.ativo
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {paciente.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>

            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Telefone</dt>
                <dd className="text-gray-800">{paciente.telefone}</dd>
              </div>

              {paciente.email && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                  <dd className="text-gray-800">{paciente.email}</dd>
                </div>
              )}

              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Data de nascimento
                </dt>
                <dd className="text-gray-800">
                  {formatarData(paciente.dataNascimento)}
                </dd>
              </div>

              {paciente.observacoes && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Observações
                  </dt>
                  <dd className="text-gray-800 whitespace-pre-wrap">
                    {paciente.observacoes}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
