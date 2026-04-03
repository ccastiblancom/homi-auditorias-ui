'use client'
import { useState } from 'react';
import { 
  BarChart3, 
  AlertOctagon, 
  CheckCircle2, 
  TrendingUp, 
  Search, 
  ClipboardEdit, 
  X,
  Save
} from 'lucide-react';

// --- DATOS DE PRUEBA (MOCKS) ---
const kpis = [
  { titulo: "Auditorías Realizadas", valor: "24", subtexto: "+3 esta semana", icono: BarChart3, color: "text-blue-600", bg: "bg-blue-50" },
  { titulo: "Tasa de Conformidad", valor: "88%", subtexto: "Meta: 95%", icono: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
  { titulo: "Hallazgos Negativos", valor: "12", subtexto: "Requieren plan de acción", icono: AlertOctagon, color: "text-rose-600", bg: "bg-rose-50" },
  { titulo: "Planes Cerrados", valor: "8", subtexto: "66% de efectividad", icono: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
];

const auditoriasRecientes = [
  { id: "AUD-001", flujo: "Urgencias", fecha: "03 Abr 2026", auditor: "Cristian Castiblanco", hallazgos: 2, estado: "Requiere Acción" },
  { id: "AUD-002", flujo: "Hospitalización", fecha: "02 Abr 2026", auditor: "Cristian Castiblanco", hallazgos: 0, estado: "Conforme" },
  { id: "AUD-003", flujo: "Salas de cirugía", fecha: "01 Abr 2026", auditor: "Ana Martínez", hallazgos: 1, estado: "Requiere Acción" },
  { id: "AUD-004", flujo: "Consulta Externa", fecha: "30 Mar 2026", auditor: "Cristian Castiblanco", hallazgos: 0, estado: "Conforme" },
];

const hallazgosMock = [
  { id: 1, pregunta: "¿El tiempo de espera en admisión es < 10 minutos?", hallazgo: "Paciente esperó 18 minutos en fila.", responsable: "Admisiones" },
  { id: 2, pregunta: "¿Se realiza la toma completa de signos vitales?", hallazgo: "No se registró saturación en 3 pacientes.", responsable: "Enfermería Triage" }
];

export default function TorreControlPage() {
  // Estado para controlar el Modal del Plan de Acción
  const [auditoriaSeleccionada, setAuditoriaSeleccionada] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12 font-sans relative">
      
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Torre de Control</h2>
            <p className="mt-1 text-lg text-slate-600 font-medium">Monitoreo y gestión de planes de acción de flujos core.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm text-sm font-semibold text-slate-700">
            Última actualización: Hoy, 08:30 AM
          </div>
        </div>

        {/* Tarjetas de KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icono;
            return (
              <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start space-x-4">
                <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 mb-1">{kpi.titulo}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{kpi.valor}</h3>
                  <p className="text-xs font-medium text-slate-400 mt-1">{kpi.subtexto}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabla Resumen de Auditorías */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-lg font-bold text-slate-900">Resumen de Auditorías Recientes</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar por ID o flujo..." 
                className="pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Flujo</th>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Auditor</th>
                  <th className="px-6 py-4 text-center">Hallazgos Negativos</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4 text-right">Plan de Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditoriasRecientes.map((audit, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-900">{audit.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-700">{audit.flujo}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{audit.fecha}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{audit.auditor}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${audit.hallazgos > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {audit.hallazgos}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-bold rounded-full ${audit.estado === 'Conforme' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {audit.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {audit.hallazgos > 0 ? (
                        <button 
                          onClick={() => setAuditoriaSeleccionada(audit)}
                          className="inline-flex items-center space-x-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                        >
                          <ClipboardEdit size={16} />
                          <span>Gestionar</span>
                        </button>
                      ) : (
                        <span className="text-sm font-medium text-slate-400 italic">No requiere</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL PLAN DE ACCIÓN --- */}
      {auditoriaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header del Modal */}
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <div>
                <h3 className="text-xl font-bold">Plan de Acción - {auditoriaSeleccionada.flujo}</h3>
                <p className="text-slate-400 text-sm font-medium">Auditoría: {auditoriaSeleccionada.id} | Fecha: {auditoriaSeleccionada.fecha}</p>
              </div>
              <button 
                onClick={() => setAuditoriaSeleccionada(null)}
                className="p-2 bg-slate-800 hover:bg-rose-500 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cuerpo del Modal (Scrollable) */}
            <div className="p-6 overflow-y-auto bg-slate-50 flex-1">
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start space-x-3 text-amber-800">
                <AlertOctagon className="flex-shrink-0 mt-0.5" size={20} />
                <p className="text-sm font-medium">Se encontraron <strong>{auditoriaSeleccionada.hallazgos} no conformidades</strong> en esta auditoría. Por favor, defina el plan de acción para cada una de ellas.</p>
              </div>

              <div className="space-y-8">
                {hallazgosMock.map((item, i) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                    
                    {/* Resumen del Hallazgo */}
                    <div className="mb-6 pb-6 border-b border-slate-100">
                      <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full mb-3 uppercase tracking-wider">Hallazgo {i + 1}</span>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{item.pregunta}</h4>
                      <p className="text-slate-700 text-sm"><strong className="text-slate-900">Evidencia:</strong> {item.hallazgo}</p>
                      <p className="text-slate-700 text-sm mt-1"><strong className="text-slate-900">Responsable inicial:</strong> {item.responsable}</p>
                    </div>

                    {/* Formulario de Acción */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Plan de Acción a ejecutar</label>
                        <textarea 
                          rows={2}
                          placeholder="Describa las acciones correctivas detalladas..."
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm"
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Fecha de Compromiso</label>
                        <input 
                          type="date" 
                          className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Estado de la Acción</label>
                        <select className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-sm text-slate-700">
                          <option value="Pendiente">Pendiente de inicio</option>
                          <option value="En proceso">En proceso</option>
                          <option value="Cerrado">Cerrado (Solucionado)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer del Modal */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
              <button 
                onClick={() => setAuditoriaSeleccionada(null)}
                className="px-6 py-2.5 rounded-lg text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-md">
                <Save size={18} />
                <span>Guardar Planes de Acción</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}