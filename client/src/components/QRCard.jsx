import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, Printer, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

const CATEGORY_ICONS = {
  phone: '📱', keys: '🔑', wallet: '👛', bag: '🎒', umbrella: '☂️',
  laptop: '💻', headphones: '🎧', glasses: '👓', watch: '⌚',
  camera: '📷', book: '📚', calculator: '🧮', other: '📦',
}

const QRCard = ({ itemId, itemName, category }) => {
  const canvasRef = useRef(null)
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const publicUrl = `${window.location.origin}/found/${itemId}`

  useEffect(() => {
    if (!canvasRef.current || !itemId) return

    QRCode.toCanvas(canvasRef.current, publicUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: '#0F172A',
        light: '#FFFFFF',
      },
      errorCorrectionLevel: 'H',
    }).then(() => {
      setQrDataUrl(canvasRef.current.toDataURL('image/png'))
    }).catch(console.error)
  }, [itemId, publicUrl])

  const handleDownload = () => {
    if (!qrDataUrl) return
    const link = document.createElement('a')
    link.download = `findit-qr-${itemName.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = qrDataUrl
    link.click()
    toast.success('QR code downloaded!')
  }

  const handlePrint = () => {
    if (!qrDataUrl) return
    const win = window.open('', '_blank')
    if (!win) {
      toast.error('Popup window blocked! Please allow popups to print labels.')
      return
    }
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>FindIt QR — ${itemName}</title>
          <style>
            body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #fff; }
            .label { text-align: center; border: 2px solid #E2E8F0; border-radius: 16px; padding: 24px; width: 260px; }
            .brand { font-size: 13px; font-weight: 700; color: #2563EB; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 8px; }
            img { width: 180px; height: 180px; display: block; margin: 0 auto 12px; }
            .item-name { font-size: 18px; font-weight: 700; color: #0F172A; margin-bottom: 4px; }
            .subtitle { font-size: 11px; color: #94A3B8; }
            @media print { @page { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="brand">🔍 FINDIT</div>
            <img src="${qrDataUrl}" alt="QR Code" />
            <div class="item-name">${CATEGORY_ICONS[category] || '📦'} ${itemName}</div>
            <div class="subtitle">Scan to report this item as found</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `)
    win.document.close()
  }

  return (
    <div className="card p-6 flex flex-col items-center text-center">
      {/* QR code label header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <QrCode size={16} className="text-white" />
        </div>
        <span className="font-display font-bold text-slate-700">QR Code</span>
      </div>

      {/* Canvas */}
      <div className="p-4 bg-white border-2 border-slate-100 rounded-2xl shadow-inner mb-4">
        <canvas ref={canvasRef} className="rounded-lg" />
      </div>

      {/* Item label */}
      <div className="mb-5">
        <p className="text-2xl mb-1">{CATEGORY_ICONS[category] || '📦'}</p>
        <p className="font-display font-bold text-ink text-lg leading-tight">{itemName}</p>
        <p className="text-xs text-slate-400 mt-1 font-mono break-all px-4">{itemId}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 w-full">
        <button
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="btn-primary flex-1 text-sm py-2.5"
        >
          <Download size={15} /> Download PNG
        </button>
        <button
          onClick={handlePrint}
          disabled={!qrDataUrl}
          className="btn-secondary flex-1 text-sm py-2.5"
        >
          <Printer size={15} /> Print Label
        </button>
      </div>
    </div>
  )
}

export { CATEGORY_ICONS }
export default QRCard
