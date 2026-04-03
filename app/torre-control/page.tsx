'use client'
import { useState } from 'react';
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
  ArrowUpRight
} from 'lucide-react';

// --- DATOS MOCK COMPLETOS ---
const mockTorreData = [
  { id: 'AUD-101', paciente: '10234455', flujo: 'Urgencias', fecha: '2026-04-03', estado: 'Pendiente', hallazgos: 2, criticidad: 'Alta' },
  { id: 'AUD-102', paciente: '52889122', flujo: 'Cirugía', estado: 'Gestionado', fecha: '2026-04-02', hallazgos: 0, criticidad: 'Baja' },
  { id: 'AUD-103', paciente: '10156677', flujo: 'Hospitalización', estado: 'En proceso', fecha: '2026-04-03', hallazgos: 1, criticidad: 'Media' },
  { id: 'AUD-104', paciente: '80223441', flujo: 'Consulta Externa', estado: 'Pendiente', fecha: '2026-04-01', hallazgos: 3, criticidad: 'Alta' },
];

export default function TorreControlPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modalGestion, setModalGestion] = useState(false);

  // Estadísticas rápidas
  const stats = [
    { label: 'Total Auditorías', value: '154', icon: BarChart3, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendientes Gestión', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'No Conformidades', value: '45', icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Efectividad', value: '92%', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold outline-none focus:ring-2 focus:ring-blue-500"
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
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalles">
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => setModalGestion(true)}
                      className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                      title="Gestionar Hallazgo"
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

      {/* --- MODAL DE GESTIÓN (CORREGIDO) --- */}
      {modalGestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Gestión de Plan de Acción</h3>
                <p className="text-slate-400 text-sm">Auditoría ID: AUD-101</p>
              </div>
              <button onClick={() => setModalGestion(false)} className="text-slate-400 hover:text-white text-2xl font-light">✕</button>
            </div>
            
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Acciones Correctivas Sugeridas</label>
                <textarea 
                  placeholder="Describa el plan de mejora a implementar..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white min-h-[120px] outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Fecha de Compromiso</label>
                  <input 
                    type="date" 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Responsable Institucional</label>
                  <input 
                    type="text" 
                    placeholder="Nombre del líder de área"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end space-x-4">
              <button onClick={() => setModalGestion(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
              <button onClick={() => setModalGestion(false)} className="bg-blue-800 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-blue-900 shadow-md transition-all">Guardar Plan de Acción</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}