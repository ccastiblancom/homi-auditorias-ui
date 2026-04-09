'use client'
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Filter, 
  Eye, 
  Edit3, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  Users,
  AlertTriangle,
  ArrowUpRight,
  X, 
  FileText, 
  CheckSquare, 
  ChevronRight, 
  Hash, 
  CheckSquare2,
  Loader2,
  Trash2,
  Calendar,
  User,
  Award 
} from 'lucide-react';

// --- FUNCIONES AUXILIARES DE FORMATO ---
const formatearFecha = (fechaISO: string) => {
  if (!fechaISO) return 'N/A';
  const fecha = new Date(fechaISO);
  return fecha.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatearNombreAuditor = (nombreCompleto: string) => {
  if (!nombreCompleto) return 'No registrado';
  const partes = nombreCompleto.trim().split(' ');
  if (partes.length >= 2) {
    return `${partes[0]} ${partes[1]}`; 
  }
  return nombreCompleto;
};

// --- COMPONENTE PRINCIPAL SEPARADO PARA SOPORTAR USE_SEARCH_PARAMS ---
function TorreControlContent() {
  const searchParams = useSearchParams();
  const queryBuscador = searchParams.get('q') || '';

  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estado para almacenar el rol del usuario
  const [usuarioActual, setUsuarioActual] = useState({ rol: '' });

  // Iniciamos el término de búsqueda con lo que venga de la cabecera
  const [searchTerm, setSearchTerm] = useState(queryBuscador);
  const [filtroEstado, setFiltroEstado] = useState('Todos los Estados');
  
  // Actualizamos el buscador si el usuario hace una nueva búsqueda desde la cabecera estando en esta misma página
  useEffect(() => {
    if (queryBuscador) {
      setSearchTerm(queryBuscador);
    }
  }, [queryBuscador]);

  // Estados para los Modales
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalFormular, setModalFormular] = useState(false);
  const [modalCerrar, setModalCerrar] = useState(false);
  
  // Estados para el Modal de Eliminar
  const [modalEliminar, setModalEliminar] = useState(false);
  const [auditoriaAEliminar, setAuditoriaAEliminar] = useState<any>(null);
  const [cargandoEliminar, setCargandoEliminar] = useState(false);
  
  // Estados de datos activos
  const [auditoriaActiva, setAuditoriaActiva] = useState<any>(null);
  const [tabActivo, setTabActivo] = useState(0);
  const [codigoGenerado, setCodigoGenerado] = useState('');

  // Estados para LA CALIFICACIÓN EN TIEMPO REAL
  const [scoreActivo, setScoreActivo] = useState<number>(0);
  const [rankingActivo, setRankingActivo] = useState<string>('');

  // Estados para Detalles y Formularios
  const [detallesOjo, setDetallesOjo] = useState<any[]>([]);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [formPlan, setFormPlan] = useState({ plan: '', responsable: '', fecha: '' });
  const [formCierre, setFormCierre] = useState({ actividades: '', evidencia: '' });

  // 1. CARGAR DATOS DE SUPABASE Y ROL AL INICIO
  useEffect(() => {
    fetchAuditorias();
    
    const userStr = localStorage.getItem('usuario_homi');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUsuarioActual({ rol: userObj.rol });
    }
  }, []);

  const fetchAuditorias = async () => {
    try {
      setCargando(true);
      const { data, error } = await supabase
        .from('auditorias')
        .select('*')
        .order('fecha_creacion', { ascending: false });

      if (error) throw error;
      if (data) setAuditorias(data);
    } catch (error) {
      console.error('Error cargando auditorías:', error);
    } finally {
      setCargando(false);
    }
  };

  // --- CÁLCULO DINÁMICO DE ESTADÍSTICAS ---
  const totalAuditorias = auditorias.length;
  const pendientes = auditorias.filter(a => a.estado === 'Pendiente').length;
  const totalHallazgos = auditorias.reduce((sum, a) => sum + (a.cantidad_hallazgos || 0), 0);
  const auditoriasSinHallazgos = auditorias.filter(a => a.cantidad_hallazgos === 0).length;
  const efectividad = totalAuditorias > 0 ? Math.round((auditoriasSinHallazgos / totalAuditorias) * 100) : 0;

  const stats = [
    { label: 'Total Auditorías', value: totalAuditorias, icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendientes Gestión', value: pendientes, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'No Conformidades', value: totalHallazgos, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Efectividad', value: `${efectividad}%`, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // FILTRO Y BÚSQUEDA
  const auditoriasFiltradas = auditorias.filter(a => {
    const termino = searchTerm.toLowerCase();
    const coincideBusqueda = 
      a.codigo_auditoria?.toLowerCase().includes(termino) || 
      a.paciente_id?.includes(searchTerm) ||
      a.paciente_nombre?.toLowerCase().includes(termino) ||
      a.punto_control?.toLowerCase().includes(termino) ||
      a.auditor_nombre?.toLowerCase().includes(termino);
      
    const coincideEstado = filtroEstado === 'Todos los Estados' || a.estado === filtroEstado;
    return coincideBusqueda && coincideEstado;
  });

  // --- FUNCIONES DE APERTURA DE MODALES CON SUPABASE ---
  const abrirModalDetalle = async (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setTabActivo(0);
    setScoreActivo(0);       // Reiniciamos score anterior
    setRankingActivo('');    // Reiniciamos ranking anterior
    setModalDetalle(true);
    setCargandoDetalles(true);

    try {
      const { data, error } = await supabase
        .from('auditoria_respuestas')
        .select('*')
        .eq('auditoria_id', auditoria.id);

      if (error) throw error;

      if (data) {
        // --- CÁLCULO DE LA CALIFICACIÓN EN TIEMPO REAL ---
        const preguntasAplica = data.filter((r: any) => r.clasificacion !== 'No aplica').length || 0;
        const conformidades = data.filter((r: any) => r.clasificacion === 'Conformidad').length || 0;
        const calculoScore = preguntasAplica > 0 ? Math.round((conformidades / preguntasAplica) * 100) : 0;
        
        setScoreActivo(calculoScore);
        
        let textoRanking = 'Crítico';
        if (calculoScore >= 90) textoRanking = 'Excelente';
        else if (calculoScore >= 75) textoRanking = 'Aceptable';
        setRankingActivo(textoRanking);

        // Agrupar pestañas
        const agrupado = data.reduce((acc: any, curr: any) => {
          if (!acc[curr.punto_control]) acc[curr.punto_control] = [];
          acc[curr.punto_control].push(curr);
          return acc;
        }, {});

        const arrayPestañas = Object.keys(agrupado).map((nombrePunto, index) => ({
          id: index,
          nombre: nombrePunto,
          preguntas: agrupado[nombrePunto]
        }));

        setDetallesOjo(arrayPestañas);
      }
    } catch (error) {
      console.error('Error al cargar detalle:', error);
    } finally {
      setCargandoDetalles(false);
    }
  };

  const abrirModalFormular = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setCodigoGenerado(auditoria.codigo_accion || `HAL-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormPlan({ plan: auditoria.plan_accion || '', responsable: auditoria.responsable_mejora || '', fecha: auditoria.fecha_limite || '' });
    setModalFormular(true);
  };

  const guardarPlanAccion = async () => {
    try {
      const { data, error } = await supabase
        .from('auditorias')
        .update({
          codigo_accion: codigoGenerado,
          plan_accion: formPlan.plan,
          responsable_mejora: formPlan.responsable,
          fecha_limite: formPlan.fecha,
          estado: 'En proceso'
        })
        .eq('id', auditoriaActiva.id)
        .select();

      if (error) throw error;

      setAuditorias(auditorias.map(a => a.id === auditoriaActiva.id ? data[0] : a));
      setModalFormular(false);
      alert('Plan de acción registrado correctamente.');
    } catch (error) {
      alert('Error al guardar el plan de acción');
    }
  };

  const abrirModalCerrar = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setFormCierre({ actividades: auditoria.actividades_cierre || '', evidencia: auditoria.evidencia_cierre || '' });
    setModalCerrar(true);
  };

  const guardarCierre = async () => {
    try {
      const { data, error } = await supabase
        .from('auditorias')
        .update({
          actividades_cierre: formCierre.actividades,
          evidencia_cierre: formCierre.evidencia,
          estado: 'Gestionado'
        })
        .eq('id', auditoriaActiva.id)
        .select();

      if (error) throw error;

      setAuditorias(auditorias.map(a => a.id === auditoriaActiva.id ? data[0] : a));
      setModalCerrar(false);
      alert('Hallazgo cerrado y auditado exitosamente.');
    } catch (error) {
      alert('Error al cerrar el hallazgo');
    }
  };

  const abrirModalEliminar = (auditoria: any) => {
    setAuditoriaAEliminar(auditoria);
    setModalEliminar(true);
  };

  const confirmarEliminacion = async () => {
    setCargandoEliminar(true);
    try {
      const { error: errorRespuestas } = await supabase
        .from('auditoria_respuestas')
        .delete()
        .eq('auditoria_id', auditoriaAEliminar.id);
      
      if (errorRespuestas) throw errorRespuestas;

      const { error: errorAuditoria } = await supabase
        .from('auditorias')
        .delete()
        .eq('id', auditoriaAEliminar.id);

      if (errorAuditoria) throw errorAuditoria;

      setAuditorias(auditorias.filter(a => a.id !== auditoriaAEliminar.id));
      setModalEliminar(false);
      setAuditoriaAEliminar(null);
      
    } catch (error) {
      console.error('Error al eliminar:', error);
      alert('Hubo un error al eliminar la auditoría. Revisa tu conexión.');
    } finally {
      setCargandoEliminar(false);
    }
  };

  return (
    <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans">
      
      {/* Encabezado */}
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Torre de Control</h2>
        <p className="text-slate-600 mt-2 text-lg font-medium">Monitoreo en tiempo real y gestión de hallazgos institucionales.</p>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filtros y Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchTerm} // <-- AHORA SE REFLEJA LO QUE SE BUSCÓ EN LA CABECERA
              placeholder="Buscar auditor, código, paciente..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="Todos los Estados">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Gestionado">Gestionado</option>
              <option value="En proceso">En proceso</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {cargando ? (
             <div className="flex justify-center items-center p-16 text-slate-400">
               <Loader2 className="animate-spin mr-3" size={32} /> 
               <span className="text-lg font-medium">Cargando base de datos en tiempo real...</span>
             </div>
          ) : auditoriasFiltradas.length === 0 ? (
             <div className="text-center p-16 text-slate-500 font-medium">
               No se encontraron auditorías registradas con ese criterio.
             </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                  <th className="px-6 py-4 whitespace-nowrap">Fecha</th>
                  <th className="px-6 py-4 whitespace-nowrap">Auditor</th>
                  <th className="px-6 py-4">Auditoría</th>
                  <th className="px-6 py-4">Paciente</th>
                  <th className="px-6 py-4">Flujo</th>
                  <th className="px-6 py-4">Punto de Control</th>
                  <th className="px-6 py-4 text-center">Hallazgos</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditoriasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500 text-sm font-medium">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-2 opacity-70"/>
                        {formatearFecha(item.fecha_creacion)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700 text-sm font-bold">
                      <div className="flex items-center">
                        <User size={14} className="mr-2 text-blue-500"/>
                        {formatearNombreAuditor(item.auditor_nombre)}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.codigo_auditoria}</td>
                    <td className="px-6 py-4">
                      <p className="text-slate-700 font-bold">{item.paciente_id}</p>
                      {item.paciente_nombre && (
                        <p className="text-slate-500 text-xs mt-0.5">{item.paciente_nombre}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{item.flujo}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm max-w-[200px] truncate" title={item.punto_control}>
                      {item.punto_control || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded-md text-xs font-black ${item.cantidad_hallazgos > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                        {item.cantidad_hallazgos}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.estado === 'Gestionado' ? 'bg-emerald-100 text-emerald-700' : 
                        item.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center space-x-1 flex justify-center">
                      <button onClick={() => abrirModalDetalle(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Resultados">
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => abrirModalFormular(item)} 
                        className={`p-2 rounded-lg transition-all ${item.cantidad_hallazgos > 0 && item.estado === 'Pendiente' ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 cursor-not-allowed'}`} 
                        title="Formular Plan de Acción"
                        disabled={item.cantidad_hallazgos === 0 || item.estado !== 'Pendiente'}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button 
                        onClick={() => abrirModalCerrar(item)} 
                        className={`p-2 rounded-lg transition-all ${item.estado === 'En proceso' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 cursor-not-allowed'}`} 
                        title="Ejecutar y Cerrar Hallazgo"
                        disabled={item.estado !== 'En proceso'}
                      >
                        <CheckSquare size={18} />
                      </button>
                      {usuarioActual.rol === 'Administrador' && (
                        <button 
                          onClick={() => abrirModalEliminar(item)} 
                          className="p-2 rounded-lg transition-all text-slate-300 hover:text-rose-600 hover:bg-rose-50" 
                          title="Eliminar Auditoría (Solo Admin)"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MODAL 1: VER DETALLES */}
      {modalDetalle && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* CABECERA DEL MODAL CON CALIFICACIÓN */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-400" size={24} />
                <div>
                  <h3 className="text-xl font-bold">Respuestas de Auditoría</h3>
                  <p className="text-slate-400 text-sm">Cód: {auditoriaActiva.codigo_auditoria} • Flujo: {auditoriaActiva.flujo}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {!cargandoDetalles && detallesOjo.length > 0 && (
                  <div className="hidden sm:flex flex-col items-end border-r border-slate-700 pr-6">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1 flex items-center">
                      <Award size={12} className="mr-1" /> Calificación Global
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                        scoreActivo >= 90 ? 'bg-emerald-500/20 text-emerald-400' : 
                        scoreActivo >= 75 ? 'bg-blue-500/20 text-blue-400' : 
                        'bg-rose-500/20 text-rose-400'
                      }`}>
                        {rankingActivo}
                      </span>
                      <span className="text-2xl font-black">{scoreActivo}<span className="opacity-50 text-base">/100</span></span>
                    </div>
                  </div>
                )}
                
                <button onClick={() => setModalDetalle(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
            </div>
            
            {cargandoDetalles ? (
               <div className="flex-1 flex justify-center items-center"><Loader2 className="animate-spin text-blue-500" size={40}/></div>
            ) : detallesOjo.length === 0 ? (
               <div className="flex-1 flex justify-center items-center text-slate-500 font-bold">No hay respuestas registradas para esta auditoría.</div>
            ) : (
              <div className="flex flex-1 overflow-hidden">
                <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                  {detallesOjo.map((tab) => (
                    <button key={tab.id} onClick={() => setTabActivo(tab.id)} className={`w-full text-left px-6 py-4 border-b border-slate-200 transition-colors ${tabActivo === tab.id ? 'bg-white border-l-4 border-l-blue-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'}`}>
                      <p className={`font-bold text-sm ${tabActivo === tab.id ? 'text-blue-700' : 'text-slate-700'}`}>{tab.nombre}</p>
                    </button>
                  ))}
                </div>
                <div className="w-2/3 p-8 overflow-y-auto bg-white">
                  <h4 className="text-lg font-extrabold text-slate-900 mb-6">Respuestas Registradas</h4>
                  <div className="space-y-4">
                    {detallesOjo.find(t => t.id === tabActivo)?.preguntas.map((preg: any, idx: number) => (
                      <div key={idx} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                        <p className="font-bold text-slate-800 mb-3 text-sm">{idx + 1}. {preg.pregunta}</p>
                        <div className="flex items-center space-x-2">
                          {preg.clasificacion === 'Conformidad' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckSquare size={14} className="mr-1" /> Conforme</span>
                          ) : preg.clasificacion === 'No aplica' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-200 text-slate-700 border border-slate-300"><AlertCircle size={14} className="mr-1" /> No Aplica</span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200"><AlertTriangle size={14} className="mr-1" /> No Conforme</span>
                          )}
                        </div>
                        {preg.hallazgo && (
                          <div className="mt-3 p-3 bg-white border border-rose-100 rounded-lg text-sm text-slate-700">
                            <strong>Observación:</strong> {preg.hallazgo}
                            {preg.responsable && <div><strong>Responsable:</strong> {preg.responsable}</div>}
                            {preg.evidencia && <div><strong>Evidencia:</strong> {preg.evidencia}</div>}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: FORMULAR PLAN */}
      {modalFormular && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Formular Plan de Acción</h3><p className="text-slate-400 text-sm">Auditoría: {auditoriaActiva.codigo_auditoria}</p></div>
              <button onClick={() => setModalFormular(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center">
                <div><p className="text-xs font-bold text-amber-600 uppercase">Se generará el Código</p><p className="text-2xl font-black text-amber-900 flex items-center"><Hash size={24} className="mr-1 text-amber-500" /> {codigoGenerado}</p></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Plan de Acción a Implementar</label>
                <textarea 
                  value={formPlan.plan}
                  onChange={(e) => setFormPlan({...formPlan, plan: e.target.value})}
                  placeholder="Describa el paso a paso de la mejora..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Responsable</label>
                  <input type="text" value={formPlan.responsable} onChange={(e) => setFormPlan({...formPlan, responsable: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Fecha Límite</label>
                  <input type="date" value={formPlan.fecha} onChange={(e) => setFormPlan({...formPlan, fecha: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t flex justify-end gap-3">
              <button onClick={() => setModalFormular(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancelar</button>
              <button onClick={guardarPlanAccion} className="bg-blue-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-900 shadow-md">Registrar Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: EJECUTAR Y CERRAR */}
      {modalCerrar && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Cierre de Acción Correctiva</h3><p className="text-slate-400 text-sm">Auditoría: {auditoriaActiva.codigo_auditoria}</p></div>
              <button onClick={() => setModalCerrar(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-600 uppercase mb-1">Gestionando Código</p>
                <p className="text-2xl font-black text-blue-900 flex items-center"><Hash size={24} className="mr-1 text-blue-500" /> {auditoriaActiva.codigo_accion}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Actividades Realizadas</label>
                <textarea 
                  value={formCierre.actividades}
                  onChange={(e) => setFormCierre({...formCierre, actividades: e.target.value})}
                  placeholder="Describa cómo se ejecutó el plan y se solucionó el problema..." 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 h-28 outline-none focus:ring-2 focus:ring-emerald-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Evidencia Objetiva</label>
                <input 
                  type="text" 
                  value={formCierre.evidencia}
                  onChange={(e) => setFormCierre({...formCierre, evidencia: e.target.value})}
                  placeholder="URL del documento, código de acta o soporte" 
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500" 
                />
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t flex justify-end gap-3">
              <button onClick={() => setModalCerrar(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancelar</button>
              <button onClick={guardarCierre} className="bg-emerald-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-md">Cerrar Hallazgo</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: CONFIRMAR ELIMINACIÓN */}
      {modalEliminar && auditoriaAEliminar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">¿Eliminar Auditoría?</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Estás a punto de borrar permanentemente la auditoría <strong className="text-slate-800">{auditoriaAEliminar.codigo_auditoria}</strong>. Esta acción eliminará todas sus respuestas y no se puede deshacer.
              </p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setModalEliminar(false)} 
                  disabled={cargandoEliminar}
                  className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors w-full"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmarEliminacion} 
                  disabled={cargandoEliminar}
                  className="bg-rose-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-rose-700 shadow-md flex items-center justify-center transition-colors w-full"
                >
                  {cargandoEliminar ? <><Loader2 size={18} className="animate-spin mr-2"/> Borrando...</> : 'Sí, eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportamos el componente envuelto en Suspense como exige Next.js 13+
export default function TorreControlPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    }>
      <TorreControlContent />
    </Suspense>
  );
}