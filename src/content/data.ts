// Central V1 dataset. Relations use ids; URLs use slugs.
// Ambition.serviceIds is the source of truth for ambition↔service links;
// Case.serviceIds for case↔service links. The repository derives the reverse side.
import type { Ambition, Case, ContactPerson, Service } from "./types";
import wolky from "@/assets/wolky.jpg.asset.json";
import rogier from "@/assets/rogier.png.asset.json";
import s100 from "@/assets/service-100.png.asset.json";
import s123 from "@/assets/service-123.png.asset.json";
import s146 from "@/assets/service-146.png.asset.json";
import koffie from "@/assets/case-koffie.jpg";
import digitaal from "@/assets/case-digitaal.jpg";
import identiteit from "@/assets/case-identiteit.jpg";

export const DEFAULT_CONTACT_ID = "c-rogier";

export const contacts: ContactPerson[] = [
  {
    id: "c-rogier",
    name: "Rogier Gilkes",
    role: "Managing Director",
    photo: rogier.url,
    email: "r.gilkes@nobears.nl",
    phone: "073 369 0000",
  },
  {
    id: "c-demo-strategie",
    name: "Demo Strateeg",
    role: "Strategy Lead (placeholder)",
    email: "strategie@example.com",
    note: "Placeholder — vervang door een echte collega.",
    isPlaceholder: true,
  },
  {
    id: "c-demo-content",
    name: "Demo Contentmaker",
    role: "Content Lead (placeholder)",
    email: "content@example.com",
    note: "Placeholder — vervang door een echte collega.",
    isPlaceholder: true,
  },
];

const p = (...t: string[]) => t;

