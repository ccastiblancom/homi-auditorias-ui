'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { 
  Search, 
  Bell, 
  Activity, 
  X, 
  BarChart3, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  User
} from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const [fecha, setFecha] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('Equipo');
  const [nombreCompleto, setNombreCompleto] = useState('');
  
  // --- ESTADOS PARA EL BUSCADOR ---
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  // --- ESTADOS PARA EL PANEL DE NOTIFICACIONES (DRAWER) ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [misStats, setMisStats] = useState({
    totalAuditorias: 0,
    totalHallazgos: 0,
    efectividad: 0
  });

  useEffect(() => {
    const opciones: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    const fechaFormateada = new Date().toLocaleDateString('es-CO', opciones);
    setFecha(fechaFormateada.charAt(0).toUpperCase() + fechaFormateada.slice(1));

    // Leer el usuario de la sesión
    const userStr = localStorage.getItem('usuario_homi');
    if (userStr) {
      const userObj = JSON.parse(userStr);
      const primerNombre = userObj.nombre.split(' ')[0];
      setNombreUsuario(primerNombre);
      setNombreCompleto(userObj.nombre);
    }
  }, []);

  // --- LÓGICA DEL BUSCADOR GLOBAL ---
  const handleBuscar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Si presiona Enter y hay algo escrito
    if (e.key === 'Enter' && terminoBusqueda.trim() !== '') {
      // Redirigir a la Torre de Control enviando el parámetro por la URL
      router.push(`/torre-control?q=${encodeURIComponent(terminoBusqueda.trim())}`);
      setTerminoBusqueda(''); // Limpiar el input después de buscar
    }
  };

  // --- LÓGICA DE LA CAMPANA (CARGAR MIS ESTADÍSTICAS) ---
  const abrirNotificaciones = async () => {
    setIsDrawerOpen(true);
    setLoadingStats(true);

    try {
      // Consultamos solo las auditorías hechas por este usuario
      const { data, error } = await supabase
        .from('auditorias')
        .select('*')
        .ilike('auditor_nombre', `%${nombreCompleto}%`);

      if (error) throw error;

      if (data) {
        const total = data.length;
        const hallazgos = data.reduce((sum, a) => sum + (a.cantidad_hallazgos || 0), 0);
        const sinHallazgos = data.filter(a => a.cantidad_hallazgos === 0).length;
        const efectividad = total > 0 ? Math.round((sinHallazgos / total) * 100) : 0;

        setMisStats({
          totalAuditorias: total,
          totalHallazgos: hallazgos,
          efectividad: efectividad
        });
      }
    } catch (error) {
      console.error('Error cargando mis estadísticas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-20 px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm print:hidden">
        
        {/* Sección Izquierda: Saludo y Contexto */}
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">
            ¡Hola, {nombreUsuario}! 👋
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">
            {fecha ? fecha : 'Cargando fecha...'}
          </p>
        </div>

        {/* Sección Derecha: Búsqueda, Notificaciones y Estatus */}
        <div className="flex items-center space-x-6">
          
          {/* Barra de búsqueda global (AHORA FUNCIONAL) */}
          <div className="relative hidden md:block group">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input 
              type="text" 
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
              onKeyDown={handleBuscar}
              placeholder="Buscar paciente (Enter ↵)" 
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all w-72 text-slate-800 placeholder-slate-400" 
            />
          </div>

          {/* Campana de Notificaciones (ABRE EL PANEL) */}
          <button 
            onClick={abrirNotificaciones}
            className="relative p-2.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 rounded-full transition-colors"
          >
            <Bell size={22} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
          </button>

          {/* Estatus del Sistema Hospitalario */}
          <div className="flex items-center pl-6 border-l border-slate-200">
            <div className="bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold flex items-center border border-emerald-100 shadow-sm">
              <span className="relative flex h-2.5 w-2.5 mr-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              Sistema Online
            </div>
          </div>

        </div>
      </header>

      {/* --- PANEL LATERAL DESLIZABLE (DRAWER DE NOTIFICACIONES) --- */}
      {/* Fondo oscuro translúcido */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        ></div>
      )}

      {/* Panel Blanco */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <User className="text-blue-400" size={24} />
            <div>
              <h3 className="text-lg font-bold">Mi Resumen</h3>
              <p className="text-slate-400 text-xs">{nombreCompleto}</p>
            </div>
          </div>
          <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 h-[calc(100vh-88px)] overflow-y-auto bg-slate-50">
          
          <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Desempeño Operativo</h4>
          
          {loadingStats ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Loader2 className="animate-spin mb-4 text-blue-500" size={32} />
              <p className="font-medium">Calculando tus métricas...</p>
            </div>
          ) : (
            <div className="space-y-4">
              
              {/* Tarjeta 1: Total Auditorías */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Auditorías Realizadas</p>
                  <p className="text-2xl font-black text-slate-900">{misStats.totalAuditorias}</p>
                </div>
              </div>

              {/* Tarjeta 2: Hallazgos */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">No Conformidades Reportadas</p>
                  <p className="text-2xl font-black text-slate-900">{misStats.totalHallazgos}</p>
                </div>
              </div>

              {/* Tarjeta 3: Efectividad */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase">Mi Efectividad (Sin Hallazgos)</p>
                  <p className="text-2xl font-black text-slate-900">{misStats.efectividad}%</p>
                </div>
              </div>

              {/* Mensaje motivacional basado en datos */}
              <div className="mt-8 p-5 bg-blue-900 rounded-xl text-white relative overflow-hidden">
                <div className="relative z-10">
                  <h5 className="font-bold text-lg mb-1">¡Buen trabajo!</h5>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    Has contribuido a la calidad del servicio con {misStats.totalAuditorias} revisiones. Sigue monitoreando los procesos para mantener la seguridad del paciente.
                  </p>
                </div>
                <Activity size={100} className="absolute -bottom-6 -right-6 text-blue-800 opacity-50" />
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
}