import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Zap, 
  Database, 
  MessageSquare, 
  FileText, 
  Shield, 
  Users, 
  Store, 
  Smartphone,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Globe,
  BarChart3,
  Wrench,
  Wifi,
  RefreshCw,
  Bot,
  TrendingUp,
  Eye,
  Settings
} from 'lucide-react';
import PendingTasks from './PendingTasks';
import PreviewBanner from './PreviewBanner'; // Importar el banner

const LandingPage = ({ showPendingTasks, isPreview }) => { // Añadir isPreview a las props
  const [isVisible, setIsVisible] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const [formData, setFormData] = useState({
    email: '',
    message: ''
  });

  // Navigation items
  const navItems = [
    { id: 'hero', label: 'Inicio', icon: null },
    { id: 'services', label: 'Servicios', icon: <Zap className="w-4 h-4" /> },
    { id: 'product', label: 'Productos', icon: <FileText className="w-4 h-4" /> },
    { id: 'audience', label: 'Clientes', icon: <Users className="w-4 h-4" /> },
    { id: 'contact', label: 'Contacto', icon: <Phone className="w-4 h-4" /> }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      // Detect active section
      const sections = navItems.map(item => item.id);
      const currentSection = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 80; // Account for fixed header
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('¡Gracias! Te contactaremos pronto.');
    setFormData({ email: '', message: '' });
  };

  const handleDemoClick = () => {
    alert('Demo próximamente disponible');
  };

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/5491123456789?text=Hola,%20me%20interesa%20conocer%20más%20sobre%20sus%20servicios', '_blank');
  };

  const handleServiceCTA = (serviceName) => {
    const message = `Hola, me interesa conocer más sobre ${serviceName}. ¿Podemos agendar una consulta?`;
    window.open(`https://wa.me/5491123456789?text=${encodeURIComponent(message)}`, '_blank');
  };

  const services = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Presencia Digital Estratégica",
      description: "Potenciamos tu imagen online con sitios web modernos, SEO optimizado y estrategias de conversión que transforman visitantes en clientes.",
      benefits: ["Más conversiones", "Imagen profesional", "Posicionamiento web"],
      cta: "Mejorar mi presencia",
      popular: true
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Business Intelligence & Datos",
      description: "Integramos tus fuentes de datos dispersas en dashboards inteligentes para tomar decisiones basadas en información real.",
      benefits: ["Reportes automáticos", "Métricas clave", "Decisiones informadas"],
      cta: "Ver mis datos"
    },
    {
      icon: <Bot className="w-8 h-8" />,
      title: "Chatbots con IA",
      description: "Automatizamos la atención al cliente 24/7 con inteligencia artificial que entiende y responde como un humano.",
      benefits: ["Atención 24/7", "Respuestas inteligentes", "Más ventas"],
      cta: "Probar chatbot",
      trending: true
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Automatización de Procesos",
      description: "Eliminamos tareas repetitivas conectando WhatsApp, Excel, emails y sistemas para que trabajen solos.",
      benefits: ["Ahorro de tiempo", "Menos errores", "Mayor productividad"],
      cta: "Automatizar procesos"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Seguridad & Conectividad",
      description: "Protegemos tu negocio con sistemas de alarmas, cámaras IP y conexión a internet estable y segura.",
      benefits: ["Protección total", "Internet estable", "Monitoreo remoto"],
      cta: "Asegurar mi negocio"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Modernización de Sistemas",
      description: "Migramos sistemas obsoletos a tecnologías actuales con soporte completo durante todo el proceso.",
      benefits: ["Tecnología actual", "Migración segura", "Soporte continuo"],
      cta: "Modernizar sistemas"
    },
    {
      icon: <Wrench className="w-8 h-8" />,
      title: "Soporte Técnico Integral",
      description: "Mantenimiento preventivo y correctivo de hardware, software y redes con planes de servicio personalizados.",
      benefits: ["Mantenimiento preventivo", "Soporte inmediato", "Equipos optimizados"],
      cta: "Contratar soporte"
    }
  ];

  const targetProfiles = [
    {
      icon: <Users className="w-12 h-12" />,
      title: "Profesionales Independientes",
      description: "Profesionales de la salud, y servicios en general que buscan optimizar su tiempo",
      features: ["Gestión de clientes", "Facturación automática", "Agenda digital"]
    },
    {
      icon: <Store className="w-12 h-12" />,
      title: "Comercios Físicos",
      description: "Kioscos, almacenes, ferreterías que quieren modernizar sus procesos",
      features: ["Control de stock", "Ventas digitales", "Seguridad integrada"]
    },
    {
      icon: <Smartphone className="w-12 h-12" />,
      title: "Emprendedores Digitales",
      description: "Vendedores de Instagram, Tiendanube, Mercado Libre en crecimiento",
      features: ["Chatbots", "Facturación automática", "Reportes inteligentes"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Enhanced Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 focus:outline-none ${
          isScrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-gray-600 shadow-lg shadow-gray-900/20'  // Cambiado color del borde para el divisor
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent cursor-pointer flex items-center" // Añadido flex e items-center
              onClick={() => scrollToSection('hero')}
            >
              <span>FlujoDigital</span>
              {isPreview && <PreviewBanner />} {/* Mostrar banner aquí si es preview */}
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2 group focus:outline-none border ${ // Añadido 'border' base
                    activeSection === item.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 bg-transparent border-transparent' // bg-transparent y border-transparent para estado inactivo
                  }`}
                >
                  {item.icon && (
                    <span className={`transition-colors duration-300 ${
                      activeSection === item.id ? 'text-emerald-400' : 'text-gray-400 group-hover:text-gray-300'
                    }`}>
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
            </div>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection('contact')}
                className="hidden md:flex bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 items-center space-x-2 font-medium focus:outline-none"
              >
                <span>Consulta Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              {/* Mobile Menu Button */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-300 focus:outline-none"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isMenuOpen ? 1 : 0, 
              height: isMenuOpen ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden"
          >
            <div className="py-4 space-y-2 border-t border-gray-700/50 mt-4">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: isMenuOpen ? 1 : 0, 
                    x: isMenuOpen ? 0 : -20 
                  }}
                  transition={{ delay: isMenuOpen ? 0.1 * index : 0 }}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center space-x-3 focus:outline-none border ${ // Añadido 'border' base
                    activeSection === item.id
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/50 bg-transparent border-transparent' // bg-transparent y border-transparent para estado inactivo
                  }`}
                >
                  {item.icon && (
                    <span className={`${
                      activeSection === item.id ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {item.icon}
                    </span>
                  )}
                  <span className="font-medium">{item.label}</span>
                </motion.button>
              ))}
              
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ 
                  opacity: isMenuOpen ? 1 : 0, 
                  x: isMenuOpen ? 0 : -20 
                }}
                transition={{ delay: isMenuOpen ? 0.5 : 0 }}
                onClick={() => scrollToSection('contact')}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 rounded-lg mt-4 flex items-center justify-center space-x-2 font-medium focus:outline-none"
              >
                <span>Consulta Gratis</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div
          className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-600"
          style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
        />
      </motion.nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 z-0"
        >
          <video
            autoPlay
            loop
            muted
            playsInline // Important for iOS and some Android browsers
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="https://videocdn.cdnpk.net/videos/03f3b8d7-8ee9-497b-bf06-0ef9e1ee18be/horizontal/previews/clear/large.mp4?token=exp=1748790876~hmac=16cde3edcf9aa01cb5ea8c208372083a0cd6f38fc7c4ec922674117526f2b9a4"
            type="video/mp4"
          >
            Tu navegador no soporta el tag de video.
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/85 via-gray-800/80 to-slate-900/85" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        </motion.div>
        
        <motion.div 
          style={{ y: y3 }}
          className="absolute inset-0 opacity-30"
        >
          <div className="pattern-grid w-full h-full" />
        </motion.div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8 leading-tight"
          >
            <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
              Mejoramos cómo trabajan
            </span>
            <br />
            <span className="text-white drop-shadow-lg">negocios como el tuyo</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md"
          >
            Con herramientas digitales simples que te dan <span className="text-emerald-400 font-semibold">más tiempo libre</span>, 
            <span className="text-teal-400 font-semibold"> menos tareas repetitivas</span> y
            <span className="text-cyan-400 font-semibold"> más control</span> sobre tu negocio.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(16, 185, 129, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center min-w-[280px]"
            >
              Agendá una consulta gratis
              <ArrowRight className="ml-2 w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDemoClick}
              className="border-2 border-gray-500 px-8 py-4 rounded-full text-lg font-semibold hover:border-emerald-400 hover:bg-emerald-400/10 transition-all duration-300 flex items-center justify-center min-w-[200px]"
            >
              Conocé lo que hacemos
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Pending Tasks Section (Conditionally Rendered) */}
      {showPendingTasks && (
        <section id="pending-tasks" className="py-16 bg-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold text-center mb-12 text-emerald-400">
                Tareas Pendientes (Visible en Preview/Dev)
              </h2>
              <PendingTasks />
            </motion.div>
          </div>
        </section>
      )}

      {/* Services Section */}
      <section id="services" className="py-24 relative">
        <motion.div
          style={{ y: y3 }}
          className="absolute inset-0 opacity-10"
        >
          <div className="pattern-dots w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                Qué hacemos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transformamos la manera en que trabajás, automatizando procesos y conectando tus herramientas favoritas
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 h-full"
              >
                <div className="text-emerald-400 mb-6 flex justify-center">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white text-center">
                  {service.title}
                </h3>
                <p className="text-gray-300 leading-relaxed text-center">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Section */}
      <section id="product" className="py-24 relative overflow-hidden">
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0 opacity-15"
        >
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url('https://images.pexels.com/photos/2110951/pexels-photo-2110951.jpeg')`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-teal-900/40" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-2 lg:order-1"
            >
              <span className="inline-block bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                ⚡️ Producto Destacado
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Facturación Digital
                </span>
                <br />
                <span className="text-white">Eficiente</span>
              </h2>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Automatizá la generación de facturas electrónicas usando datos desde WhatsApp, 
                archivos Excel/CSV o plataformas e-commerce. Todo en un solo lugar.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { icon: <Clock className="w-5 h-5" />, text: "Ahorra hasta 5 horas semanales" },
                  { icon: <CheckCircle className="w-5 h-5" />, text: "Reduce errores de facturación al 99%" },
                  { icon: <Target className="w-5 h-5" />, text: "Mayor comodidad y control" }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="text-emerald-400">{benefit.icon}</div>
                    <span className="text-gray-200">{benefit.text}</span>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20, 184, 166, 0.3)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDemoClick}
                className="bg-gradient-to-r from-teal-500 to-emerald-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all duration-300 flex items-center"
              >
                Probar demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </motion.button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.product ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="order-1 lg:order-2 flex justify-center"
              style={{ y: y3 }}
            >
              <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/20 backdrop-blur-sm p-8 rounded-3xl border border-emerald-500/30 max-w-md">
                <img 
                  src="https://images.unsplash.com/photo-1694903089438-bf28d4697d9a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzd8MHwxfHNlYXJjaHwzfHxidXNpbmVzcyUyMGF1dG9tYXRpb258ZW58MHx8fGJsdWV8MTc0ODczMjc3M3ww&ixlib=rb-4.1.0&q=85"
                  alt="Facturación Digital"
                  className="w-full h-auto rounded-2xl"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section id="audience" className="py-24 relative">
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-5"
        >
          <div className="pattern-grid w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible.audience ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                A quién ayudamos
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Especialistas en soluciones digitales para diferentes tipos de negocios y profesionales
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {targetProfiles.map((profile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isVisible.audience ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10 h-full flex flex-col"
              >
                <div className="text-teal-400 mb-6 flex justify-center">
                  {profile.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-center text-white">
                  {profile.title}
                </h3>
                <p className="text-gray-300 mb-6 text-center leading-relaxed flex-grow">
                  {profile.description}
                </p>
                <ul className="space-y-3">
                  {profile.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span className="text-sm text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 relative overflow-hidden">
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/4347481/pexels-photo-4347481.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-900/90" />
        <motion.div 
          style={{ y: y2 }}
          className="absolute inset-0 opacity-20"
        >
          <div className="pattern-dots w-full h-full" />
        </motion.div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                  Hablemos de tu proyecto
                </span>
              </h2>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Contanos en qué podemos ayudarte o dejá tu mail para coordinar una llamada sin cargo.
              </p>

              <div className="space-y-6 mb-8">
                {[
                  { icon: <Phone className="w-5 h-5" />, text: "+54 11 2345-6789" },
                  { icon: <Mail className="w-5 h-5" />, text: "hola@digitalflow.com.ar" },
                  { icon: <MapPin className="w-5 h-5" />, text: "Buenos Aires, Argentina" }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-xl bg-gray-800/30 backdrop-blur-sm border border-gray-700/30"
                  >
                    <div className="text-emerald-400 bg-emerald-400/10 p-3 rounded-full">{contact.icon}</div>
                    <span className="text-gray-200 text-lg">{contact.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isVisible.contact ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-3xl border border-gray-700/50"
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-3">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-400 transition-all duration-300"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-3">
                    Mensaje *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-4 bg-gray-700/50 border border-gray-600 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-white placeholder-gray-400 resize-none transition-all duration-300"
                    placeholder="Contanos sobre tu proyecto o necesidad..."
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 flex items-center justify-center"
                >
                  Enviar mensaje
                  <ArrowRight className="ml-2 w-5 h-5" />
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent mb-4">
                FlujoDigital
              </h3>
              <p className="text-gray-400 leading-relaxed">
                Transformamos pequeños negocios con tecnología accesible y efectiva que impulsa el crecimiento.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Servicios</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Automatización</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Integración</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Facturación Digital</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Consultoría</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Empresa</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Sobre nosotros</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Blog</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Casos de éxito</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Contacto</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Términos de uso</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Política de privacidad</li>
                <li className="hover:text-emerald-400 transition-colors duration-300 cursor-pointer">Cookies</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FlujoDigital. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, duration: 0.5, type: "spring" }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleWhatsAppClick}
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 hover:shadow-green-500/25"
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Visor de Tareas Pendientes (para desarrollo/recordatorio) */}
      <PendingTasks />
    </div>
  );
};

export default LandingPage;