export const PERMISSION_OPTIONS = [
  { key: 'leads.read_all', label: 'Ver todas las solicitudes', group: 'Solicitudes' },
  { key: 'leads.read_assigned', label: 'Ver solicitudes asignadas', group: 'Solicitudes' },
  { key: 'leads.edit_all', label: 'Editar todas las solicitudes', group: 'Solicitudes' },
  { key: 'leads.edit_assigned', label: 'Editar solicitudes asignadas', group: 'Solicitudes' },
  { key: 'leads.assign', label: 'Asignar solicitudes a agentes', group: 'Solicitudes' },
  { key: 'leads.delete', label: 'Eliminar solicitudes y facturas', group: 'Solicitudes' },
  { key: 'projects.manage', label: 'Crear y editar trabajos', group: 'Contenido' },
  { key: 'users.manage', label: 'Gestionar usuarios y permisos', group: 'Usuarios' },
];

export const PERMISSIONS = PERMISSION_OPTIONS.map((item) => item.key);

export const ROLE_DEFAULTS = {
  owner: [...PERMISSIONS],
  admin: ['leads.read_all', 'leads.edit_all', 'leads.assign', 'leads.delete', 'projects.manage', 'users.manage'],
  agent: ['leads.read_assigned', 'leads.edit_assigned'],
};

export const ROLE_LABELS = {
  owner: 'Propietario',
  admin: 'Administrador',
  agent: 'Agente',
};

export function hasPermission(member, key) {
  if (!member?.active) return false;
  return member.role === 'owner' || (Array.isArray(member.permissions) && member.permissions.includes(key));
}

export function canViewLeads(member) {
  return hasPermission(member, 'leads.read_all') || hasPermission(member, 'leads.read_assigned');
}

export function canEditLeads(member) {
  return hasPermission(member, 'leads.edit_all') || hasPermission(member, 'leads.edit_assigned');
}

export function allowedRoleForManager(manager, role) {
  if (!hasPermission(manager, 'users.manage')) return false;
  return manager.role === 'owner' ? ['admin', 'agent'].includes(role) : role === 'agent';
}

export function validateMemberPermissions(manager, role, proposed) {
  if (!allowedRoleForManager(manager, role) || !Array.isArray(proposed)) return null;
  const normalized = [...new Set(proposed.map(String))];
  if (normalized.some((value) => !PERMISSIONS.includes(value))) return null;
  if (role === 'agent' && normalized.includes('users.manage')) return null;
  if (normalized.some((value) => !hasPermission(manager, value))) return null;
  return normalized;
}
