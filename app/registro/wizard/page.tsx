'use client'
import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ArrowRight, ArrowLeft, ClipboardList, Info, Calendar, Activity, Lock, Loader2, Check } from 'lucide-react';

// Importamos la data de los flujos
import { flujoUrgencias } from '@/data/preguntas-urgencias';
import { flujoHospitalizacion } from '@/data/preguntas-hospitalizacion';
import { flujoCirugia } from '@/data/preguntas-cirugia';
import { flujoConsulta } from '@/data/preguntas-consulta';

export default function WizardPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center font-bold text-blue-900 flex justify-center"><Loader2 className="animate-spin mr-2" /> Cargando auditoría...</div>}>
      <FormularioAuditoria />
    </Suspense>
  );
}

function FormularioAuditoria() {
  const searchParams = useSearchParams();
  const router = useRouter(); 
  
  // Capturamos el flujo y el punto específico desde la URL
  const flujoId = searchParams.get('flujo'); 
  const puntoParam = searchParams.get('punto');
  const puntoIndex = puntoParam ? parseInt(puntoParam) : 0;
  
  // Clave única para el autoguardado de este formulario específico
  const draftKey = `draft_homi_${flujoId}_${puntoIndex}`;

  const topRef = useRef<HTMLDivElement>(null);

  const flujosData: Record<string, any> = {
    urgencias: flujoUrgencias,
    hospitalizacion: flujoHospitalizacion,
    cirugia: flujoCirugia,
    consulta: flujoConsulta
  };

  const flujoActivo = (flujoId && flujosData[flujoId]) ? flujosData[flujoId] : flujoUrgencias;
  const punto = flujoActivo.puntosControl[puntoIndex] || flujoActivo.puntosControl[0];

  const [preguntaActual, setPreguntaActual] = useState(0);
  const [fechaBogota, setFechaBogota] = useState('');
  const [cargandoEnvio, setCargandoEnvio] = useState(false);

  // --- NUEVO: Estado para almacenar el nombre del auditor silenciosamente ---
  const [auditorNombre, setAuditorNombre] = useState('Auditor Desconocido');

  // ESTADOS DE LOS INPUTS
  const [pacienteId, setPacienteId] = useState(''); 
  const [pacienteNombre, setPacienteNombre] = useState(''); 
  const [hallazgo, setHallazgo] = useState('');
  const [responsable, setResponsable] = useState('');
  const [evidencia, setEvidencia] = useState('');
  const [clasificacion, setClasificacion] = useState('');

  const [respuestasGuardadas, setRespuestasGuardadas] = useState<Record<string, any>>({});

  const esPrimeraPregunta = preguntaActual === 0;
  const esUltimaPregunta = preguntaActual === punto.preguntas.length - 1;

  const preguntaData = punto.preguntas[preguntaActual];
  const progreso = ((preguntaActual + 1) / punto.preguntas.length) * 100;

  useEffect(() => {
    // 1. Configurar fecha
    const date = new Date().toLocaleDateString("es-CO", { 
      timeZone: "America/Bogota",
      year: 'numeric', month: 'long', day: 'numeric' 
    });
    setFechaBogota(date);

    // --- NUEVO: Leer quién está logueado para registrarlo como auditor ---
    const userStr = localStorage.getItem('usuario_homi');
    if (userStr) {
      try {
        const userObj = JSON.parse(userStr);
        if (userObj.nombre) {
          setAuditorNombre(userObj.nombre);
        }
      } catch (e) {
        console.error("Error leyendo usuario", e);
      }
    }

    // 2. Leer si hay un borrador guardado
    const savedDraft = localStorage.getItem(draftKey);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.pacienteId) setPacienteId(parsed.pacienteId);
        if (parsed.pacienteNombre) setPacienteNombre(parsed.pacienteNombre);
        if (parsed.respuestasGuardadas) setRespuestasGuardadas(parsed.respuestasGuardadas);
        
        // Si había un progreso, saltar a esa pregunta y cargar sus datos
        if (parsed.preguntaActual !== undefined) {
          setPreguntaActual(parsed.preguntaActual);
          const key = `pregunta-${parsed.preguntaActual}`;
          const rep = parsed.respuestasGuardadas[key];
          setClasificacion(rep ? rep.clasificacion : '');
          setHallazgo(rep ? rep.hallazgo : '');
          setResponsable(rep ? rep.responsable : '');
          setEvidencia(rep ? rep.evidencia : '');
        }
      } catch (e) {
        console.error("Error leyendo autoguardado", e);
      }
    }
  }, [draftKey]);

  const cargarDatosPregunta = (respuestasDict: Record<string, any>, pPregunta: number) => {
    const key = `pregunta-${pPregunta}`;
    const rep = respuestasDict[key];
    setClasificacion(rep ? rep.clasificacion : '');
    setHallazgo(rep ? rep.hallazgo : '');
    setResponsable(rep ? rep.responsable : '');
    setEvidencia(rep ? rep.evidencia : '');
  };

  const handleSiguiente = async () => {
    // Validación de ID y Nombre en la primera pregunta
    if (esPrimeraPregunta && (!pacienteId || !pacienteNombre)) {
      alert("Por favor, ingrese la identificación y el nombre del paciente para continuar.");
      return;
    }

    if (!clasificacion) {
      alert("Por favor, seleccione una clasificación para el hallazgo.");
      return;
    }

    // 1. Guardar la respuesta actual en memoria
    const key = `pregunta-${preguntaActual}`;
    const respuestaActual = {
      punto_control: punto.nombre,
      pregunta: preguntaData.pregunta,
      clasificacion,
      hallazgo,
      responsable,
      evidencia
    };
    
    const nuevasRespuestas = { ...respuestasGuardadas, [key]: respuestaActual };
    setRespuestasGuardadas(nuevasRespuestas);

    // 2. Verificar si es la última pregunta del punto de control
    if (esUltimaPregunta) {
      await enviarASupabase(nuevasRespuestas);
      return;
    }

    // 3. Si no es el final, avanzamos a la siguiente pregunta
    const nextPregunta = preguntaActual + 1;
    setPreguntaActual(nextPregunta);
    
    // Guardar en el navegador (Autoguardado)
    localStorage.setItem(draftKey, JSON.stringify({
      pacienteId,
      pacienteNombre,
      respuestasGuardadas: nuevasRespuestas,
      preguntaActual: nextPregunta
    }));

    // Cargar datos si ya había respondido antes y se devolvió
    cargarDatosPregunta(nuevasRespuestas, nextPregunta);
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleAnterior = () => {
    if (preguntaActual > 0) {
      const prevPregunta = preguntaActual - 1;
      setPreguntaActual(prevPregunta);
      cargarDatosPregunta(respuestasGuardadas, prevPregunta);
      
      // Actualizar el autoguardado al retroceder
      localStorage.setItem(draftKey, JSON.stringify({
        pacienteId,
        pacienteNombre,
        respuestasGuardadas,
        preguntaActual: prevPregunta
      }));

      topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const enviarASupabase = async (todasLasRespuestas: Record<string, any>) => {
    setCargandoEnvio(true);
    try {
      const arrRespuestas = Object.values(todasLasRespuestas);
      const cantidadHallazgos = arrRespuestas.filter(r => r.clasificacion === 'No conformidad').length;
      const codigoGenerado = `AUD-${Math.floor(10000 + Math.random() * 90000)}`;

      // 1. Insertar Cabecera de Auditoría (AHORA ENVIANDO EL AUDITOR)
      const { data: auditData, error: auditError } = await supabase
        .from('auditorias')
        .insert([{
          codigo_auditoria: codigoGenerado,
          paciente_id: pacienteId,
          paciente_nombre: pacienteNombre, 
          flujo: flujoActivo.titulo,
          punto_control: punto.nombre,
          auditor_nombre: auditorNombre, // <-- DATO SILENCIOSO ENVIADO
          estado: cantidadHallazgos > 0 ? 'Pendiente' : 'Gestionado',
          cantidad_hallazgos: cantidadHallazgos
        }])
        .select();

      if (auditError) throw auditError;

      const auditoriaId = auditData[0].id;

      // 2. Preparar los detalles
      const insertRespuestas = arrRespuestas.map(r => ({
        auditoria_id: auditoriaId,
        punto_control: r.punto_control,
        pregunta: r.pregunta,
        clasificacion: r.clasificacion,
        hallazgo: r.hallazgo,
        responsable: r.responsable,
        evidencia: r.evidencia
      }));

      // 3. Insertar Respuestas
      const { error: respError } = await supabase
        .from('auditoria_respuestas')
        .insert(insertRespuestas);

      if (respError) throw respError;

      // Eliminar el borrador local porque ya se envió exitosamente
      localStorage.removeItem(draftKey);

      alert(`¡Auditoría guardada exitosamente! \nCódigo: ${codigoGenerado}`);
      router.push('/torre-control');

    } catch (error) {
      console.error('Error al guardar la auditoría:', error);
      alert('Hubo un error de conexión al intentar guardar la auditoría. Revisa tu base de datos.');
    } finally {
      setCargandoEnvio(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center relative">
      <div ref={topRef} className="absolute top-0 h-4 w-full"></div>

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all mt-4">
        
        {/* Cabecera */}
        <div className="bg-slate-900 px-8 py-6 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Activity className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider text-slate-400 uppercase mb-1">{flujoActivo.titulo}</p>
              <h2 className="text-2xl font-bold text-white">{punto.nombre}</h2>
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

        {/* Cuerpo del Formulario */}
        <div className="p-8 sm:p-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-bold mb-8">
            <ClipboardList className="w-4 h-4 mr-2" />
            Pregunta {preguntaActual + 1} de {punto.preguntas.length}
          </div>

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

          {/* CAMPOS DE ENTRADA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* CAMPO: IDENTIFICACIÓN */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                Identificación del paciente
              </label>
              <input 
                type="number" 
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                disabled={!esPrimeraPregunta} 
                placeholder="Ingrese número de documento"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  esPrimeraPregunta 
                    ? "border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900" 
                    : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                }`}
              />
            </div>

            {/* CAMPO: NOMBRE DEL PACIENTE */}
            <div>
              <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                Nombre del paciente
                {!esPrimeraPregunta && (
                  <span className="ml-2 flex items-center text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    <Lock size={12} className="mr-1" /> Bloqueado
                  </span>
                )}
              </label>
              <input 
                type="text" 
                value={pacienteNombre}
                onChange={(e) => setPacienteNombre(e.target.value)}
                disabled={!esPrimeraPregunta} 
                placeholder="Nombre completo"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${
                  esPrimeraPregunta 
                    ? "border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 text-slate-900" 
                    : "border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium"
                }`}
              />
            </div>

            <div className="md:col-span-2 mt-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Descripción del hallazgo</label>
              <textarea 
                rows={3}
                value={hallazgo}
                onChange={(e) => setHallazgo(e.target.value)}
                placeholder="Escriba aquí sus observaciones..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-colors outline-none text-slate-900"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Responsable del hallazgo</label>
              <input 
                type="text" 
                value={responsable}
                onChange={(e) => setResponsable(e.target.value)}
                placeholder="Nombre o cargo"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Evidencia (Registro/Documento)</label>
              <input 
                type="text" 
                value={evidencia}
                onChange={(e) => setEvidencia(e.target.value)}
                placeholder="Número de soporte"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Clasificación del hallazgo <span className="text-rose-500">*</span></label>
              <select 
                value={clasificacion}
                onChange={(e) => setClasificacion(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 cursor-pointer"
              >
                <option value="">Seleccione una clasificación...</option>
                <option value="Conformidad">✅ Conformidad (Cumple)</option>
                <option value="No conformidad">❌ No conformidad (No cumple)</option>
                <option value="No aplica">➖ No aplica</option>
              </select>
            </div>
          </div>
        </div>

        {/* Controles Inferiores */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-between items-center">
          <button 
            onClick={handleAnterior}
            disabled={esPrimeraPregunta || cargandoEnvio}
            className={`flex items-center space-x-2 px-5 py-2.5 rounded-lg font-semibold transition-all ${
              esPrimeraPregunta 
                ? 'text-slate-400 bg-slate-100 cursor-not-allowed' 
                : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={18} />
            <span>Anterior</span>
          </button>

          <button 
            onClick={handleSiguiente}
            disabled={cargandoEnvio}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg font-semibold text-white transition-all active:scale-95 ${
              esUltimaPregunta 
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
            }`}
          >
            {cargandoEnvio ? (
              <><Loader2 className="animate-spin" size={18} /> <span>Guardando...</span></>
            ) : esUltimaPregunta ? (
              <><span>Finalizar Auditoría</span> <Check size={18} /></>
            ) : (
              <><span>Siguiente</span> <ArrowRight size={18} /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}