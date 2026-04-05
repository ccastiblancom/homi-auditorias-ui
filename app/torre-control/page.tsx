'use client'
import { useState } from 'react';
import { 
  Search, Filter, Eye, Edit3, CheckCircle, Clock, 
  BarChart3, AlertTriangle, X, FileText, CheckSquare, 
  AlertCircle, ChevronRight, Hash
} from 'lucide-react';

// --- DATOS MOCK COMPLETOS ---
const mockTorreData = [
  { id: 'AUD-101', paciente: '10234455', flujo: 'Urgencias', fecha: '2026-04-03', estado: 'Pendiente', hallazgos: 2, criticidad: 'Alta' },
  { id: 'AUD-102', paciente: '52889122', flujo: 'Cirugía', estado: 'Gestionado', fecha: '2026-04-02', hallazgos: 0, criticidad: 'Baja' },
  { id: 'AUD-103', paciente: '10156677', flujo: 'Hospitalización', estado: 'En proceso', fecha: '2026-04-03', hallazgos: 1, criticidad: 'Media' },
  { id: 'AUD-104', paciente: '80223441', flujo: 'Consulta Externa', estado: 'Pendiente', fecha: '2026-04-01', hallazgos: 3, criticidad: 'Alta' },
];

// Mock de la completitud para el Modal del Ojo
const mockDetallesAuditoria = [
  { id: 1, nombre: 'Punto de Control 1', completitud: '100%', preguntas: [
    { num: 1, texto: '¿Cumple el flujo con el intervalo de tiempo?', estado: 'Conforme' },
    { num: 2, texto: '¿Se evidencia el cumplimiento del protocolo?', estado: 'No Conforme', hallazgo: 'No se entregó formato al paciente.' },
  ]},
  { id: 2, nombre: 'Punto de Control 2', completitud: '100%', preguntas: [
    { num: 1, texto: '¿Se cumple con el estándar de tiempo de espera?', estado: 'Conforme' },
    { num: 2, texto: '¿Existe una justificación clínica documentada?', estado: 'Conforme' },
  ]},
  { id: 3, nombre: 'Punto de Control 3', completitud: 'Pendiente', preguntas: []}
];

