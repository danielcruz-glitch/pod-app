'use client';

import { useState } from 'react';

export default function NewPodPage() {
  const [form, setForm] = useState({
    delivery_date: '',
    delivery_time: '',
    driver_name: '',
    customer_name: '',
    company_name: '',
    delivery_address: '',
    order_number: '',
    items_delivered: '',
    delivery_status: 'Delivered',
    receiver_name: '',
    notes: '',
    recipient_email: '',
    cc_email: '',
    submitted_by: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/pod/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          items_delivered: form.items_delivered
            ? Number(form.items_delivered)
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }

      setMessage(`POD submitted successfully. Order #: ${form.order_number}`);

      setForm({
        delivery_date: '',
        delivery_time: '',
        driver_name: '',
        customer_name: '',
        company_name: '',
        delivery_address: '',
        order_number: '',
        items_delivered: '',
        delivery_status: 'Delivered',
        receiver_name: '',
        notes: '',
        recipient_email: '',
        cc_email: '',
        submitted_by: '',
      });
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '700px' }}>
      <h1>New POD Submission</h1>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '12px' }}>
        <input name="delivery_date" type="date" value={form.delivery_date} onChange={handleChange} required />
        <input name="delivery_time" placeholder="Delivery Time" value={form.delivery_time} onChange={handleChange} />
        <input name="driver_name" placeholder="Driver Name" value={form.driver_name} onChange={handleChange} required />
        <input name="customer_name" placeholder="Customer Name" value={form.customer_name} onChange={handleChange} required />
        <input name="company_name" placeholder="Company Name" value={form.company_name} onChange={handleChange} />
        <input name="delivery_address" placeholder="Delivery Address" value={form.delivery_address} onChange={handleChange} required />
        <input name="order_number" placeholder="Order Number" value={form.order_number} onChange={handleChange} required />
        <input name="items_delivered" type="number" placeholder="Items Delivered" value={form.items_delivered} onChange={handleChange} />

        <select name="delivery_status" value={form.delivery_status} onChange={handleChange} required>
          <option value="Delivered">Delivered</option>
          <option value="Partially Delivered">Partially Delivered</option>
          <option value="Delivery Attempted">Delivery Attempted</option>
          <option value="Refused">Refused</option>
        </select>

        <input name="receiver_name" placeholder="Receiver Name" value={form.receiver_name} onChange={handleChange} required />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} rows={4} />
        <input name="recipient_email" type="email" placeholder="Recipient Email" value={form.recipient_email} onChange={handleChange} required />
        <input name="cc_email" type="email" placeholder="CC Email (optional)" value={form.cc_email} onChange={handleChange} />
        <input name="submitted_by" placeholder="Submitted By" value={form.submitted_by} onChange={handleChange} />

        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit POD'}
        </button>
      </form>

      {message && (
        <p style={{ marginTop: '16px', color: message.startsWith('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </main>
  );
}