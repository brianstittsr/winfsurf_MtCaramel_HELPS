'use client';

import { useRef, useImperativeHandle, forwardRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignaturePadProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  penColor?: string;
}

export interface SignaturePadRef {
  clear: () => void;
  isEmpty: () => boolean;
  toDataURL: (type?: string) => string;
  toBlob: () => Promise<Blob>;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(({
  width = 400,
  height = 200,
  backgroundColor = 'rgba(255,255,255,0)',
  penColor = 'black'
}, ref) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  useImperativeHandle(ref, () => ({
    clear: () => {
      signatureRef.current?.clear();
    },
    isEmpty: () => {
      return signatureRef.current?.isEmpty() || false;
    },
    toDataURL: (type = 'image/png') => {
      return signatureRef.current?.toDataURL(type) || '';
    },
    toBlob: async () => {
      return new Promise((resolve) => {
        const canvas = signatureRef.current?.getCanvas();
        if (canvas) {
          canvas.toBlob((blob) => {
            resolve(blob || new Blob());
          });
        } else {
          resolve(new Blob());
        }
      });
    }
  }));

  return (
    <div className="signature-pad-container">
      <div className="signature-canvas border rounded p-2" style={{ width: width + 20, height: height + 20 }}>
        <SignatureCanvas
          ref={signatureRef}
          canvasProps={{
            width,
            height,
            className: 'signature-canvas'
          }}
          backgroundColor={backgroundColor}
          penColor={penColor}
        />
      </div>
      <div className="mt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => signatureRef.current?.clear()}
        >
          Clear Signature
        </button>
      </div>
    </div>
  );
});

SignaturePad.displayName = 'SignaturePad';

export default SignaturePad;