export const services: Omit<Service, "ambitionIds" | "caseIds">[] = [
  {
    id: "s-merkstrategie",
    title: "Merkstrategie & positionering",
    slug: "merkstrategie-positionering",
    korteIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta. Morbi mi magna, ullamcorper eget odio ac, congue varius nibh. Proin faucibus sit amet arcu vel volutpat.",
    shortIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta. Morbi mi magna, ullamcorper eget odio ac, congue varius nibh. Proin faucibus sit amet arcu vel volutpat.",
    shortDescription: "Waar staat het merk voor en waarom kiest de klant ervoor?",
    extraKeywords: "propositie, merkbelofte, positionering, merkfundament, merkverhaal, archetype",
    extraZoekwoorden:
      "propositie, merkbelofte, positionering, merkfundament, merkverhaal, archetype",
    description: p(
      "We brengen in kaart waar een merk vandaan komt, waar het naartoe wil en welke plek het in de markt kan claimen. Dat doen we met interviews, sessies en markt- en doelgroeponderzoek.",
      "Het resultaat is een scherpe positionering, een merkbelofte en een merkverhaal dat richting geeft aan alle volgende stappen: van huisstijl tot campagne.",
    ),
    image: s100.url,
    searchTerms: [
      "branding",
      "positionering",
      "brand strategy",
      "merkwaarden",
      "merkbelofte",
      "merkidentiteit",
      "rebranding",
    ],
    contactPersonId: "c-rogier",
  },
  {
    id: "s-huisstijl",
    title: "Huisstijl",
    slug: "huisstijl",
    shortIntro: "Een visuele identiteit die herkenbaar en consistent is.",
    shortDescription: "Een visuele identiteit die herkenbaar en consistent is.",
    extraKeywords: "logo ontwerp, visuele identiteit, design system, brandbook",
    description: p(
      "Logo, kleur, typografie, beeldtaal en vormelementen: samen vormen ze het gezicht van een merk. We ontwerpen een identiteit die past bij de positionering en flexibel genoeg is voor elk kanaal.",
      "We leveren de huisstijl op met heldere richtlijnen, zodat iedereen er direct mee aan de slag kan.",
    ),
    image: s123.url,
    searchTerms: [
      "logo",
      "visuele identiteit",
      "brand identity",
      "corporate identity",
      "styleguide",
      "brandbook",
      "kleurenpalet",
    ],
  },
  {
    id: "s-touchpoint",
    title: "Touchpoint - optimalisatie",
    slug: "touchpoint-optimalisatie",
    shortIntro: "Elk contactmoment met de klant slimmer en beter.",
    shortDescription: "Elk contactmoment met de klant slimmer en beter.",
    extraKeywords: "conversieoptimalisatie, funnel, klantreis, user journey, ux audit",
    description: p(
      "We analyseren de contactmomenten tussen merk en klant: website, e-mail, winkel, service. Waar haken mensen af en waar liggen kansen?",
      "Op basis van data en gebruikersonderzoek verbeteren we die momenten stap voor stap, met meetbaar resultaat.",
    ),
    image: s146.url,
    searchTerms: [
      "customer journey",
      "conversie",
      "cro",
      "ux",
      "klantreis",
      "optimalisatie",
      "touchpoints",
    ],
    contactPersonId: "c-demo-strategie",
  },
  {
    id: "s-campagne",
    title: "Campagne - strategie",
    slug: "campagne-strategie",
    shortIntro: "Een campagne-idee dat opvalt en werkt.",
    shortDescription: "Een campagne-idee dat opvalt en werkt.",
    extraKeywords: "campagneconcept, media-inzet, activatie, go to market",
    description: p(
      "Van inzicht naar creatief concept naar mediaplan. We bepalen welke boodschap bij welke doelgroep landt, en via welke kanalen.",
      "Een sterke campagne vergroot bekendheid, versterkt het merk en zet mensen in beweging.",
    ),
    image: s100.url,
    searchTerms: [
      "campagne",
      "concept",
      "advertising",
      "reclame",
      "mediaplan",
      "creatief concept",
      "awareness",
    ],
  },
  {
    id: "s-contentstrategie",
    title: "Contentstrategie",
    slug: "contentstrategie",
    shortIntro: "Het juiste verhaal, op het juiste moment, op het juiste kanaal.",
    shortDescription: "Het juiste verhaal, op het juiste moment, op het juiste kanaal.",
    extraKeywords: "contentkalender, formats, content funnel, redactioneel",
    description: p(
      "We bepalen welke content een merk nodig heeft om zijn doelen te halen: welke thema's, welke formats en welk ritme.",
      "Zo wordt content geen losse verzameling posts, maar een samenhangend verhaal dat bijdraagt aan merk en business.",
    ),
    image: s123.url,
    searchTerms: ["content plan", "redactieplan", "storytelling", "content marketing", "thema's"],
    contactPersonId: "c-demo-content",
  },
  {
    id: "s-content-socials",
    title: "Content (voor socials)",
    slug: "content-socials",
    shortIntro: "Social content die past bij het merk en het platform.",
    shortDescription: "Social content die past bij het merk en het platform.",
    extraKeywords: "tiktok, instagram reels, social templates, community content",
    description: p(
      "Posts, reels, stories en ads voor Instagram, LinkedIn en TikTok. We maken content die past bij het platform én het merk.",
    ),
    image: s146.url,
    searchTerms: ["social media", "instagram", "linkedin", "tiktok", "reels", "posts", "socials"],
  },
  {
    id: "s-content-website",
    title: "Content (voor website)",
    slug: "content-website",
    shortIntro: "Teksten en beeld die bezoekers overtuigen.",
    shortDescription: "Teksten en beeld die bezoekers overtuigen.",
    extraKeywords: "copywriting, webtekst, seo artikelen, landingspagina tekst",
    description: p(
      "We schrijven en maken content voor websites en landingspagina's: helder, vindbaar en in de tone of voice van het merk.",
    ),
    image: s100.url,
    searchTerms: ["copywriting", "webteksten", "seo", "landingspagina", "tone of voice"],
  },
  {
    id: "s-video",
    title: "Video & film",
    slug: "video-film",
    shortIntro: "Bewegend beeld dat een verhaal vertelt.",
    shortDescription: "Bewegend beeld dat een verhaal vertelt.",
    extraKeywords: "bedrijfsfilm, commercial, recruitment video, video productie, vimeo",
    description: p(
      "Van brandfilm tot korte social video's en recruitmentfilms. We verzorgen concept, productie en montage.",
    ),
    image: s123.url,
    searchTerms: ["video", "film", "brandfilm", "videoproductie", "montage", "motion"],
  },
  {
    id: "s-animatie",
    title: "Animatie & 3D",
    slug: "animatie-3d",
    shortIntro: "Complexe ideeën helder en aantrekkelijk in beeld.",
    shortDescription: "Complexe ideeën helder en aantrekkelijk in beeld.",
    extraKeywords: "3d visualisatie, uitleganimatie, explainer video, 3d rendering",
    description: p(
      "Met motion design, explainers en 3D-visualisaties maken we producten en processen zichtbaar die je met een camera niet vastlegt.",
    ),
    image: s146.url,
    searchTerms: ["animatie", "3d", "motion design", "explainer", "visualisatie", "render"],
  },
  {
    id: "s-fotografie",
    title: "Fotografie",
    slug: "fotografie",
    shortIntro: "Eigen beeld dat het merk laat zien zoals het is.",
    shortDescription: "Eigen beeld dat het merk laat zien zoals het is.",
    extraKeywords: "bedrijfsfotografie, beeldbank, shoot, portretfotografie",
    description: p(
      "Product-, campagne- en portretfotografie. We regisseren shoots die aansluiten bij de beeldtaal van het merk.",
    ),
    image: s100.url,
    searchTerms: ["foto", "fotoshoot", "productfotografie", "beeld", "portret"],
  },
  {
    id: "s-drukwerk",
    title: "Drukwerk & offline middelen",
    slug: "drukwerk-offline",
    shortIntro: "Tastbare middelen die het merk versterken.",
    shortDescription: "Tastbare middelen die het merk versterken.",
    extraKeywords: "beursstand, signing, verpakkingen, print design, flyers",
    description: p(
      "Brochures, verpakkingen, beursmaterialen en signing. We ontwerpen en begeleiden de productie tot het eindresultaat.",
    ),
    image: s123.url,
    searchTerms: ["print", "brochure", "verpakking", "packaging", "beurs", "signing", "flyer"],
  },
];

