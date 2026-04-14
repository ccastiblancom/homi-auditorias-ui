'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { 
  Filter, 
  Download, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Building2,
  Award,
  Loader2,
  Search,
  AlertCircle,
  Hash,
  X // <-- Nuevo icono para borrar etiquetas
} from 'lucide-react';

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result as string), false);
    reader.addEventListener("error", () => reject(new Error("Error loading image")));
    reader.readAsDataURL(blob);
  });
};

const normalizarTexto = (texto: string) => {
  if (!texto) return '';
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

const formatearIdVisual = (id: string) => {
  if (!id) return '';
  return id.charAt(0).toUpperCase() + id.slice(1).toLowerCase();
};

export default function InformeAuditoriaPage() {
  const [flujoSeleccionado, setFlujoSeleccionado] = useState('Todos');
  
  // --- NUEVO: ESTADO PARA MÚLTIPLES INFORMES ---
  const [informesSeleccionados, setInformesSeleccionados] = useState<string[]>([]);
  
  const [listaAuditorias, setListaAuditorias] = useState<any[]>([]);
  // --- NUEVO: ESTADO PARA ARRAY DE INFORMES GENERADOS ---
  const [informesGenerados, setInformesGenerados] = useState<any[]>([]);
  const [isGenerando, setIsGenerando] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchListaAuditorias = async () => {
      try {
        const { data, error } = await supabase
          .from('auditorias')
          .select('codigo_auditoria, flujo')
          .order('fecha_creacion', { ascending: false });

        if (error) throw error;
        if (data) setListaAuditorias(data);
      } catch (error) {
        console.error('Error cargando la lista:', error);
      }
    };
    fetchListaAuditorias();
  }, []);

  // Filtramos los que coinciden con el flujo Y que NO hayan sido seleccionados aún
  const informesDisponibles = listaAuditorias.filter(a => {
    const flujoCoincide = flujoSeleccionado === 'Todos' ? true : 
                          normalizarTexto(a.flujo || '').includes(normalizarTexto(flujoSeleccionado));
    const noSeleccionado = !informesSeleccionados.includes(a.codigo_auditoria);
    return flujoCoincide && noSeleccionado;
  });

  const agregarInforme = (id: string) => {
    if (id && !informesSeleccionados.includes(id)) {
      setInformesSeleccionados([...informesSeleccionados, id]);
    }
  };

  const quitarInforme = (id: string) => {
    setInformesSeleccionados(informesSeleccionados.filter(item => item !== id));
    // Limpiamos la vista si borramos todos
    if (informesSeleccionados.length === 1) setInformesGenerados([]); 
  };

  const handleGenerarInforme = async () => {
    if (informesSeleccionados.length === 0) {
      alert("Por favor, seleccione al menos un ID de informe.");
      return;
    }

    setIsGenerando(true);
    setInformesGenerados([]);

    try {
      // 1. Buscamos TODAS las auditorías seleccionadas
      const { data: auditData, error: auditError } = await supabase
        .from('auditorias')
        .select('*')
        .in('codigo_auditoria', informesSeleccionados.map(id => id.trim().toUpperCase()));

      if (auditError || !auditData || auditData.length === 0) {
        alert("No se encontraron datos para las auditorías seleccionadas.");
        setIsGenerando(false);
        return;
      }

      // 2. Buscamos TODAS las respuestas de esas auditorías
      const auditIds = auditData.map(a => a.id);
      const { data: respData, error: respError } = await supabase
        .from('auditoria_respuestas')
        .select('*')
        .in('auditoria_id', auditIds);

      if (respError) throw respError;

      // 3. Procesamos cada auditoría por separado
      const arrayInformesProcesados = auditData.map(auditoria => {
        const respuestasDeEstaAuditoria = (respData || []).filter(r => r.auditoria_id === auditoria.id);
        
        const agrupado = respuestasDeEstaAuditoria.reduce((acc: any, curr: any) => {
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

        const preguntasAplica = respuestasDeEstaAuditoria.filter(r => r.clasificacion !== 'No aplica').length || 0;
        const conformidades = respuestasDeEstaAuditoria.filter(r => r.clasificacion === 'Conformidad').length || 0;
        const calculoScore = preguntasAplica > 0 ? Math.round((conformidades / preguntasAplica) * 100) : 0;
        
        let textoRanking = 'Crítico (Requiere intervención inmediata)';
        if (calculoScore >= 90) textoRanking = 'Excelente (Cumplimiento superior)';
        else if (calculoScore >= 75) textoRanking = 'Aceptable (Requiere mejoras)';

        const fechaFormateada = new Date(auditoria.fecha_creacion).toLocaleDateString("es-CO", { 
          year: 'numeric', month: 'long', day: 'numeric' 
        });

        return {
          id: auditoria.codigo_auditoria,
          flujo: auditoria.flujo,
          fecha: fechaFormateada,
          auditor: auditoria.auditor_nombre || 'Auditor Concurrente',
          score: calculoScore,
          ranking: textoRanking,
          puntos: puntosEstructurados
        };
      });

      setInformesGenerados(arrayInformesProcesados);

    } catch (error) {
      console.error("Error consultando la BD:", error);
      alert("Ocurrió un error al intentar generar los informes.");
    } finally {
      setIsGenerando(false);
    }
  };

  // --- MOTOR PDF MULTI-PÁGINA ---
  const handleExportPDF = async () => {
    setIsExporting(true);

    try {
      const doc = new jsPDF({ format: 'letter' });
      let logoBase64 = null;
      try { logoBase64 = await getBase64ImageFromUrl('/HOMI_LOGO.png'); } catch (e) {}

      // Recorremos cada informe generado y lo añadimos al PDF
      informesGenerados.forEach((informe, index) => {
        // Si no es el primer informe, añadimos una página nueva
        if (index > 0) {
          doc.addPage();
        }

        if (logoBase64) {
          doc.addImage(logoBase64, 'PNG', 14, 15, 40, 14);
        } else {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(20);
          doc.setTextColor(30, 58, 138);
          doc.text("HOMI", 14, 25);
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42); 
        doc.text("INFORME OFICIAL DE AUDITORÍA", 60, 20);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text("Sistema de Gestión de Calidad", 60, 25);

        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(`ID Informe: ${informe.id}`, 155, 20);
        doc.text(`Fecha: ${informe.fecha}`, 155, 25);

        doc.setDrawColor(203, 213, 225); 
        doc.setLineWidth(0.5);
        doc.line(14, 32, 202, 32);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138);
        doc.text("Resumen de Calificación", 14, 40);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text("Flujo Auditado:", 14, 48);
        doc.setFont("helvetica", "bold");
        doc.text(informe.flujo, 40, 48);

        doc.setFont("helvetica", "normal");
        doc.text("Auditor Líder:", 14, 54);
        doc.setFont("helvetica", "bold");
        doc.text(informe.auditor, 40, 54);

        doc.setFont("helvetica", "normal");
        doc.text("Calificación Global:", 110, 48);

        doc.setFont("helvetica", "bold");
        let colorCalificacion = [225, 29, 72]; 
        if (informe.score >= 90) colorCalificacion = [5, 150, 105]; 
        else if (informe.score >= 75) colorCalificacion = [37, 99, 235]; 

        doc.setTextColor(colorCalificacion[0], colorCalificacion[1], colorCalificacion[2]);
        const scoreText = `${informe.score}/100 - ${informe.ranking}`;
        const splitScore = doc.splitTextToSize(scoreText, 85); 
        doc.text(splitScore, 110, 54); 

        let finalY = 65; 

        informe.puntos.forEach((punto: any) => {
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42);
          doc.text(punto.nombre, 14, finalY + 8);

          const tableData = punto.preguntas.map((preg: any, i: number) => [
            `${i + 1}. ${preg.pregunta}`,
            preg.hallazgo || 'Sin observación adicional',
            preg.clasificacion,
            preg.responsable || 'N/A'
          ]);

          autoTable(doc, {
            startY: finalY + 12,
            head: [['Pregunta de Auditoría', 'Observación / Hallazgo', 'Estado', 'Responsable']],
            body: tableData,
            theme: 'grid',
            styles: { font: 'helvetica', fontSize: 8 }, 
            headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
            bodyStyles: { textColor: 50 },
            columnStyles: {
              0: { cellWidth: 78 },
              1: { cellWidth: 58 },
              2: { cellWidth: 26, fontStyle: 'bold' },
              3: { cellWidth: 26 }  
            },
            didParseCell: function(data) {
              if (data.section === 'body' && data.column.index === 2) {
                if (data.cell.raw === 'Conformidad') data.cell.styles.textColor = [5, 150, 105];
                else if (data.cell.raw === 'No aplica') data.cell.styles.textColor = [100, 116, 139];
                else data.cell.styles.textColor = [225, 29, 72];
              }
            }
          });

          finalY = (doc as any).lastAutoTable.finalY + 5;
        });

        if (finalY > 230) {
          doc.addPage();
          finalY = 20;
        }

        finalY += 30; 
        doc.setDrawColor(100, 116, 139);
        doc.setLineWidth(0.3);
        doc.line(30, finalY, 80, finalY);
        doc.line(130, finalY, 180, finalY);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(15, 23, 42);
        doc.text(informe.auditor, 55, finalY + 5, { align: 'center' });
        doc.text("Coordinador de Calidad", 155, finalY + 5, { align: 'center' });
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139);
        doc.text("Auditor Concurrente", 55, finalY + 10, { align: 'center' });
        doc.text("VoBo Institucional", 155, finalY + 10, { align: 'center' });
      });

      // Exportar PDF con nombre dinámico
      const nombreArchivo = informesGenerados.length === 1 
        ? `Informe_HOMI_${informesGenerados[0].id}.pdf` 
        : `Lote_Informes_HOMI_${informesGenerados.length}_Auditorias.pdf`;
      
      doc.save(nombreArchivo);

    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un error al generar el documento.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-8 font-sans">
      
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Informe de Auditoría</h2>
            <p className="mt-1 text-lg text-slate-600 font-medium">Genere y exporte reportes individuales o por lotes.</p>
          </div>
          
          <button 
            onClick={handleExportPDF}
            disabled={isExporting || informesGenerados.length === 0}
            className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95 ${
              isExporting || informesGenerados.length === 0 ? 'bg-slate-300 text-slate-500 cursor-not-allowed' : 'bg-blue-800 hover:bg-blue-900 text-white'
            }`}
          >
            {isExporting ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
            <span>{isExporting ? 'Procesando Archivo...' : 'Descargar PDF Oficial'}</span>
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-start">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Filtro Rápido (Flujo)</label>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <select 
                value={flujoSeleccionado}
                onChange={(e) => {
                  setFlujoSeleccionado(e.target.value);
                  setInformesSeleccionados([]); 
                  setInformesGenerados([]);
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-900 cursor-pointer"
              >
                <option value="Todos">Todos los flujos</option>
                <option value="Urgencias">Urgencias</option>
                <option value="Hospitalización">Hospitalización</option>
                <option value="Salas de cirugía">Salas de cirugía</option>
                <option value="Consulta Externa">Consulta Externa</option>
              </select>
            </div>
          </div>
          
          <div className="flex-[2] min-w-[250px] flex flex-col">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Seleccione ID(s) del Informe</label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                <select 
                  onChange={(e) => agregarInforme(e.target.value)}
                  value="" 
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none text-slate-900 cursor-pointer" 
                >
                  <option value="">Agregar un informe a la lista...</option>
                  {informesDisponibles.map((auditoria, index) => (
                    <option key={index} value={auditoria.codigo_auditoria}>
                      {formatearIdVisual(auditoria.codigo_auditoria)}
                    </option>
                  ))}
                </select>
              </div>
              <button 
                onClick={handleGenerarInforme}
                disabled={isGenerando || informesSeleccionados.length === 0}
                className={`px-8 py-2.5 rounded-lg font-bold shadow-md transition-colors h-[46px] flex items-center shrink-0 ${informesSeleccionados.length === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white'}`}
              >
                {isGenerando ? <><Loader2 className="animate-spin mr-2" size={18} /> Buscando...</> : 'Visualizar Informes'}
              </button>
            </div>
            
            {/* ETIQUETAS DE SELECCIÓN MÚLTIPLE */}
            {informesSeleccionados.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {informesSeleccionados.map(id => (
                  <span key={id} className="bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-sm">
                    {formatearIdVisual(id)}
                    <button onClick={() => quitarInforme(id)} className="ml-2 text-blue-400 hover:text-rose-500 transition-colors bg-white rounded-full p-0.5">
                      <X size={12}/>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- VISTA PREVIA WEB --- */}
      {informesGenerados.length > 0 ? (
        <div className="flex flex-col items-center w-full space-y-12">
          {informesGenerados.map((informe, idx) => (
            <div key={informe.id} className="w-full max-w-[216mm] bg-white p-8 md:p-12 rounded-sm shadow-2xl border border-slate-300 mx-auto relative">
              
              {/* Indicador visual de página si son varios */}
              {informesGenerados.length > 1 && (
                <div className="absolute top-0 right-0 bg-blue-800 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                  Informe {idx + 1} de {informesGenerados.length}
                </div>
              )}

              <div className="border-b-2 border-slate-800 pb-8 mb-8 flex justify-between items-center mt-2">
                <div className="flex items-center space-x-6">
                  <img src="/HOMI_LOGO.png" alt="Logo HOMI" style={{ width: '160px', height: '55px', objectFit: 'contain' }}/>
                  <div className="border-l-2 border-slate-200 pl-6">
                    <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest">Informe Oficial</h1>
                    <p className="text-slate-500 font-semibold">Sistema de Gestión de Calidad</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">ID Informe: <span className="text-blue-700">{informe.id}</span></p>
                  <p className="text-sm text-slate-600">Fecha: {informe.fecha}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Flujo Auditado</p>
                  <p className="text-lg font-bold text-slate-900 flex items-center"><Building2 size={18} className="mr-2 text-blue-600"/> {informe.flujo}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Auditor Líder</p>
                  <p className="text-sm font-bold text-slate-900 flex items-center"><FileText size={18} className="mr-2 text-blue-600 shrink-0"/> <span className="truncate">{informe.auditor}</span></p>
                </div>
                
                <div className={`col-span-2 p-4 rounded-lg border flex items-center justify-between ${informe.score >= 90 ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : informe.score >= 75 ? 'bg-blue-50 border-blue-200 text-blue-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <div>
                    <p className="text-xs font-bold uppercase opacity-70 mb-1">Calificación Global</p>
                    <p className="text-sm md:text-lg font-bold flex items-center"><Award size={18} className="mr-2 shrink-0"/> {informe.ranking}</p>
                  </div>
                  <div className="text-4xl font-black ml-4 shrink-0">
                    {informe.score}<span className="text-xl md:text-2xl opacity-50">/100</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 border-b border-slate-200 pb-2">Detalle de Puntos de Control</h3>
                
                {informe.puntos.map((punto: any, index: number) => (
                  <div key={index} className="mb-8">
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                item.clasificacion === 'Conformidad' ? 'bg-emerald-100 text-emerald-800' : 
                                item.clasificacion === 'No aplica' ? 'bg-slate-200 text-slate-800' : 
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {item.clasificacion === 'Conformidad' ? <CheckCircle size={12} className="mr-1"/> : 
                                 item.clasificacion === 'No aplica' ? <AlertCircle size={12} className="mr-1"/> : 
                                 <XCircle size={12} className="mr-1"/>}
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

              <div className="mt-16 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center pb-8">
                <div>
                  <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                  <p className="font-bold text-slate-800 truncate px-4">{informe.auditor}</p>
                  <p className="text-sm text-slate-500">Auditor</p>
                </div>
                <div>
                  <div className="border-b border-slate-400 w-48 mx-auto mb-2"></div>
                  <p className="font-bold text-slate-800">Coordinador de Calidad</p>
                  <p className="text-sm text-slate-500">VoBo Institucional</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl shadow-sm border border-slate-200 text-center">
          <FileText size={64} className="text-slate-200 mb-4" />
          <h3 className="text-2xl font-bold text-slate-700 mb-2">No hay informes visibles</h3>
          <p className="text-slate-500 max-w-md">Seleccione uno o más IDs de la lista y presione "Visualizar Informes" para verlos y exportarlos en lote.</p>
        </div>
      )}
    </div>
  );
}