export default function TorreControlPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  
  // Estados para los modales
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalGestion, setModalGestion] = useState(false);
  const [auditoriaActiva, setAuditoriaActiva] = useState<any>(null);
  const [tabActivo, setTabActivo] = useState(1);
  const [codigoHallazgo, setCodigoHallazgo] = useState('');

  // Estadísticas rápidas
  const stats = [
    { label: 'Total Auditorías', value: '154', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendientes Gestión', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'No Conformidades', value: '45', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Efectividad', value: '92%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const abrirModalDetalle = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setTabActivo(1);
    setModalDetalle(true);
  };

  const abrirModalGestion = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    // Generar código único aleatorio para simular el backend (Ej: HAL-4092)
    setCodigoHallazgo(`HAL-${Math.floor(1000 + Math.random() * 9000)}`);
    setModalGestion(true);
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
              placeholder="Buscar por ID o Paciente..." 
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
              <option>Todos los Estados</option>
              <option>Pendiente</option>
              <option>Gestionado</option>
              <option>En proceso</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Auditoría</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4">Flujo</th>
                <th className="px-6 py-4 text-center">Hallazgos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTorreData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{item.paciente}</td>
                  <td className="px-6 py-4 text-slate-600">{item.flujo}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded-md text-xs font-black ${item.hallazgos > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
                      {item.hallazgos}
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
                  <td className="px-6 py-4 text-right space-x-2">
                    {/* BOTÓN OJO: Ver detalles */}
                    <button 
                      onClick={() => abrirModalDetalle(item)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                      title="Ver Completitud"
                    >
                      <Eye size={18} />
                    </button>
                    {/* BOTÓN LÁPIZ: Gestionar */}
                    <button 
                      onClick={() => abrirModalGestion(item)}
                      className={`p-2 rounded-lg transition-all ${item.hallazgos > 0 ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 cursor-not-allowed'}`} 
                      title="Gestionar Acción Correctiva"
                      disabled={item.hallazgos === 0}
                    >
                      <Edit3 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL 1: DETALLE DE AUDITORÍA (EL OJO)     */}
      {/* ========================================== */}
      {modalDetalle && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Cabecera Modal */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <FileText className="text-blue-400" size={24} />
                <div>
                  <h3 className="text-xl font-bold">Completitud de Auditoría</h3>
                  <p className="text-slate-400 text-sm">ID: {auditoriaActiva.id} • Flujo: {auditoriaActiva.flujo}</p>
                </div>
              </div>
              <button onClick={() => setModalDetalle(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Cuerpo del Modal con Layout de Pestañas */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar de Pestañas */}
              <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                {mockDetallesAuditoria.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActivo(tab.id)}
                    className={`w-full text-left px-6 py-4 border-b border-slate-200 flex justify-between items-center transition-colors ${
                      tabActivo === tab.id ? 'bg-white border-l-4 border-l-blue-600' : 'hover:bg-slate-100 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div>
                      <p className={`font-bold text-sm ${tabActivo === tab.id ? 'text-blue-700' : 'text-slate-700'}`}>{tab.nombre}</p>
                      <p className="text-xs text-slate-500 mt-1">Completitud: <span className={tab.completitud === '100%' ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>{tab.completitud}</span></p>
                    </div>
                    <ChevronRight size={16} className={tabActivo === tab.id ? 'text-blue-600' : 'text-slate-400'} />
                  </button>
                ))}
              </div>

              {/* Contenido de la Pestaña Activa */}
              <div className="w-2/3 p-8 overflow-y-auto bg-white">
                <h4 className="text-lg font-extrabold text-slate-900 mb-6">Respuestas Registradas</h4>
                
                {mockDetallesAuditoria.find(t => t.id === tabActivo)?.preguntas.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <AlertCircle className="mx-auto text-slate-400 mb-2" size={32} />
                    <p className="text-slate-500 font-medium">Este punto de control aún no ha sido evaluado.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockDetallesAuditoria.find(t => t.id === tabActivo)?.preguntas.map((preg) => (
                      <div key={preg.num} className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                        <p className="font-bold text-slate-800 mb-3 text-sm">{preg.num}. {preg.texto}</p>
                        <div className="flex items-center space-x-2">
                          {preg.estado === 'Conforme' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                              <CheckSquare size={14} className="mr-1" /> Conforme
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                              <AlertTriangle size={14} className="mr-1" /> No Conforme
                            </span>
                          )}
                        </div>
                        {preg.hallazgo && (
                          <div className="mt-3 p-3 bg-white border border-rose-100 rounded-lg text-sm text-slate-700">
                            <strong>Observación:</strong> {preg.hallazgo}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: GESTIÓN DE ACCIONES (EL LÁPIZ)    */}
      {/* ========================================== */}
      {modalGestion && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Gestión de Acción Correctiva</h3>
                <p className="text-slate-400 text-sm">Auditoría ID: {auditoriaActiva.id}</p>
              </div>
              <button onClick={() => setModalGestion(false)} className="text-slate-400 hover:text-white text-2xl font-light">✕</button>
            </div>
            
            <div className="p-8 space-y-6">
              
              {/* Código Único Generado */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-1">Código Único de Hallazgo</p>
                  <p className="text-2xl font-black text-blue-900 flex items-center">
                    <Hash size={24} className="mr-1 text-blue-500" /> {codigoHallazgo}
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200">Estado: Abierto</span>
                </div>
              </div>

              {/* Formulario de Gestión */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Plan de Acción a Implementar</label>
                <textarea 
                  placeholder="Describa el paso a paso de la mejora..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Fecha Límite de Cumplimiento</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Responsable de Cierre</label>
                  <input 
                    type="text" 
                    placeholder="Nombre o cargo del líder"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end space-x-4">
              <button onClick={() => setModalGestion(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
              <button onClick={() => {
                alert(`¡Plan de acción guardado exitosamente bajo el código ${codigoHallazgo}!`);
                setModalGestion(false);
              }} className="bg-blue-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-900 shadow-md transition-all">Registrar Plan</button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}