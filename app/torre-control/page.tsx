'use client'
import { useState } from 'react';
import { 
  Search, Filter, Eye, Edit3, CheckCircle, Clock, 
  BarChart3, AlertTriangle, X, FileText, CheckSquare, 
  AlertCircle, ChevronRight, Hash, CheckSquare2
} from 'lucide-react';

const mockTorreData = [
  { id: 'AUD-101', paciente: '10234455', flujo: 'Urgencias', fecha: '2026-04-03', estado: 'Pendiente', hallazgos: 2, codigoAccion: '' },
  { id: 'AUD-103', paciente: '10156677', flujo: 'Hospitalización', estado: 'En proceso', fecha: '2026-04-03', hallazgos: 1, codigoAccion: 'HAL-4092' },
  { id: 'AUD-102', paciente: '52889122', flujo: 'Cirugía', estado: 'Gestionado', fecha: '2026-04-02', hallazgos: 1, codigoAccion: 'HAL-8831' },
];

const mockDetallesAuditoria = [
  { id: 1, nombre: 'Punto de Control 1', completitud: '100%', preguntas: [
    { num: 1, texto: '¿Cumple el flujo con el intervalo de tiempo?', estado: 'Conforme' },
    { num: 2, texto: '¿Se evidencia el cumplimiento del protocolo?', estado: 'No Conforme', hallazgo: 'No se entregó formato al paciente.' },
  ]}
];

