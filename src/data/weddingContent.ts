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
    intro:
      "En Suiza, con montañas nevadas y una calma absoluta, llegó la pregunta que soñábamos desde hace tiempo. Fue íntimo, sencillo y profundamente nuestro.",
    beats: [
      {
        title: "Mañana entre montañas",
        text: "Subimos temprano para ver la luz caer sobre la nieve. El paisaje parecía una postal en movimiento.",
      },
      {
        title: "La pregunta",
        text: "Entre frío, lágrimas y risas, llegó el 'sí'. Un instante pequeño para el mundo, inmenso para nosotros.",
      },
      {
        title: "Un nuevo comienzo",
        text: "Volvimos con anillo, video y la certeza de que queríamos celebrar esta historia con nuestra gente.",
      },
    ],
    videoLabel: "Ver video de la propuesta",
    videoUrl: "#video-propuesta",
  },
  gallery: {
    title: "Galería",
    subtitle: "Fragmentos de nuestra historia en fotografías y recuerdos.",
    categories: [
      {
        title: "Primeros años",
        photos: [
          {
            src: "https://picsum.photos/seed/cj-01/1200/1600",
            alt: "Cata y Javier en una calle iluminada",
            caption: "Noches que nunca querían terminar.",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-02/1600/1100",
            alt: "Bolos sobre una mesa de madera",
            caption: "El plan que se volvió tradición.",
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
            caption: "El amor también aprendió de salas de espera.",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-04/1200/1200",
            alt: "Postal de ciudad europea",
            caption: "La distancia nos enseñó a elegirnos todos los días.",
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
            caption: "Cada viaje, una versión nueva de nosotros.",
            format: "landscape",
          },
          {
            src: "https://picsum.photos/seed/cj-06/1200/1500",
            alt: "Pareja frente a lago",
            caption: "Donde hay paisaje, hay historia.",
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
            caption: "Lo cotidiano también puede ser extraordinario.",
            format: "square",
          },
          {
            src: "https://picsum.photos/seed/cj-08/1600/1100",
            alt: "Sala cálida con plantas",
            caption: "Nuestro lugar favorito siempre termina siendo el hogar.",
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
            caption: "La dueña del sofá y del corazón.",
            format: "portrait",
          },
          {
            src: "https://picsum.photos/seed/cj-10/1200/1200",
            alt: "Huella sobre manta clara",
            caption: "Siempre presente en cada capítulo.",
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
            caption: "El lugar donde dijimos sí.",
            format: "landscape",
          },
          {
            src: "https://picsum.photos/seed/cj-12/1200/1500",
            alt: "Anillo y flores blancas",
            caption: "Un instante eterno.",
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
            caption: "Gracias por acompañarnos hasta aquí.",
            format: "square",
          },
          {
            src: "https://picsum.photos/seed/cj-14/1600/1100",
            alt: "Brindis al aire libre al atardecer",
            caption: "Nos emociona celebrar este día con ustedes.",
            format: "landscape",
          },
        ],
      },
    ],
  },
  event: {
    title: "El gran día",
    subtitle: "Queremos celebrar este capítulo junto a ustedes.",
    details: [
      {
        label: "Fecha",
        value: "5 de septiembre de 2026",
      },
      {
        label: "Ceremonia",
        value: "Por confirmar · Tibasosa / Nobsa / Sogamoso",
      },
      {
        label: "Recepción",
        value: "Hacienda La Mara",
      },
      {
        label: "Código de vestuario",
        value: "Elegante · tonos tierra y verdes naturales",
      },
    ],
    schedule: [
      {
        time: "3:30 p. m.",
        event: "Llegada y bienvenida",
      },
      {
        time: "4:00 p. m.",
        event: "Ceremonia",
      },
      {
        time: "5:00 p. m.",
        event: "Cóctel en jardines",
      },
      {
        time: "7:00 p. m.",
        event: "Cena y brindis",
      },
      {
        time: "9:00 p. m.",
        event: "Celebración",
      },
    ],
    note: "Tu presencia es lo más importante. Si tienes restricciones alimentarias o necesidades especiales, cuéntanos en el RSVP.",
  },
  rsvp: {
    title: "Confirmación de asistencia",
    subtitle: "Agradecemos confirmar tu asistencia antes del 15 de julio de 2026.",
    submitLabel: "Confirmar asistencia",
    loadingLabel: "Enviando confirmación...",
    successMessage: "Gracias por confirmar. Nos emociona celebrar contigo.",
    errorMessage: "No pudimos registrar tu confirmación. Intenta de nuevo en unos minutos.",
  },
};

export default weddingContent;
