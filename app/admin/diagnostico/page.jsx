import { notFound } from 'next/navigation';

export const metadata = {
  title: 'No disponible',
  robots: { index: false, follow: false },
};

export default function AdminDiagnosticsPage() {
  notFound();
}
