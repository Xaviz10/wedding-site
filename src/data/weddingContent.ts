import type { WeddingContent } from "../types/wedding";
import distancia1Image from "../assets/distancia-1.jpg";
import distancia2Image from "../assets/distancia-2.jpg";
import distancia3Image from "../assets/distancia-3.jpg";
import distancia4Image from "../assets/distancia-4.jpg";
import distancia5Image from "../assets/distancia-5.jpg";
import fincaLaMaraImage from "../assets/finca-la-mara.avif";
import hogar1Image from "../assets/hogar-1.jpg";
import hogar2Image from "../assets/hogar-2.jpg";
import hogar3Image from "../assets/hogar-3.jpg";
import hogar4Image from "../assets/hogar-4.jpg";
import hogar5Image from "../assets/hogar-5.jpg";
import inicio2016Image from "../assets/inicio-2016.jpg";
import milkaCachorra1Image from "../assets/milka-cachorra-1.jpg";
import milkaCachorra2Image from "../assets/milka-cachorra-2.jpg";
import milkaCarrusel1Image from "../assets/milka-carrusel-1.jpg";
import milkaCarrusel2Image from "../assets/milka-carrusel-2.jpg";
import milkaCarrusel3Image from "../assets/milka-carrusel-3.jpg";
import milkaConNosotrosImage from "../assets/milka-con-nosotros.jpg";
import propuestaFamiliaEigerImage from "../assets/propuesta-familia-eiger.jpg";

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
        text: "Javier estaba de vacaciones en Colombia y Cata estaba en la fiesta de graduación de nuestro mejor amigo. Allí nos vimos por primera vez, sin imaginar que, después de esa noche, algo comenzaría a cambiar entre nosotros.\nEntre fiesta, risas y una conversación casual, comenzó nuestra historia. Tras una salida, una mirada y un beso que lo cambió todo, Javier volvió a Portugal.",
        image: inicio2016Image,
        alt: "Javier con amigos en la fiesta de graduación en Colombia",
        images: [
          {
            src: inicio2016Image,
            alt: "Javier con amigos en la fiesta de graduación en Colombia",
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
        text: "Con Javier en Portugal y Cata en Colombia, aprendimos a querernos entre mensajes y llamadas.\nLa distancia no fue fácil, pero nos enseñó a elegirnos todos los días. Después vinieron los viajes, los reencuentros, nuevos países y la primera vez de Cata en avión.",
        image: distancia1Image,
        alt: "Vista aérea de Portugal desde el avión",
        images: [
          {
            src: distancia1Image,
            alt: "Vista aérea de Portugal desde el avión",
          },
          {
            src: distancia2Image,
            alt: "Cata y Javier durante un viaje por Europa",
          },
          {
            src: distancia3Image,
            alt: "Cata y Javier tomados de la mano durante un viaje",
          },
          {
            src: distancia4Image,
            alt: "Cata y Javier frente a la Torre Eiffel",
          },
          {
            src: distancia5Image,
            alt: "Vuelo en parapente durante uno de sus viajes",
          },
        ],
        frame: "postcard",
      },
      {
        title: "Volver y construir hogar",
        moment: "Colombia, 2021 hasta hoy",
        text: "La pandemia empujó a Javier de vuelta a Colombia, decidimos vivir juntos y aprender el amor en la vida diaria, la rutina, la paciencia, las mudanzas y los sueños compartidos.\nDespués de tanto camino, seguimos llegando al mismo lugar: juntos.",
        image: hogar1Image,
        alt: "Cata y Javier juntos durante la pandemia en Colombia",
        images: [
          {
            src: hogar1Image,
            alt: "Cata y Javier juntos durante la pandemia en Colombia",
          },
          {
            src: hogar2Image,
            alt: "Cata y Javier con familia durante un viaje en Colombia",
          },
          {
            src: hogar3Image,
            alt: "Cata y Javier compartiendo con familia en un restaurante",
          },
          {
            src: hogar4Image,
            alt: "Celebración familiar de año nuevo",
          },
          {
            src: hogar5Image,
            alt: "Cata y Javier con sus familias en el campo",
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
        src: milkaCachorra1Image,
        alt: "Milka cachorra sentada frente a una puerta azul",
        caption: "Milka cachorra",
      },
      {
        src: milkaCachorra2Image,
        alt: "Milka cachorra en brazos de una niña en casa",
        caption: "Milka cachorra",
      },
      {
        src: milkaConNosotrosImage,
        alt: "Cata y Javier con Milka en un día de campo",
        caption: "Milka",
      },
      {
        src: milkaCarrusel1Image,
        alt: "Milka descansando en el sofá",
        caption: "Milka carrusel",
      },
      {
        src: milkaCarrusel2Image,
        alt: "Milka acostada en la cama con su peluche",
        caption: "Milka carrusel",
      },
      {
        src: milkaCarrusel3Image,
        alt: "Milka jugando acostada en el piso",
        caption: "Milka carrusel",
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
        src: propuestaFamiliaEigerImage,
        alt: "Familia reunida en Grindelwald durante el viaje de la propuesta",
        caption: "",
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
    title: "El gran día",
    subtitle: "Ceremonia, celebración y confirmación de asistencia.",
    date: "5 de septiembre de 2026",
    paragraphs: [
      "Después de casi diez años de historia, queremos celebrar este nuevo capítulo con las personas que queremos.",
      "Nos encantaría que nos acompañes.",
    ],
    ceremony: {
      title: "Ceremonia religiosa",
      image:
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=80",
      imageAlt: "Arco floral en ceremonia al aire libre",
      venue: "Lugar por confirmar",
      location: "Tibasosa / Nobsa / Sogamoso",
      time: "2:30 pm",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://www.google.com/maps/search/?api=1&query=Tibasosa%20Nobsa%20Sogamoso",
    },
    reception: {
      title: "Recepción",
      image: fincaLaMaraImage,
      imageAlt: "Finca La Mara",
      venue: "Finca La Mara",
      location: "Vía Tibasosa Km 4 via Duitama- Tibasosa",
      time: "4:30 pm",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://maps.app.goo.gl/pKbaD39XnPYG72tg6",
    },
    dressCode: {
      title: "Código de vestimenta",
      subtitle: "Elegante formal",
      guidance: [
        "Queremos una celebración elegante, cómoda y natural.",
        "Te sugerimos trajes, vestidos o conjuntos en tonos neutros, tierra, oliva, champagne o colores suaves.",
      ],
      examples: [
        "Traje Formal, sin chaleco.",
        "Se restringe el color azul.",
      ],
      womenExamples: [
        "Vestido largo",
        "Unicolor.",
        "Se restringe el color blanco y amarillo.",
      ],
      palette: ["#24291f", "#788267", "#949080", "#cbc2ad", "#f6f5f1"],
      note: "",
    },
  },
  rsvp: {
    title: "Confirma tu asistencia",
    intro: "Nos ayudará mucho saber si podremos contar contigo en este día tan especial.",
    submitLabel: "Confirmar asistencia",
    loadingLabel: "Enviando confirmación...",
    successMessage: "Gracias por ser parte de nuestra historia.\n\nCon amor,\n\nCata, Javier & Milka",
    errorMessage: "No pudimos registrar tu confirmación. Intenta de nuevo en unos minutos.",
  },
};

export default weddingContent;
