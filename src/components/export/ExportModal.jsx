import { useState, useRef } from 'react';
import { Download, X, FileText, CheckCircle2 } from 'lucide-react';
import { exportToPDF } from '../../lib/exportService';
import { exportToATSPDF, exportToATSDOCX } from '../../lib/atsExportService';
import toast from 'react-hot-toast';
import './ExportModal.css';

export default function ExportModal({ isOpen, onClose, resumeData, previewRef }) {
  const [exporting, setExporting] = useState(false);
  const [format, setFormat] = useState('ats-pdf');

  if (!isOpen) return null;

  const handleExport = async () => {
    setExporting(true);
    
    try {
      const filename = `${resumeData.title || 'resume'}_${new Date().toISOString().split('T')[0]}`;

      if (format === 'ats-pdf') {
        await exportToATSPDF(resumeData, `${filename}.pdf`);
        toast.success('ATS-friendly PDF downloaded successfully!');
      } else if (format === 'ats-docx') {
        await exportToATSDOCX(resumeData, `${filename}.docx`);
        toast.success('ATS-friendly DOCX downloaded successfully!');
      } else if (format === 'pdf') {
        if (!previewRef?.current) {
          throw new Error('Resume preview not found');
        }
        await exportToPDF(previewRef.current, `${filename}.pdf`);
        toast.success('Visual PDF downloaded successfully!');
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
          <div className="ats-info-banner">
            <CheckCircle2 size={20} />
            <div>
              <strong>ATS-Friendly Formats Recommended</strong>
              <p>These formats are optimized to pass through Applicant Tracking Systems</p>
            </div>
          </div>

          <div className="export-formats">
            <div
              className={`export-format-card ${format === 'ats-pdf' ? 'active' : ''}`}
              onClick={() => setFormat('ats-pdf')}
            >
              <div className="format-badge ats">ATS Optimized</div>
              <FileText size={32} />
              <h3>ATS-Friendly PDF</h3>
              <p>Text-based PDF that can be parsed by any ATS system. Recommended for job applications.</p>
            </div>

            <div
              className={`export-format-card ${format === 'ats-docx' ? 'active' : ''}`}
              onClick={() => setFormat('ats-docx')}
            >
              <div className="format-badge ats">ATS Optimized</div>
              <FileText size={32} />
              <h3>ATS-Friendly DOCX</h3>
              <p>Editable Word document optimized for ATS. Best for maximum compatibility.</p>
            </div>

            <div
              className={`export-format-card ${format === 'pdf' ? 'active' : ''}`}
              onClick={() => setFormat('pdf')}
            >
              <div className="format-badge visual">Visual</div>
              <FileText size={32} />
              <h3>Visual PDF</h3>
              <p>High-quality PDF with exact visual formatting. Best for printing or portfolios.</p>
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
