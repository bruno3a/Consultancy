// Carga diferida de recursos no críticos
document.addEventListener('DOMContentLoaded', function() {
    // Cargar scripts no críticos
    const script = document.createElement('script');
    script.src = '/js/non-critical.js';
    script.async = true;
    document.head.appendChild(script);
});

// Lazy loading para imágenes
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}