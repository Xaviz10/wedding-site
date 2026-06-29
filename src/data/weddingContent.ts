import type { WeddingContent } from "../types/wedding";
import capillaInmaculadaImage from "../assets/capilla-inmaculada.jpg";
import distanciaAmsterdamImage from "../assets/distancia-amsterdam.gif";
import distanciaCataJavier2018Image from "../assets/distancia-cata-javier-2018.jpg";
import distanciaMadridImage from "../assets/distancia-madrid.jpg";
import distanciaReencuentro2018Image from "../assets/distancia-reencuentro-2018.jpg";
import distanciaVueloNubes1Image from "../assets/distancia-vuelo-nubes-1.jpg";
import distanciaVueloNubes2Image from "../assets/distancia-vuelo-nubes-2.jpg";
import fincaLaMaraImage from "../assets/finca-la-mara.avif";
import hogar1Image from "../assets/hogar-1.jpg";
import hogar2Image from "../assets/hogar-2.jpg";
import hogarPlaya2023Image from "../assets/hogar-playa-2023.jpg";
import hogar5Image from "../assets/hogar-5.jpg";
import inicioAmigos2016Image from "../assets/inicio-amigos-2016.png";
import inicioFotoHistoriaImage from "../assets/inicio-foto-historia.png";
import milkaCachorra1Image from "../assets/milka-cachorra-1.jpg";
import milkaCachorra2Image from "../assets/milka-cachorra-2.jpg";
import milkaCarrusel1Image from "../assets/milka-carrusel-1.jpg";
import milkaCarrusel2Image from "../assets/milka-carrusel-2.jpg";
import milkaCarrusel3Image from "../assets/milka-carrusel-3.jpg";
import milkaConNosotrosImage from "../assets/milka-con-nosotros.jpg";
import milkaPortadaNavidadImage from "../assets/milka-portada-navidad.jpg";
import milkaPortadaPanueletaImage from "../assets/milka-portada-panueleta.jpg";
import milkaPortadaParqueImage from "../assets/milka-portada-parque.jpg";
import milkaPortadaPuertaAzulImage from "../assets/milka-portada-puerta-azul.jpg";
import milkaPortadaRioImage from "../assets/milka-portada-rio.jpg";
import milkaRetratoCircularImage from "../assets/milka-retrato-circular.jpg";
import propuestaAnilloNieve2025Image from "../assets/propuesta-anillo-nieve-2025.jpg";
import propuestaCataAnilloNieve2025Image from "../assets/propuesta-cata-anillo-nieve-2025.jpg";
import propuestaCataDijoSi2025Image from "../assets/propuesta-cata-dijo-si-2025.jpg";
import propuestaEigergletscherBgImage from "../assets/Frame-27-06-2026-09-17-07.jpeg";
import propuestaFamiliaNieve2025Image from "../assets/propuesta-familia-nieve-2025.jpg";
import propuestaGrindelwaldFamilia2025Image from "../assets/propuesta-grindelwald-familia-2025.jpg";

