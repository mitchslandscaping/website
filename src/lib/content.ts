import type { TrustedByContent } from "@/components/trusted-by";

// Phase 1 content adapter. These fields map to the approved Sanity models.
// Leave unknown business details empty; never invent phone numbers or reviews.
export const site = {
  name: "Mitch’s Landscaping",
  logo: "/images/mitchs-logo.svg",
  phone: "(985) 693-6354",
  email: "contact@mitchlandscaping.com",
  googleBusinessUrl: "https://share.google/A2zeRekIZVP2YXKMN",
  announcement: {
    enabled: true,
    message: "Privacy. Security. Curb appeal.",
    action: "Fencing by Mitch’s.",
    service: "Fencing",
  },
  hero: {
    video: "/videos/rollout-hero-v7.mp4",
    image: "/images/rollout-v7-poster.jpg",
    label: "RESIDENTIAL & COMMERCIAL",
    headline: ["Landscape.", "Fencing.", "Construction."],
    description: "From keeping your grounds looking their best to building what comes next. Landscaping, fencing, and outdoor construction for homes and businesses.",
    note: "Free estimates. Let’s talk about your property.",
  },
  trustedBy: {
    enabled: true,
    heading: "Trusted by businesses in our community",
    logos: [
      { id: "cts", name: "CTS", image: "/images/client-cts.png", crop: { x: 79, y: 143, width: 2431, height: 2229, sourceWidth: 2550, sourceHeight: 2477 } },
      { id: "nov", name: "NOV", image: "/images/client-nov.png", lightBackground: true, crop: { x: 17, y: 21, width: 566, height: 213, sourceWidth: 600, sourceHeight: 250 } },
      {"id": "gobears", "name": "GoBears", "image": "/images/client-gobears.png", "lightBackground": false, "crop": {"x": 0, "y": 0, "width": 900, "height": 256, "sourceWidth": 900, "sourceHeight": 256}},
      {"id": "let", "name": "Louisiana Environmental Transportation", "image": "/images/client-let.png", "lightBackground": false, "crop": {"x": 90, "y": 20, "width": 314, "height": 160, "sourceWidth": 495, "sourceHeight": 294}, "lightMark": true},
      {"id": "chase", "name": "Chase", "image": "/images/client-chase.png", "lightBackground": true, "crop": {"x": 21, "y": 80, "width": 377, "height": 71, "sourceWidth": 420, "sourceHeight": 235}},
      {"id": "republic", "name": "Republic Services", "image": "/images/client-republic.png", "lightBackground": false, "crop": {"x": 15, "y": 20, "width": 1255, "height": 427, "sourceWidth": 1280, "sourceHeight": 463}},
      {"id": "advance", "name": "Advance Auto Parts", "image": "/images/client-advance-hd.png", "lightBackground": false, "crop": {"x": 275, "y": 374, "width": 1550, "height": 302, "sourceWidth": 2100, "sourceHeight": 1050}, "lightMark": true},
      {"id": "physiofit", "name": "Physiofit", "image": "/images/client-physiofit-official.png", "lightBackground": false, "crop": {"x": 0, "y": 0, "width": 2000, "height": 407, "sourceWidth": 2000, "sourceHeight": 407}, "lightMark": true},
      {"id": "cvs", "name": "CVS", "image": "/images/client-cvs.png", "lightBackground": true, "crop": {"x": 18, "y": 155, "width": 376, "height": 98, "sourceWidth": 400, "sourceHeight": 400}},
      {"id": "autozone", "name": "AutoZone", "image": "/images/client-autozone.png", "lightBackground": true, "crop": {"x": 116, "y": 637, "width": 2591, "height": 326, "sourceWidth": 2823, "sourceHeight": 1600}},
      {"id": "miswaco", "name": "M-I SWACO", "image": "/images/client-miswaco.png", "lightBackground": true, "crop": {"x": 8, "y": 9, "width": 1243, "height": 180, "sourceWidth": 1257, "sourceHeight": 230}, "clipPath": "polygon(0 0, 100% 0, 100% 100%, 46% 100%, 46% 88%, 0 88%)"},
      {"id": "halliburton", "name": "Halliburton", "image": "/images/client-halliburton-hd.png", "lightMark": true, "crop": {"x": 131, "y": 533, "width": 1661, "height": 118, "sourceWidth": 1920, "sourceHeight": 1200}},
      {"id": "scurlock", "name": "Scurlock Electric", "image": "/images/client-scurlock.png", "lightBackground": true, "crop": {"x": 55, "y": 11, "width": 419, "height": 65, "sourceWidth": 529, "sourceHeight": 378}},
      {"id": "lafourche", "name": "Lafourche Parish Public Schools", "image": "/images/client-lafourche.png", "crop": {"x": 0, "y": 0, "width": 1200, "height": 721, "sourceWidth": 1200, "sourceHeight": 722}},
      {"id": "blfwd", "name": "Bayou Lafourche Fresh Water District", "image": "/images/client-blfwd.png", "lightBackground": true, "lightMark": false, "crop": {"x": 38, "y": 142, "width": 371, "height": 163, "sourceWidth": 447, "sourceHeight": 447}},
      {"id": "sealevel", "name": "Sealevel Construction", "image": "/images/client-sealevel.png", "lightBackground": false, "lightMark": true, "crop": {"x": 23, "y": 30, "width": 751, "height": 145, "sourceWidth": 800, "sourceHeight": 205}},
      {"id": "chouest", "name": "Chouest Group", "image": "/images/client-chouest.png", "lightBackground": true, "lightMark": false, "crop": {"x": 100, "y": 260, "width": 985, "height": 128, "sourceWidth": 1200, "sourceHeight": 630}},
      {"id": "intermoor", "name": "InterMoor", "image": "/images/client-intermoor.png", "lightBackground": true, "crop": {"x": 0, "y": 0, "width": 640, "height": 418, "sourceWidth": 640, "sourceHeight": 418}},
      {"id": "joes-septic", "name": "Joe\u2019s Septic Contractors", "image": "/images/client-joes-septic.png", "lightBackground": true, "crop": {"x": 212, "y": 154, "width": 773, "height": 318, "sourceWidth": 1200, "sourceHeight": 630}},
      {"id": "loop", "name": "LOOP LLC", "image": "/images/client-loop-official.png", "crop": {"x": 0, "y": 0, "width": 127, "height": 68, "sourceWidth": 127, "sourceHeight": 68}},
      {"id": "freetown", "name": "Freetown Builders", "image": "/images/client-freetown.png", "lightBackground": true, "crop": {"x": 3, "y": 0, "width": 794, "height": 213, "sourceWidth": 800, "sourceHeight": 213}},
    ],
  } satisfies TrustedByContent,
  // Short excerpts verified against the Google listing on October 28, 2026.
  reviews: [
    { author: "Marvin Autin", quote: "Mitch is honest and professional." },
    { author: "John Stevison", quote: "Mr. Mitch is a good man and a great landscaper" },
    { author: "Robert Lilley", quote: "Knowledgeable, friendly and efficient." },
  ],
  aboutPhoto: {
    src: "", // Add a company photo when available.
    isStock: false,
    alt: "",
    position: "50% 60%",
  },
  team: [
    { name: "Mitch Pitre", role: "Owner", photo: "" },
    { name: "Marcelle Pate", role: "Landscape Designer", photo: "" },
    { name: "Kieran Pate", role: "Operations Manager", photo: "" },
    { name: "Makenzie Hebert", role: "Office Administrator", photo: "" },
    { name: "Je’an Pitre", role: "Access Control Manager", photo: "" },
    { name: "Connor Mabile", role: "Court Surfacing Manager", photo: "" },
  ] as { name: string; role: string; photo: string; active?: boolean; _key?: string }[],
  story: "",
  serviceAreas: [] as string[],
  projects: [] as { src: string; title: string; caption: string }[],
};

