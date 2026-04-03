import Link from 'next/link';
import { ClipboardCheck } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white text-gray-800 p-10">
      <div className="bg-blue-50 p-8 rounded-full mb-6">
        <ClipboardCheck size={80} className="text-blue-900" />
      </div>
      <h1 className="text-4xl font-bold text-blue-900 mb-4 text-center">
        Bienvenido al Sistema de Auditorías HOMI
      </h1>
      <p className="text-lg text-gray-600 mb-8 text-center max-w-2xl">
        Plataforma centralizada para la gestión, control y seguimiento de auditorías de los flujos Core (Urgencias, Hospitalización, Salas de Cirugía y Consulta Externa).
      </p>
      <Link
        href="/registro"
        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-transform hover:scale-105"
      >
        Comenzar Nueva Auditoría
      </Link>
    </div>
  );
}