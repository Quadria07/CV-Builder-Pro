import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CVData } from '../types/cv';

export const generatePDF = async (cvData: CVData, templateName: string) => {
  try {
    const element = document.getElementById('cv-preview');
    if (!element) {
      throw new Error('CV preview element not found');
    }

    // Temporarily modify the element for better PDF capture
    const originalStyle = element.style.cssText;
    element.style.width = '210mm'; // A4 width
    element.style.minHeight = 'auto';
    element.style.transform = 'scale(1)';
    element.style.transformOrigin = 'top left';

    // Wait for any layout changes to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create canvas from the CV preview element with optimized settings
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    });

    // Restore original styles
    element.style.cssText = originalStyle;

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