export const ambitions: Ambition[] = [
  {
    id: "a-sterk-merk",
    title: "Een sterk merk neerzetten",
    slug: "een-sterk-merk-neerzetten",
    korteIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta. Morbi mi magna, ullamcorper eget odio ac, congue varius nibh. Proin faucibus sit amet arcu vel volutpat.",
    shortIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta. Morbi mi magna, ullamcorper eget odio ac, congue varius nibh. Proin faucibus sit amet arcu vel volutpat.",
    shortDescription:
      "De klant wil een merk dat herkenbaar is, onderscheidend en waar mensen voor kiezen.",
    extraZoekwoorden: "Propositie, merkpropositie, merkambitie, marktleider, sterke merkbasis",
    extraKeywords: "Propositie, merkpropositie, merkambitie, marktleider, sterke merkbasis",
    description: p(
      "Een sterk merk begint bij een helder verhaal: waar sta je voor en waarom doet dat ertoe? Daarna volgt de vertaling naar beeld, taal en gedrag op elk contactmoment.",
      "Vaak gaat het om een organisatie die gegroeid is, fuseert of merkt dat het huidige merk niet meer past bij wie ze nu zijn.",
    ),
    searchTerms: [
      "propositie",
      "rebranding",
      "merk bouwen",
      "branding",
      "herkenbaarheid",
      "nieuw merk",
      "merk versterken",
    ],
    serviceIds: [
      "s-merkstrategie",
      "s-huisstijl",
      "s-campagne",
      "s-contentstrategie",
      "s-content-website",
      "s-video",
      "s-animatie",
      "s-fotografie",
      "s-drukwerk",
      "s-content-socials",
    ],
    contactPersonId: "c-rogier",
  },
  {
    id: "a-lancering",
    title: "Een nieuw product of dienst lanceren",
    slug: "nieuw-product-of-dienst-lanceren",
    shortIntro: "De klant heeft iets nieuws en wil dat met impact in de markt zetten.",
    shortDescription: "De klant heeft iets nieuws en wil dat met impact in de markt zetten.",
    extraKeywords: "productintroductie, go to market, productlaunch, lancering campagne",
    description: p(
      "Een lancering vraagt om een scherpe propositie, een herkenbare uitstraling en een campagne die op het juiste moment de juiste mensen bereikt.",
    ),
    searchTerms: ["launch", "productlancering", "introductie", "go to market", "nieuw product"],
    serviceIds: ["s-merkstrategie", "s-campagne", "s-animatie", "s-video", "s-content-socials"],
  },
  {
    id: "a-bekendheid",
    title: "Mijn merkbekendheid vergroten",
    slug: "merkbekendheid-vergroten",
    shortIntro: "Meer mensen moeten het merk kennen en onthouden.",
    shortDescription: "Meer mensen moeten het merk kennen en onthouden.",
    extraKeywords: "brand awareness, bereik vergroten, zichtbaarheid campagne, naamsbekendheid",
    description: p(
      "Bekendheid bouw je met een consistente boodschap, een opvallend idee en zichtbaarheid op de kanalen waar de doelgroep zit.",
    ),
    searchTerms: ["awareness", "zichtbaarheid", "bekendheid", "bereik", "naamsbekendheid"],
    serviceIds: ["s-campagne", "s-content-socials", "s-video", "s-contentstrategie"],
    contactPersonId: "c-demo-content",
  },
  {
    id: "a-doelgroep",
    title: "Een nieuwe doelgroep bereiken",
    slug: "nieuwe-doelgroep-bereiken",
    shortIntro: "De klant wil mensen aanspreken die het merk nog niet kennen.",
    shortDescription: "De klant wil mensen aanspreken die het merk nog niet kennen.",
    extraKeywords: "doelgroepsegmentatie, persona's, nieuwe markt, jongeren bereiken",
    description: p(
      "Een nieuwe doelgroep vraagt om inzicht in hun drijfveren en een aanpak die daarop aansluit, zonder de bestaande klanten te verliezen.",
    ),
    searchTerms: ["target audience", "jongeren", "nieuwe klanten", "doelgroep", "persona"],
    serviceIds: ["s-merkstrategie", "s-contentstrategie", "s-content-socials", "s-campagne"],
  },
  {
    id: "a-markt",
    title: "Een nieuwe markt betreden",
    slug: "nieuwe-markt-betreden",
    shortIntro: "Uitbreiden naar een nieuwe sector of een nieuw land.",
    shortDescription: "Uitbreiden naar een nieuwe sector of een nieuw land.",
    extraKeywords: "internationalisatie, export, marktexpansie, nieuwe branche",
    description: p(
      "Een nieuwe markt betekent nieuwe concurrenten, nieuwe verwachtingen en vaak een andere taal. Positionering en lokale vertaling zijn cruciaal.",
    ),
    searchTerms: ["internationalisering", "export", "expansie", "buitenland", "nieuwe sector"],
    serviceIds: ["s-merkstrategie", "s-campagne", "s-content-website"],
  },
  {
    id: "a-merkverhaal",
    title: "Mijn merkverhaal beter vertellen",
    slug: "merkverhaal-beter-vertellen",
    shortIntro: "Het verhaal is er, maar het komt nog niet goed over.",
    shortDescription: "Het verhaal is er, maar het komt nog niet goed over.",
    extraKeywords: "storytelling, brand narrative, merkmanifest, corporate story",
    description: p(
      "We helpen het verhaal scherp te krijgen en vertalen het naar content die mensen raakt: in woord, beeld en film.",
    ),
    searchTerms: ["storytelling", "marketingverhaal", "boodschap", "verhaal", "messaging"],
    serviceIds: ["s-contentstrategie", "s-video", "s-content-website", "s-fotografie"],
    contactPersonId: "c-demo-content",
  },
  {
    id: "a-journey",
    title: "De customer journey verbeteren",
    slug: "customer-journey-verbeteren",
    shortIntro: "De klantreis moet soepeler, persoonlijker en effectiever.",
    shortDescription: "De klantreis moet soepeler, persoonlijker en effectiever.",
    extraKeywords: "klantreis optimalisatie, cx, ux research, touchpoint mapping",
    description: p(
      "We kijken naar de hele reis van eerste kennismaking tot herhaalaankoop en verbeteren de momenten die het verschil maken.",
    ),
    searchTerms: ["klantreis", "klantervaring", "cx", "ux", "touchpoints", "klanttevredenheid"],
    serviceIds: ["s-touchpoint", "s-content-website"],
    contactPersonId: "c-demo-strategie",
  },
  {
    id: "a-leads",
    title: "Meer en/of betere leads genereren",
    slug: "meer-betere-leads-genereren",
    shortIntro: "Meer aanvragen, en vooral de juiste.",
    shortDescription: "Meer aanvragen, en vooral de juiste.",
    extraKeywords: "leadgeneratie b2b, inbound marketing, conversiestrategie, sales funnel",
    description: p(
      "Leads komen uit een samenspel van zichtbaarheid, overtuigende content en een website die converteert.",
    ),
    searchTerms: ["leadgeneratie", "aanvragen", "conversie", "sales", "b2b marketing", "funnel"],
    serviceIds: ["s-touchpoint", "s-campagne", "s-content-website", "s-contentstrategie"],
  },
  {
    id: "a-werven",
    title: "Nieuwe medewerkers werven",
    slug: "nieuwe-medewerkers-werven",
    shortIntro: "Talent aantrekken met een sterk werkgeversmerk.",
    shortDescription: "Talent aantrekken met een sterk werkgeversmerk.",
    extraKeywords:
      "employer branding, vacaturecampagne, wervingscampagne, employee value proposition",
    description: p(
      "Employer branding draait om een eerlijk verhaal over werken bij de organisatie, verteld waar kandidaten zijn.",
    ),
    searchTerms: [
      "recruitment",
      "employer branding",
      "werving",
      "vacatures",
      "arbeidsmarktcommunicatie",
      "personeel",
    ],
    serviceIds: ["s-campagne", "s-video", "s-content-socials"],
  },
  {
    id: "a-intern",
    title: "Mijn merk intern laten doorleven",
    slug: "merk-intern-laten-doorleven",
    shortIntro: "Medewerkers moeten het merk begrijpen, voelen en uitdragen.",
    shortDescription: "Medewerkers moeten het merk begrijpen, voelen en uitdragen.",
    extraKeywords:
      "interne merkactivatie, cultuurprogramma, merkwaarden intern, medewerkersbetrokkenheid",
    description: p(
      "Een merk leeft pas echt als medewerkers het dragen. We vertalen het merk naar middelen en momenten die intern landen.",
    ),
    searchTerms: [
      "interne communicatie",
      "internal branding",
      "cultuur",
      "medewerkers",
      "merkambassadeurs",
    ],
    serviceIds: ["s-merkstrategie", "s-video", "s-drukwerk"],
  },
  {
    id: "a-aanbod",
    title: "Mijn aanbod beter onder de aandacht brengen",
    slug: "aanbod-beter-onder-de-aandacht",
    shortIntro: "Het product of de dienst verdient meer aandacht.",
    shortDescription: "Het product of de dienst verdient meer aandacht.",
    extraKeywords: "productactivatie, dienstenportfolio, promotiecampagne, sales enablement",
    description: p(
      "Met heldere content, sterk beeld en gerichte activatie zorgen we dat het aanbod gezien en begrepen wordt.",
    ),
    searchTerms: [
      "promotie",
      "activatie",
      "producten",
      "verkoop",
      "aandacht",
      "zichtbaarheid aanbod",
    ],
    serviceIds: ["s-fotografie", "s-animatie", "s-content-socials", "s-drukwerk"],
  },
  {
    id: "a-uitstraling",
    title: "Mijn merkuitstraling vernieuwen",
    slug: "merkuitstraling-vernieuwen",
    korteIntro: "Een eigentijdse, vernieuwde look die past bij de huidige fase van het merk.",
    shortIntro: "Een eigentijdse, vernieuwde look die past bij de huidige fase van het merk.",
    shortDescription: "Een eigentijdse, vernieuwde look die past bij de huidige fase van het merk.",
    extraZoekwoorden:
      "merkuitstraling, restyle, opfrissen, redesign, nieuw logo, make-over, visuele vernieuwing",
    extraKeywords:
      "merkuitstraling, restyle, opfrissen, redesign, nieuw logo, make-over, visuele vernieuwing",
    description: p(
      "Wanneer een organisatie groeit, verandert of een nieuwe koers kiest, sluit de visuele uitstraling daar soms niet meer bij aan. We vernieuwen de uitstraling met respect voor wat al herkenbaar en sterk is.",
      "Van een subtiele evolutie tot een complete vernieuwing van vormentaal, kleuren, typografie en beeldmateriaal op alle kanalen.",
    ),
    searchTerms: [
      "merkuitstraling",
      "restyle",
      "opfrissen",
      "redesign",
      "nieuw logo",
      "make-over",
      "visuele vernieuwing",
      "huisstijl vernieuwen",
    ],
    serviceIds: [
      "s-huisstijl",
      "s-fotografie",
      "s-drukwerk",
      "s-content-website",
      "s-content-socials",
      "s-video",
    ],
    contactPersonId: "c-rogier",
  },
];