export const weddingContent: WeddingContent = {
  couple: "Cata & Javier",
  weddingDate: "5 de septiembre de 2026",
  hero: {
    title: "Cata & Javier",
    subtitle: "Nos casamos",
    text: "Una fiesta, un mensaje, un beso, 7.715 kilómetros, incontables reencuentros y muchos viajes nos han traído hasta este día.",
    date: "5 de septiembre de 2026",
    countdownTarget: "2026-09-05T14:30:00-05:00",
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
        image: inicioFotoHistoriaImage,
        alt: "Javier con un amigo en la fiesta de graduación en Colombia",
        images: [
          {
            src: inicioFotoHistoriaImage,
            alt: "Javier con un amigo en la fiesta de graduación en Colombia",
          },
          {
            src: inicioAmigos2016Image,
            alt: "Javier, Cata y amigos en una celebración de 2016",
            objectPosition: "82% 50%",
          },
        ],
        frame: "polaroid",
      },
      {
        title: "La distancia",
        moment: "Colombia ↔ Portugal",
        text: "Con Javier en Portugal y Cata en Colombia, aprendimos a querernos entre mensajes y llamadas.\nLa distancia no fue fácil, pero nos enseñó a elegirnos todos los días. Después vinieron los viajes, los reencuentros, nuevos países y la primera vez de Cata en avión.",
        image: distanciaVueloNubes1Image,
        alt: "Vista del ala de un avión sobre las nubes",
        images: [
          {
            src: distanciaVueloNubes1Image,
            alt: "Vista del ala de un avión sobre las nubes",
          },
          {
            src: distanciaCataJavier2018Image,
            alt: "Cata y Javier sonriendo juntos durante un reencuentro",
          },
          {
            src: distanciaVueloNubes2Image,
            alt: "Vista de un avión sobre el cielo y las nubes",
          },
          {
            src: distanciaReencuentro2018Image,
            alt: "Cata y Javier abrazados durante un reencuentro",
          },
          {
            src: distanciaAmsterdamImage,
            alt: "Cata y Javier junto a un canal con flores en Amsterdam",
          },
          {
            src: distanciaMadridImage,
            alt: "Cata besando a Javier frente al Palacio Real de Madrid",
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
            src: hogarPlaya2023Image,
            alt: "Cata y Javier abrazados en la playa al atardecer",
          },
          {
            src: hogar5Image,
            alt: "Cata y Javier con sus familias en el campo",
            blurBackground: true,
            objectFit: "contain",
            objectPosition: "50% 50%",
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
      "En una jornada de adopción en Sogamoso vimos una bolita negra de apenas dos meses escondida entre otros cachorros.",
      "Era Milka.",
      "Sin saberlo, ese día llegó a nuestras vidas una compañera que llenó nuestro hogar de amor, alegría y ternura.",
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
        src: milkaPortadaPuertaAzulImage,
        alt: "Milka cachorra sentada frente a una puerta azul",
        caption: "Milka portada",
      },
      {
        src: milkaPortadaNavidadImage,
        alt: "Cata y Javier con Milka usando sacos navideños",
        caption: "Milka portada",
      },
      {
        src: milkaPortadaRioImage,
        alt: "Milka parada en un río rodeada de vegetación",
        caption: "Milka portada",
      },
      {
        src: milkaPortadaPanueletaImage,
        alt: "Milka usando una pañoleta verde en el pasto",
        caption: "Milka portada",
      },
      {
        src: milkaPortadaParqueImage,
        alt: "Milka corriendo en un parque",
        caption: "Milka portada",
      },
      {
        src: milkaRetratoCircularImage,
        alt: "Retrato de Milka sonriendo sobre fondo oscuro",
        caption: "Milka retrato",
      },
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
        src: propuestaCataDijoSi2025Image,
        alt: "Cata y Javier mostrando el anillo en la nieve después de la propuesta",
        caption: "Cata dijo que sí",
        format: "portrait",
        objectPosition: "50% 28%",
      },
      {
        src: propuestaEigergletscherBgImage,
        alt: "Vista amplia de montañas suizas cubiertas de nieve en Eigergletscher",
        backgroundOnly: true,
        caption: "Eigergletscher, Suiza",
        format: "landscape",
      },
      {
        src: propuestaFamiliaNieve2025Image,
        alt: "Cata y Javier con sus familias en la nieve durante el viaje de la propuesta",
        caption: "",
        format: "portrait",
        objectPosition: "50% 36%",
      },
      {
        src: propuestaGrindelwaldFamilia2025Image,
        alt: "Cata y Javier con sus familias en Grindelwald",
        blurBackground: true,
        caption: "",
        format: "portrait",
        objectFit: "cover",
        objectPosition: "50% 50%",
      },
      {
        src: propuestaCataAnilloNieve2025Image,
        alt: "Cata sonriendo y mostrando el anillo de compromiso en la nieve",
        caption: "Un recuerdo para siempre",
        format: "square",
        secondaryAlt: "Mano de Cata mostrando el anillo de compromiso frente a la nieve",
        secondarySrc: propuestaAnilloNieve2025Image,
      },
    ],
    videoLabel: "Ver video de la propuesta",
    videoUrl: "https://www.youtube-nocookie.com/embed/QQmBa2mqOMU?autoplay=1&playsinline=1&rel=0",
    videoPoster: propuestaAnilloNieve2025Image,
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
      image: capillaInmaculadaImage,
      imageAlt: "Capilla De La Inmaculada en Tibasosa",
      venue: "Capilla De La Inmaculada",
      location: "Dg. 3 #121, Tibasosa, Boyacá",
      time: "2:30 pm",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://maps.app.goo.gl/VosoWe88QpCFpbXP7",
    },
    reception: {
      title: "Recepción",
      image: fincaLaMaraImage,
      imageAlt: "Finca La Mara",
      venue: "Finca La Mara",
      location: "Vía Tibasosa Km 4 vía Duitama - Tibasosa",
      time: "4:30 pm",
      locationCtaLabel: "Ver ubicación",
      locationCtaHref: "https://maps.app.goo.gl/pKbaD39XnPYG72tg6",
    },
    dressCode: {
      title: "Código de vestimenta",
      subtitle: "Elegante formal",
      guidance: [
        "Queremos una celebración elegante, cómoda y natural.",
        "Todos los colores son bienvenidos; solo evitamos algunos tonos específicos para mantener la armonía del día.",
      ],
      examples: [
        "Traje formal, sin chaleco.",
        "Evitar solo el tono marcado en la paleta.",
      ],
      womenExamples: [
        "Vestido largo. Unicolor.",
        "Evitar los tonos marcados en la paleta.",
      ],
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
  footer: {
    eyebrow: "Gracias por acompañarnos",
    message: "Nuestra historia continúa, y nos hace felices poder celebrar este nuevo capítulo contigo.",
    backToTopLabel: "Volver al inicio",
  },
};

export default weddingContent;
