
export const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) {
        console.warn("No data available to export.");
        return;
    }
    if (!Array.isArray(data)) {
        console.error("Data provided to exportToCSV is not an array.");
        return;
    }
    data = data.filter(item => typeof item === 'object' && item !== null);
    if (data.length === 0) {
        console.warn("No valid object data available to export after filtering.");
        return;
    }


    const headers = Object.keys(data[0]);
    const csvRows = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                let cell = row[header] === null || row[header] === undefined ? '' : row[header];
                if (cell instanceof Date) {
                    cell = cell.toISOString();
                } else if (typeof cell === 'object' && cell !== null && cell.seconds !== undefined && typeof cell.nanoseconds === 'number') {
                    try {
                        // Use toLocaleString for consistency with other date displays
                        cell = new Date(cell.seconds * 1000 + cell.nanoseconds / 1000000).toLocaleString();
                    } catch (e) {
                        cell = '[Invalid Timestamp]'
                    }
                } else if (typeof cell === 'object' && cell !== null) {
                    try {
                        cell = JSON.stringify(cell); // Stringify other plain objects
                    } catch (e) {
                        cell = '[Object]'; // Fallback for complex/circular objects
                    }
                }
                const cellString = String(cell);
                // Escape quotes and wrap in quotes if it contains commas, newlines, or double quotes
                if (cellString.includes(',') || cellString.includes('\n') || cellString.includes('"')) {
                    return `"${cellString.replace(/"/g, '""')}"`;
                }
                return cellString;
            }).join(',')
        )
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url); // Clean up the object URL
    }
};

export const resizeImage = (file, maxWidth, maxHeight, quality) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = error => reject(error);
        };
        reader.onerror = error => reject(error);
    });
};

// Helper to format date as YYYY-MM-DD
export const formatDateISO = (date) => {
    if (!date) return '';
    // Make sure it's a Date object
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return ''; // Return empty string for invalid dates
    return d.toISOString().split('T')[0];
};

// --- Time Formatting Helper --- Define outside components
export const timeToAmPm = (time) => {
    if (!time) return '';
    try {
        const [h, m] = time.split(':');
        const hour = parseInt(h, 10);
        if (isNaN(hour) || isNaN(parseInt(m, 10))) return 'Invalid Time'; // Basic validation
        const suffix = hour >= 12 ? 'p' : 'a';
        const convertedHour = ((hour + 11) % 12 + 1);
        return `${convertedHour}${m === '00' ? '' : `:${m}`}${suffix}`;
    } catch (e) {
        console.error("Error formatting time:", time, e);
        return 'Invalid Time';
    }
};

// --- Currency Formatting Helper ---
export const formatCurrency = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(num);
};
