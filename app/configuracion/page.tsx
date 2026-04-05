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
  Lock,
  UserPlus,
  Mail,
  Briefcase,
  X
} from 'lucide-react';

// --- DATOS DE PRUEBA INICIALES ---
const inicialUsuarios = [
  { id: 1, nombre: 'Cristian Castiblanco', email: 'ccastiblanco@homi.org.co', rol: 'Administrador', estado: 'Activo' },
  { id: 2, nombre: 'Dra. Ana Martínez', email: 'amartinez@homi.org.co', rol: 'Coordinador', estado: 'Activo' },
  { id: 3, nombre: 'Carlos Ruiz', email: 'cruiz@homi.org.co', rol: 'Auditor Concurrente', estado: 'Inactivo' },
];

export default function ConfiguracionPage() {
  const [usuarios, setUsuarios] = useState(inicialUsuarios);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({ nombre: '', email: '', rol: '', estado: 'Activo' });

  const handleCrearUsuario = () => {
    if (!nuevoUsuario.nombre || !nuevoUsuario.email || !nuevoUsuario.rol) return;
    const user = { ...nuevoUsuario, id: usuarios.length + 1 };
    setUsuarios([...usuarios, user]);
    setMostrarModal(false);
    setNuevoUsuario({ nombre: '', email: '', rol: '', estado: 'Activo' });
  };

  const eliminarUsuario = (id: number) => {
    setUsuarios(usuarios.filter(u => u.id !== id));
  };

  return (
    <div className="p-8 lg:p-12 max-w-7xl mx-auto font-sans">
      
      <div className="mb-10">
        <h2 className="text-3xl font-extrabold text-slate-900 flex items-center">
          <Settings className="mr-3 text-blue-600" size={32} />
          Configuración de Accesos
        </h2>
        <p className="text-slate-600 mt-2">Administre los usuarios y permisos del sistema hospitalario.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Directorio de Usuarios */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center">
                <Users className="mr-2 text-blue-500" size={20} />
                Usuarios con Acceso
              </h3>
              <button 
                onClick={() => setMostrarModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all"
              >
                <Plus size={18} className="mr-1" /> Nuevo Usuario
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">Usuario</th>
                    <th className="px-6 py-4">Rol</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {usuarios.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{u.nombre}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          {u.rol}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${u.estado === 'Activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {u.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => eliminarUsuario(u.id)} className="p-2 text-slate-400 hover:text-rose-600 transition-colors"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Roles y Permisos (Informativo) */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg">
            <h3 className="font-bold flex items-center mb-4">
              <Shield className="mr-2 text-blue-400" size={20} /> Permisos por Rol
            </h3>
            <div className="space-y-4 text-sm">
              <div className="border-l-2 border-blue-500 pl-4">
                <p className="font-bold text-blue-400">Administrador</p>
                <p className="text-slate-400 text-xs">Acceso total, gestión de usuarios y borrado de registros.</p>
              </div>
              <div className="border-l-2 border-slate-600 pl-4 opacity-70">
                <p className="font-bold text-white">Auditor / Coordinador</p>
                <p className="text-slate-400 text-xs">Registro de auditorías, gestión de hallazgos y visualización de informes.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CREAR USUARIO */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-slate-900 p-6 flex justify-between items-center text-white">
              <h3 className="text-lg font-bold flex items-center"><UserPlus className="mr-2" /> Nuevo Acceso</h3>
              <button onClick={() => setMostrarModal(false)} className="text-slate-400 hover:text-white"><X /></button>
            </div>
            <div className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nombre Completo</label>
                <div className="relative">
                  <Users className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={nuevoUsuario.nombre}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" 
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Correo Institucional</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900" 
                    placeholder="usuario@homi.org.co"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Rol Asignado</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select 
                    value={nuevoUsuario.rol}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 appearance-none"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Coordinador">Coordinador</option>
                    <option value="Ingeniero">Ingeniero</option>
                    <option value="Auditor Concurrente">Auditor Concurrente</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 border-t border-slate-100 flex gap-3">
              <button onClick={() => setMostrarModal(false)} className="flex-1 py-2.5 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-all">Cancelar</button>
              <button onClick={handleCrearUsuario} className="flex-1 py-2.5 bg-blue-800 text-white font-bold rounded-xl hover:bg-blue-900 shadow-md transition-all">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}