export const serviceGroups = [
  {
    id: "landscaping",
    slug: "maintenance",
    number: "01",
    label: "CARE. TRIM. MAINTAIN.",
    title: "Maintenance Services",
    cardDescription: "Keep your property neat and welcoming with lawn care, landscape upkeep, arbor care, and herbicide treatments. We’ll tailor a maintenance plan to your property’s needs.",
    image: "",
    alt: "",
    description:
      "Keep your property looking cared for throughout the seasons. Our maintenance services bring lawn care, landscape upkeep, arbor care, and herbicide treatments together, helping you manage everyday growth and keep your outdoor spaces neat and welcoming. We’ll discuss your property’s needs and put together a scope of care that fits.",
    services: [
      {
        name: "Lawn maintenance",
        description:
          "Routine lawn care to keep your property neat, welcoming, and ready to enjoy.",
      },
      {
        name: "Landscape maintenance",
        description:
          "Seasonal upkeep and care for the planted spaces that frame your property.",
      },
      {
        name: "Arbor Care",
        description:
          "Care for the trees on your property, with a scope of work tailored to your landscape and priorities.",
      },
      {
        name: "Herbicide treatments",
        description:
          "Tell us about unwanted growth so we can discuss an appropriate treatment plan.",
      },
    ],
  },
  {
    id: "landscape-design",
    slug: "design-build",
    number: "02",
    label: "PLAN. PLANT. TRANSFORM.",
    title: "Design / Build",
    cardDescription: "Bring your outdoor ideas to life with thoughtful design and planting. From refreshing garden beds to planning a new landscape, we connect your vision with the installation.",
    image: "/images/optimized/design-build-project.webp",
    alt: "Lawn installation beside a pool terrace, stone retaining wall, and black metal fence",
    description: "Bring your ideas for your property into focus with landscape design and build services. From refreshing planted areas to planning a new outdoor space, we consider the layout, planting, and way you use your property. Our team helps connect the design with the installation, creating a clear direction from the first conversation through the finished landscape.",
    services: [
      {
        name: "Landscape design / build",
        description:
          "A considered plan and installation for outdoor spaces that fit how you live and work.",
      },
      {
        name: "Landscape Design and Architecture",
        description:
          "Discuss the layout, planting, and function of your outdoor space with our team.",
      },
    ],
  },
  {
    id: "construction",
    slug: "construction",
    number: "03",
    label: "BUILD. IMPROVE. MAKE IT WORK.",
    title: "Construction",
    cardDescription: "Make more of your outdoor space with patios, retaining walls, brickwork, drainage solutions, and sports court surfacing. We’ll plan improvements around your site conditions and how you use your property.",
    image: "/images/optimized/construction-project.webp",
    alt: "Crew installing a drainage pipe in an excavated trench beside a driveway",
    description:
      "Make your outdoor space more useful with construction shaped around your property. Whether you’re planning a patio, defining an area with retaining walls and brickwork, addressing drainage, or surfacing a tennis or pickleball court, we’ll work through the site conditions and priorities with you. Our team brings these improvements together in a scope that supports how you want to use the space.",
    services: [
      {
        name: "Hardscaping",
        description:
          "Patios, walkways, brickwork, and retaining walls that bring structure and function to your outdoor space.",
      },
      {
        name: "Drainage solutions",
        description:
          "Discuss water movement and drainage concerns so we can assess your property’s needs.",
      },
      {
        name: "Sports Court Surfacing & Resurfacing",
        description:
          "Surfacing and resurfacing for tennis and pickleball courts, with a tailored approach for new playing surfaces and the renewal of existing courts.",
      },
    ],
  },
  {
    id: "fencing-access",
    slug: "fencing-access-control",
    number: "04",
    label: "PRIVACY. SECURITY. ACCESS.",
    title: "Fencing & Access Control",
    cardDescription: "Bring privacy, security, and convenient access to your property. Explore fencing, entry features, and sports field backstops tailored to your site.",
    image: "/images/optimized/fencing-project.webp",
    alt: "Driveway entrance gate with stone columns and privacy fencing",
    description: "Define your boundaries and take control of how people enter your property. Our fencing and access control services help address privacy, security, and everyday access for homes and commercial sites, along with fencing and backstops for sports fields. We’ll talk through your goals, the layout of your property, and the entry features you need to find an approach that fits.",
    services: [
      {
        name: "Fencing",
        description:
          "Define your space and discuss the right privacy, boundary, and enclosure options.",
      },
      {
        name: "Access control",
        description:
          "Discuss access to your property and the entry features that suit your needs.",
      },
      {
        name: "Sports Field Fencing & Backstops",
        description:
          "Fencing and backstops for sports fields, planned around your field’s layout and the way it’s used.",
      },
    ],
  },
];

