import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import QRCodeLib from 'qrcode';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './App.css';
import LogoInQR from './LogoInQR';
import logo from './assets/TEMPLATE-LOGO-ML-1080-RGB.png';
import QRCode from 'react-qr-code';

type QrType = 'url' | 'text' | 'vcard' | 'wifi' | 'email' | 'sms' | 'event';

type VCardForm = {
  name: string;
  phone: string;
  email: string;
  org: string;
  url: string;
};

type WifiForm = {
  ssid: string;
  password: string;
  type: 'WPA' | 'WEP' | 'nopass';
};

type EmailForm = {
  to: string;
  subject: string;
  body: string;
};

type SmsForm = {
  to: string;
  body: string;
};

type EventForm = {
  title: string;
  start: string;
  end: string;
  location: string;
  description: string;
};

type FormState = {
  url: string;
  text: string;
  vcard: VCardForm;
  wifi: WifiForm;
  email: EmailForm;
  sms: SmsForm;
  event: EventForm;
};

type HistoryItem = { value: string; date: number };

const myLogo = logo;

function App() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [form, setForm] = useState<FormState>({
    url: '',
    text: '',
    vcard: { name: '', phone: '', email: '', org: '', url: '' },
    wifi: { ssid: '', password: '', type: 'WPA' },
    email: { to: '', subject: '', body: '' },
    sms: { to: '', body: '' },
    event: { title: '', start: '', end: '', location: '', description: '' },
  });

  const [qrColor, setQrColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [qrSize, setQrSize] = useState(256);
  const [logoUrl, setLogoUrl] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState('');
  const [accessible, setAccessible] = useState(false);

  const fileName = '';
  const svgRef = useRef<SVGSVGElement | null>(null);

  const getQRValue = (): string => {
    switch (qrType) {
      case 'url':
        return form.url;
      case 'text':
        return form.text;
      case 'vcard':
        return `BEGIN:VCARD\nVERSION:3.0\nFN:${form.vcard.name}\nORG:${form.vcard.org}\nTEL:${form.vcard.phone}\nEMAIL:${form.vcard.email}\nURL:${form.vcard.url}\nEND:VCARD`;
      case 'wifi':
        return `WIFI:T:${form.wifi.type};S:${form.wifi.ssid};P:${form.wifi.password};;`;
      case 'email':
        return `mailto:${form.email.to}?subject=${encodeURIComponent(form.email.subject)}&body=${encodeURIComponent(form.email.body)}`;
      case 'sms':
        return `SMSTO:${form.sms.to}:${form.sms.body}`;
      case 'event':
        return `BEGIN:VEVENT\nSUMMARY:${form.event.title}\nDTSTART:${form.event.start}\nDTEND:${form.event.end}\nLOCATION:${form.event.location}\nDESCRIPTION:${form.event.description}\nEND:VEVENT`;
      default:
        return '';
    }
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveToHistory = (value: string) => {
    if (!value) return;
    setHistory((h) => [{ value, date: Date.now() }, ...h.slice(0, 9)]);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQrType(e.target.value as QrType);
    setForm((f) => ({ ...f }));
  };

  const renderForm = () => {
    switch (qrType) {
      case 'url':
        return (
          <input
            className="input"
            type="text"
            placeholder="URL"
            value={form.url}
            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
          />
        );
      case 'text':
        return (
          <input
            className="input"
            type="text"
            placeholder="Texto libre"
            value={form.text}
            onChange={(e) => setForm((f) => ({ ...f, text: e.target.value }))}
          />
        );
      case 'vcard':
        return (
          <div className="vcard-form">
            <input
              className="input"
              type="text"
              placeholder="Nombre"
              value={form.vcard.name}
              onChange={(e) => setForm((f) => ({ ...f, vcard: { ...f.vcard, name: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Teléfono"
              value={form.vcard.phone}
              onChange={(e) => setForm((f) => ({ ...f, vcard: { ...f.vcard, phone: e.target.value } }))}
            />
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={form.vcard.email}
              onChange={(e) => setForm((f) => ({ ...f, vcard: { ...f.vcard, email: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Organización"
              value={form.vcard.org}
              onChange={(e) => setForm((f) => ({ ...f, vcard: { ...f.vcard, org: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Sitio web"
              value={form.vcard.url}
              onChange={(e) => setForm((f) => ({ ...f, vcard: { ...f.vcard, url: e.target.value } }))}
            />
          </div>
        );
      case 'wifi':
        return (
          <div className="wifi-form">
            <input
              className="input"
              type="text"
              placeholder="SSID"
              value={form.wifi.ssid}
              onChange={(e) => setForm((f) => ({ ...f, wifi: { ...f.wifi, ssid: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Contraseña"
              value={form.wifi.password}
              onChange={(e) => setForm((f) => ({ ...f, wifi: { ...f.wifi, password: e.target.value } }))}
            />
            <select
              className="input"
              value={form.wifi.type}
              onChange={(e) => setForm((f) => ({ ...f, wifi: { ...f.wifi, type: e.target.value as WifiForm['type'] } }))}
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">Sin contraseña</option>
            </select>
          </div>
        );
      case 'email':
        return (
          <div className="email-form">
            <input
              className="input"
              type="email"
              placeholder="Para"
              value={form.email.to}
              onChange={(e) => setForm((f) => ({ ...f, email: { ...f.email, to: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Asunto"
              value={form.email.subject}
              onChange={(e) => setForm((f) => ({ ...f, email: { ...f.email, subject: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Mensaje"
              value={form.email.body}
              onChange={(e) => setForm((f) => ({ ...f, email: { ...f.email, body: e.target.value } }))}
            />
          </div>
        );
      case 'sms':
        return (
          <div className="sms-form">
            <input
              className="input"
              type="text"
              placeholder="Para"
              value={form.sms.to}
              onChange={(e) => setForm((f) => ({ ...f, sms: { ...f.sms, to: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Mensaje"
              value={form.sms.body}
              onChange={(e) => setForm((f) => ({ ...f, sms: { ...f.sms, body: e.target.value } }))}
            />
          </div>
        );
      case 'event':
        return (
          <div className="event-form">
            <input
              className="input"
              type="text"
              placeholder="Título"
              value={form.event.title}
              onChange={(e) => setForm((f) => ({ ...f, event: { ...f.event, title: e.target.value } }))}
            />
            <input
              className="input"
              type="datetime-local"
              placeholder="Inicio"
              value={form.event.start}
              onChange={(e) => setForm((f) => ({ ...f, event: { ...f.event, start: e.target.value } }))}
            />
            <input
              className="input"
              type="datetime-local"
              placeholder="Fin"
              value={form.event.end}
              onChange={(e) => setForm((f) => ({ ...f, event: { ...f.event, end: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Ubicación"
              value={form.event.location}
              onChange={(e) => setForm((f) => ({ ...f, event: { ...f.event, location: e.target.value } }))}
            />
            <input
              className="input"
              type="text"
              placeholder="Descripción"
              value={form.event.description}
              onChange={(e) => setForm((f) => ({ ...f, event: { ...f.event, description: e.target.value } }))}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const handleDownloadSVG = () => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const svg = svgRef.current;
    const svgBlob = new Blob([serializer.serializeToString(svg)], { type: 'image/svg+xml' });
    saveAs(svgBlob, `${fileName || 'qr-code'}.svg`);
    saveToHistory(getQRValue());
  };

  const handleDownloadPNG = async () => {
    if (!getQRValue()) {
      setError('Error: No hay QR para exportar');
      return;
    }

    try {
      const qrDataUrl = await QRCodeLib.toDataURL(getQRValue(), {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: qrSize,
        color: { dark: qrColor, light: bgColor },
      });

      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Error al exportar PNG');
        return;
      }

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
          img.src = src;
        });

      const imgQR = await loadImage(qrDataUrl);
      ctx.drawImage(imgQR, 0, 0, qrSize, qrSize);

      if (logoUrl) {
        const imgLogo = await loadImage(logoUrl);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imgLogo.width;
        tempCanvas.height = imgLogo.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.drawImage(imgLogo, 0, 0);
          const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
          let minX = tempCanvas.width,
            minY = tempCanvas.height,
            maxX = 0,
            maxY = 0;
          for (let y = 0; y < tempCanvas.height; y++) {
            for (let x = 0; x < tempCanvas.width; x++) {
              const alpha = imgData.data[(y * tempCanvas.width + x) * 4 + 3];
              if (alpha > 0) {
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
              }
            }
          }
          const cropW = maxX - minX + 1;
          const cropH = maxY - minY + 1;
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = cropW;
          croppedCanvas.height = cropH;
          const croppedCtx = croppedCanvas.getContext('2d');
          if (croppedCtx) {
            croppedCtx.drawImage(tempCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
            const logoSize = qrSize * 0.25;
            const scale = Math.min(logoSize / cropW, logoSize / cropH);
            const logoW = cropW * scale;
            const logoH = cropH * scale;
            const x = qrSize / 2 - logoW / 2;
            const y = qrSize / 2 - logoH / 2;
            ctx.save();
            ctx.beginPath();
            ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(croppedCanvas, x, y, logoW, logoH);
            ctx.restore();
          }
        }
      }

      saveAs(canvas.toDataURL('image/png'), `${fileName || 'qr-code'}.png`);
      saveToHistory(getQRValue());
    } catch {
      setError('Error al exportar PNG');
    }
  };

  const handleShare = async () => {
    if (!svgRef.current) return;

    try {
      const serializer = new XMLSerializer();
      const svgBlob = new Blob([serializer.serializeToString(svgRef.current)], { type: 'image/svg+xml' });
      const file = new File([svgBlob], `${fileName || 'qr-code'}.svg`, { type: 'image/svg+xml' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'QR', text: getQRValue() });
      } else {
        setError('Compartir no soportado en este navegador');
      }
    } catch {
      setError('Error al compartir');
    }
  };

  const handleExportAllPDF = async () => {
    if (!history.length) return;

    if (!logoUrl && myLogo) {
      await new Promise<void>((resolve) => {
        fetch(myLogo)
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              setLogoUrl((e.target?.result as string) || '');
              setTimeout(resolve, 100);
            };
            reader.readAsDataURL(blob);
          })
          .catch(() => resolve());
      });
    }

    let waitCount = 0;
    while (!logoUrl && waitCount < 20) {
      await new Promise((r) => setTimeout(r, 50));
      waitCount++;
    }

    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [qrSize, qrSize + 40] });

    const generateQRWithLogo = async (value: string) => {
      const qrDataUrl = await QRCodeLib.toDataURL(value, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: qrSize,
        color: { dark: qrColor, light: bgColor },
      });

      const canvas = document.createElement('canvas');
      canvas.width = qrSize;
      canvas.height = qrSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return qrDataUrl;

      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('No se pudo cargar la imagen'));
          img.src = src;
        });

      const imgQR = await loadImage(qrDataUrl);
      ctx.drawImage(imgQR, 0, 0, qrSize, qrSize);

      if (logoUrl) {
        try {
          const imgLogo = await loadImage(logoUrl);
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = imgLogo.width;
          tempCanvas.height = imgLogo.height;
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            tempCtx.drawImage(imgLogo, 0, 0);
            const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
            let minX = tempCanvas.width,
              minY = tempCanvas.height,
              maxX = 0,
              maxY = 0;
            for (let y = 0; y < tempCanvas.height; y++) {
              for (let x = 0; x < tempCanvas.width; x++) {
                const alpha = imgData.data[(y * tempCanvas.width + x) * 4 + 3];
                if (alpha > 0) {
                  if (x < minX) minX = x;
                  if (y < minY) minY = y;
                  if (x > maxX) maxX = x;
                  if (y > maxY) maxY = y;
                }
              }
            }
            const cropW = maxX - minX + 1;
            const cropH = maxY - minY + 1;
            const croppedCanvas = document.createElement('canvas');
            croppedCanvas.width = cropW;
            croppedCanvas.height = cropH;
            const croppedCtx = croppedCanvas.getContext('2d');
            if (croppedCtx) {
              croppedCtx.drawImage(tempCanvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
              const logoSize = qrSize * 0.25;
              const scale = Math.min(logoSize / cropW, logoSize / cropH);
              const logoW = cropW * scale;
              const logoH = cropH * scale;
              const x = qrSize / 2 - logoW / 2;
              const y = qrSize / 2 - logoH / 2;
              ctx.save();
              ctx.beginPath();
              ctx.arc(qrSize / 2, qrSize / 2, logoSize / 2, 0, 2 * Math.PI);
              ctx.fillStyle = 'white';
              ctx.clip();
              ctx.drawImage(croppedCanvas, x, y, logoW, logoH);
              ctx.restore();
            }
          }
        } catch {
          // ignore logo errors
        }
      }

      return canvas.toDataURL('image/png');
    };

    for (let i = 0; i < history.length; i++) {
      const value = history[i].value;
      const png = await generateQRWithLogo(value);
      if (i > 0) pdf.addPage([qrSize, qrSize + 40], 'portrait');
      pdf.addImage(png, 'PNG', 0, 20, qrSize, qrSize);
      pdf.setFontSize(12);
      pdf.text(value.length > 40 ? value.slice(0, 40) + '…' : value, 10, 15);
    }

    pdf.save('qr-historial.pdf');
  };

  const handleExportAllZIP = async () => {
    if (!history.length) return;
    const zip = new JSZip();
    let csv = 'archivo,valor,fecha\n';

    let tempDiv: HTMLDivElement | null = null;
    if (logoUrl) {
      tempDiv = document.createElement('div');
      tempDiv.style.position = 'fixed';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);
    }

    for (let i = 0; i < history.length; i++) {
      const value = history[i].value;
      const date = history[i].date;
      const safeValue = String(value).replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 20);
      const filename = `${i + 1}_${safeValue}.png`;

      const png = await QRCodeLib.toDataURL(value, { errorCorrectionLevel: 'H', margin: 2, width: qrSize });
      zip.file(filename, png.split(',')[1], { base64: true });
      csv += `${filename},"${value.replace(/"/g, '""')}",${date}\n`;
    }

    if (logoUrl && tempDiv) document.body.removeChild(tempDiv);
    zip.file('metadatos.csv', csv);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'qr-historial.zip');
  };

  const handleExcelUpload = async (file: File | undefined) => {
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    const isCsv = lowerName.endsWith('.csv');
    const isXlsx = lowerName.endsWith('.xlsx');
    const isXls = lowerName.endsWith('.xls');

    if (isXls) {
      setError('xls no soportado, exporta a .xlsx');
      return;
    }

    if (!isCsv && !isXlsx) {
      setError('Solo se permiten archivos .xlsx o .csv');
      return;
    }

    const cellToString = (value: unknown): string => {
      if (value == null) return '';
      if (value instanceof Date) return value.toISOString();
      if (typeof value === 'object') {
        const record = value as Record<string, unknown>;
        const text = record['text'];
        if (typeof text === 'string') return text;
        const hyperlink = record['hyperlink'];
        if (typeof hyperlink === 'string') return hyperlink;
        if ('result' in record) return String(record['result']);
      }
      return String(value);
    };

    let rows: (string | number | null)[][] = [];

    try {
      if (isCsv) {
        const { default: Papa } = await import('papaparse');
        const text = await file.text();
        const parsed = Papa.parse<string[]>(text, { skipEmptyLines: true });
        if (parsed.errors.length) {
          setError('No se pudo parsear el CSV.');
          return;
        }
        rows = (parsed.data as unknown as string[][]).map((r) => r.map((c) => (c ?? '')));
      } else {
        const { default: ExcelJS } = await import('exceljs');
        const buffer = await file.arrayBuffer();
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(buffer);
        const ws = workbook.worksheets[0];
        if (!ws) {
          setError('El archivo Excel no tiene hojas.');
          return;
        }

        const headerRow = ws.getRow(1);
        const headerValues = (headerRow.values as unknown[]).slice(1);
        rows.push(headerValues.map((v) => cellToString(v)));

        for (let r = 2; r <= ws.rowCount; r++) {
          const row = ws.getRow(r);
          const values = (row.values as unknown[]).slice(1);
          if (!values.length) continue;
          rows.push(values.map((v) => cellToString(v)));
        }
      }
    } catch {
      setError('No se pudo leer el archivo.');
      return;
    }

    if (rows.length < 2) {
      setError('El archivo debe tener encabezados y al menos una fila de datos.');
      return;
    }

    const headers = rows[0].map((h) => String(h ?? ''));
    const fechaIdx = headers.findIndex((h) => h.toLowerCase().includes('fecha'));
    const urlIdx = headers.findIndex((h) => h.toLowerCase().includes('url'));

    if (fechaIdx === -1 || urlIdx === -1) {
      setError('El archivo debe tener columnas "fecha" y "url".');
      return;
    }

    const zip = new JSZip();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const fecha = row?.[fechaIdx] ?? '';
      const url = row?.[urlIdx] ?? '';
      const urlStr = String(url).trim();
      if (!urlStr) continue;

      const png = await QRCodeLib.toDataURL(urlStr, { errorCorrectionLevel: 'H', margin: 2, width: 256 });
      const safeFecha = String(fecha).replace(/[^a-zA-Z0-9-_]/g, '_');
      const safeUrl = urlStr.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 20);
      const filename = `${safeFecha}_${safeUrl}.png`;
      zip.file(filename, png.split(',')[1], { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'qr-masivo.zip');
    setError('');
  };

  const handleExcelInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    void handleExcelUpload(file);
  };

  const handleExcelDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const lowerName = file.name.toLowerCase();
    if (lowerName.endsWith('.xls')) {
      setError('xls no soportado, exporta a .xlsx');
      return;
    }

    if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.csv')) {
      void handleExcelUpload(file);
    } else {
      setError('Solo se permiten archivos .xlsx o .csv');
    }
  };

  const handleExcelDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div className="app-container">
      <h1 tabIndex={0} style={accessible ? { outline: '2px solid #f59e42', outlineOffset: 2 } : {}}>
        Generador de QR
      </h1>

      <div style={{ marginBottom: 12 }}>
        <select
          value={qrType}
          onChange={handleTypeChange}
          className="input"
          style={{ maxWidth: 220, margin: '0 auto', display: 'block' }}
          aria-label="Tipo de QR"
        >
          <option value="url">URL</option>
          <option value="text">Texto</option>
          <option value="vcard">vCard (Contacto)</option>
          <option value="wifi">WiFi</option>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="event">Evento</option>
        </select>
      </div>

      {renderForm()}

      <div
        style={{ display: 'flex', gap: 12, marginBottom: 18, justifyContent: 'center', flexWrap: 'wrap' }}
        role="group"
        aria-label="Opciones de personalización"
      >
        <label style={{ fontSize: 14, color: '#6366f1' }}>
          Color QR
          <input
            type="color"
            value={qrColor}
            onChange={(e) => setQrColor(e.target.value)}
            style={{ marginLeft: 8, verticalAlign: 'middle' }}
          />
        </label>
        <label style={{ fontSize: 14, color: '#6366f1' }}>
          Fondo
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            style={{ marginLeft: 8, verticalAlign: 'middle' }}
          />
        </label>
        <label style={{ fontSize: 14, color: '#6366f1' }}>
          Tamaño
          <select
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            style={{
              marginLeft: 8,
              verticalAlign: 'middle',
              borderRadius: 6,
              border: '1px solid #a5b4fc',
              padding: '2px 8px',
            }}
          >
            <option value={128}>128px</option>
            <option value={256}>256px</option>
            <option value={512}>512px</option>
          </select>
        </label>
        <label style={{ fontSize: 14, color: '#6366f1' }}>
          Logo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (ev) => setLogoUrl((ev.target?.result as string) || '');
                reader.readAsDataURL(file);
              }
            }}
            style={{ marginLeft: 8, verticalAlign: 'middle' }}
          />
        </label>
        <button
          onClick={() => setAccessible((a) => !a)}
          aria-label="Accesible"
          style={{
            background: accessible ? '#f59e42' : '#a5b4fc',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            padding: '4px 12px',
            fontSize: 14,
          }}
        >
          {accessible ? 'Accesible ON' : 'Accesible OFF'}
        </button>
      </div>

      <div
        className="preview"
        style={Object.assign({ background: bgColor }, accessible ? { outline: '2px solid #f59e42', outlineOffset: 2 } : {})}
        aria-label="Vista previa del código QR"
        tabIndex={0}
        role="region"
      >
        {getQRValue() ? (
          <svg
            ref={svgRef}
            width={qrSize}
            height={qrSize}
            viewBox={`0 0 ${qrSize} ${qrSize}`}
            style={{ background: bgColor, display: 'block', margin: '0 auto' }}
            role="img"
            aria-label="Código QR generado"
            className="qr-animate"
          >
            <QRCode value={getQRValue()} size={qrSize} level="H" fgColor={qrColor} bgColor={bgColor} />
            {logoUrl && <LogoInQR size={qrSize * 0.25} logo={logoUrl} qrSize={qrSize} />}
          </svg>
        ) : (
          <p>Introduce un texto para generar el QR</p>
        )}
      </div>

      {getQRValue() && !isValidUrl(getQRValue()) && getQRValue().startsWith('http') && (
        <div className="error">La URL no es válida</div>
      )}

      {error && <div className="error">{error}</div>}

      <div className="actions" role="group" aria-label="Acciones de exportación y descarga">
        <button onClick={handleDownloadSVG} disabled={!getQRValue()}>
          Descargar SVG
        </button>
        <button onClick={handleDownloadPNG} disabled={!getQRValue()}>
          Descargar PNG
        </button>
        <button onClick={handleShare} disabled={!getQRValue()}>
          Compartir
        </button>
        <button onClick={handleExportAllPDF} disabled={history.length === 0}>
          Exportar historial a PDF
        </button>
        <button onClick={handleExportAllZIP} disabled={history.length === 0}>
          Exportar historial a ZIP
        </button>
      </div>

      {history.length > 0 && (
        <div style={{ marginTop: 24, textAlign: 'left' }}>
          <h3 style={{ color: '#a5b4fc', fontSize: 16, marginBottom: 8 }}>Historial reciente</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {history.map((h, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#818cf8',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontSize: 14,
                  }}
                  onClick={() => setForm((f) => ({ ...f, url: h.value, text: h.value }))}
                  aria-label={`Generar QR para ${h.value}`}
                >
                  {h.value.length > 40 ? h.value.slice(0, 40) + '…' : h.value}
                </button>
                <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>{new Date(h.date).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginTop: 24 }}>
        <div
          style={{ display: 'inline-block' }}
          onDrop={handleExcelDrop}
          onDragOver={handleExcelDragOver}
          tabIndex={0}
          aria-label="Zona de carga masiva Excel"
        >
          <label style={{ fontSize: 14, color: '#6366f1', display: 'block', cursor: 'pointer' }}>
            Carga masiva (Excel):
            <input
              type="file"
              accept=".xlsx,.csv"
              onChange={handleExcelInput}
              style={{ marginLeft: 8, verticalAlign: 'middle', display: 'inline-block' }}
            />
            <span style={{ display: 'block', fontSize: 12, color: '#a5b4fc' }}>Arrastra y suelta aquí tu archivo</span>
          </label>
        </div>
      </div>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">© 2010-2026 <strong>GLASTOR-DEV</strong> — Todos los derechos reservados. GLASTOR® marca registrada.</p>
          <div className="footer-links">
            <a
              href="https://github.com/glastor-dev/qr-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Ver código en GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
              GitHub
            </a>
            <span className="footer-separator">•</span>
            <a
              href="https://github.com/glastor-dev/qr-pro/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="Ver licencia GPL-3.0"
            >
              GPL-3.0
            </a>
            <span className="footer-separator">•</span>
            <span className="footer-version">v1.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function WhatsAppFloatingButton() {
  return (
    <a
      href="https://wa.me/5491132578591"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        zIndex: 1000,
        background: '#25d366',
        color: '#fff',
        border: 'none',
        borderRadius: '50%',
        width: 56,
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        fontSize: 32,
        textDecoration: 'none',
      }}
      aria-label="Contactar por WhatsApp"
    >
      <span role="img" aria-label="WhatsApp">
        💬
      </span>
    </a>
  );
}

export default App;
