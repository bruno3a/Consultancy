// Reemplazar scroll events con Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: [0, 0.25, 0.5, 0.75, 1]
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Añadir clase sin causar reflow
            entry.target.classList.add('visible');
            
            // Opcional: dejar de observar una vez visible
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos
document.querySelectorAll('.fade-in-element').forEach(el => {
    observer.observe(el);
});