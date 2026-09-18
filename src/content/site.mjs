/** Alleen bevestigde bedrijfsgegevens invullen. Lege gegevens worden nooit verzonnen. */
export const site = {
  name: 'Bridge2Connect',
  person: 'Lex de Lange',
  role: 'Adviseur',
  language: 'nl-NL',
  email: 'lexdelange@bridge2connect.nl',
  phone: '',
  phoneDisplay: '',
  linkedIn: '',
  partnerUrl: '',
  domain: '',
  kvk: '',
  published: false,
  approval: {
    copy: false,
    contact: false,
    companyMentions: false,
    images: false,
    privacy: false,
  },
};

export const navigation = [
  { href: '/expertise/', label: 'Expertise' },
  { href: '/over-lex/', label: 'Over Lex' },
  { href: '/netwerk/', label: 'Netwerk' },
];

export const services = [
  {
    id: 'sectorinzicht', number: '01', icon: 'compass',
    title: 'De sector begrijpen',
    short: 'Bepalen waar uw aanbod aansluit op de behoeften, werkwijze en besluitvorming van de sector.',
    heading: 'Uw aanbod begrijpen vanuit de sector.',
    paragraphs: [
      'De Defensie- en Veiligheidssector heeft een eigen taal, werkwijze en besluitvorming. Een sterke oplossing is daarom niet het hele verhaal. Het gaat er ook om hoe die oplossing aansluit op de dagelijkse praktijk en de vraag van de organisatie.',
      'Lex helpt uw aanbod vanuit dat perspectief te bekijken. Wat lost u op? Voor wie is dat relevant? En wat is een logische eerste stap? Zo ontstaat een duidelijker verhaal en een gerichtere aanpak.',
    ],
    results: ['Een heldere positionering', 'Inzicht in relevante vraagstukken', 'Een onderbouwde richting voor het gesprek'],
    question: 'Waar sluit ons aanbod aan op de behoeften van de sector?',
  },
  {
    id: 'verbinding', number: '02', icon: 'connection',
    title: 'De juiste mensen verbinden',
    short: 'Van een eerste aanspreekpunt naar een gesprek met de mensen die uw vraagstuk verder kunnen brengen.',
    heading: 'De juiste aanspreekpunten en partners vinden.',
    paragraphs: [
      'Binnen deze sector zijn vaak verschillende mensen en perspectieven betrokken: van gebruikers en inhoudelijke specialisten tot management en commerciële partners. Wie u spreekt, wanneer u dat doet en met welke vraag, maakt verschil.',
      'Met zijn netwerk binnen en rondom de sector helpt Lex relevante aanspreekpunten en samenwerkingspartners te vinden. Hij begrijpt hoe gesprekken op verschillende niveaus met elkaar samenhangen — de praktijk achter multi-level selling.',
    ],
    results: ['Relevante aanspreekpunten', 'Verbinding met mogelijke partners', 'Een gesprek dat inhoudelijk aansluit'],
    question: 'Met wie moeten we in gesprek om verder te komen?',
  },
  {
    id: 'samenwerking', number: '03', icon: 'arrow-path',
    title: 'Van vraag naar samenwerking',
    short: 'De vertaalslag maken tussen wat een organisatie nodig heeft en wat uw bedrijf daadwerkelijk kan bieden.',
    heading: 'Van behoefte naar een passende oplossing.',
    paragraphs: [
      'Een behoefte wordt niet altijd in dezelfde woorden beschreven als een oplossing. Lex brengt beide kanten bij elkaar: wat is het werkelijke vraagstuk, wat kan uw bedrijf bijdragen en waar is samenwerking met anderen nodig?',
      'Vanuit die gedeelde basis helpt hij richting te geven aan het vervolg. Met oog voor de mensen, verwachtingen en randvoorwaarden die daarbij horen. Niet door snelle resultaten te beloven, maar door de samenwerking zorgvuldig op te bouwen.',
    ],
    results: ['Een gedeeld begrip van de behoefte', 'Duidelijke verwachtingen', 'Concrete vervolgstappen'],
    question: 'Hoe maken we van een goed gesprek een zinvol vervolg?',
  },
];

