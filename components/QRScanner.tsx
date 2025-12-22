"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";

interface QRScannerProps {
  onScanSuccess: (decodedText: string) => void;
  onScanError?: (error: string) => void;
  width?: number;
  height?: number;
  fps?: number;
  className?: string;
}

/**
 * QR Code Scanner component using html5-qrcode library
 * For POS terminal scanning functionality
 * 
 * Usage:
 * <QRScanner
 *   onScanSuccess={(text) => console.log("Scanned:", text)}
 *   onScanError={(err) => console.error(err)}
 * />
 */
export function QRScanner({
  onScanSuccess,
  onScanError,
  width = 300,
  height = 300,
  fps = 10,
  className = "",
}: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string>("");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const startScanning = useCallback(async () => {
    if (!containerRef.current || scannerRef.current) return;

    try {
      const scanner = new Html5Qrcode("qr-scanner-container");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" }, // Use back camera
        {
          fps,
          qrbox: { width: Math.min(width - 50, 250), height: Math.min(height - 50, 250) },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          // Optionally stop after successful scan
          // stopScanning();
        },
        (errorMessage) => {
          // Ignore continuous scanning errors (they happen frequently)
          if (onScanError && !errorMessage.includes("No QR code found")) {
            onScanError(errorMessage);
          }
        }
      );

      setIsScanning(true);
      setHasPermission(true);
      setError("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to start scanner";
      setError(errorMessage);
      setHasPermission(false);
      if (onScanError) onScanError(errorMessage);
    }
  }, [fps, width, height, onScanSuccess, onScanError]);

  const stopScanning = useCallback(async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
        setIsScanning(false);
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
  }, []);

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div
        id="qr-scanner-container"
        ref={containerRef}
        style={{ width, height }}
        className="bg-gray-100 rounded-lg overflow-hidden relative"
      >
        {!isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Start Camera
            </button>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <p className="text-red-500 text-sm mb-2">{error}</p>
            <button
              onClick={startScanning}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
      
      {isScanning && (
        <button
          onClick={stopScanning}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Stop Scanning
        </button>
      )}

      {hasPermission === false && (
        <p className="mt-2 text-sm text-gray-500 text-center">
          Please allow camera access to scan QR codes
        </p>
      )}
    </div>
  );
}

/**
 * Hook for using QR scanner imperatively
 * Useful for more complex POS flows
 */
export function useQRScanner() {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const startScanner = async (
    elementId: string,
    onSuccess: (text: string) => void,
    onError?: (error: string) => void
  ) => {
    const scanner = new Html5Qrcode(elementId);
    scannerRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        onSuccess,
        (error) => {
          if (onError && !error.includes("No QR code found")) {
            onError(error);
          }
        }
      );
    } catch (err) {
      throw err;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
  };

  const scanImage = async (imageFile: File): Promise<string> => {
    const scanner = new Html5Qrcode("temp-scanner");
    try {
      const result = await scanner.scanFile(imageFile, true);
      return result;
    } finally {
      scanner.clear();
    }
  };

  return { startScanner, stopScanner, scanImage };
}
