'use client'
import { useState, useRef } from 'react';
import { jsPDF } from 'jspdf';
import { toPng } from 'html-to-image';
import { supabase } from '@/lib/supabase'; // <-- Conexión a Supabase
import { 
  Filter, 
  Download, 
  FileText, 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Building2,
  Award,
  Loader2,
  Search
} from 'lucide-react';

export default function InformeAuditoriaPage() {
  const [flujoSeleccionado, setFlujoSeleccionado] = useState('Todos');
  const [informeId, setInformeId] = useState('');
  
  // Estado para guardar los datos reales consultados
  const [informeGenerado, setInformeGenerado] = useState<any>(null);
  const [isGenerando, setIsGenerando] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  const informeRef = useRef<HTMLDivElement>(null);

  // --- FUNCIÓN PARA CONSULTAR SUPABASE Y GENERAR INFORME ---
  const handleGenerarInforme = async () => {
    if (!informeId) {
      alert("Por favor, ingrese el ID del informe (Ej: AUD-10245)");
      return;
    }

    setIsGenerando(true);
    setInformeGenerado(null);

    try {
      // 1. Buscar la cabecera de la auditoría
      const { data: auditData, error: auditError } = await supabase
        .from('auditorias')
        .select('*')
        .eq('codigo_auditoria', informeId.trim().toUpperCase())
        .single();

      if (auditError || !auditData) {
        alert("No se encontró ninguna auditoría con ese ID.");
        setIsGenerando(false);
        return;
      }

      // 2. Buscar las respuestas asociadas a esa auditoría
      const { data: respData, error: respError } = await supabase
        .from('auditoria_respuestas')
        .select('*')
        .eq('auditoria_id', auditData.id);

      if (respError) throw respError;

      // 3. Transformar los datos para adaptarlos al diseño (Agrupar por Punto de Control)
      const agrupado = (respData || []).reduce((acc: any, curr: any) => {
        if (!acc[curr.punto_control]) acc[curr.punto_control] = [];
        acc[curr.punto_control].push({
          pregunta: curr.pregunta,
          hallazgo: curr.hallazgo || 'Sin observaciones adicionales.',
          clasificacion: curr.clasificacion,
          responsable: curr.responsable || 'No especificado'
        });
        return acc;
      }, {});

      const puntosEstructurados = Object.keys(agrupado).map(nombre => ({
        nombre: nombre,
        preguntas: agrupado[nombre]
      }));

      // 4. Calcular el Score y el Ranking matemáticamente
      const totalPreguntas = respData?.length || 0;
      const conformidades = respData?.filter(r => r.clasificacion === 'Conformidad').length || 0;
      const calculoScore = totalPreguntas > 0 ? Math.round((conformidades / totalPreguntas) * 100) : 0;
      
      let textoRanking = 'Crítico (Requiere intervención inmediata)';
      if (calculoScore >= 90) textoRanking = 'Excelente (Cumplimiento superior)';
      else if (calculoScore >= 75) textoRanking = 'Aceptable (Requiere mejoras)';

      // 5. Armar el objeto final
      const fechaFormateada = new Date(auditData.fecha_creacion).toLocaleDateString("es-CO", { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });

      // Intentar obtener el nombre del usuario logueado desde localStorage si existe
      let nombreAuditor = 'Auditor Concurrente';
      const userStr = localStorage.getItem('usuario_homi');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        nombreAuditor = userObj.nombre;
      }

      setInformeGenerado({
        id: auditData.codigo_auditoria,
        flujo: auditData.flujo,
        fecha: fechaFormateada,
        auditor: nombreAuditor,
        score: calculoScore,
        ranking: textoRanking,
        puntos: puntosEstructurados
      });

    } catch (error) {
      console.error("Error consultando la BD:", error);
      alert("Ocurrió un error al intentar generar el informe.");
    } finally {
      setIsGenerando(false);
    }
  };

  // Función profesional para generar PDF directo usando html-to-image
  const handleExportPDF = async () => {
    const elemento = informeRef.current;
    if (!elemento) return;

    setIsExporting(true);

    try {
      // Usamos toPng de html-to-image que soporta CSS moderno sin errores
      const dataUrl = await toPng(elemento, { 
        quality: 1,
        pixelRatio: 2, // Alta resolución para textos nítidos
        backgroundColor: '#ffffff' // Fondo blanco asegurado
      });
      
      // Creamos un documento PDF tamaño A4
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculamos las proporciones para que encaje perfecto
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Forzamos la descarga del archivo
      pdf.save(`Informe_HOMI_${informeGenerado.flujo}_${informeGenerado.id}.pdf`);
      
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el documento.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      
      {/* --- PANEL SUPERIOR --- */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Informe de Auditoría</h2>
            <p className="mt-1 text-lg text-slate-600 font-medium">Genere, visualice y exporte los reportes detallados.</p>
          </div>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting || !informeGenerado}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
              isExporting || !informeGenerado ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            <span>{isExporting ? 'Generando Archivo...' : 'Exportar a PDF'}</span>
          </button>
        </div>

        {/* Filtros Actualizados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Flujo Core</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={flujoSeleccionado}
                onChange={(e) => setFlujoSeleccionado(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-900"
              >
                <option value="Todos" className="text-slate-900">Todos los flujos</option>
                <option value="Urgencias" className="text-slate-900">Urgencias</option>
                <option value="Hospitalización" className="text-slate-900">Hospitalización</option>
                <option value="Salas de cirugía" className="text-slate-900">Salas de cirugía</option>
                <option value="Consulta Externa" className="text-slate-900">Consulta Externa</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 min-w-[250px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">ID del Informe</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Ej: AUD-12345"
                value={informeId}
                onChange={(e) => setInformeId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 uppercase" 
              />
            </div>
          </div>

          <button 
            onClick={handleGenerarInforme}
            disabled={isGenerando}
            className="bg-blue-800 hover:bg-blue-900 text-white px-8 py-2.5 rounded-lg font-bold shadow-md transition-colors h-[46px] flex items-center"
          >
            {isGenerando ? <><Loader2 className="animate-spin mr-2" size={18} /> Buscando...</> : 'Generar Informe'}
          </button>
        </div>
      </div>

      {/* --- VISTA PREVIA DEL DOCUMENTO --- */}
      {informeGenerado ? (
        <div className="flex justify-center">
          <div ref={informeRef} className="w-full max-w-[210mm] bg-white p-10 md:p-16 rounded-sm shadow-2xl border border-slate-300">
            
            {/* Cabecera del Documento CON LOGO OFICIAL */}
            <div className="border-b-2 border-slate-800 pb-8 mb-8 flex justify-between items-center">
              <div className="flex items-center space-x-6">
                <img 
                  src="/HOMI_LOGO.png" 
                  alt="Logo HOMI" 
                  style={{ width: '160px', height: '55px', objectFit: 'contain' }}
                />
                <div className="border-l-2 border-slate-200 pl-6">
                  <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">Informe Oficial</h1>
                  <p className="text-slate-500 font-semibold">Sistema de Gestión de Calidad</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">ID Informe: <span className="text-blue-700">{informeGenerado.id}</span></p>
                <p className="text-sm text-slate-600">Fecha: {informeGenerado.fecha}</p>
              </div>
            </div>

            {/* Resumen y Calificación (Ranking) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Flujo Auditado</p>
                <p className="text-lg font-bold text-slate-900 flex items-center"><Building2 size={18} className="mr-2 text-blue-600"/> {informeGenerado.flujo}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500 font-bold uppercase mb-1">Auditor Líder</p>
                <p className="text-sm font-bold text-slate-900 flex items-center"><FileText size={18} className="mr-2 text-blue-600 shrink-0"/> <span className="truncate">{informeGenerado.auditor}</span></p>
              </div>
              
              <div className={`col-span-2 p-4 rounded-lg border flex items-center justify-between ${informeGenerado.score >= 90 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : informeGenerado.score >= 75 ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                <div>
                  <p className="text-xs font-bold uppercase opacity-70 mb-1">Calificación Global</p>
                  <p className="text-sm md:text-lg font-bold flex items-center"><Award size={18} className="mr-2 shrink-0"/> {informeGenerado.ranking}</p>
                </div>
                <div className="text-4xl font-black ml-4 shrink-0">
                  {informeGenerado.score}<span className="text-xl md:text-2xl opacity-50">/100</span>
                </div>
              </div>
            </div>

            {/* Detalle de Hallazgos */}
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Detalle de Puntos de Control</h3>
              
              {informeGenerado.puntos.map((punto: any, index: number) => (
                <div key={index} className="mb-6">
                  <h4 className="text-lg font-bold text-blue-900 mb-4 bg-blue-50 px-4 py-2 rounded-md">{punto.nombre}</h4>
                  
                  <div className="space-y-4">
                    {punto.preguntas.map((item: any, i: number) => (
                      <div key={i} className="border border-slate-200 rounded-lg p-5">
                        <p className="font-bold text-slate-800 mb-3">{i + 1}. {item.pregunta}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <p className="text-sm text-slate-500 font-semibold">Hallazgo / Observación</p>
                            <p className="text-sm text-slate-700 mt-1">{item.hallazgo}</p>
                          </div>
                          <div>
                            <p className="text-sm text-slate-500 font-semibold mb-1">Clasificación</p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${item.clasificacion === 'Conformidad' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                              {item.clasificacion === 'Conformidad' ? <CheckCircle size={12} className="mr-1"/> : <XCircle size={12} className="mr-1"/>}
                              {item.clasificacion}
                            </span>
                            <p className="text-xs text-slate-500 mt-2"><span className="font-semibold">Responsable:</span> {item.responsable}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Firmas */}
            <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center pb-8">
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                <p className="font-bold text-slate-800 truncate px-4">{informeGenerado.auditor}</p>
                <p className="text-sm text-slate-500">Auditor Concurrente</p>
              </div>
              <div>
                <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                <p className="font-bold text-slate-800">Coordinador de Calidad</p>
                <p className="text-sm text-slate-500">VoBo Institucional</p>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
          <FileText size={64} className="text-slate-200 mb-4" />
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No hay un informe visible</h3>
          <p className="text-slate-500 max-w-md">Ingrese el ID de una auditoría en la barra de búsqueda de arriba y presione "Generar Informe" para visualizar y exportar los resultados.</p>
        </div>
      )}

    </div>
  );
}