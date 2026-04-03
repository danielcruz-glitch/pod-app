import { supabase } from '@/lib/supabase';
import NavBar from '../components/NavBar';
import Link from 'next/link';

export default async function Home() {
  const { data, error } = await supabase
    .from('pod_submissions')
    .select('id, created_at, customer_name, order_number, delivery_status, email_status')
    .order('created_at', { ascending: false });

  const totalPods = data?.length ?? 0;
  const sentEmails = data?.filter((row) => row.email_status === 'sent').length ?? 0;
  const pendingEmails =
    data?.filter((row) => row.email_status !== 'sent').length ?? 0;

  const recentPods = data?.slice(0, 5) ?? [];

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d9e2ec',
            borderRadius: '12px',
            padding: '28px',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '32px', color: '#102a43' }}>
            POD Operations Dashboard
          </h1>
          <p style={{ marginTop: '10px', color: '#486581', fontSize: '16px' }}>
            Create Proof of Delivery records, generate professional PDFs, email customers,
            and track delivery history in one place.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
            <Link
              href="/pod/new"
              style={{
                backgroundColor: '#0070f3',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
              }}
            >
              New POD Entry
            </Link>

            <Link
              href="/pod/history"
              style={{
                backgroundColor: '#ffffff',
                color: '#102a43',
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 'bold',
                border: '1px solid #bcccdc',
              }}
            >
              View POD History
            </Link>
          </div>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <DashboardCard title="Total PODs" value={String(totalPods)} />
          <DashboardCard title="Emails Sent" value={String(sentEmails)} />
          <DashboardCard title="Pending / Failed" value={String(pendingEmails)} />
        </section>

        <section
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d9e2ec',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h2 style={{ marginTop: 0, color: '#102a43' }}>Recent POD Activity</h2>

          {error && (
            <p style={{ color: 'red' }}>
              Error loading dashboard data: {error.message}
            </p>
          )}

          {!error && recentPods.length === 0 && (
            <p style={{ color: '#486581' }}>No POD records found yet.</p>
          )}

          {!error && recentPods.length > 0 && (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  minWidth: '700px',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f0f4f8' }}>
                    <th style={thStyle}>Created</th>
                    <th style={thStyle}>Customer</th>
                    <th style={thStyle}>Order #</th>
                    <th style={thStyle}>Status</th>
                    <th style={thStyle}>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPods.map((pod) => (
                    <tr key={pod.id}>
                      <td style={tdStyle}>
                        {pod.created_at
                          ? new Date(pod.created_at).toLocaleString()
                          : ''}
                      </td>
                      <td style={tdStyle}>{pod.customer_name}</td>
                      <td style={tdStyle}>{pod.order_number}</td>
                      <td style={tdStyle}>{pod.delivery_status}</td>
                      <td style={tdStyle}>{pod.email_status || 'pending'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function DashboardCard({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #d9e2ec',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ color: '#486581', fontSize: '14px', marginBottom: '8px' }}>{title}</div>
      <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#102a43' }}>{value}</div>
    </div>
  );
}

const thStyle = {
  borderBottom: '1px solid #d9e2ec',
  padding: '12px',
  textAlign: 'left' as const,
  color: '#243b53',
  fontSize: '14px',
};

const tdStyle = {
  borderBottom: '1px solid #e6edf3',
  padding: '12px',
  color: '#334e68',
  fontSize: '14px',
};