/// <reference types="@vercel/analytics" />

// Simple analytics event tracker
// Uses Vercel Analytics if available, with graceful fallback

export const trackEvent = (eventName: string, data?: Record<string, any>) => {
  try {
    // Try to use Vercel Analytics if available
    if (typeof window !== 'undefined' && (window as any).va) {
      (window as any).va.track?.(eventName, data);
    }
  } catch (error) {
    // Silently fail if analytics is not available
    console.debug(`Could not track event: ${eventName}`);
  }

  // Log to console for debugging
  if (process.env.NODE_ENV === 'development') {
    console.debug(`📊 Event: ${eventName}`, data || {});
  }
};

// Track specific user actions
export const analyticsEvents = {
  // CV Generation
  cvGenerateStart: () => trackEvent('cv_generate_start'),
  cvGenerateSuccess: () => trackEvent('cv_generate_success'),
  cvGenerateError: (error: string) => trackEvent('cv_generate_error', { error }),

  // CV Optimization
  cvOptimizeStart: () => trackEvent('cv_optimize_start'),
  cvOptimizeSuccess: () => trackEvent('cv_optimize_success'),
  cvOptimizeError: (error: string) => trackEvent('cv_optimize_error', { error }),

  // PDF Export
  pdfDownloadStart: (template: string) => trackEvent('pdf_download_start', { template }),
  pdfDownloadSuccess: (template: string) => trackEvent('pdf_download_success', { template }),
  pdfDownloadError: (template: string, error: string) => trackEvent('pdf_download_error', { template, error }),

  // Template Selection
  templateSelected: (templateId: string) => trackEvent('template_selected', { template: templateId }),

  // ATS Analysis
  atsAnalysisStart: () => trackEvent('ats_analysis_start'),
  atsAnalysisSuccess: () => trackEvent('ats_analysis_success'),
  atsAnalysisError: (error: string) => trackEvent('ats_analysis_error', { error }),

  // File Upload
  fileUploadSuccess: (fileType: string) => trackEvent('file_upload_success', { fileType }),
  fileUploadError: (error: string) => trackEvent('file_upload_error', { error }),

  // User Navigation
  homePageView: () => trackEvent('home_page_view'),
  editorPageView: () => trackEvent('editor_page_view'),
};
