// Detectar problemas de rendimiento
if (process.env.NODE_ENV === 'development') {
    // Monitorear repaints
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'paint') {
                console.log(`${entry.name}: ${entry.startTime}ms`);
            }
        }
    });
    
    observer.observe({ entryTypes: ['paint', 'layout-shift'] });
    
    // Detectar elementos que causan reflow
    const resizeObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            console.log('Element resized:', entry.target);
        });
    });
    
    document.querySelectorAll('.watch-resize').forEach(el => {
        resizeObserver.observe(el);
    });
}