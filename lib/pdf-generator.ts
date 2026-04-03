import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

type PodData = {
  id?: string;
  delivery_date: string;
  delivery_time?: string;
  driver_name: string;
  customer_name: string;
  company_name?: string;
  delivery_address: string;
  order_number: string;
  items_delivered?: number | null;
  delivery_status: string;
  receiver_printed_name: string;
  notes?: string;
  recipient_email: string;
  cc_email?: string;
  submitted_by?: string;
  signature_data?: string;
};

export async function generatePodPdf(data: PodData) {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]);

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const black = rgb(0, 0, 0);
  const gray = rgb(0.4, 0.4, 0.4);
  const lightGray = rgb(0.9, 0.9, 0.9);
  const border = rgb(0.7, 0.7, 0.7);
  const blue = rgb(0, 0.32, 0.71);

  const margin = 40;
  const width = 612 - margin * 2;

  let y = 750;

  function drawDivider(yPos: number) {
    page.drawLine({
      start: { x: margin, y: yPos },
      end: { x: margin + width, y: yPos },
      thickness: 1,
      color: border,
    });
  }

  function drawSectionHeader(title: string, yPos: number) {
    page.drawRectangle({
      x: margin,
      y: yPos,
      width,
      height: 20,
      color: lightGray,
      borderColor: border,
      borderWidth: 1,
    });

    page.drawText(title, {
      x: margin + 10,
      y: yPos + 5,
      size: 11,
      font: boldFont,
      color: black,
    });
  }

  function drawBox(yPos: number, height: number) {
    page.drawRectangle({
      x: margin,
      y: yPos,
      width,
      height,
      borderColor: border,
      borderWidth: 1,
    });
  }

  function field(label: string, value: string, x: number, yPos: number) {
    page.drawText(label, {
      x,
      y: yPos,
      size: 10,
      font: boldFont,
      color: gray,
    });

    page.drawText(value || '-', {
      x: x + 110,
      y: yPos,
      size: 10,
      font,
      color: black,
    });
  }

  // HEADER
  page.drawText('PROOF OF DELIVERY', {
    x: margin,
    y,
    size: 20,
    font: boldFont,
    color: blue,
  });

  page.drawText(`POD #: ${data.id ?? '-'}`, {
    x: 420,
    y,
    size: 11,
    font: boldFont,
  });

  y -= 20;

  page.drawText(`Date Issued: ${new Date().toLocaleDateString()}`, {
    x: 420,
    y,
    size: 10,
    font,
  });

  y -= 20;
  drawDivider(y);
  y -= 25;

  // CUSTOMER SECTION
  drawSectionHeader('CUSTOMER / DELIVERY INFORMATION', y);
  y -= 20;

  drawBox(y - 100, 100);

  field('Customer:', data.customer_name, margin + 10, y - 20);
  field('Company:', data.company_name || '-', margin + 10, y - 40);
  field('Address:', data.delivery_address, margin + 10, y - 60);
  field('Email:', data.recipient_email, margin + 10, y - 80);

  y -= 120;

  // DELIVERY DETAILS
  drawSectionHeader('DELIVERY DETAILS', y);
  y -= 20;

  drawBox(y - 100, 100);

  field('Order #:', data.order_number, margin + 10, y - 20);
  field('Status:', data.delivery_status, margin + 300, y - 20);

  field('Date:', data.delivery_date, margin + 10, y - 40);
  field('Time:', data.delivery_time || '-', margin + 300, y - 40);

  field('Driver:', data.driver_name, margin + 10, y - 60);
  field(
    'Items:',
    data.items_delivered !== null ? String(data.items_delivered) : '-',
    margin + 300,
    y - 60
  );

  field('Submitted By:', data.submitted_by || '-', margin + 10, y - 80);

  y -= 120;

  // RECEIVER SECTION
  drawSectionHeader('RECEIVER ACKNOWLEDGEMENT', y);
  y -= 20;

  drawBox(y - 140, 140);

  field('Printed Name:', data.receiver_printed_name, margin + 10, y - 20);

  page.drawText('Signature:', {
    x: margin + 10,
    y: y - 50,
    size: 10,
    font: boldFont,
  });

  // signature line
  page.drawLine({
    start: { x: margin + 10, y: y - 110 },
    end: { x: margin + 250, y: y - 110 },
    thickness: 1,
    color: border,
  });

  if (data.signature_data) {
    try {
      const img = await pdfDoc.embedPng(data.signature_data);
      page.drawImage(img, {
        x: margin + 20,
        y: y - 100,
        width: 180,
        height: 60,
      });
    } catch {}
  }

  page.drawText('Authorized Receiver', {
    x: margin + 10,
    y: y - 125,
    size: 9,
    font,
    color: gray,
  });

  y -= 160;

  // NOTES
  drawSectionHeader('NOTES / EXCEPTIONS', y);
  y -= 20;

  drawBox(y - 90, 90);

  const notes = data.notes || 'No notes provided.';
  page.drawText(notes, {
    x: margin + 10,
    y: y - 20,
    size: 10,
    font,
    maxWidth: width - 20,
  });

  y -= 110;

  // FOOTER
  drawDivider(y);

  page.drawText(
    'This document confirms receipt of goods/services listed above.',
    {
      x: margin,
      y: y - 15,
      size: 9,
      font,
      color: gray,
    }
  );

  page.drawText(`Generated on ${new Date().toLocaleString()}`, {
    x: 360,
    y: y - 15,
    size: 9,
    font,
    color: gray,
  });

  return await pdfDoc.save();
}