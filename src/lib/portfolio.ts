// Placeholder entries until confirmed project stories and photography are ready.
type PortfolioProject = {
  slug: string; title: string; category: string; serviceSlug: string; description: string;
  example?: boolean;
  spotlight?: boolean;
  photos?: { src: string; alt: string; caption?: string }[];
  propertyType?: string;
  city?: string;
  completed?: string;
  services?: string[];
  subtitle?: string;
  storyHeading?: string;
  facts?: { label: string; value: string }[];
  overview?: string;
  included?: string[];
  scope?: string;
  story?: { title: string; text: string }[];
};
export const portfolioProjects: PortfolioProject[] = [
  {
    slug: "ranch-training-facility", spotlight: true, title: "The Ranch Training Facility",
    category: "Fencing & Access Control", serviceSlug: "fencing-access-control",
    description: "Mitch’s installed a 35-foot-tall backstop at The Ranch Training Facility, featuring 6-inch Schedule 40 posts, #36 nylon netting, and a wire rope support system. The installation provides ball containment behind home plate while maintaining clear sightlines across the training field.",
    propertyType: "Sports training facility",
    city: "Gray, LA",
    completed: "September 2026",
    services: ["Backstop installation"],
    photos: [
      { src: "/images/optimized/sports-field-fencing.webp", alt: "Front view of the completed 35-foot backstop at The Ranch Training Facility" },
      { src: "/images/ranch-training-facility/img_3435.jpg", alt: "Completed backstop at The Ranch Training Facility viewed from the pitching area" },
      { src: "/images/ranch-training-facility/img_3430.jpg", alt: "Side view of the backstop posts, netting, and support cables" },
      { src: "/images/ranch-training-facility/img_3431.jpg", alt: "Close-up of backstop netting behind home plate" },
      { src: "/images/ranch-training-facility/img_3434.jpg", alt: "Wide view of the backstop surrounding the home plate area" },
      { src: "/images/ranch-training-facility/img_3436.jpg", alt: "Two people beside the completed backstop at The Ranch Training Facility" },
    ],
  },
  {
    slug: "laris-residence", spotlight: true, title: "Laris Residence",
    category: "Design / Build", serviceSlug: "design-build",
    description: "A cohesive landscape installation featuring trees, shrubs, and ornamental grasses arranged to complement the home’s architecture. Defined bed edges and fresh mulch create a polished finish throughout the front landscape and courtyard.",
    propertyType: "Residential",
    city: "Thibodaux, LA",
    completed: "October 2023",
    services: ["Landscape Architecture", "Design-Build"],
    photos: [
      { src: "/images/laris-residence/photo-14.jpg", alt: "Completed front landscaping at Laris Residence" },
      { src: "/images/laris-residence/photo-13.jpg", alt: "Finished landscape beds around the curved entrance path" },
      { src: "/images/laris-residence/photo-10.jpg", alt: "Completed courtyard planting beds around the central feature" },
      { src: "/images/laris-residence/photo-19.jpg", alt: "Completed landscaping at the driveway entrance" },
      { src: "/images/laris-residence/photo-16.jpg", alt: "Finished planting along the boundary wall" },
      { src: "/images/laris-residence/photo-17.jpg", alt: "Wide view of the completed corner landscaping" },
      { src: "/images/laris-residence/photo-18.jpg", alt: "New trees and planting beds beside the white boundary wall" },
      { src: "/images/laris-residence/photo-15.jpg", alt: "Curved planting beds with shrubs and ornamental grasses" },
      { src: "/images/laris-residence/photo-11.jpg", alt: "Mulched planting bed alongside the front walkway" },
      { src: "/images/laris-residence/photo-12.jpg", alt: "New shrubs lining the entrance walkway" },
      { src: "/images/laris-residence/photo-08.jpg", alt: "Newly planted beds beside the residence" },
      { src: "/images/laris-residence/photo-01.jpg", alt: "Planting layout along the residence’s white boundary wall" },
      { src: "/images/laris-residence/photo-02.jpg", alt: "Shrubs staged along the corner planting bed" },
      { src: "/images/laris-residence/photo-03.jpg", alt: "Planting preparations beside the entrance walkway" },
      { src: "/images/laris-residence/photo-04.jpg", alt: "Planting layout along the front of Laris Residence" },
      { src: "/images/laris-residence/photo-05.jpg", alt: "Trees and ornamental grasses staged for planting" },
      { src: "/images/laris-residence/photo-06.jpg", alt: "Front landscape beds before planting" },
      { src: "/images/laris-residence/photo-07.jpg", alt: "Tree and shrub installation in progress" },
      { src: "/images/laris-residence/photo-09.jpg", alt: "Courtyard planting work in progress" },
    ],
  },
  { slug: "project-02", spotlight: true, title: "Project coming soon", category: "Construction", serviceSlug: "construction", description: "Project photos and details are coming soon." },
  { slug: "project-04", title: "Project coming soon", category: "Maintenance Services", serviceSlug: "maintenance", description: "Project photos and details are coming soon." },
  { slug: "project-05", title: "Project coming soon", category: "Design / Build", serviceSlug: "design-build", description: "Project photos and details are coming soon." },
];

export const previousProjectSlugs: Record<string, string> = {
  "project-06": "laris-residence",
  "drainage-installation": "project-02",
  "driveway-gate": "ranch-training-facility",
  "project-03": "ranch-training-facility",
};