// Design samples only. This is never represented as completed company work.
export const inspiration = [
  {
    src: "/images/hero.jpg",
    title: "Lawn & planting",
    caption: "Room for everyday living",
    alt: "A green lawn and sheltered residential patio",
  },
  {
    src: "/images/patio.jpg",
    title: "Patios & pathways",
    caption: "Stone, shade, and a place to gather",
    alt: "Natural stone patio surrounded by leafy trees",
  },
  {
    src: "/images/planting.jpg",
    title: "Walls & planting",
    caption: "Structure that works with the landscape",
    alt: "Rounded shrubs and grass above a stone garden wall",
  },
];

// Company-specific content only; no unverified reviews, credentials, or statistics.
export const companyReasons = [
  {
    title: "One team, more of your to-do list.",
    description:
      "Landscaping, lawn care, and outdoor construction together. Talk through a single task or several improvements with Mitch’s.",
  },
  {
    title: "For your home and your business.",
    description:
      "From a backyard project to commercial grounds, start with the services that fit your property.",
  },
  {
    title: "Practical solutions outside.",
    description:
      "Patios, retaining walls, drainage, fencing, and access control — improvements shaped around how you use your space.",
  },
  {
    title: "A clear place to start.",
    description:
      "Request a free estimate. We aim to respond the same day or next business day to discuss the details.",
  },
];
export const estimateSteps = [
  {
    title: "Request a Quote",
    description: "Tell us about your property, your priorities, and the work you have in mind.",
  },
  {
    title: "Site Walk",
    description: "We discuss your goals and arrange an on-site visit when the work calls for it.",
  },
  {
    title: "Custom Proposal",
    description: "Review a free estimate with the scope of work and pricing for your property.",
  },
  {
    title: "Get Scheduled",
    description: "Once approved, we coordinate access, timing, and the plan for getting started.",
  },
  {
    title: "Work & Ongoing Care",
    description: "We carry out the agreed work and coordinate continued care if it’s part of your plan.",
  },
];
