"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCodeGenerator({ value, size = 200, className = "" }: QRCodeGeneratorProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const generateQR = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(value, {
          width: size,
          margin: 2,
          color: {
            dark: "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "M",
        });
        setQrDataUrl(dataUrl);
        setError("");
      } catch (err) {
        console.error("Error generating QR code:", err);
        setError("Failed to generate QR code");
      }
    };

    if (value) {
      generateQR();
    }
  }, [value, size]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg ${className}`} style={{ width: size, height: size }}>
        <p className="text-red-500 text-sm text-center px-4">{error}</p>
      </div>
    );
  }

  if (!qrDataUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-lg animate-pulse ${className}`} style={{ width: size, height: size }}>
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt={`QR Code for ${value}`}
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
    />
  );
}

// Helper function to generate QR code as data URL (for use outside React)
export async function generateQRCodeDataUrl(value: string, size: number = 200): Promise<string> {
  return QRCode.toDataURL(value, {
    width: size,
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
}

// Helper function to generate QR code as SVG string
export async function generateQRCodeSVG(value: string): Promise<string> {
  return QRCode.toString(value, {
    type: "svg",
    margin: 2,
    color: {
      dark: "#000000",
      light: "#FFFFFF",
    },
    errorCorrectionLevel: "M",
  });
}
