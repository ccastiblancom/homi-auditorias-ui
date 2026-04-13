'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { 
  Filter, Calendar, BarChart3, AlertTriangle, CheckCircle, 
  Activity, Loader2, TrendingUp, Target, Sparkles, ListChecks
} from 'lucide-react';

// Paleta de colores corporativa para los gráficos
const COLORES = ['#1e40af', '#059669', '#e11d48', '#d97706', '#7c3aed', '#0891b2'];
const COLORES_ESTADO = { 'Gestionado': '#10b981', 'En proceso': '#3b82f6', 'Pendiente': '#f59e0b' };

export default function DashboardPage() {
  const [auditorias, setAuditorias] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [flujoFiltro, setFlujoFiltro] = useState('Todos');
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');

  useEffect(() => {
    fetchDatos();
  }, [flujoFiltro, fechaDesde, fechaHasta]);

  const fetchDatos = async () => {
    setCargando(true);
    try {
      let query = supabase.from('auditorias').select('*');

      if (flujoFiltro !== 'Todos') {
        query = query.ilike('flujo', `%${flujoFiltro}%`);
      }
      if (fechaDesde) {
        query = query.gte('fecha_creacion', `${fechaDesde}T00:00:00`);
      }
      if (fechaHasta) {
        query = query.lte('fecha_creacion', `${fechaHasta}T23:59:59`);
      }

      const { data, error } = await query.order('fecha_creacion', { ascending: true });

      if (error) throw error;
      if (data) setAuditorias(data);
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setCargando(false);
    }
  };

  // --- PROCESAMIENTO DE DATOS PARA GRÁFICOS ---
  const totalAuditorias = auditorias.length;
  const totalHallazgos = auditorias.reduce((sum, a) => sum + (a.cantidad_hallazgos || 0), 0);
  const auditoriasSinHallazgos = auditorias.filter(a => a.cantidad_hallazgos === 0).length;
  const efectividadGlobal = totalAuditorias > 0 ? Math.round((auditoriasSinHallazgos / totalAuditorias) * 100) : 0;

  const evolucionData = auditorias.reduce((acc: any[], curr) => {
    const fecha = new Date(curr.fecha_creacion).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    const existente = acc.find(item => item.fecha === fecha);
    if (existente) {
      existente.Auditorias += 1;
      existente.Hallazgos += curr.cantidad_hallazgos || 0;
    } else {
      acc.push({ fecha, Auditorias: 1, Hallazgos: curr.cantidad_hallazgos || 0 });
    }
    return acc;
  }, []);

  const flujosDataRaw = auditorias.reduce((acc: any, curr) => {
    const flujo = curr.flujo || 'Otro';
    if (!acc[flujo]) acc[flujo] = { nombre: flujo, Hallazgos: 0, Auditorias: 0 };
    acc[flujo].Hallazgos += curr.cantidad_hallazgos || 0;
    acc[flujo].Auditorias += 1;
    return acc;
  }, {});
  const flujosData = Object.values(flujosDataRaw).sort((a: any, b: any) => b.Hallazgos - a.Hallazgos);

  // Procesamiento para Puntos de Control (Para el Gráfico Top 5 y la Matriz Completa)
  const puntosDataRaw = auditorias.reduce((acc: any, curr) => {
    if (curr.punto_control) {
      if (!acc[curr.punto_control]) acc[curr.punto_control] = { nombre: curr.punto_control, Hallazgos: 0, Revisiones: 0 };
      acc[curr.punto_control].Hallazgos += (curr.cantidad_hallazgos || 0);
      acc[curr.punto_control].Revisiones += 1;
    }
    return acc;
  }, {});
  
  // Todos los puntos ordenados del peor al mejor
  const todosLosPuntos = Object.values(puntosDataRaw).sort((a: any, b: any) => b.Hallazgos - a.Hallazgos);
  
  // Solo los Top 5 para la gráfica
  const topPuntosData = todosLosPuntos
    .map((item: any) => ({ 
      nombre: item.nombre.length > 35 ? item.nombre.substring(0, 35) + '...' : item.nombre, 
      Hallazgos: item.Hallazgos 
    }))
    .slice(0, 5);

  const estadosDataRaw = auditorias.reduce((acc: any, curr) => {
    acc[curr.estado] = (acc[curr.estado] || 0) + 1;
    return acc;
  }, {});
  const estadosData = Object.keys(estadosDataRaw).map(key => ({
    name: key,
    value: estadosDataRaw[key]
  }));

  // --- NUEVO: MOTOR HEURÍSTICO DE ANÁLISIS AUTOMÁTICO ---
  const generarAnalisisInteligente = () => {
    if (totalAuditorias === 0) return "No hay datos suficientes en el periodo y flujo seleccionados para generar un análisis directivo.";

    let parrafo1 = "";
    if (efectividadGlobal >= 90) {
      parrafo1 = `El sistema refleja un nivel de cumplimiento **EXCELENTE (${efectividadGlobal}% de efectividad)** en los ${totalAuditorias} controles realizados. La adherencia a los estándares operativos es alta.`;
    } else if (efectividadGlobal >= 75) {
      parrafo1 = `El sistema refleja un nivel de cumplimiento **ACEPTABLE (${efectividadGlobal}% de efectividad)**. Sin embargo, se han detectado ${totalHallazgos} desviaciones que requieren atención para prevenir riesgos sistémicos.`;
    } else {
      parrafo1 = `**ALERTA CRÍTICA:** La efectividad operativa es baja (**${efectividadGlobal}%**). Con ${totalHallazgos} no conformidades en ${totalAuditorias} auditorías, existe un riesgo significativo en la adherencia a los procesos.`;
    }

    let parrafo2 = "";
    if (todosLosPuntos.length > 0 && todosLosPuntos[0].Hallazgos > 0) {
      parrafo2 = `El foco principal de vulnerabilidad se encuentra en el punto de control: **"${todosLosPuntos[0].nombre}"**, el cual acumula la mayor cantidad de fallos de la institución. `;
    }

    let parrafo3 = "";
    if (flujosData.length > 0 && flujosData[0].Hallazgos > 0) {
      parrafo3 = `A nivel de estructura, el flujo core de **"${flujosData[0].nombre}"** es el área que actualmente requiere mayor intervención administrativa y auditoría concurrente.`;
    }

    let recomendacion = "";
    if (efectividadGlobal >= 90) {
      recomendacion = "Recomendación: Mantener los controles actuales y enfocar esfuerzos en el cierre preventivo de hallazgos menores.";
    } else {
      recomendacion = `Recomendación: Establecer planes de acción correctivos urgentes (Ciclo PHVA) liderados por calidad, con foco específico en capacitar al personal sobre el punto de control más crítico.`;
    }

    return (
      <div className="space-y-3 text-sm md:text-base leading-relaxed text-blue-900">
        <p>{parrafo1.split('**').map((text, i) => i % 2 === 1 ? <strong key={i}>{text}</strong> : text)}</p>
        {(parrafo2 || parrafo3) && <p>{parrafo2} {parrafo3}</p>}
        <div className="mt-4 p-3 bg-white/50 rounded-lg border border-blue-200/50">
          <strong>{recomendacion}</strong>
        </div>
      </div>
    );
  };

  const limpiarFiltros = () => {
    setFlujoFiltro('Todos');
    setFechaDesde('');
    setFechaHasta('');
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans pb-20">
      
      {/* --- CABECERA Y FILTROS --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Directivo</h2>
            <p className="mt-1 text-lg text-slate-600 font-medium">Analítica avanzada de calidad y auditorías concurrentes.</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center"><Filter size={14} className="mr-1"/> Flujo Core</label>
            <select 
              value={flujoFiltro}
              onChange={(e) => setFlujoFiltro(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 font-semibold cursor-pointer"
            >
              <option value="Todos">Todos los flujos</option>
              <option value="Urgencias">Urgencias</option>
              <option value="Hospitalización">Hospitalización</option>
              <option value="Salas de cirugía">Salas de cirugía</option>
              <option value="Consulta Externa">Consulta Externa</option>
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center"><Calendar size={14} className="mr-1"/> Fecha Desde</label>
            <input 
              type="date" 
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 cursor-pointer"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center"><Calendar size={14} className="mr-1"/> Fecha Hasta</label>
            <input 
              type="date" 
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 cursor-pointer"
            />
          </div>

          <button 
            onClick={limpiarFiltros}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors h-[46px]"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
          <p className="text-xl font-bold">Analizando datos en tiempo real...</p>
        </div>
      ) : auditorias.length === 0 ? (
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-32 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
          <AlertTriangle size={64} className="mb-4 text-slate-300" />
          <p className="text-xl font-bold">No hay datos para estos filtros</p>
          <p className="text-sm mt-2">Intenta cambiar el rango de fechas o el flujo seleccionado.</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* --- KPIs TOP --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-blue-50 text-blue-600"><BarChart3 size={28} /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Auditorías</p>
                <p className="text-3xl font-black text-slate-900">{totalAuditorias}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-rose-50 text-rose-600"><AlertTriangle size={28} /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Hallazgos (No Conf.)</p>
                <p className="text-3xl font-black text-slate-900">{totalHallazgos}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle size={28} /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Efectividad Global</p>
                <p className="text-3xl font-black text-slate-900">{efectividadGlobal}%</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
              <div className="p-4 rounded-xl bg-purple-50 text-purple-600"><Target size={28} /></div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Prom. Hallazgos/Audit.</p>
                <p className="text-3xl font-black text-slate-900">{(totalHallazgos / totalAuditorias).toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* --- GRÁFICOS FILA 1 --- */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><TrendingUp className="mr-2 text-blue-500" size={20}/> Evolución Operativa</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evolucionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAuditorias" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="fecha" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}/>
                    <Area type="monotone" dataKey="Auditorias" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAuditorias)" />
                    <Line type="monotone" dataKey="Hallazgos" stroke="#e11d48" strokeWidth={3} dot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><Activity className="mr-2 text-emerald-500" size={20}/> Comparativo por Flujo Core</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={flujosData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="nombre" tick={{fontSize: 11, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '14px', paddingTop: '10px' }}/>
                    <Bar dataKey="Hallazgos" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={50} />
                    <Bar dataKey="Auditorias" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- GRÁFICOS FILA 2 --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">Estado de Hallazgos</h3>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadosData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {estadosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES_ESTADO[entry.name as keyof typeof COLORES_ESTADO] || COLORES[index % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '13px' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center"><AlertTriangle className="mr-2 text-amber-500" size={20}/> Top 5: Puntos de Control Críticos</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topPuntosData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                    <XAxis type="number" tick={{fontSize: 12, fill: '#64748b'}} axisLine={false} tickLine={false} />
                    <YAxis dataKey="nombre" type="category" width={180} tick={{fontSize: 11, fill: '#475569', fontWeight: 600}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="Hallazgos" fill="#f59e0b" radius={[0, 4, 4, 0]} barSize={24}>
                      {topPuntosData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#f59e0b'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* --- NUEVA SECCIÓN: MATRIZ PUNTO POR PUNTO & ANÁLISIS AUTOMATIZADO --- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* 1. Matriz de Puntos de Control (Detalle Completo) */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center"><ListChecks className="mr-2 text-indigo-500" size={20}/> Matriz de Cumplimiento por Punto de Control</h3>
              <p className="text-sm text-slate-500 mb-4">Listado detallado de todos los puntos evaluados. Las barras rojas indican mayor índice de fallo operativo.</p>
              
              <div className="h-[300px] overflow-y-auto pr-2 space-y-4">
                {todosLosPuntos.length === 0 ? (
                  <p className="text-slate-400 text-center py-10">No hay puntos de control registrados.</p>
                ) : (
                  todosLosPuntos.map((punto: any, idx: number) => {
                    const esCritico = idx === 0 && punto.Hallazgos > 0;
                    return (
                      <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-start mb-2">
                          <p className={`font-bold text-sm ${esCritico ? 'text-rose-700' : 'text-slate-700'}`}>{punto.nombre}</p>
                          <span className="text-xs font-bold text-slate-500 whitespace-nowrap ml-4">
                            {punto.Hallazgos} hallazgos en {punto.Revisiones} eval.
                          </span>
                        </div>
                        {/* Barra visual de proporción */}
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${esCritico ? 'bg-rose-500' : 'bg-amber-400'}`} 
                            style={{ width: `${Math.min(100, (punto.Hallazgos / (punto.Revisiones * 3)) * 100)}%` }} // Aproximación visual
                          ></div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </div>

            {/* 2. Conclusión Automatizada (El Motor Heurístico) */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm flex flex-col relative overflow-hidden">
              {/* Decoración de fondo */}
              <Sparkles className="absolute -top-4 -right-4 text-blue-200/50" size={100} />
              
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                  <Sparkles className="mr-2 text-blue-600" size={20}/> Conclusión Automatizada
                </h3>
                <div className="bg-white/60 backdrop-blur-sm p-5 rounded-xl border border-white">
                  {generarAnalisisInteligente()}
                </div>
                <p className="text-[10px] text-blue-400 font-semibold uppercase tracking-widest mt-4 text-center">
                  Generado en tiempo real basado en datos operativos
                </p>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}