export default function TorreControlPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [modalDetalle, setModalDetalle] = useState(false);
  const [modalFormular, setModalFormular] = useState(false);
  const [modalCerrar, setModalCerrar] = useState(false);
  
  const [auditoriaActiva, setAuditoriaActiva] = useState<any>(null);
  const [tabActivo, setTabActivo] = useState(1);
  const [codigoGenerado, setCodigoGenerado] = useState('');

  const abrirModalDetalle = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setTabActivo(1);
    setModalDetalle(true);
  };

  const abrirModalFormular = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setCodigoGenerado(auditoria.codigoAccion || `HAL-${Math.floor(1000 + Math.random() * 9000)}`);
    setModalFormular(true);
  };

  const abrirModalCerrar = (auditoria: any) => {
    setAuditoriaActiva(auditoria);
    setModalCerrar(true);
  };

  return (
    <div className="p-8 lg:p-12 bg-slate-50 min-h-screen font-sans">
      
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Torre de Control</h2>
        <p className="text-slate-600 mt-2 text-lg font-medium">Gestión del ciclo completo de auditorías institucionales.</p>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center bg-slate-50/50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por ID o Paciente..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Auditoría</th>
                <th className="px-6 py-4">Paciente</th>
                <th className="px-6 py-4 text-center">Hallazgos</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mockTorreData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{item.id}</td>
                  <td className="px-6 py-4 text-slate-700 font-medium">{item.paciente}</td>
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
                  <td className="px-6 py-4 text-center space-x-1">
                    
                    {/* BOTÓN 1: VER (Ojo) */}
                    <button onClick={() => abrirModalDetalle(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Resultados">
                      <Eye size={18} />
                    </button>
                    
                    {/* BOTÓN 2: FORMULAR PLAN (Lápiz Naranja) */}
                    <button 
                      onClick={() => abrirModalFormular(item)} 
                      className={`p-2 rounded-lg transition-all ${item.hallazgos > 0 && item.estado === 'Pendiente' ? 'text-amber-500 hover:bg-amber-50' : 'text-slate-300 cursor-not-allowed'}`} 
                      title="Formular Plan de Acción"
                      disabled={item.hallazgos === 0 || item.estado !== 'Pendiente'}
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* BOTÓN 3: CERRAR HALLAZGO (Check Verde) */}
                    <button 
                      onClick={() => abrirModalCerrar(item)} 
                      className={`p-2 rounded-lg transition-all ${item.estado === 'En proceso' ? 'text-emerald-500 hover:bg-emerald-50' : 'text-slate-300 cursor-not-allowed'}`} 
                      title="Ejecutar y Cerrar Hallazgo"
                      disabled={item.estado !== 'En proceso'}
                    >
                      <CheckSquare size={18} />
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL 1: VER DETALLES (EL OJO)             */}
      {/* ========================================== */}
      {modalDetalle && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Respuestas de Auditoría</h3><p className="text-slate-400 text-sm">ID: {auditoriaActiva.id}</p></div>
              <button onClick={() => setModalDetalle(false)} className="text-slate-400 hover:text-white"><X size={24} /></button>
            </div>
            <div className="flex flex-1 overflow-hidden">
              <div className="w-1/3 bg-slate-50 border-r border-slate-200 overflow-y-auto">
                {mockDetallesAuditoria.map((tab) => (
                  <button key={tab.id} onClick={() => setTabActivo(tab.id)} className={`w-full text-left px-6 py-4 border-b ${tabActivo === tab.id ? 'bg-white border-l-4 border-l-blue-600 text-blue-700' : 'hover:bg-slate-100'}`}>
                    <p className="font-bold text-sm">{tab.nombre}</p>
                  </button>
                ))}
              </div>
              <div className="w-2/3 p-8 overflow-y-auto bg-white">
                {mockDetallesAuditoria.find(t => t.id === tabActivo)?.preguntas.map((preg) => (
                  <div key={preg.num} className="border border-slate-200 rounded-xl p-5 mb-4 bg-slate-50">
                    <p className="font-bold text-slate-800 text-sm">{preg.num}. {preg.texto}</p>
                    <p className={`mt-2 font-bold text-xs ${preg.estado === 'Conforme' ? 'text-emerald-600' : 'text-rose-600'}`}>{preg.estado}</p>
                    {preg.hallazgo && <p className="mt-2 text-sm text-slate-600 bg-white p-2 border rounded">Obs: {preg.hallazgo}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 2: FORMULAR PLAN (EL LÁPIZ)          */}
      {/* ========================================== */}
      {modalFormular && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Formular Plan de Acción</h3></div>
              <button onClick={() => setModalFormular(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex justify-between items-center">
                <div><p className="text-xs font-bold text-amber-600 uppercase">Se generará el Código</p><p className="text-2xl font-black text-amber-900">{codigoGenerado}</p></div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Plan Propuesto</label>
                <textarea placeholder="¿Qué se va a hacer para corregir el hallazgo?" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 h-24 outline-none focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Responsable</label><input type="text" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-2">Fecha Límite</label><input type="date" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none" /></div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t flex justify-end gap-3">
              <button onClick={() => setModalFormular(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancelar</button>
              <button onClick={() => {alert("Plan guardado. Estado cambia a 'En proceso'"); setModalFormular(false);}} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-blue-700">Guardar Plan</button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* MODAL 3: EJECUTAR Y CERRAR (EL CHECK)      */}
      {/* ========================================== */}
      {modalCerrar && auditoriaActiva && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
              <div><h3 className="text-xl font-bold">Cierre de Acción Correctiva</h3></div>
              <button onClick={() => setModalCerrar(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-xs font-bold text-blue-600 uppercase">Gestionando Código</p>
                <p className="text-xl font-black text-blue-900">{auditoriaActiva.codigoAccion}</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Actividades Realizadas</label>
                <textarea placeholder="Describa cómo se ejecutó el plan y cómo se solucionó el problema..." className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 h-28 outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Evidencia Objetiva</label>
                <input type="text" placeholder="URL del documento, código de acta o soporte" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t flex justify-end gap-3">
              <button onClick={() => setModalCerrar(false)} className="px-6 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl">Cancelar</button>
              <button onClick={() => {alert("Acción cerrada exitosamente. Estado cambia a 'Gestionado'"); setModalCerrar(false);}} className="bg-emerald-600 text-white px-8 py-2 rounded-xl font-bold hover:bg-emerald-700">Cerrar Hallazgo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}