export const companies = [
  'SAAB NL', 'Signify / Trulifi', 'DuJardin–Remmers', 'UBC Composites',
  'Fleetmasters', 'BeephoniX', 'Neo4j',
];

// Redactioneel voorstel op basis van de briefing; door Lex bevestigen vóór publicatie.
export const steps = [
  { number: '01', title: 'Kennismaken', text: 'We beginnen bij uw bedrijf, uw oplossing en de vraag waarmee u rondloopt. Eerst begrijpen, dan adviseren.' },
  { number: '02', title: 'Richting bepalen', text: 'We verkennen waar de aansluiting zit en welke mensen, partners en vervolgstappen relevant kunnen zijn.' },
  { number: '03', title: 'Verbinden & opvolgen', text: 'We brengen de juiste perspectieven bij elkaar en maken het vervolg concreet. Met aandacht voor de relatie.' },
];

export const faqs = [
  {
    question: 'Voor welke bedrijven is Bridge2Connect er?',
    answer: 'Voor bedrijven die zaken willen doen met de Defensie- en Veiligheidssector en daar ondersteuning bij kunnen gebruiken. Dat kan gaan om een eerste verkenning, het vinden van relevante contacten of het verder brengen van een bestaande samenwerking.',
  },
  {
    question: 'Moeten we al actief zijn binnen Defensie?',
    answer: 'Nee. Ook wanneer u de sector nog aan het verkennen bent, is een gesprek zinvol. Het vertrekpunt is uw bedrijf en de vraag waar uw oplossing mogelijk aansluit.',
  },
  {
    question: 'Wat gebeurt er tijdens een eerste gesprek?',
    answer: 'We bespreken wat uw bedrijf doet, welke ervaring u met de sector heeft en waar u ondersteuning zoekt. Daarna kijken we samen of en hoe Lex kan bijdragen. De werkwijze en eventuele opdracht spreken we vervolgens apart af.',
  },
  {
    question: 'Garandeert een introductie ook een opdracht?',
    answer: 'Nee. Een relevante introductie kan een gesprek mogelijk maken, maar is geen garantie op een opdracht of een bepaalde uitkomst. Bridge2Connect richt zich op een goede aansluiting en een zorgvuldig opgebouwde samenwerking.',
  },
];

export const pages = {
  home: { path: '/', title: 'Bridge2Connect | Verbinding met Defensie & Veiligheid', description: 'Lex de Lange helpt bedrijven hun weg te vinden in de Defensie- en Veiligheidssector. Sectorinzicht, relevante verbindingen en persoonlijke begeleiding.' },
  expertise: { path: '/expertise/', title: 'Expertise | Bridge2Connect', description: 'Van sectorinzicht en de juiste aanspreekpunten tot de vertaalslag naar samenwerking. Ontdek hoe Lex de Lange uw bedrijf ondersteunt.' },
  about: { path: '/over-lex/', title: 'Over Lex de Lange | Bridge2Connect', description: 'Oud-militair, gebrevetteerd commando en ervaren in de samenwerking tussen IT-bedrijven en de Defensie- en Veiligheidssector. Maak kennis met Lex.' },
  network: { path: '/netwerk/', title: 'Netwerk & samenwerking | Bridge2Connect', description: 'Een persoonlijk netwerk binnen en rondom de Defensie- en Veiligheidssector. Over de bedrijven en samenwerkingen van Bridge2Connect.' },
  contact: { path: '/contact/', title: 'Kennismaken met Lex | Bridge2Connect', description: 'Vertel waar uw bedrijf naartoe wil. Een eerste gesprek met Lex de Lange begint bij uw vraag over de Defensie- en Veiligheidssector.' },
  privacy: { path: '/privacy/', title: 'Privacy & website-informatie | Bridge2Connect', description: 'Informatie over deze website, het contactproces en de gebruikte beelden.' },
  notfound: { path: '/404.html', title: 'Pagina niet gevonden | Bridge2Connect', description: 'Deze pagina is niet gevonden. Ga terug naar Bridge2Connect.' },
};
