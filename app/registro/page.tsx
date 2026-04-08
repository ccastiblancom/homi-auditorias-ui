'use client'
import { useState } from 'react';
import Link from 'next/link';
import { 
  Activity, 
  Building2, 
  Stethoscope, 
  HeartPulse, 
  ArrowRight, 
  ArrowLeft,
  ClipboardCheck
} from 'lucide-react';

// Importamos la data real para generar las tarjetas de los puntos de control dinámicamente
import { flujoUrgencias } from '../../data/preguntas-urgencias';
import { flujoHospitalizacion } from '../../data/preguntas-hospitalizacion';
import { flujoConsulta } from '../../data/preguntas-consulta';
import { flujoCirugia } from '../../data/preguntas-cirugia';

// Mapa de datos para acceder fácilmente según el ID del flujo
const MAPA_DATOS: Record<string, any> = {
  urgencias: flujoUrgencias,
  hospitalizacion: flujoHospitalizacion,
  consulta: flujoConsulta,
  cirugia: flujoCirugia
};

export default function RegistroPage() {
  // Estado para saber si estamos en la vista principal o viendo los puntos de un flujo específico
  const [flujoSeleccionado, setFlujoSeleccionado] = useState<string | null>(null);

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

  // Si hay un flujo seleccionado, buscamos su información
  const flujoActual = flujoSeleccionado ? flujos.find(f => f.id === flujoSeleccionado) : null;
  const puntosDeControl = flujoSeleccionado ? MAPA_DATOS[flujoSeleccionado]?.puntosControl || [] : [];

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        
        {/* --- VISTA 1: SELECCIÓN DE FLUJO CORE --- */}
        {!flujoSeleccionado && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-12">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Registro de Auditoría</h2>
              <p className="mt-2 text-lg text-slate-600 font-medium">Seleccione el flujo core que desea auditar el día de hoy.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {flujos.map((flujo) => {
                const Icon = flujo.icon;
                return (
                  <button 
                    key={flujo.id} 
                    onClick={() => setFlujoSeleccionado(flujo.id)}
                    className="group relative bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between overflow-hidden text-left w-full"
                  >
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
                      <span>Ver puntos de control</span>
                      <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- VISTA 2: SELECCIÓN DE PUNTO DE CONTROL --- */}
        {flujoSeleccionado && flujoActual && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Cabecera con botón de retroceso */}
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <button 
                  onClick={() => setFlujoSeleccionado(null)}
                  className="flex items-center text-slate-500 hover:text-blue-600 font-semibold mb-4 transition-colors bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow active:scale-95 w-fit"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Volver a Flujos
                </button>
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${flujoActual.bgColor} ${flujoActual.color}`}>
                    <flujoActual.icon size={28} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{flujoActual.nombre}</h2>
                    <p className="mt-1 text-slate-600 font-medium">Seleccione el Punto de Control a evaluar ({puntosDeControl.length} disponibles)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rejilla de Puntos de Control */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {puntosDeControl.map((punto: any, index: number) => (
                <Link 
                  key={index}
                  href={`/registro/wizard?flujo=${flujoSeleccionado}&punto=${index}`}
                  className="group bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-slate-100 text-slate-600 p-2.5 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <ClipboardCheck size={24} />
                      </div>
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-3 py-1 rounded-full group-hover:bg-blue-100 group-hover:text-blue-700 transition-colors">
                        Módulo {index + 1}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                      {punto.nombre}
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Contiene {punto.preguntas.length} {punto.preguntas.length === 1 ? 'pregunta' : 'preguntas'} de auditoría.
                    </p>
                  </div>
                  
                  <div className="w-full bg-slate-50 group-hover:bg-blue-600 text-slate-600 group-hover:text-white py-2.5 rounded-xl font-bold text-sm flex items-center justify-center transition-colors">
                    Iniciar Evaluación
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}