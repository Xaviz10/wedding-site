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
      "Todo comenzó en mensajes de Facebook, entre conversaciones tímidas y ganas de vernos en persona. Lo que parecía casual terminó convirtiéndose en la certeza de que queríamos caminar juntos.",
    beats: [
      {
        title: "El primer mensaje",
        moment: "Facebook, una noche cualquiera",
        text: "Entre bromas y respuestas largas apareció una conexión inesperada. Nadie imaginó que esa conversación sería el inicio de todo.",
      },
      {
        title: "Bowling y nervios",
        moment: "Nuestra primera salida",
        text: "Llegamos con planes simples y salimos con una sensación difícil de explicar. Fue la primera vez que el tiempo se nos fue sin darnos cuenta.",
      },
      {
        title: "Caminatas nocturnas",
        moment: "Cuando la ciudad se quedaba en silencio",
        text: "Después de cada cita seguíamos hablando en la calle, sin querer despedirnos. Ahí entendimos que esta historia tenía rumbo.",
      },
      {
        title: "El beso que cambió todo",
        moment: "Una noche inolvidable",
        text: "El primer beso llegó natural, como si ya estuviera escrito. Desde entonces dejamos de preguntarnos si era posible y empezamos a construir.",
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
      "Milka no es una mascota en nuestra historia, es familia. Su energía, sus rituales y su ternura hicieron de la casa un lugar todavía más nuestro.",
    moments: [
      {
        title: "Bienvenida oficial",
        text: "Desde el primer día se adueñó del sofá y de nuestros horarios, con una mirada que siempre pide abrazo.",
      },
      {
        title: "Inspectora de maletas",
        text: "No hay viaje que se prepare sin su supervisión. Cada maleta abierta significa que pronto habrá una despedida o un reencuentro.",
      },
      {
        title: "Compañera de tardes lentas",
        text: "Entre paseos y siestas largas, nos recuerda que los mejores planes también caben en casa.",
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