export const cases: Case[] = [
  {
    id: "k-wolky",
    clientName: "Wolky",
    werktitel: "Wolky",
    title: "Complete rebranding & herpositionering",
    subtitle: "Complete rebranding & herpositionering",
    slug: "wolky",
    image: wolky.url,
    korteIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta.",
    shortIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta.",
    shortDescription:
      "Een nieuwe positionering en visuele identiteit voor het Nederlandse schoenenmerk, met een eigen campagnebeeld.",
    serviceIds: ["s-merkstrategie", "s-campagne", "s-huisstijl", "s-fotografie"],
    videoUrl:
      "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
    videolink:
      "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
    media: [
      {
        type: "video",
        url: "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
        poster: wolky.url,
        title: "Wolky — Rebranding campagnefilm",
        provider: "bunny",
      },
      {
        type: "image",
        url: wolky.url,
        title: "Wolky campagnemodel & nieuwe collectie",
      },
      {
        type: "image",
        url: identiteit,
        title: "Wolky merkidentiteit, typografie en vormentaal",
      },
      {
        type: "image",
        url: koffie,
        title: "Campagnefotografie detail en vakmanschap",
      },
    ],
  },
  {
    id: "k-inqar",
    clientName: "INQAR",
    werktitel: "INQAR Kat in het Bakkie",
    title: "Kat in het Bakkie",
    subtitle: "Campagne & socials",
    slug: "inqar-kat-in-het-bakkie",
    image: digitaal,
    korteIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta.",
    shortIntro:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean fringilla condimentum quam. Aliquam erat volutpat. Nullam et luctus lacus. Maecenas semper ex sed velit sagittis porta.",
    shortDescription:
      "Landelijke merkcampagne en activatie voor INQAR autoverhuur rondom het herkenbare concept 'Kat in het bakkie'.",
    serviceIds: ["s-campagne", "s-content-socials", "s-drukwerk", "s-video"],
    videoUrl:
      "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
    videolink:
      "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
    media: [
      {
        type: "video",
        url: "https://nobears-std.b-cdn.net/videos/Case-video's/InQar%20kat%20in%20't%20bakkie.mp4",
        poster: digitaal,
        title: "INQAR — Kat in het bakkie campagnefilm",
        provider: "bunny",
      },
      {
        type: "image",
        url: digitaal,
        title: "INQAR online activatie & social content",
      },
      {
        type: "image",
        url: identiteit,
        title: "INQAR outdoor abri's en wagenpark branding",
      },
    ],
  },
  {
    id: "k-bonn",
    clientName: "Bonn Coffee (demo)",
    title: "Lanceringscampagne in de stad",
    slug: "bonn-coffee",
    image: koffie,
    shortDescription:
      "Van merkverhaal naar outdoor, video en social voor de introductie van een specialty koffiemerk.",
    serviceIds: ["s-merkstrategie", "s-campagne", "s-video", "s-content-socials"],
    media: [
      {
        type: "image",
        url: koffie,
        title: "Verpakkingsdesign en specialty branding",
      },
      {
        type: "image",
        url: identiteit,
        title: "Stedelijke outdoor campagne & posters",
      },
    ],
  },
  {
    id: "k-naturvita",
    clientName: "Naturvita (demo)",
    title: "Een identiteit die groeit",
    slug: "naturvita",
    image: identiteit,
    shortDescription: "Nieuwe merkidentiteit en drukwerk voor een duurzaam voedingsmerk.",
    serviceIds: ["s-merkstrategie", "s-huisstijl", "s-drukwerk"],
    media: [
      {
        type: "image",
        url: identiteit,
        title: "Naturvita huisstijl & verpakkingsontwerp",
      },
      {
        type: "image",
        url: koffie,
        title: "Naturvita offline middelen en beursmateriaal",
      },
      {
        type: "image",
        url: s100.url,
        title: "Merkwaarden & kleurenpalet",
      },
    ],
  },
  {
    id: "k-voltera",
    clientName: "Voltera (demo)",
    title: "Een klantreis zonder drempels",
    slug: "voltera",
    image: digitaal,
    shortDescription:
      "Nieuwe website, uitlegvideo's in 3D en een geoptimaliseerde aanvraagflow voor een energieleverancier.",
    serviceIds: ["s-touchpoint", "s-content-website", "s-animatie"],
    media: [
      {
        type: "image",
        url: digitaal,
        title: "Nieuwe website en interactieve flow",
      },
      {
        type: "image",
        url: s146.url,
        title: "Touchpoint mapping en conversieoptimalisatie",
      },
    ],
  },
  {
    id: "k-werkgeluk",
    clientName: "Zorggroep Werkgeluk (demo)",
    title: "Werken waar het ertoe doet",
    slug: "werkgeluk",
    image: s146.url,
    shortDescription: "Een recruitmentcampagne met echte medewerkers in film en social content.",
    serviceIds: ["s-campagne", "s-contentstrategie", "s-content-socials", "s-video"],
    media: [
      {
        type: "image",
        url: s146.url,
        title: "Social recruitment ads & carrousels",
      },
      {
        type: "image",
        url: koffie,
        title: "Portretfotografie zorgmedewerkers",
      },
    ],
  },
];
