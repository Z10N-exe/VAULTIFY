// Simple error handling without JSX
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.maxQueueSize = 100;
    this.isReportingEnabled = import.meta.env.VITE_ENABLE_ERROR_REPORTING === 'true';
  }

  captureError(error, context = {}) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      context,
      severity: this.getSeverity(error)
    };

    this.errorQueue.push(errorInfo);
    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    if (import.meta.env.DEV) {
      console.error('Error captured:', errorInfo);
    }

    if (this.isReportingEnabled && import.meta.env.PROD) {
      this.reportError(errorInfo);
    }

    return errorInfo;
  }

  getSeverity(error) {
    if (error.name === 'ChunkLoadError' || error.name === 'NetworkError') {
      return 'low';
    }
    if (error.message.includes('User rejected')) {
      return 'low';
    }
    if (error.message.includes('encryption') || error.message.includes('blockchain')) {
      return 'high';
    }
    return 'medium';
  }

  async reportError(errorInfo) {
    try {
      const response = await fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(errorInfo)
      });

      if (!response.ok) {
        console.warn('Failed to report error to monitoring service');
      }
    } catch (reportError) {
      console.error('Failed to report error:', reportError);
    }
  }

  getErrorStats() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentErrors = this.errorQueue.filter(
      error => new Date(error.timestamp) > last24h
    );

    return {
      total: this.errorQueue.length,
      last24h: recentErrors.length,
      bySeverity: this.groupBySeverity(recentErrors),
      byType: this.groupByType(recentErrors)
    };
  }

  groupBySeverity(errors) {
    return errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {});
  }

  groupByType(errors) {
    return errors.reduce((acc, error) => {
      const type = error.message.split(':')[0];
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }

  clearErrors() {
    this.errorQueue = [];
  }
}

export const errorHandler = new ErrorHandler();

// Global error handlers
window.addEventListener('error', (event) => {
  errorHandler.captureError(event.error, {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  errorHandler.captureError(new Error(event.reason), {
    type: 'unhandledrejection',
    promise: event.promise
  });
});
