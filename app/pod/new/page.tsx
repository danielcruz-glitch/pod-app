'use client';

import { useRef, useState } from 'react';

export default function NewPodPage() {
  const fieldRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)[]>([]);

  const [form, setForm] = useState({
    delivery_date: '',
    delivery_time: '',
    driver_name: '',
    driver_phone: '',
    customer_name: '',
    company_name: '',
    delivery_address: '',
    order_number: '',
    items_delivered: '',
    delivery_status: 'Delivered',
    notes: '',
    recipient_email: '',
    billing_email: '',
    cc_email: '',
    submitted_by: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [signingLink, setSigningLink] = useState('');
  const [activeField, setActiveField] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    index: number
  ) {
    if (e.key === 'Enter' && e.currentTarget.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const nextField = fieldRefs.current[index + 1];
      nextField?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setSigningLink('');

    try {
      const response = await fetch('/api/pod/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

      setMessage(result.message || 'Dispatch POD created successfully.');
      setSigningLink(result.signingLink || '');

      setForm({
        delivery_date: '',
        delivery_time: '',
        driver_name: '',
        driver_phone: '',
        customer_name: '',
        company_name: '',
        delivery_address: '',
        order_number: '',
        items_delivered: '',
        delivery_status: 'Delivered',
        notes: '',
        recipient_email: '',
        billing_email: '',
        cc_email: '',
        submitted_by: '',
      });

      fieldRefs.current[0]?.focus();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  function inputStyle(fieldName: string): React.CSSProperties {
    const isActive = activeField === fieldName;
    const hasValue = String((form as any)[fieldName] || '').length > 0;
    return {
      width: '100%',
      padding: '9px 12px',
      border: `1.5px solid ${isActive ? '#f59e0b' : hasValue ? '#78716c' : '#d6d3d1'}`,
      borderRadius: '7px',
      outline: 'none',
      backgroundColor: '#ffffff',
      boxShadow: isActive ? '0 0 0 3px rgba(245,158,11,0.15)' : 'none',
      transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
      fontSize: '13px',
      color: '#1c1917',
      fontFamily: 'inherit',
    };
  }

  function selectStyle(fieldName: string): React.CSSProperties {
    return {
      ...inputStyle(fieldName),
      padding: '9px 32px 9px 12px',
      appearance: 'none',
      backgroundImage:
        "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2378716c' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 8px center',
      backgroundSize: '20px',
      cursor: 'pointer',
    };
  }

  const isError = message.startsWith('Error');

  return (
    <main
      style={{
        backgroundColor: '#fafaf9',
        minHeight: 'calc(100vh - 50px)',
        padding: '28px 22px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: '860px',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          border: '1.5px solid #d6d3d1',
          borderRadius: '10px',
          padding: '20px 22px 24px',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            paddingBottom: '16px',
            borderBottom: '1px solid #e7e5e4',
          }}
        >
          <div>
            <h1
              style={{
                margin: '0 0 2px',
                fontSize: '19px',
                fontWeight: 700,
                color: '#1c1917',
              }}
            >
              Dispatch POD Entry
            </h1>
            <p style={{ margin: 0, fontSize: '12px', color: '#78716c' }}>
              Prepare the POD here — the signing link will be sent to the driver.
            </p>
          </div>
          <span
            style={{
              backgroundColor: '#fef3c7',
              color: '#92400e',
              border: '1px solid #fbbf24',
              borderRadius: '12px',
              padding: '3px 10px',
              fontSize: '12px',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            ⚡ Live
          </span>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Section 1: ORDER INFORMATION ── */}
          <SectionLabel text="Order Information" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Order Number" required>
              <input
                ref={(el) => { fieldRefs.current[7] = el; }}
                name="order_number"
                placeholder="e.g. ORD-1234"
                value={form.order_number}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 7)}
                onFocus={() => setActiveField('order_number')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('order_number')}
              />
            </FormField>

            <FormField label="Company Name">
              <input
                ref={(el) => { fieldRefs.current[5] = el; }}
                name="company_name"
                placeholder="Company name"
                value={form.company_name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 5)}
                onFocus={() => setActiveField('company_name')}
                onBlur={() => setActiveField('')}
                style={inputStyle('company_name')}
              />
            </FormField>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Customer Name" required>
              <input
                ref={(el) => { fieldRefs.current[4] = el; }}
                name="customer_name"
                placeholder="Full name"
                value={form.customer_name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 4)}
                onFocus={() => setActiveField('customer_name')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('customer_name')}
              />
            </FormField>

            <FormField label="Recipient Email" required>
              <input
                ref={(el) => { fieldRefs.current[10] = el; }}
                name="recipient_email"
                type="email"
                placeholder="email@example.com"
                value={form.recipient_email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 10)}
                onFocus={() => setActiveField('recipient_email')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('recipient_email')}
              />
            </FormField>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Billing Email">
              <input
                ref={(el) => { fieldRefs.current[11] = el; }}
                name="billing_email"
                type="email"
                placeholder="billing@example.com"
                value={form.billing_email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 11)}
                onFocus={() => setActiveField('billing_email')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('billing_email')}
              />
            </FormField>

            <FormField label="CC Email">
              <input
                ref={(el) => { fieldRefs.current[12] = el; }}
                name="cc_email"
                type="email"
                placeholder="cc@example.com (optional)"
                value={form.cc_email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 12)}
                onFocus={() => setActiveField('cc_email')}
                onBlur={() => setActiveField('')}
                style={inputStyle('cc_email')}
              />
            </FormField>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <FormField label="Delivery Address" required>
              <input
                ref={(el) => { fieldRefs.current[6] = el; }}
                name="delivery_address"
                placeholder="Street address, city, state"
                value={form.delivery_address}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 6)}
                onFocus={() => setActiveField('delivery_address')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('delivery_address')}
              />
            </FormField>
          </div>

          {/* ── Divider ── */}
          <div style={{ borderTop: '1px solid #e7e5e4', margin: '14px 0' }} />

          {/* ── Section 2: CARGO & DRIVER ── */}
          <SectionLabel text="Cargo & Driver" />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Delivery Date" required>
              <input
                ref={(el) => { fieldRefs.current[0] = el; }}
                name="delivery_date"
                type="date"
                value={form.delivery_date}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 0)}
                onFocus={() => setActiveField('delivery_date')}
                onBlur={() => setActiveField('')}
                required
                aria-label="Delivery Date"
                title="Delivery Date"
                style={inputStyle('delivery_date')}
              />
            </FormField>

            <FormField label="Delivery Time">
              <input
                ref={(el) => { fieldRefs.current[1] = el; }}
                name="delivery_time"
                placeholder="e.g. 10:00 AM"
                value={form.delivery_time}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 1)}
                onFocus={() => setActiveField('delivery_time')}
                onBlur={() => setActiveField('')}
                style={inputStyle('delivery_time')}
              />
            </FormField>

            <FormField label="Driver Name" required>
              <input
                ref={(el) => { fieldRefs.current[2] = el; }}
                name="driver_name"
                placeholder="Driver full name"
                value={form.driver_name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 2)}
                onFocus={() => setActiveField('driver_name')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('driver_name')}
              />
            </FormField>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Driver Phone" required>
              <input
                ref={(el) => { fieldRefs.current[3] = el; }}
                name="driver_phone"
                placeholder="+19175551234"
                value={form.driver_phone}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 3)}
                onFocus={() => setActiveField('driver_phone')}
                onBlur={() => setActiveField('')}
                required
                style={inputStyle('driver_phone')}
              />
            </FormField>

            <FormField label="Items Delivered">
              <input
                ref={(el) => { fieldRefs.current[8] = el; }}
                name="items_delivered"
                type="number"
                placeholder="Number of items"
                value={form.items_delivered}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 8)}
                onFocus={() => setActiveField('items_delivered')}
                onBlur={() => setActiveField('')}
                style={inputStyle('items_delivered')}
              />
            </FormField>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            <FormField label="Delivery Status" required>
              <select
                ref={(el) => { fieldRefs.current[9] = el; }}
                name="delivery_status"
                value={form.delivery_status}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 9)}
                onFocus={() => setActiveField('delivery_status')}
                onBlur={() => setActiveField('')}
                required
                aria-label="Delivery Status"
                style={selectStyle('delivery_status')}
              >
                <option value="Delivered">Delivered</option>
                <option value="Partially Delivered">Partially Delivered</option>
                <option value="Delivery Attempted">Delivery Attempted</option>
                <option value="Refused">Refused</option>
              </select>
            </FormField>

            <FormField label="Submitted By">
              <input
                ref={(el) => { fieldRefs.current[13] = el; }}
                name="submitted_by"
                placeholder="Your name"
                value={form.submitted_by}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 13)}
                onFocus={() => setActiveField('submitted_by')}
                onBlur={() => setActiveField('')}
                style={inputStyle('submitted_by')}
              />
            </FormField>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <FormField label="Notes">
              <textarea
                ref={(el) => { fieldRefs.current[14] = el; }}
                name="notes"
                placeholder="Any additional notes…"
                value={form.notes}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, 14)}
                onFocus={() => setActiveField('notes')}
                onBlur={() => setActiveField('')}
                rows={4}
                style={{
                  ...inputStyle('notes'),
                  resize: 'vertical',
                  height: '80px',
                }}
              />
            </FormField>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 0',
              backgroundColor: '#f59e0b',
              color: '#1c1917',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.8 : 1,
              transition: 'background 0.15s ease',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Creating POD…' : 'Create POD →'}
          </button>
        </form>

        {message && (
          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              backgroundColor: isError ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${isError ? '#fca5a5' : '#86efac'}`,
              borderRadius: '7px',
              fontSize: '13px',
              color: isError ? '#dc2626' : '#15803d',
              fontWeight: 600,
            }}
          >
            {message}
          </div>
        )}

        {signingLink && (
          <div
            style={{
              marginTop: '12px',
              padding: '14px 16px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fbbf24',
              borderRadius: '8px',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
                color: '#92400e',
                marginBottom: '6px',
              }}
            >
              Signing Link
            </div>
            <div
              style={{
                wordBreak: 'break-all',
                fontSize: '13px',
                color: '#1c1917',
              }}
            >
              {signingLink}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: '11px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.09em',
        color: '#78716c',
        marginBottom: '10px',
      }}
    >
      {text}
    </div>
  );
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 600,
          color: '#44403c',
          marginBottom: '5px',
        }}
      >
        {label}
        {required && (
          <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}
