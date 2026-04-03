'use client'
import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, ArrowLeft, ClipboardList, Info, Calendar, Activity } from 'lucide-react';

// Importamos la data de TODOS los flujos
import { flujoUrgencias } from '@/data/preguntas-urgencias';
import { flujoHospitalizacion } from '@/data/preguntas-hospitalizacion';
import { flujoCirugia } from '@/data/preguntas-cirugia';
import { flujoConsulta } from '@/data/preguntas-consulta';

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-blue-900">Cargando auditoría...</div>}>
      <FormularioAuditoria />
    </Suspense>
  );
}

function FormularioAuditoria() {
  const searchParams = useSearchParams();
  const flujoId = searchParams.get('flujo'); 

  // Referencia para el ancla del scroll automático
  const topRef = useRef<HTMLDivElement>(null);

  // Mapa dinámico con los 4 flujos listos
  const flujosData: Record<string, any> = {
    urgencias: flujoUrgencias,
    hospitalizacion: flujoHospitalizacion,
    cirugia: flujoCirugia,
    consulta: flujoConsulta
  };

  const flujoActivo = (flujoId && flujosData[flujoId]) ? flujosData[flujoId] : flujoUrgencias;

  const [puntoActual, setPuntoActual] = useState(0);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [fechaBogota, setFechaBogota] = useState('');

  const punto = flujoActivo.puntosControl[puntoActual];
  const preguntaData = punto.preguntas[preguntaActual];

  const progreso = ((preguntaActual + 1) / punto.preguntas.length) * 100;

  useEffect(() => {
    const date = new Date().toLocaleDateString("es-CO", { 
      timeZone: "America/Bogota",
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    setFechaBogota(date);
  }, []);

  const handleSiguiente = () => {
    if (preguntaActual < punto.preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
    } else if (puntoActual < flujoActivo.puntosControl.length - 1) {
      setPuntoActual(puntoActual + 1);
      setPreguntaActual(0);
    } else {
      alert("¡Auditoría Finalizada! Los datos se enviarán a la base de datos.");
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
    } else if (puntoActual > 0) {
      setPuntoActual(puntoActual - 1);
      setPreguntaActual(flujoActivo.puntosControl[puntoActual - 1].preguntas.length - 1);
    }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center relative">
      
      {/* ANCLA INVISIBLE PARA EL SCROLL */}
      <div ref={topRef} className="absolute top-0 h-4 w-full"></div>

      {/* Contenedor Principal */}
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all mt-4">
        
        {/* Cabecera */}
        <div className="bg-slate-900 px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">Auditoría en curso</p>
              <h2 className="text-2xl font-bold text-white">{flujoActivo.titulo}</h2>
            </div>
          </div>
          <div className="flex items-center text-slate-300 bg-slate-800 px-4 py-2 rounded-lg">
            <Calendar size={16} className="mr-2 text-slate-400" />
            <span className="text-sm font-medium">{fechaBogota}</span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full bg-slate-100 h-1.5">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-500 ease-in-out" 
            style={{ width: `${progreso}%` }}
          ></div>
        </div>

        {/* Cuerpo */}
        <div className="p-8 sm:p-10">
          
          {/* Indicador del Punto de Control */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-8">
            <ClipboardList className="w-4 h-4 mr-2" />
            {punto.nombre}
          </div>

          {/* Pregunta */}
          <div className="mb-10">
            <h3 className="text-3xl font-extrabold text-slate-900 leading-tight mb-6">
              {preguntaData.pregunta}
            </h3>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 flex items-start space-x-4">
              <Info className="text-blue-500 flex-shrink-0 mt-1" size={24} />
              <div className="space-y-3 text-sm text-slate-700">
                <p><strong className="text-slate-900">Prueba de auditoría:</strong> {preguntaData.prueba}</p>
                <p><strong className="text-slate-900">Criterio esperado:</strong> {preguntaData.criterio}</p>
              </div>
            </div>
          </div>

          <hr className="border-slate-100 mb-10" />

          {/* --- CAMPOS DE ENTRADA CORREGIDOS CON TEXTO OSCURO --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Identificación del paciente</label>
              <input 
                type="number" 
                placeholder="Solo números"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Tab') e.preventDefault();
                }}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción del hallazgo</label>
              <textarea 
                rows={3}
                placeholder="Escriba aquí sus observaciones..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none resize-none text-slate-900 placeholder-slate-400"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Responsable del hallazgo</label>
              <input 
                type="text" 
                placeholder="Nombre o cargo"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Evidencia del hallazgo</label>
              <input 
                type="text" 
                placeholder="Número de registro o documento"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none text-slate-900 placeholder-slate-400"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Clasificación del hallazgo</label>
              <select 
                defaultValue=""
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors outline-none cursor-pointer appearance-none text-slate-900"
              >
                <option value="" disabled className="text-slate-900">Seleccione una clasificación...</option>
                <option value="Conformidad" className="text-slate-900">✅ Conformidad (Cumple)</option>
                <option value="No conformidad" className="text-slate-900">❌ No conformidad (No cumple)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Controles Inferiores */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={handleAnterior}
            disabled={puntoActual === 0 && preguntaActual === 0}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              puntoActual === 0 && preguntaActual === 0 
                ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Anterior</span>
          </button>

          <span className="text-sm font-medium text-slate-500 hidden sm:block">
            Pregunta {preguntaActual + 1} de {punto.preguntas.length}
          </span>

          <button 
            onClick={handleSiguiente}
            className="flex items-center space-x-2 px-6 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-md transition-all active:scale-95"
          >
            <span>{preguntaActual === punto.preguntas.length - 1 && puntoActual === flujoActivo.puntosControl.length - 1 ? 'Finalizar' : 'Siguiente'}</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}