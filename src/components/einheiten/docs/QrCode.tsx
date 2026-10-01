import { qrSvg } from '../../../lib/einheiten/qr'

interface QrCodeProps {
  /** Exakt der kodierte Inhalt — meist `landingUrl(setKey, buchstabe)`. */
  text: string
  /** Druckbreite inkl. Ruhezone. */
  groesseMm?: number
  /** Vorlesetext; ohne Angabe «QR-Code: <text>». */
  titel?: string
}

/**
 * QR-Code als Inline-SVG, schwarz auf weiss. Das SVG hat keine eigene Grösse und
 * füllt die Breite des Rahmens; `lineHeight: 0` verhindert den Grundlinien-Spalt.
 */
export function QrCode({ text, groesseMm = 25, titel }: QrCodeProps) {
  return (
    <span
      className="qr-code"
      role="img"
      aria-label={titel ?? `QR-Code: ${text}`}
      style={{ display: 'inline-block', width: `${groesseMm}mm`, lineHeight: 0, background: '#fff' }}
      dangerouslySetInnerHTML={{ __html: qrSvg(text) }}
    />
  )
}
