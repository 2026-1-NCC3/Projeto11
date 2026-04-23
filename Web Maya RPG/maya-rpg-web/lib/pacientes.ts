import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Paciente } from "@/types/paciente";

export async function adicionarPaciente(
  dados: Omit<Paciente, "id" | "criadoEm" | "atualizadoEm">,
) {
  const docRef = await addDoc(collection(db, "pacientes"), {
    ...dados,
    criadoEm: serverTimestamp(),
    atualizadoEm: serverTimestamp(),
  });
  return docRef.id;
}

export async function listarPacientes(): Promise<Paciente[]> {
  const q = query(collection(db, "pacientes"), orderBy("nome"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Paciente, "id">),
  }));
}
export async function buscarPacientePorId(
  id: string,
): Promise<Paciente | null> {
  const docRef = doc(db, "pacientes", id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<Paciente, "id">),
  };
}
