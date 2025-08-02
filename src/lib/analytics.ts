// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const GA_MEASUREMENT_ID = 'GA_MEASUREMENT_ID'; // Replace with your actual GA4 Measurement ID

// Track page views
export const trackPageView = (page_title: string, page_location?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title,
      page_location: page_location || window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: {
    event_category?: string;
    event_label?: string;
    value?: number;
    [key: string]: any;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: parameters?.event_category || 'engagement',
      event_label: parameters?.event_label,
      value: parameters?.value,
      ...parameters,
    });
  }
};

// Predefined events for the speech screening app
export const analytics = {
  // Screening events
  startScreening: (ageGroup: string) =>
    trackEvent('start_screening', {
      event_category: 'screening',
      event_label: ageGroup,
    }),
  
  completeScreening: (ageGroup: string, score: number, percentage: number) =>
    trackEvent('complete_screening', {
      event_category: 'screening',
      event_label: ageGroup,
      value: percentage,
      score,
      percentage,
    }),
  
  answerQuestion: (questionId: string, answer: boolean) =>
    trackEvent('answer_question', {
      event_category: 'screening',
      event_label: questionId,
      answer: answer ? 'yes' : 'no',
    }),
  
  saveResults: (ageGroup: string, percentage: number) =>
    trackEvent('save_results', {
      event_category: 'screening',
      event_label: ageGroup,
      value: percentage,
    }),
  
  restartScreening: () =>
    trackEvent('restart_screening', {
      event_category: 'screening',
    }),
  
  // Navigation events
  selectAgeGroup: (ageGroup: string) =>
    trackEvent('select_age_group', {
      event_category: 'navigation',
      event_label: ageGroup,
    }),
  
  goBack: (fromStep: string) =>
    trackEvent('go_back', {
      event_category: 'navigation',
      event_label: fromStep,
    }),
};