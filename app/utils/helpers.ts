export const renderMarkdown = (text: string): string => {
    let html = text;

    // Escape HTML
    html = html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Bold
    html = html.replace(/\*\*([^\*]+)\*\*/g, "<strong>$1</strong>");

    // Italic
    html = html.replace(/_([^_]+)_/g, "<em>$1</em>");

    // Strikethrough
    html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

    // Headers
    html = html.replace(/^### (.*?)$/gm, "<h3>$1</h3>");
    html = html.replace(/^## (.*?)$/gm, "<h2>$1</h2>");
    html = html.replace(/^# (.*?)$/gm, "<h1>$1</h1>");

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, "<blockquote>$1</blockquote>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^\)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />');

    // Line breaks
    html = html.replace(/\n\n/g, "</p><p>");
    html = "<p>" + html + "</p>";
    html = html.replace(/<p><\/p>/g, "");

    // Lists
    html = html.replace(/^- (.*?)$/gm, "<li>$1</li>");
    html = html.replace(/(<li>.*?<\/li>)/, "<ul>$1</ul>");
    html = html.replace(/^1\. (.*?)$/gm, "<li>$1</li>");

    return html;
  };

export const formatRelativeTime = (timestampMs: any): string => {
    // 1. Define time constants in milliseconds
    const MS_PER_SECOND = 1000;
    const MS_PER_MINUTE = 60 * MS_PER_SECOND;
    const MS_PER_HOUR = 60 * MS_PER_MINUTE;
    const MS_PER_DAY = 24 * MS_PER_HOUR;
    const MS_PER_WEEK = 7 * MS_PER_DAY;
    const MS_PER_MONTH = 30 * MS_PER_DAY; // Approximate
    const MS_PER_YEAR = 365 * MS_PER_DAY; // Approximate

    const now = Date.now();
    const diff = now - timestampMs; // Difference in milliseconds

    // Determine if the time is in the past (ago) or future (in)
    const isPast = diff >= 0;
    const absDiff = Math.abs(diff);

    // Helper function to format the string
    const format = (unit: number, unitName: string) => {
        const value = Math.round(absDiff / unit);
        const plural = value !== 1 ? 's' : '';
        const prefix = isPast ? ' ago' : ' from now';

        if (unitName === 'day' && value === 1) {
            return isPast ? 'yesterday' : 'tomorrow';
        }
        if (unitName === 'hour' && value === 0) {
            return isPast ? 'just now' : 'soon';
        }

        return `${value} ${unitName}${plural}${prefix}`;
    };

    // 2. Apply comparison thresholds
    if (absDiff < MS_PER_MINUTE) {
        // Less than 1 minute
        const seconds = Math.round(absDiff / MS_PER_SECOND);
        if (seconds < 10) return isPast ? 'just now' : 'soon';
        return format(MS_PER_SECOND, 'second');
    } else if (absDiff < MS_PER_HOUR) {
        // Less than 1 hour
        return format(MS_PER_MINUTE, 'minute');
    } else if (absDiff < MS_PER_DAY) {
        // Less than 1 day
        return format(MS_PER_HOUR, 'hour');
    } else if (absDiff < MS_PER_WEEK) {
        // Less than 1 week
        return format(MS_PER_DAY, 'day');
    } else if (absDiff < MS_PER_MONTH) {
        // Less than 1 month
        return format(MS_PER_WEEK, 'week');
    } else if (absDiff < MS_PER_YEAR) {
        // Less than 1 year
        return format(MS_PER_MONTH, 'month');
    } else {
        // 1 year or more
        return format(MS_PER_YEAR, 'year');
    }
}

export function convert24hrTo12hr(time24hr: string): string {
    const parts = time24hr?.split(':');
    if (parts.length !== 2) {
        return 'Invalid Time Format';
    }

    let hours = parseInt(parts[0], 10);
    const minutes = parts[1]; // Keep minutes as string to preserve leading zero if present
    
    // Basic validation
    if (isNaN(hours) || hours < 0 || hours > 23 || minutes.length !== 2 || isNaN(parseInt(minutes, 10))) {
        return 'Invalid Time Value';
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    // Convert 24-hour time to 12-hour format:
    // 0:00 - 11:59 AM
    // 12:00 - 23:59 PM
    
    // 1. Convert 0 (midnight) to 12
    // 2. Convert hours > 12 (13-23) to hours - 12
    hours = hours % 12;
    hours = hours === 0 ? 12 : hours;

    return `${hours}:${minutes} ${ampm}`;
}

export const save = (key: string, value: any) => {
    localStorage.setItem(key, value);
}

export const load = (key: string) => {
    return localStorage.getItem(key);
}   