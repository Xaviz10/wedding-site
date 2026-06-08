import type { WeddingContent } from "../types/wedding";

export const weddingContent: WeddingContent = {
  couple: "Cata & Javier",
  weddingDate: "5 de septiembre de 2026",
  hero: {
    title: "Cata & Javier",
    subtitle: "Nos casamos",
    text: "Una historia que empezó con una confusión, siguió con un beso inolvidable y hoy nos trae hasta este día.",
    date: "5 de septiembre de 2026",
    cta: "Ver nuestra historia",
  },
  story: {
    intro:
      "Todo empezó en septiembre de 2016, sin planearlo demasiado: una fiesta, una confusión, una salida, un beso y una historia que desde entonces no dejó de crecer.",
    beats: [
      {
        title: "El inicio",
        moment: "Septiembre de 2016",
        text: "Nos conocimos en una fiesta de graduación.\nJavier pensó que Cata era una de las tías de su amigo.\nSí, así de romántico empezó esto.",
        image:
          "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
        alt: "Luces cálidas y ambiente de fiesta nocturna",
        images: [
          {
            src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
            alt: "Luces cálidas y ambiente de fiesta nocturna",
          },
          {
            src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
            alt: "Personas celebrando en una fiesta con luces de colores",
          },
          {
            src: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
            alt: "Brindis en una fiesta con ambiente íntimo",
          },
        ],
        frame: "polaroid",
      },
      {
        title: "La distancia",
        moment: "Colombia ↔ Portugal",
        text: "Después de una salida, una mirada y un beso que lo cambió todo, Javier volvió a Portugal.\nAhí empezó nuestra historia a distancia: llamadas largas, aeropuertos, despedidas y reencuentros.",
        image:
          "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
        alt: "Ventana de aeropuerto con avión durante el atardecer",
        images: [
          {
            src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1400&q=80",
            alt: "Ventana de aeropuerto con avión durante el atardecer",
          },
          {
            src: "https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1400&q=80",
            alt: "Mano sosteniendo pasaporte frente a una pista de aeropuerto",
          },
          {
            src: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=1400&q=80",
            alt: "Pantalla de videollamada representando relación a distancia",
          },
        ],
        frame: "postcard",
      },
      {
        title: "Los viajes",
        moment: "Aeropuertos, fotos y postales",
        text: "Seguimos eligiéndonos a pesar de la distancia.\nVinieron viajes, fotos, nuevos países y la primera vez de Cata en avión.",
        image:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1300&q=80",
        alt: "Pasaporte, mapa y recuerdos de viaje sobre una mesa",
        images: [
          {
            src: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1300&q=80",
            alt: "Pasaporte, mapa y recuerdos de viaje sobre una mesa",
          },
          {
            src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1300&q=80",
            alt: "Vista aérea de un paisaje montañoso durante un viaje",
          },
          {
            src: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1300&q=80",
            alt: "Pareja caminando por una calle europea",
          },
        ],
        frame: "instant",
      },
      {
        title: "Volver y construir hogar",
        moment: "Colombia, 2021 hasta hoy",
        text: "La pandemia empujó a Javier de vuelta a Colombia en 2021.\nDespués decidimos vivir juntos y aprender el amor en la vida diaria: la rutina, la paciencia, las mudanzas y los sueños compartidos.\nEste año compramos nuestro apartamento.\nDespués de tanto camino, seguimos llegando al mismo lugar: juntos.",
        image:
          "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1300&q=80",
        alt: "Pareja en una cocina cálida con cajas de mudanza",
        images: [
          {
            src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1300&q=80",
            alt: "Pareja en una cocina cálida con cajas de mudanza",
          },
          {
            src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1300&q=80",
            alt: "Llaves de apartamento sobre una mesa de madera",
          },
          {
            src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1300&q=80",
            alt: "Sala luminosa de apartamento nuevo con plantas y sofá",
          },
        ],
        frame: "polaroid",
      },
    ],
  },
  journey: {
    intro:
      "Nuestra relación aprendió a vivir entre aeropuertos, pantallas, maletas y regresos. La distancia no nos separó: nos enseñó disciplina, confianza y cuidado diario.",
    beats: [
      {
        title: "Colombia ↔ Portugal",
        location: "Entre husos horarios",
        text: "Las videollamadas, los mensajes de madrugada y los calendarios compartidos se volvieron parte de nuestra rutina.",
      },
      {
        title: "Tarjetas de embarque",
        location: "Llegadas y despedidas",
        text: "Cada vuelo era una promesa cumplida. Cada reencuentro nos recordaba por qué valía la pena insistir.",
      },
      {
        title: "Primer apartamento",
        location: "Nuestro hogar",
        text: "Dejar de medir el amor en kilómetros y empezar a medirlo en cafés de la mañana, mercado compartido y vida cotidiana.",
      },
    ],
  },
  milka: {
    intro:
      "A veces la vida parece una ruta fija entre metas, trabajo y planes. Hasta que aparecen seres de luz que te recuerdan lo esencial.",
    paragraphs: [
      "En una jornada de adopción en Sogamoso vimos una bolita negra de apenas dos meses, escondida debajo de otros cachorros.",
      "Era Milka.",
      "La vimos y nos enamoramos. Lo que no sabíamos era todo el amor que traería a nuestras vidas: las risas, la unión, la ternura y esa forma tan suya de hablarnos con esas perlas negras que tiene por ojos.",
      "Desde entonces va con nosotros a todas partes y se convirtió en una parte enorme de nuestra familia.",
      "Milka nos recuerda, todos los días, lo que verdaderamente importa.",
      "Por eso, obviamente, también estará en nuestra boda. Porque esta historia no estaría completa sin sus patitas.",
    ],
    quote: "Gracias, Milka, por ser ese ser de luz que nos recuerda lo que verdaderamente importa.",
    note: [
      "Hola, soy Milka.",
      "Yo también voy a estar en la boda porque esta familia no toma decisiones importantes sin mí.",
      "Prometo verme hermosa, acompañar a mis humanos y posiblemente robarme algunas miradas.",
      "Nos vemos el 5 de septiembre.",
      "Con amor,",
      "Milka.",
    ],
    photos: [
      {
        src: "https://picsum.photos/seed/milka-cachorra/900/1100",
        alt: "Milka de cachorra envuelta en una manta clara",
        caption: "Milka cachorra",
      },
      {
        src: "https://picsum.photos/seed/milka-actual/900/1100",
        alt: "Milka adulta mirando con ternura a cámara",
        caption: "Milka hoy",
      },
      {
        src: "https://picsum.photos/seed/milka-familia/1100/900",
        alt: "Milka junto a nosotros durante un paseo",
        caption: "Milka con nosotros",
      },
    ],
  },
  proposal: {
    intro: "La pregunta en las montañas.",
    beats: [
      {
        text: "Después de tantos años juntos, Javier quería que la propuesta fuera en un lugar tan especial como nuestra historia.",
      },
      {
        text: "En abril de 2025 viajamos a Europa con nuestras familias y llegamos a Suiza. En Eigergletscher, rodeados de montañas, frío y una vista imposible de olvidar, Javier le pidió matrimonio a Cata.",
      },
      {
        text: "Cata dijo que sí.",
        emphasis: "highlight",
      },
      {
        text: "Tenemos fotos, tenemos el recuerdo y también tenemos un video grabado con mucho amor… y con poca estabilidad de cámara. Gracias, Dayana.",
        emphasis: "humor",
      },
      {
        text: "No fue perfecto. Fue mejor: fue nuestro.",
      },
    ],
    photos: [
      {
        src: "https://picsum.photos/seed/eiger-propuesta-01/1400/980",
        alt: "Vista amplia de montañas suizas cubiertas de nieve en Eigergletscher",
        caption: "Eigergletscher, Suiza",
        format: "landscape",
      },
      {
        src: "https://picsum.photos/seed/eiger-propuesta-02/980/1280",
        alt: "Cata y Javier abrazados en la nieve con el anillo de compromiso",
        caption: "La pregunta y el sí",
        format: "portrait",
      },
      {
        src: "https://picsum.photos/seed/eiger-propuesta-03/1200/1200",
        alt: "Manos juntas con anillo y paisaje de fondo",
        caption: "Un recuerdo para siempre",
        format: "square",
      },
    ],
    videoLabel: "Ver video de la propuesta",
    videoUrl: "#video-propuesta",
    videoPoster: "https://picsum.photos/seed/eiger-propuesta-video/1400/880",
  },
  gallery: {
    title: "Galería — Nuestro camino",
    subtitle:
      "Nuestro camino en fotos. Algunos recuerdos de estos años: viajes, casas, despedidas, reencuentros, Milka, familia y todos esos momentos pequeños que nos trajeron hasta aquí.",
    categories: [
      {
        title: "Primeros años",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-01/1200/1600",
            alt: "Cata y Javier en una calle iluminada",
            caption: "Donde empezó todo",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-02/1600/1100",
            alt: "Bolos sobre una mesa de madera",
            caption: "Nuestra primera gran aventura",
            format: "landscape",
          },
        ],
      },
      {
        title: "Portugal y la distancia",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-03/1200/1500",
            alt: "Ventana de aeropuerto al atardecer",
            caption: "Un aeropuerto más",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-04/1200/1200",
            alt: "Postal de ciudad europea",
            caption: "Siempre volviendo a encontrarnos",
            format: "square",
          },
        ],
      },
      {
        title: "Viajes juntos",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-05/1600/1100",
            alt: "Ruta de montaña con luz de tarde",
            caption: "Nuestra primera gran aventura",
            format: "landscape",
          },
          {
            src: "https://picsum.photos/seed/cj-06/1200/1500",
            alt: "Pareja frente a lago",
            caption: "Siempre volviendo a encontrarnos",
            format: "portrait",
          },
        ],
      },
      {
        title: "Nuestra vida en casa",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-07/1200/1200",
            alt: "Mesa de madera con velas",
            caption: "Nuestro hogar",
            format: "square",
          },
          {
            src: "https://picsum.photos/seed/cj-08/1600/1100",
            alt: "Sala cálida con plantas",
            caption: "Nuestro hogar",
            format: "landscape",
          },
        ],
      },
      {
        title: "Milka",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-09/1200/1500",
            alt: "Perrita observando por la ventana",
            caption: "La familia creció con cuatro patas",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-10/1200/1200",
            alt: "Huella sobre manta clara",
            caption: "La familia creció con cuatro patas",
            format: "square",
          },
        ],
      },
      {
        title: "Suiza y la propuesta",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-11/1600/1100",
            alt: "Montañas nevadas bajo cielo limpio",
            caption: "El sí más bonito",
            format: "landscape",
          },
          {
            src: "https://picsum.photos/seed/cj-12/1200/1500",
            alt: "Anillo y flores blancas",
            caption: "El sí más bonito",
            format: "portrait",
          },
        ],
      },
      {
        title: "Familia y amigos",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-13/1200/1200",
            alt: "Mesa larga con flores y velas",
            caption: "Siempre volviendo a encontrarnos",
            format: "square",
          },
          {
            src: "https://picsum.photos/seed/cj-14/1600/1100",
            alt: "Brindis al aire libre al atardecer",
            caption: "Donde empezó todo",
            format: "landscape",
          },
        ],
      },
    ],
  },
  event: {
    title: "EL GRAN DÍA + RSVP",
    subtitle: "Celebra con nosotros.",
    paragraphs: [
      "Después de casi diez años de historia, queremos celebrar este nuevo capítulo con las personas que queremos.",
      "Nos casamos el 5 de septiembre de 2026 y nos encantaría que nos acompañes.",
    ],
    ceremony: {
      title: "Ceremonia religiosa",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80",
      imageAlt: "Arco floral en ceremonia al aire libre",
      venue: "Lugar por confirmar",
      location: "Tibasosa / Nobsa / Sogamoso",
      time: "Hora por confirmar",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://www.google.com/maps/search/?api=1&query=Tibasosa%20Nobsa%20Sogamoso",
    },
    reception: {
      title: "Recepción",
      image:
        "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1800&q=80",
      imageAlt: "Montaje de recepción con flores y velas",
      venue: "Hacienda La Mara",
      location: "Boyacá, Colombia",
      time: "Hora por confirmar",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://www.google.com/maps/search/?api=1&query=Hacienda%20La%20Mara%20Boyac%C3%A1",
    },
  },
  rsvp: {
    title: "Confirma tu asistencia",
    intro: "Por favor confirma antes del [fecha límite] para ayudarnos a organizar cada detalle con mucho amor.",
    submitLabel: "Enviar confirmación",
    loadingLabel: "Enviando confirmación...",
    successMessage: "Gracias por ser parte de nuestra historia.\n\nCon amor,\n\nCata, Javier & Milka",
    errorMessage: "No pudimos registrar tu confirmación. Intenta de nuevo en unos minutos.",
  },
};

export default weddingContent;
