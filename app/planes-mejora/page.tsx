'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Search, Filter, Calendar, Target, CheckCircle, 
  ListChecks, Clock, Activity, AlertTriangle, ChevronRight,
  X, Hash, Users, Edit3, Trash2, Loader2, PlayCircle
} from 'lucide-react';

// Formateadores
const formatearFecha = (fechaISO: string) => {
  if (!fechaISO) return 'N/A';
  return new Date(fechaISO).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default function PlanesMejoraPage() {
  const [planes, setPlanes] = useState<any[]>([]);
  
  // --- NUEVO ESTADO PARA HALLAZGOS ESPECÍFICOS ---
  const [hallazgosDisponibles, setHallazgosDisponibles] = useState<any[]>([]);
  const [hallazgosSeleccionados, setHallazgosSeleccionados] = useState<any[]>([]);
  
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Modales
  const [modalCrear, setModalCrear] = useState(false);
  const [modalSeguimiento, setModalSeguimiento] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Formulario de Creación
  const [formPlan, setFormPlan] = useState({
    flujo: '',
    descripcion: '',
    fecha_cierre: '',
  });
  const [actividades, setActividades] = useState([{ id: Date.now(), desc: '', resp: '', completada: false }]);

  // Estado para Seguimiento
  const [planActivo, setPlanActivo] = useState<any>(null);
  const [nuevaFechaSeguimiento, setNuevaFechaSeguimiento] = useState('');

  // --- CARGA INICIAL DE DATOS ---
  useEffect(() => {
    fetchDatos();
  }, []);

  const fetchDatos = async () => {
    setCargando(true);
    try {
      // 1. Cargar Planes de Mejora
      const { data: dataPlanes, error: errorPlanes } = await supabase
        .from('planes_mejora')
        .select('*')
        .order('fecha_creacion', { ascending: false });
      
      if (errorPlanes) throw errorPlanes;
      if (dataPlanes) setPlanes(dataPlanes);

      // 2. NUEVO: Cargar RESPUESTAS con calificación "No Conforme" o "No Cumple"
      // Hacemos un join con la tabla 'auditorias' para traer el código asociado
      const { data: dataHallazgos, error: errorHallazgos } = await supabase
        .from('auditoria_respuestas')
        .select(`
          id,
          punto_control,
          hallazgo,
          clasificacion,
          auditorias (codigo_auditoria)
        `)
        .in('clasificacion', ['No Conforme', 'No Cumple']); // Filtramos solo los errores

      if (errorHallazgos) throw errorHallazgos;
      
      if (dataHallazgos) {
        // Formateamos la data para que sea fácil de mostrar
        const formateados = dataHallazgos.map((h: any) => ({
          id: h.id,
          codigo: h.auditorias?.codigo_auditoria || 'Sin Código',
          punto_control: h.punto_control,
          hallazgo: h.hallazgo || 'Sin observación registrada'
        }));
        setHallazgosDisponibles(formateados);
      }

    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setCargando(false);
    }
  };

  // --- LÓGICA DE CREACIÓN ---
  const agregarActividad = () => {
    setActividades([...actividades, { id: Date.now(), desc: '', resp: '', completada: false }]);
  };

  const quitarActividad = (id: number) => {
    if (actividades.length > 1) {
      setActividades(actividades.filter(act => act.id !== id));
    }
  };

  const actualizarActividad = (id: number, campo: string, valor: string) => {
    setActividades(actividades.map(act => act.id === id ? { ...act, [campo]: valor } : act));
  };

  const guardarNuevoPlan = async () => {
    if (!formPlan.flujo || !formPlan.descripcion || !formPlan.fecha_cierre || actividades.some(a => !a.desc || !a.resp)) {
      alert("Por favor, complete todos los campos obligatorios y asegúrese de que las actividades tengan descripción y responsable.");
      return;
    }

    if (hallazgosSeleccionados.length === 0) {
      alert("Debe asociar al menos un hallazgo/punto de control a este plan de mejora.");
      return;
    }

    setIsSaving(true);
    try {
      const codigoGenerado = `PM-${Math.floor(1000 + Math.random() * 9000)}`;
      
      const nuevoPlan = {
        codigo: codigoGenerado,
        flujo: formPlan.flujo,
        descripcion: formPlan.descripcion,
        fecha_cierre_estimada: formPlan.fecha_cierre,
        auditorias_asociadas: hallazgosSeleccionados, // <-- Ahora guarda el objeto completo (Código, Punto y Hallazgo)
        actividades: actividades,
        estado: 'Abierto',
        porcentaje_cumplimiento: 0
      };

      const { error } = await supabase.from('planes_mejora').insert([nuevoPlan]);
      if (error) throw error;

      alert(`Plan de Mejora ${codigoGenerado} creado exitosamente.`);
      setModalCrear(false);
      resetFormulario();
      fetchDatos();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Hubo un error al guardar el plan. Revise la consola.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetFormulario = () => {
    setFormPlan({ flujo: '', descripcion: '', fecha_cierre: '' });
    setHallazgosSeleccionados([]);
    setActividades([{ id: Date.now(), desc: '', resp: '', completada: false }]);
  };

  // --- LÓGICA DE SEGUIMIENTO ---
  const abrirSeguimiento = (plan: any) => {
    setPlanActivo(plan);
    setNuevaFechaSeguimiento(plan.proximo_seguimiento || '');
    setModalSeguimiento(true);
  };

  const toggleActividad = async (idActividad: number) => {
    const planActualizado = { ...planActivo };
    
    planActualizado.actividades = planActualizado.actividades.map((act: any) => 
      act.id === idActividad ? { ...act, completada: !act.completada } : act
    );

    const completadas = planActualizado.actividades.filter((a: any) => a.completada).length;
    const total = planActualizado.actividades.length;
    planActualizado.porcentaje_cumplimiento = total > 0 ? Math.round((completadas / total) * 100) : 0;

    setPlanActivo(planActualizado);
    setPlanes(planes.map(p => p.id === planActualizado.id ? planActualizado : p));

    await supabase
      .from('planes_mejora')
      .update({ 
        actividades: planActualizado.actividades,
        porcentaje_cumplimiento: planActualizado.porcentaje_cumplimiento
      })
      .eq('id', planActualizado.id);
  };

  const guardarSeguimiento = async () => {
    setIsSaving(true);
    try {
      let nuevoEstado = planActivo.porcentaje_cumplimiento === 100 ? 'Cerrado' : 'En seguimiento';
      
      const { error } = await supabase
        .from('planes_mejora')
        .update({ 
          proximo_seguimiento: nuevaFechaSeguimiento || null,
          estado: nuevoEstado
        })
        .eq('id', planActivo.id);

      if (error) throw error;
      
      setModalSeguimiento(false);
      fetchDatos();
      if (nuevoEstado === 'Cerrado') {
        alert("¡Felicidades! El plan ha alcanzado el 100% y se ha marcado como Cerrado.");
      }
    } catch (error) {
      alert("Error al guardar el seguimiento.");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FILTROS DE VISTA ---
  const planesFiltrados = planes.filter(p => {
    const coincideEstado = filtroEstado === 'Todos' || p.estado === filtroEstado;
    const coincideBusqueda = p.codigo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             p.flujo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    return coincideEstado && coincideBusqueda;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12 font-sans pb-20">
      
      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
            <Target className="mr-3 text-indigo-600" size={32} />
            Gestión de Planes de Mejora
          </h2>
          <p className="mt-2 text-lg text-slate-600 font-medium">Ciclo PHVA: Seguimiento y cierre efectivo de hallazgos.</p>
        </div>
        <button 
          onClick={() => setModalCrear(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold shadow-md shadow-indigo-200 transition-all active:scale-95 flex items-center"
        >
          <Plus size={20} className="mr-2" /> Nuevo Plan de Mejora
        </button>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar por código PM, flujo o descripción..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
          />
        </div>
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-indigo-500 w-full md:w-48 cursor-pointer"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En seguimiento">En Seguimiento</option>
            <option value="Cerrado">Cerrado Completado</option>
          </select>
        </div>
      </div>

      {/* PANEL DE CONTROL (TARJETAS DE PLANES) */}
      {cargando ? (
        <div className="flex justify-center items-center py-20 text-indigo-500"><Loader2 className="animate-spin" size={48}/></div>
      ) : planesFiltrados.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center text-slate-400">
          <ListChecks size={64} className="mb-4 opacity-50" />
          <p className="text-xl font-bold text-slate-600">No hay planes de mejora registrados.</p>
          <p>Crea tu primer plan con el botón superior.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {planesFiltrados.map((plan) => (
            <div key={plan.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center space-x-4">
                  <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-black text-lg border border-indigo-100">
                    {plan.codigo}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 flex items-center">{plan.flujo}</h4>
                    <p className="text-xs text-slate-500 flex items-center mt-1"><Calendar size={12} className="mr-1"/> Creado: {formatearFecha(plan.fecha_creacion)}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                  plan.estado === 'Cerrado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                  plan.estado === 'En seguimiento' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                  'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {plan.estado}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">{plan.descripcion}</p>
                
                {/* --- NUEVA VISUALIZACIÓN DE LOS HALLAZGOS ASOCIADOS --- */}
                {plan.auditorias_asociadas && plan.auditorias_asociadas.length > 0 && (
                  <div className="space-y-2 mb-6 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
                    <p className="text-[11px] font-bold text-rose-800 uppercase tracking-wider mb-2 flex items-center">
                      <AlertTriangle size={14} className="mr-1.5"/> Solucionando {plan.auditorias_asociadas.length} hallazgo(s):
                    </p>
                    <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                      {plan.auditorias_asociadas.map((item: any, i: number) => (
                        typeof item === 'string' ? ( // Retrocompatibilidad por si hay planes viejos
                          <span key={i} className="text-[10px] font-bold px-2 py-1 bg-white text-slate-500 rounded-md border border-slate-200 inline-flex items-center mr-2">
                            <Hash size={10} className="mr-1"/> {item}
                          </span>
                        ) : (
                          <div key={i} className="bg-white border border-rose-200 p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-black text-slate-800 flex items-center">
                              <span className="text-rose-600 mr-1.5 bg-rose-100 px-1.5 py-0.5 rounded text-[10px]">{item.codigo}</span> 
                              {item.punto_control}
                            </p>
                            <p className="text-[11px] text-slate-600 mt-1 italic line-clamp-2">"{item.hallazgo}"</p>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                )}

                {/* Barra de Progreso */}
                <div className="mt-auto">
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avance del Plan</p>
                    <p className={`text-lg font-black ${plan.porcentaje_cumplimiento === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                      {plan.porcentaje_cumplimiento}%
                    </p>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${plan.porcentaje_cumplimiento === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                      style={{ width: `${plan.porcentaje_cumplimiento}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center">
                <div className="flex items-center text-xs font-semibold text-slate-500">
                  <Clock size={14} className="mr-1.5 text-amber-500"/> 
                  {plan.proximo_seguimiento ? `Seguimiento: ${formatearFecha(plan.proximo_seguimiento)}` : 'Sin seguimiento programado'}
                </div>
                
                <button 
                  onClick={() => abrirSeguimiento(plan)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-700 text-slate-700 text-sm font-bold rounded-lg shadow-sm flex items-center transition-all"
                >
                  <PlayCircle size={16} className="mr-2"/> Gestionar
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* =========================================================
          MODAL 1: CREAR PLAN DE MEJORA
      ========================================================= */}
      {modalCrear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-indigo-900 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <Target className="text-indigo-400" size={28} />
                <div>
                  <h3 className="text-xl font-bold">Diseñar Plan de Mejora</h3>
                  <p className="text-indigo-200 text-sm">Formulación de acciones y responsables</p>
                </div>
              </div>
              <button onClick={() => setModalCrear(false)} className="text-indigo-200 hover:text-white transition-colors"><X size={28} /></button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto bg-slate-50 flex-1 space-y-6">
              
              {/* Sección 1: Datos Básicos */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center"><Activity size={18} className="mr-2 text-indigo-500"/> Información General</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Flujo Core</label>
                    <select 
                      value={formPlan.flujo} onChange={(e) => setFormPlan({...formPlan, flujo: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                    >
                      <option value="">Seleccione flujo afectado...</option>
                      <option value="Urgencias">Urgencias</option>
                      <option value="Hospitalización">Hospitalización</option>
                      <option value="Salas de cirugía">Salas de cirugía</option>
                      <option value="Consulta Externa">Consulta Externa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fecha Límite Global</label>
                    <input 
                      type="date" value={formPlan.fecha_cierre} onChange={(e) => setFormPlan({...formPlan, fecha_cierre: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Descripción del Problema Raíz / Justificación</label>
                  <textarea 
                    value={formPlan.descripcion} onChange={(e) => setFormPlan({...formPlan, descripcion: e.target.value})}
                    placeholder="Detalle el problema operativo que este plan pretende solucionar..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 h-24"
                  />
                </div>
              </div>

              {/* --- NUEVA SECCIÓN 2: ASOCIACIÓN DE HALLAZGOS (NO CONFORMES) --- */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center"><AlertTriangle size={18} className="mr-2 text-rose-500"/> Asociación de Hallazgos (No Conformes)</h4>
                
                <div className="flex gap-3 items-center">
                  <select 
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      if (selectedId && !hallazgosSeleccionados.find(h => h.id == selectedId)) {
                        const item = hallazgosDisponibles.find(h => h.id == selectedId);
                        if (item) setHallazgosSeleccionados([...hallazgosSeleccionados, item]);
                      }
                      e.target.value = '';
                    }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800"
                  >
                    <option value="">Seleccione los puntos de control que fallaron...</option>
                    {hallazgosDisponibles.map((h, i) => (
                      <option key={i} value={h.id}>[{h.codigo}] {h.punto_control}</option>
                    ))}
                  </select>
                </div>
                
                {/* Tarjetas de los hallazgos seleccionados */}
                {hallazgosSeleccionados.length > 0 && (
                  <div className="flex flex-col gap-3 mt-5">
                    {hallazgosSeleccionados.map(item => (
                      <div key={item.id} className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex justify-between items-start shadow-sm transition-all hover:border-rose-300">
                        <div className="pr-4">
                          <p className="font-black text-slate-800 text-sm flex items-center">
                            <span className="bg-rose-600 text-white px-2 py-0.5 rounded mr-2 text-[10px] tracking-wider uppercase shadow-sm">
                              {item.codigo}
                            </span>
                            {item.punto_control}
                          </p>
                          <p className="text-slate-600 text-sm mt-1.5 italic leading-relaxed">"{item.hallazgo}"</p>
                        </div>
                        <button 
                          onClick={() => setHallazgosSeleccionados(hallazgosSeleccionados.filter(i => i.id !== item.id))} 
                          className="text-rose-400 hover:text-white hover:bg-rose-500 bg-white border border-rose-200 rounded-full p-1.5 shadow-sm transition-colors"
                          title="Remover hallazgo"
                        >
                          <X size={16}/>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sección 3: Actividades Dinámicas */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                  <h4 className="font-bold text-slate-800 flex items-center"><Users size={18} className="mr-2 text-indigo-500"/> Plan de Acción (Actividades)</h4>
                  <button onClick={agregarActividad} className="text-xs font-bold bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-md hover:bg-indigo-100 flex items-center transition-colors">
                    <Plus size={14} className="mr-1"/> Agregar Tarea
                  </button>
                </div>
                
                <div className="space-y-4">
                  {actividades.map((act, index) => (
                    <div key={act.id} className="flex flex-col md:flex-row gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                      <div className="w-8 h-8 rounded-full bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-500 shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 w-full">
                        <input 
                          type="text" placeholder="Describa la actividad a realizar..." value={act.desc}
                          onChange={(e) => actualizarActividad(act.id, 'desc', e.target.value)}
                          className="w-full px-4 py-2.5 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 mb-3 text-sm font-medium"
                        />
                        <div className="flex items-center space-x-2">
                          <Users size={14} className="text-slate-400 shrink-0"/>
                          <input 
                            type="text" placeholder="Responsable (Ej: Coord. Calidad)" value={act.resp}
                            onChange={(e) => actualizarActividad(act.id, 'resp', e.target.value)}
                            className="w-full md:w-1/2 px-4 py-2 rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 outline-none text-slate-800 text-sm"
                          />
                        </div>
                      </div>
                      {actividades.length > 1 && (
                        <button onClick={() => quitarActividad(act.id)} className="md:absolute right-4 top-4 text-slate-300 hover:text-rose-500 transition-colors bg-white p-1.5 rounded-md shadow-sm border border-slate-100">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="bg-white p-6 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button onClick={() => setModalCrear(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancelar</button>
              <button onClick={guardarNuevoPlan} disabled={isSaving} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center">
                {isSaving ? <Loader2 className="animate-spin mr-2" size={20}/> : <CheckCircle className="mr-2" size={20}/>} Guardar Plan de Mejora
              </button>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================
          MODAL 2: GESTIÓN Y SEGUIMIENTO
      ========================================================= */}
      {modalSeguimiento && planActivo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white/10 rounded-xl"><Activity size={24} className="text-emerald-400"/></div>
                <div>
                  <h3 className="text-xl font-bold">Seguimiento Operativo</h3>
                  <p className="text-slate-400 text-sm">Plan: {planActivo.codigo} • {planActivo.flujo}</p>
                </div>
              </div>
              <button onClick={() => setModalSeguimiento(false)} className="text-slate-400 hover:text-white transition-colors"><X size={28} /></button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto bg-slate-50 flex-1 space-y-6">
              
              {/* Dashboard Interno */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Avance Actual</p>
                  <p className={`text-4xl font-black ${planActivo.porcentaje_cumplimiento === 100 ? 'text-emerald-500' : 'text-indigo-600'}`}>{planActivo.porcentaje_cumplimiento}%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Tareas Completadas</p>
                  <p className="text-xl font-bold text-slate-800">
                    {planActivo.actividades.filter((a:any)=>a.completada).length} <span className="text-slate-400 text-sm font-medium">de {planActivo.actividades.length}</span>
                  </p>
                </div>
              </div>

              {/* Checklist de Actividades */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h4 className="font-bold text-slate-800 border-b pb-2 mb-4 flex items-center"><ListChecks size={18} className="mr-2 text-indigo-500"/> Checklist de Actividades</h4>
                
                <div className="space-y-3">
                  {planActivo.actividades.map((act: any) => (
                    <label key={act.id} className={`flex items-start p-4 rounded-xl border cursor-pointer transition-colors group ${act.completada ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 hover:bg-slate-100 border-slate-200'}`}>
                      <div className="relative flex items-center justify-center w-6 h-6 mr-4 mt-0.5 shrink-0">
                        <input 
                          type="checkbox" 
                          checked={act.completada} 
                          onChange={() => toggleActividad(act.id)}
                          className="peer sr-only"
                        />
                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${act.completada ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300 peer-hover:border-indigo-400'}`}>
                          {act.completada && <CheckCircle size={16} className="text-white" strokeWidth={3}/>}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className={`font-semibold text-sm transition-all ${act.completada ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{act.desc}</p>
                        <p className={`text-xs mt-1 ${act.completada ? 'text-emerald-600/70' : 'text-slate-500 font-medium'}`}><Users size={12} className="inline mr-1"/> {act.resp}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Programar Siguiente Seguimiento */}
              {planActivo.porcentaje_cumplimiento < 100 && (
                <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-amber-900 flex items-center"><Clock size={18} className="mr-2 text-amber-600"/> Próximo Seguimiento</h4>
                    <p className="text-xs text-amber-700 mt-1">Programa cuándo se volverá a revisar este plan.</p>
                  </div>
                  <input 
                    type="date" 
                    value={nuevaFechaSeguimiento} 
                    onChange={(e) => setNuevaFechaSeguimiento(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border border-amber-300 bg-white text-amber-900 font-bold focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
                  />
                </div>
              )}

            </div>

            <div className="bg-white p-6 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button onClick={() => setModalSeguimiento(false)} className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Volver</button>
              <button 
                onClick={guardarSeguimiento} disabled={isSaving} 
                className={`px-8 py-3 rounded-xl font-bold shadow-md transition-all flex items-center ${planActivo.porcentaje_cumplimiento === 100 ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
              >
                {isSaving ? <Loader2 className="animate-spin mr-2" size={20}/> : <CheckCircle className="mr-2" size={20}/>} 
                {planActivo.porcentaje_cumplimiento === 100 ? 'Confirmar Cierre Total' : 'Guardar Seguimiento'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}