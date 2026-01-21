import { useState, useRef } from 'react';
import { Download, X, FileText } from 'lucide-react';
import { exportToPDF } from '../../lib/exportService';
import toast from 'react-hot-toast';
import './ExportModal.css';

export default function ExportModal({ isOpen, onClose, resumeData, previewRef }) {
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState('pdf');

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const filename = `${resumeData.title || 'resume'}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'pdf') {
        if (!previewRef?.current) {
          throw new Error('Resume preview not found');
        }
        await exportToPDF(previewRef.current, `${filename}.pdf`);
        toast.success('PDF downloaded successfully!');
      }

      onClose();
    } catch (error) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export resume');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-modal-overlay" onClick={onClose}>
      <div className="export-modal" onClick={(e) => e.stopPropagation()}>
        <div className="export-modal-header">
          <h2>Export Resume</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="export-modal-body">
          <p className="export-description">
            Choose a format to download your resume
          </p>

          <div className="export-formats">
            <div
              className={`export-format-card ${format === 'pdf' ? 'active' : ''}`}
              onClick={() => setFormat('pdf')}
            >
              <FileText size={32} />
              <h3>PDF Document</h3>
              <p>Best for most applications. Preserves exact formatting.</p>
            </div>
          </div>
        </div>

        <div className="export-modal-footer">
          <button className="btn-secondary" onClick={onClose} disabled={exporting}>
            Cancel
          </button>
          <button 
            className="btn-primary" 
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <>
                <div className="spinner"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} />
                Download
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
