import AdminShell from '@/components/admin/AdminShell';
import { requireAdmin } from '@/lib/admin';
import SecurityFactors from './SecurityFactors';

export const metadata = { title: 'Seguridad de la cuenta', robots: { index: false, follow: false } };

export default async function SecurityPage() {
  await requireAdmin();
  return (
    <AdminShell title="Seguridad de la cuenta"
      description="Protege tu acceso al CRM con una aplicación de autenticación.">
      <SecurityFactors />
    </AdminShell>
  );
}
