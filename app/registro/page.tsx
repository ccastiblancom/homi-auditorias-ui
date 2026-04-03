'use client'
import Link from 'next/link';
import { Activity, Building2, Stethoscope, HeartPulse, ArrowRight } from 'lucide-react';

export default function RegistroPage() {
  const flujos = [
    { 
      id: 'urgencias', 
      nombre: 'URGENCIAS', 
      descripcion: 'Auditoría de Triage, consulta y capacidad instalada.',
      icon: Activity, 
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-100'
    },
    { 
      id: 'hospitalizacion', 
      nombre: 'Hospitalización', 
      descripcion: 'Gestión de presalidas, egresos y estancias por diagnóstico.',
      icon: Building2, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-100'
    },
    { 
      id: 'cirugia', 
      nombre: 'Salas de cirugía', 
      descripcion: 'Programación quirúrgica, procedimientos y recuperación.',
      icon: HeartPulse, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    { 
      id: 'consulta', 
      nombre: 'Consulta Externa', 
      descripcion: 'Agendamiento, mallas, facturación y postconsulta.',
      icon: Stethoscope, 
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      borderColor: 'border-cyan-100'
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado de Sección */}
        <div className="mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registro de Auditoría</h2>
          <p className="mt-2 text-lg text-slate-600 font-medium">Seleccione el flujo core que desea auditar el día de hoy.</p>
        </div>

        {/* Rejilla de Tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {flujos.map((flujo) => {
            const Icon = flujo.icon;
            return (
              <Link 
                key={flujo.id} 
                href={`/registro/wizard?flujo=${flujo.id}`}
                className="group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Decoración de fondo al pasar el mouse */}
                <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${flujo.bgColor} opacity-0 group-hover:opacity-50 transition-opacity blur-2xl`}></div>

                <div>
                  <div className={`inline-flex p-4 rounded-2xl ${flujo.bgColor} ${flujo.color} mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{flujo.nombre}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {flujo.descripcion}
                  </p>
                </div>

                <div className="flex items-center text-blue-600 font-bold text-sm">
                  <span>Iniciar auditoría</span>
                  <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}