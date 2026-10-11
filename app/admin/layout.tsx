import './anime.css';
import AdminShell from '@/components/admin/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anime-bg">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}