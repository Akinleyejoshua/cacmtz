'use client';

import { useEffect } from 'react';

// Generate unique session ID
const generateSessionId = (): string => {
    return 'sess_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

// Detect device type from user agent
const getDeviceType = (): 'mobile' | 'desktop' | 'tablet' => {
    if (typeof window === 'undefined') return 'desktop';

    const ua = navigator.userAgent.toLowerCase();

    if (/tablet|ipad|playbook|silk/i.test(ua)) {
        return 'tablet';
    }

    if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
        return 'mobile';
    }

    return 'desktop';
};

// Get today's date as string for localStorage key
const getTodayKey = (): string => {
    return new Date().toISOString().split('T')[0]; // e.g., "2024-12-27"
};

interface PageTrackerProps {
    pageUrl?: string;
}

export default function PageTracker({ pageUrl }: PageTrackerProps) {
    useEffect(() => {
        const trackPageView = async () => {
            // Skip in development if needed
            // if (process.env.NODE_ENV === 'development') return;

            // Get or create session ID
            let sessionId = localStorage.getItem('analytics_session_id');
            if (!sessionId) {
                sessionId = generateSessionId();
                localStorage.setItem('analytics_session_id', sessionId);
            }

            // Check if already tracked today for this page (prevent duplicate)
            const todayKey = getTodayKey();
            const trackingKey = `tracked_${todayKey}_${pageUrl || window.location.pathname}`;

            if (localStorage.getItem(trackingKey)) {
                // Already tracked today, skip
                console.log('[PageTracker] Already tracked today, skipping.');
                return;
            }

            try {
                const response = await fetch('/api/analytics/track', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        pageUrl: pageUrl || window.location.pathname,
                        userAgent: navigator.userAgent,
                        referrer: document.referrer || '',
                        sessionId,
                        deviceType: getDeviceType(),
                    }),
                });

                if (response.ok) {
                    // Mark as tracked for today
                    localStorage.setItem(trackingKey, 'true');
                    console.log('[PageTracker] Page view tracked successfully.');

                    // Clean up old tracking keys (older than today)
                    cleanupOldTrackingKeys(todayKey);
                }
            } catch (error) {
                console.error('[PageTracker] Failed to track page view:', error);
            }
        };

        // Small delay to ensure page is fully loaded
        const timer = setTimeout(trackPageView, 500);

        return () => clearTimeout(timer);
    }, [pageUrl]);

    return null; // This component renders nothing
}

// Cleanup old tracking keys from localStorage
function cleanupOldTrackingKeys(todayKey: string) {
    try {
        const keysToRemove: string[] = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('tracked_') && !key.includes(todayKey)) {
                keysToRemove.push(key);
            }
        }

        keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
        // Ignore cleanup errors
    }
}
