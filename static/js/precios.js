/**
 * CONFIGURACIÓN DE PRECIOS EDITABLE — SCROLL STUDIOS
 * Cada servicio puede tener 'promoHasta' (formato YYYY-MM-DD).
 * Si la fecha actual supera 'promoHasta', el servicio muestra automáticamente
 * su precio regular. NUNCA se usa la palabra 'Antes'.
 */
const SCROLL_PRICING_CONFIG = [
  {
    id: "pack-landing-avior",
    titulo: "Pack Landing + Avior",
    subtitulo: "Página web de aterrizaje + asistente en tu WhatsApp configurado para tu negocio.",
    destacado: true,
    etiqueta: "Recomendado",
    precioPromo: 300,
    promoHasta: "2026-10-31",
    textoPromo: "Precio de lanzamiento · termina el 31/10",
    badgeAhorro: "Ahorras S/ 100 este mes",
    precioRegular: null, // Si es null y vence, se oculta o usa texto por definir
        ocultarSiVence: true,
    caracteristicas: [
      "Landing page de alta conversión para celular y PC",
      "Avior configurado con las preguntas de tu negocio",
      "Botón directo y enlace a WhatsApp",
      "Entrega en 7 días hábiles",
      "2 rondas de cambios incluidas"
    ],
    ctaTexto: "Pedir Pack por WhatsApp",
    ctaMensaje: "Hola Scroll Studios! Me interesa el Pack Landing + Avior en oferta por S/ 300."
  },
  {
    id: "landing-page",
    titulo: "Landing Page",
    subtitulo: "Una sola página directa al grano, ideal para lanzar un producto o captar clientes.",
    destacado: false,
    etiqueta: null,
    precioPromo: 200,
    promoHasta: "2026-10-31",
    textoPromo: "Precio de lanzamiento · termina el 31/10",
    precioRegular: 300,
    textoDesdeNoviembre: "Desde noviembre: S/ 300",
    caracteristicas: [
      "Diseño moderno adaptado a celulares (360-430px)",
      "Formulario o botón de contacto a WhatsApp",
      "Carga rápida y optimización visual",
      "Entrega en 7 días hábiles",
      "2 rondas de cambios incluidas"
    ],
    ctaTexto: "Consultar por WhatsApp",
    ctaMensaje: "Hola Scroll Studios! Me interesa contratar una Landing Page."
  },
  {
    id: "avior-ia",
    titulo: "Avior (Asistente de WhatsApp)",
    subtitulo: "Responde consultas frecuentes de tus clientes en WhatsApp cuando tú no puedes.",
    destacado: false,
    etiqueta: null,
    precioPromo: 200,
    promoHasta: "2026-10-31",
    textoPromo: "Precio de lanzamiento · termina el 31/10",
    precioRegular: 350,
    textoDesdeNoviembre: "Desde noviembre: S/ 350",
    caracteristicas: [
      "Entrenado con información real de tus productos/servicios",
      "Te avisa cuando un cliente solicita hablar con una persona",
      "Se pausa automáticamente cuando tomas la conversación",
      "Sin cobros sorpresa de plataforma",
      "Configuración lista en tu número de WhatsApp"
    ],
    ctaTexto: "Pedir Avior por WhatsApp",
    ctaMensaje: "Hola Scroll Studios! Me interesa implementar el asistente Avior en mi WhatsApp."
  },
  {
    id: "web-corporativa",
    titulo: "Página Web Corporativa",
    subtitulo: "Múltiples secciones y páginas para empresas que necesitan mostrar solvencia y servicios.",
    destacado: false,
    etiqueta: null,
    precioRegular: 500,
    precioPromo: null,
    promoHasta: null,
    caracteristicas: [
      "Inicio, Nosotros, Servicios, Proyectos y Contacto",
      "Diseño a medida según la identidad de tu marca",
      "Estructura orientada a transmitir confianza profesional",
            "2 rondas de cambios incluidas"
    ],
    ctaTexto: "Cotizar por WhatsApp",
    ctaMensaje: "Hola Scroll Studios! Quisiera cotizar una Página Web Corporativa para mi empresa."
  },
  {
    id: "tienda-online",
    titulo: "Tienda Online (E-commerce)",
    subtitulo: "Catálogo de productos organizado, pasarelas de pago o pedidos directos por WhatsApp.",
    destacado: false,
    etiqueta: null,
    precioRegular: 800,
    precioPromo: null,
    promoHasta: null,
    caracteristicas: [
      "Catálogo interactivo con carrito de compras",
      "Integración de pagos (Yape, Plin, Tarjeta o WhatsApp)",
      "Panel para agregar o editar productos fácilmente",
            "2 rondas de cambios incluidas"
    ],
    ctaTexto: "Cotizar Tienda por WhatsApp",
    ctaMensaje: "Hola Scroll Studios! Quisiera cotizar una Tienda Online para mi negocio."
  }
];

function renderPrecios() {
  const container = document.getElementById('pricingGrid');
  if (!container) return;

  const now = new Date();
  // Fecha en zona horaria local
  const todayStr = now.toISOString().split('T')[0];

  let html = '';

  SCROLL_PRICING_CONFIG.forEach(item => {
    let estaEnPromo = false;
    if (item.promoHasta && item.precioPromo) {
      estaEnPromo = todayStr <= item.promoHasta;
    }

    // Si el pack solo dura hasta el 31/10 y ya venció, se oculta
    if (item.ocultarSiVence && !estaEnPromo) {
      return;
    }

    const precioMostrar = estaEnPromo ? item.precioPromo : item.precioRegular;
    const badgeHTML = item.etiqueta ? `<span class="pricing-card-badge">${item.etiqueta}</span>` : '';
    const ahorroHTML = (estaEnPromo && item.badgeAhorro) ? `<span class="pricing-save-badge">${item.badgeAhorro}</span>` : '';
    
    let promoSubtext = '';
    if (estaEnPromo && item.textoPromo) {
      promoSubtext = `<div class="pricing-promo-note">${item.textoPromo}</div>`;
      if (item.textoDesdeNoviembre) {
        promoSubtext += `<div class="pricing-next-note">${item.textoDesdeNoviembre}</div>`;
      }
    }

    const featureItems = item.caracteristicas.map(f => `<li><span class="p-check">✓</span> ${f}</li>`).join('');

    const waLink = `https://wa.me/51987355501?text=${encodeURIComponent(item.ctaMensaje)}`;

    html += `
      <div class="pricing-card ${item.destacado ? 'featured' : ''} reveal" id="${item.id}">
        ${badgeHTML}
        <div class="pricing-card-header">
          <h3 class="pricing-title">${item.titulo}</h3>
          <p class="pricing-sub">${item.subtitulo}</p>
        </div>

        <div class="pricing-cost-wrap">
          <div class="pricing-cost-main">
            <span class="pricing-from">Desde</span>
            <span class="pricing-currency">S/</span>
            <span class="pricing-amount">${precioMostrar}</span>
          </div>
          ${ahorroHTML}
          ${promoSubtext}
        </div>

        <ul class="pricing-features">
          ${featureItems}
        </ul>

        <div class="pricing-cta-wrap">
          <a href="${waLink}" target="_blank" class="pricing-btn ${item.destacado ? 'btn-clay-primary' : 'btn-clay-secondary'}">
            ${item.ctaTexto} ↗
          </a>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderPrecios);
} else {
  renderPrecios();
}
