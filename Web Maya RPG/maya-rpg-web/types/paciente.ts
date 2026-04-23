import { Timestamp } from "firebase/firestore";

export type Paciente = {
  id?: string;
  nome: string;
  email?: string;
  telefone: string;
  dataNascimento: string;
  observacoes?: string;
  ativo: boolean;
  criadoEm?: Timestamp;
  atualizadoEm?: Timestamp;
};
