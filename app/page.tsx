import { supabase } from '@/lib/supabase';

export default async function Home() {
  const { data, error } = await supabase
    .from('pod_submissions')
    .select('*');

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>POD Submissions</h1>

      {error && (
        <p style={{ color: 'red' }}>
          Error loading data: {error.message}
        </p>
      )}

      {!error && data && data.length === 0 && (
        <p>No POD records found.</p>
      )}

      {!error && data && data.length > 0 && (
        <ul>
          {data.map((pod) => (
            <li key={pod.id} style={{ marginBottom: '16px' }}>
              <strong>Customer:</strong> {pod.customer_name}
              <br />
              <strong>Order #:</strong> {pod.order_number}
              <br />
              <strong>Driver:</strong> {pod.driver_name}
              <br />
              <strong>Status:</strong> {pod.delivery_status}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}