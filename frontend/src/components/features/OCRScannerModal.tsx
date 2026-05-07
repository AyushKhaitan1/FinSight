import { useState, useRef } from 'react';
import { X, UploadCloud, FileText, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface OCRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (data: any) => void;
}

export default function OCRScannerModal({ isOpen, onClose, onScanComplete }: OCRScannerModalProps) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('receipt', file);

      const response = await api.post('/ocr/scan', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      onScanComplete(response.data.data);
      setScanning(false);
      onClose();
      
    } catch (err: any) {
      console.error('Scan failed', err);
      setError(err.response?.data?.error || 'Failed to connect to backend OCR service. Make sure backend is running.');
      setScanning(false);
      
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border w-full max-w-md rounded-xl p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-foreground">Scan Receipt</h2>
          <button onClick={() => { setError(''); onClose(); }} className="text-muted hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/30 text-danger rounded-lg text-sm flex items-start gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors bg-surface/50">
          {scanning ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-foreground font-medium">Extracting data via AI...</p>
              <p className="text-sm text-muted mt-1">This may take a few seconds...</p>
            </div>
          ) : (
            <>
              <UploadCloud className="w-12 h-12 text-muted mb-4" />
              <p className="text-foreground font-medium">Upload a receipt or bill</p>
              <p className="text-sm text-muted mt-1 mb-6">JPG, PNG up to 5MB</p>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileUpload} 
              />
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-border hover:bg-[#3F3F46] text-foreground px-6 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium"
              >
                <FileText className="w-4 h-4" /> Select File
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
