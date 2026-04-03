'use client';

import { useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import NavBar from '../../../components/NavBar';

export default function NewPodPage() {
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const fieldRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)[]>([]);

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
    receiver_printed_name: '',
    notes: '',
    recipient_email: '',
    cc_email: '',
    submitted_by: '',
    signature_data: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeField, setActiveField] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function clearSignature() {
    sigCanvas.current?.clear();
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

    try {
      let signatureData = '';

      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        signatureData = sigCanvas.current
          .getTrimmedCanvas()
          .toDataURL('image/png');
      }

      const response = await fetch('/api/pod/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          signature_data: signatureData,
          items_delivered: form.items_delivered
            ? Number(form.items_delivered)
            : null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong.');
      }

      setMessage(result.message || 'POD submitted successfully.');

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
        receiver_printed_name: '',
        notes: '',
        recipient_email: '',
        cc_email: '',
        submitted_by: '',
        signature_data: '',
      });

      sigCanvas.current?.clear();
      fieldRefs.current[0]?.focus();
    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ maxWidth: '1050px', margin: '0 auto', padding: '32px 24px' }}>
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #d9e2ec',
            borderRadius: '12px',
            padding: '28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}
        >
          <h1 style={{ marginTop: 0, marginBottom: '8px', color: '#102a43' }}>
            New POD Submission
          </h1>
          <p style={{ marginTop: 0, marginBottom: '24px', color: '#486581' }}>
            Data-entry mode: press <strong>Enter</strong> to move to the next field.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '16px',
              }}
            >
              <FormField label="Delivery Date">
                <input
                  ref={(el) => {
                    fieldRefs.current[0] = el;
                  }}
                  name="delivery_date"
                  type="date"
                  value={form.delivery_date}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 0)}
                  onFocus={() => setActiveField('delivery_date')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'delivery_date')}
                />
              </FormField>

              <FormField label="Delivery Time">
                <input
                  ref={(el) => {
                    fieldRefs.current[1] = el;
                  }}
                  name="delivery_time"
                  placeholder="Delivery Time"
                  value={form.delivery_time}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 1)}
                  onFocus={() => setActiveField('delivery_time')}
                  onBlur={() => setActiveField('')}
                  style={inputStyle(activeField === 'delivery_time')}
                />
              </FormField>

              <FormField label="Driver Name">
                <input
                  ref={(el) => {
                    fieldRefs.current[2] = el;
                  }}
                  name="driver_name"
                  placeholder="Driver Name"
                  value={form.driver_name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 2)}
                  onFocus={() => setActiveField('driver_name')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'driver_name')}
                />
              </FormField>

              <FormField label="Customer Name">
                <input
                  ref={(el) => {
                    fieldRefs.current[3] = el;
                  }}
                  name="customer_name"
                  placeholder="Customer Name"
                  value={form.customer_name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 3)}
                  onFocus={() => setActiveField('customer_name')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'customer_name')}
                />
              </FormField>

              <FormField label="Company Name">
                <input
                  ref={(el) => {
                    fieldRefs.current[4] = el;
                  }}
                  name="company_name"
                  placeholder="Company Name"
                  value={form.company_name}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 4)}
                  onFocus={() => setActiveField('company_name')}
                  onBlur={() => setActiveField('')}
                  style={inputStyle(activeField === 'company_name')}
                />
              </FormField>

              <FormField label="Delivery Address">
                <input
                  ref={(el) => {
                    fieldRefs.current[5] = el;
                  }}
                  name="delivery_address"
                  placeholder="Delivery Address"
                  value={form.delivery_address}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 5)}
                  onFocus={() => setActiveField('delivery_address')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'delivery_address')}
                />
              </FormField>

              <FormField label="Order Number">
                <input
                  ref={(el) => {
                    fieldRefs.current[6] = el;
                  }}
                  name="order_number"
                  placeholder="Order Number"
                  value={form.order_number}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 6)}
                  onFocus={() => setActiveField('order_number')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'order_number')}
                />
              </FormField>

              <FormField label="Items Delivered">
                <input
                  ref={(el) => {
                    fieldRefs.current[7] = el;
                  }}
                  name="items_delivered"
                  type="number"
                  placeholder="Items Delivered"
                  value={form.items_delivered}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 7)}
                  onFocus={() => setActiveField('items_delivered')}
                  onBlur={() => setActiveField('')}
                  style={inputStyle(activeField === 'items_delivered')}
                />
              </FormField>

              <FormField label="Delivery Status">
                <select
                  ref={(el) => {
                    fieldRefs.current[8] = el;
                  }}
                  name="delivery_status"
                  value={form.delivery_status}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 8)}
                  onFocus={() => setActiveField('delivery_status')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'delivery_status')}
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Partially Delivered">Partially Delivered</option>
                  <option value="Delivery Attempted">Delivery Attempted</option>
                  <option value="Refused">Refused</option>
                </select>
              </FormField>

              <FormField label="Recipient Email">
                <input
                  ref={(el) => {
                    fieldRefs.current[9] = el;
                  }}
                  name="recipient_email"
                  type="email"
                  placeholder="Recipient Email"
                  value={form.recipient_email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 9)}
                  onFocus={() => setActiveField('recipient_email')}
                  onBlur={() => setActiveField('')}
                  required
                  style={inputStyle(activeField === 'recipient_email')}
                />
              </FormField>

              <FormField label="CC Email">
                <input
                  ref={(el) => {
                    fieldRefs.current[10] = el;
                  }}
                  name="cc_email"
                  type="email"
                  placeholder="CC Email (optional)"
                  value={form.cc_email}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 10)}
                  onFocus={() => setActiveField('cc_email')}
                  onBlur={() => setActiveField('')}
                  style={inputStyle(activeField === 'cc_email')}
                />
              </FormField>

              <FormField label="Submitted By">
                <input
                  ref={(el) => {
                    fieldRefs.current[11] = el;
                  }}
                  name="submitted_by"
                  placeholder="Submitted By"
                  value={form.submitted_by}
                  onChange={handleChange}
                  onKeyDown={(e) => handleKeyDown(e, 11)}
                  onFocus={() => setActiveField('submitted_by')}
                  onBlur={() => setActiveField('')}
                  style={inputStyle(activeField === 'submitted_by')}
                />
              </FormField>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Notes">
                  <textarea
                    ref={(el) => {
                      fieldRefs.current[12] = el;
                    }}
                    name="notes"
                    placeholder="Notes"
                    value={form.notes}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 12)}
                    onFocus={() => setActiveField('notes')}
                    onBlur={() => setActiveField('')}
                    rows={4}
                    style={{
                      ...inputStyle(activeField === 'notes'),
                      resize: 'vertical',
                    }}
                  />
                </FormField>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <div
                  style={{
                    border: '1px solid #d9e2ec',
                    borderRadius: '10px',
                    padding: '18px',
                    backgroundColor: '#f8fbff',
                  }}
                >
                  <label
                    style={{
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: 'bold',
                      color: '#102a43',
                    }}
                  >
                    Receiver Signature
                  </label>

                  <div
                    style={{
                      border: '1px solid #bcccdc',
                      background: '#ffffff',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      maxWidth: '520px',
                    }}
                  >
                    <SignatureCanvas
                      ref={sigCanvas}
                      penColor="black"
                      canvasProps={{
                        width: 520,
                        height: 180,
                        style: { width: '100%', height: '180px', display: 'block' },
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={clearSignature}
                    style={{
                      marginTop: '10px',
                      padding: '10px 14px',
                      backgroundColor: '#829ab1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    Clear Signature
                  </button>
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <FormField label="Receiver Printed Name">
                  <input
                    ref={(el) => {
                      fieldRefs.current[13] = el;
                    }}
                    name="receiver_printed_name"
                    placeholder="Receiver Printed Name"
                    value={form.receiver_printed_name}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, 13)}
                    onFocus={() => setActiveField('receiver_printed_name')}
                    onBlur={() => setActiveField('')}
                    required
                    style={inputStyle(activeField === 'receiver_printed_name')}
                  />
                </FormField>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#0070f3',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  fontSize: '15px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,112,243,0.25)',
                }}
              >
                {loading ? 'Submitting...' : 'Submit POD'}
              </button>

              {message && (
                <p
                  style={{
                    margin: 0,
                    color: message.startsWith('Error') ? '#d64545' : '#147d64',
                    fontWeight: 600,
                  }}
                >
                  {message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: '6px',
          fontWeight: 'bold',
          color: '#243b53',
          fontSize: '14px',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function inputStyle(isActive: boolean): React.CSSProperties {
  return {
    width: '100%',
    padding: '11px 12px',
    border: isActive ? '2px solid #2684ff' : '1px solid #bcccdc',
    borderRadius: '8px',
    outline: 'none',
    backgroundColor: '#ffffff',
    boxShadow: isActive ? '0 0 0 3px rgba(38,132,255,0.12)' : 'none',
    transition: 'all 0.15s ease',
    fontSize: '14px',
    color: '#102a43',
  };
}