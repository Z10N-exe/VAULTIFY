// Simple analytics without JSX
class Analytics {
  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_ANALYTICS === 'true';
    this.sessionId = this.generateSessionId();
    this.startTime = Date.now();
    this.events = [];
    this.performanceMetrics = {};
  }

  generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  track(event, properties = {}) {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };

    this.events.push(eventData);
    this.sendEvent(eventData);
  }

  trackFileUpload(fileInfo) {
    this.track('file_upload', {
      fileName: fileInfo.name,
      fileSize: fileInfo.size,
      fileType: fileInfo.type,
      encryptionMethod: 'AES-256'
    });
  }

  trackFileAccess(fileHash) {
    this.track('file_access', {
      fileHash: fileHash.substring(0, 8) + '...',
      accessTime: new Date().toISOString()
    });
  }

  trackWalletConnection(walletAddress) {
    this.track('wallet_connected', {
      walletAddress: walletAddress.substring(0, 6) + '...' + walletAddress.substring(walletAddress.length - 4),
      connectionMethod: 'MetaMask'
    });
  }

  trackBlockchainTransaction(txHash, operation) {
    this.track('blockchain_transaction', {
      txHash: txHash.substring(0, 8) + '...',
      operation,
      timestamp: new Date().toISOString()
    });
  }

  measurePerformance(name, startTime, endTime) {
    const duration = endTime - startTime;
    this.performanceMetrics[name] = duration;
    
    this.track('performance_metric', {
      metric: name,
      duration,
      timestamp: new Date().toISOString()
    });
  }

  trackPageView(page) {
    this.track('page_view', {
      page,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    });
  }

  trackError(error, context) {
    this.track('error', {
      errorMessage: error.message,
      errorStack: error.stack,
      context,
      severity: this.getErrorSeverity(error)
    });
  }

  getErrorSeverity(error) {
    if (error.message.includes('User rejected')) return 'low';
    if (error.message.includes('Network')) return 'medium';
    if (error.message.includes('encryption') || error.message.includes('blockchain')) return 'high';
    return 'medium';
  }

  async sendEvent(eventData) {
    try {
      if (import.meta.env.PROD) {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData)
        });
      } else {
        console.log('Analytics event:', eventData);
      }
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  getSessionSummary() {
    const sessionDuration = Date.now() - this.startTime;
    const eventCount = this.events.length;
    
    return {
      sessionId: this.sessionId,
      duration: sessionDuration,
      eventCount,
      performanceMetrics: this.performanceMetrics,
      events: this.events
    };
  }

  trackEngagement(action, details = {}) {
    this.track('user_engagement', {
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  trackSecurityEvent(event, details = {}) {
    this.track('security_event', {
      event,
      details,
      severity: 'high',
      timestamp: new Date().toISOString()
    });
  }
}

export const analytics = new Analytics();
