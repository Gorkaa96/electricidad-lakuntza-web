'use client';

import { ROLE_DEFAULTS } from '@/lib/rolePermissions';

export default function InviteRoleSelect({ allowAdmin = false }) {
  function syncDefaults(event) {
    const role = event.target.value;
    const defaults = new Set(ROLE_DEFAULTS[role] || []);
    const form = event.currentTarget.form;
    if (!form) return;
    for (const checkbox of form.querySelectorAll('input[type="checkbox"][name="permissions"]')) {
      checkbox.checked = !checkbox.disabled && defaults.has(checkbox.value);
    }
  }

  return (
    <select name="role" defaultValue="agent" onChange={syncDefaults} className="min-h-12 rounded-xl border border-neutral-300 px-4 py-3">
      <option value="agent">Agente</option>
      {allowAdmin ? <option value="admin">Administrador</option> : null}
    </select>
  );
}
