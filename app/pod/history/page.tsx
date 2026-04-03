import { supabase } from '@/lib/supabase';
import NavBar from '../../../components/NavBar';

export default async function PodHistoryPage() {
  const { data, error } = await supabase
    .from('pod_submissions')
    .select(
      'id, created_at, delivery_date, customer_name, order_number, driver_name, delivery_status, recipient_email, email_status, pdf_url'
    )
    .order('created_at', { ascending: false });

  return (
    <main style={{ fontFamily: 'Arial, sans-serif' }}>
      <NavBar />

      <div style={{ padding: '24px' }}>
        <h1 style={{ marginBottom: '20px' }}>POD History</h1>

        {error && (
          <p style={{ color: 'red' }}>
            Error loading POD history: {error.message}
          </p>
        )}

        {!error && data && data.length === 0 && (
          <p>No POD submissions found.</p>
        )}

        {!error && data && data.length > 0 && (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: '1000px',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#f3f3f3' }}>
                  <th style={thStyle}>Created</th>
                  <th style={thStyle}>Delivery Date</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Order #</th>
                  <th style={thStyle}>Driver</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Recipient Email</th>
                  <th style={thStyle}>Email Status</th>
                  <th style={thStyle}>PDF</th>
                </tr>
              </thead>

              <tbody>
                {data.map((pod) => (
                  <tr key={pod.id}>
                    <td style={tdStyle}>
                      {pod.created_at
                        ? new Date(pod.created_at).toLocaleString()
                        : ''}
                    </td>

                    <td style={tdStyle}>{pod.delivery_date}</td>
                    <td style={tdStyle}>{pod.customer_name}</td>
                    <td style={tdStyle}>{pod.order_number}</td>
                    <td style={tdStyle}>{pod.driver_name}</td>
                    <td style={tdStyle}>{pod.delivery_status}</td>
                    <td style={tdStyle}>{pod.recipient_email}</td>
                    <td style={tdStyle}>{pod.email_status || 'pending'}</td>

                    <td style={tdStyle}>
                      {pod.pdf_url ? (
                        <a
                          href={pod.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      ) : (
                        'No PDF'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

const thStyle = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left' as const,
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '10px',
};