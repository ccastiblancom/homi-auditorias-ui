'use client'
import { useState } from 'react';
import { 
  Settings, 
  Shield, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

// --- DATOS DE PRUEBA (MOCKS) ---
const mockUsuarios = [
  { id: 1, nombre: 'Cristian Castiblanco', email: 'ccastiblanco@homi.org.co', rol: 'Ingeniero', estado: 'Activo' },
  { id: 2, nombre: 'Admin HOMI', email: 'admin@homi.org.co', rol: 'Administrador', estado: 'Activo' },
  { id: 3, nombre: 'Dra. Ana Martínez', email: 'amartinez@homi.org.co', rol: 'Coordinador', estado: 'Activo' },
  { id: 4, nombre: 'Carlos Ruiz', email: 'cruiz@homi.org.co', rol: 'Auditor Concurrente', estado: 'Inactivo' },
];

const rolesInfo = [
  { 
    rol: 'Administrador', 
    descripcion: 'Acceso total al sistema y configuraciones.',
    permisos: ['Registro auditoría', 'Torre de control', 'Informe Auditoría', 'Configuración'],
    color: 'bg-indigo-100 text-indigo-800 border-indigo-200'
  },
  { 
    rol: 'Coordinador', 
    descripcion: 'Supervisión de auditorías y planes de acción.',
    permisos: ['Registro auditoría', 'Torre de control', 'Informe Auditoría'],
    color: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  { 
    rol: 'Ingeniero', 
    descripcion: 'Análisis de procesos y mejora continua.',
    permisos: ['Registro auditoría', 'Torre de control', 'Informe Auditoría'],
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  },
  { 
    rol: 'Auditor Concurrente', 
    descripcion: 'Ejecución de auditorías en campo.',
    permisos: ['Registro auditoría', 'Torre de control', 'Informe Auditoría'],
    color: 'bg-amber-100 text-amber-800 border-amber-200'
  },
];

export default function ConfiguracionPage() {
  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 p-8 lg:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Encabezado */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
              <Settings className="mr-3 text-slate-700" size={32} />
              Configuración del Sistema
            </h2>
            <p className="mt-2 text-lg text-slate-600 font-medium">Gestión de usuarios, roles y permisos de acceso a módulos.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* COLUMNA IZQUIERDA: Tarjetas de Roles */}
          <div className="xl:col-span-1 space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center mb-4">
              <Shield className="mr-2 text-blue-600" size={24} />
              Niveles de Acceso (Roles)
            </h3>
            
            {rolesInfo.map((rol, index) => (
              <div key={index} className={`bg-white rounded-2xl border p-5 shadow-sm ${rol.color.replace('bg-', 'hover:bg-opacity-50 hover:bg-').split(' ')[0]} transition-all`}>
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-slate-900">{rol.rol}</h4>
                  <Lock size={16} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 mb-4">{rol.descripcion}</p>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Módulos permitidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {rol.permisos.map((permiso, i) => (
                      <span key={i} className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold border ${rol.color}`}>
                        <CheckCircle2 size={12} className="mr-1" />
                        {permiso}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Tabla de Usuarios */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
              
              <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 flex items-center">
                  <Users className="mr-2 text-blue-600" size={20} />
                  Directorio de Usuarios
                </h3>
                <button 
                  onClick={() => setMostrarModal(true)}
                  className="flex items-center space-x-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm"
                >
                  <Plus size={16} />
                  <span>Nuevo Usuario</span>
                </button>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm font-semibold uppercase tracking-wider">
                      <th className="px-6 py-4">Usuario</th>
                      <th className="px-6 py-4">Rol Asignado</th>
                      <th className="px-6 py-4 text-center">Estado</th>
                      <th className="px-6 py-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mockUsuarios.map((user) => (
                      <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{user.nombre}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {user.rol}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${user.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                            {user.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                              <Edit2 size={16} />
                            </button>
                            <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Desactivar">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- MODAL CREAR USUARIO --- */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold">Registrar Nuevo Usuario</h3>
              <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-white transition-colors">
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                <input type="text" placeholder="Ej. Juan Pérez" className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Institucional</label>
                <input type="email" placeholder="usuario@homi.org.co" className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Asignar Rol</label>
                <select defaultValue="" className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none text-slate-900">
                  <option value="" disabled>Seleccione un rol...</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Coordinador">Coordinador</option>
                  <option value="Ingeniero">Ingeniero</option>
                  <option value="Auditor Concurrente">Auditor Concurrente</option>
                </select>
              </div>
            </div>
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-end space-x-3">
              <button onClick={() => setMostrarModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={() => setMostrarModal(false)} className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-blue-800 hover:bg-blue-900 transition-colors shadow-sm">Guardar Usuario</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}