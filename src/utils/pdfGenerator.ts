import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CVData } from '../types/cv';

export const generatePDF = async (cvData: CVData, templateName: string) => {
  try {
    const element = document.getElementById('cv-preview');
    if (!element) {
      throw new Error('CV preview element not found');
    }

    // Clone element to avoid modifying the live DOM and completely bypass hidden/overflow issues on mobile
    const clone = element.cloneNode(true) as HTMLElement;

    // Assign specific A4 dimensions and place safely off-screen
    clone.style.cssText = `
      position: absolute;
      top: -9999px;
      left: 0;
      width: 210mm;
      min-height: 297mm;
      background: white;
      transform: none !important;
      display: block !important;
      pointer-events: none;
      margin: 0;
      box-sizing: border-box;
      z-index: -9999;
    `;

    // Ensure all SVGs are fully rendered
    const svgs = clone.querySelectorAll('svg');
    svgs.forEach(svg => {
      svg.setAttribute('width', svg.getAttribute('width') || '100%');
      svg.setAttribute('height', svg.getAttribute('height') || '100%');
    });

    document.body.appendChild(clone);

    // Wait for any layout changes to settle exactly layout
    await new Promise(resolve => setTimeout(resolve, 300));

    // Create canvas from the CV preview element with optimized settings
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: clone.scrollWidth || 794,
      height: clone.scrollHeight || 1123,
      windowWidth: clone.scrollWidth || 794,
      windowHeight: clone.scrollHeight || 1123,
    });

    document.body.removeChild(clone);

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Convert canvas to image
    const imgData = canvas.toDataURL('image/png', 1.0);

    // Calculate scaling to fit A4 width
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = pdfWidth / (imgWidth * 0.264583); // Convert pixels to mm
    const scaledWidth = pdfWidth;
    const scaledHeight = (imgHeight * 0.264583) * ratio;

    // Add the image to PDF
    let yPosition = 0;
    let remainingHeight = scaledHeight;

    while (remainingHeight > 0) {
      if (yPosition > 0) {
        pdf.addPage();
      }

      const pageHeight = Math.min(remainingHeight, pdfHeight);

      pdf.addImage(
        imgData,
        'PNG',
        0,
        yPosition === 0 ? 0 : -yPosition,
        scaledWidth,
        scaledHeight
      );

      remainingHeight -= pdfHeight;
      yPosition += pdfHeight;
    }

    // Generate filename
    const name = cvData.personalInfo.name || 'CV';
    const filename = `${name.replace(/\s+/g, '_')}_${templateName}.pdf`;

    // Save the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};