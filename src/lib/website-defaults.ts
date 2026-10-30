import { site, serviceGroups } from './content';
import { portfolioProjects } from './portfolio';
import { positions } from './careers';

export const defaultOffice = {
  street: '13957 E Main St', cityLine: 'Larose, LA 70373', weekdays: 'Monday–Friday', weekdayHours: '9 AM–4 PM', weekend: 'Saturday–Sunday', weekendHours: 'Closed',
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=13957+E+Main+St+Larose+LA+70373',
  banner: { src: '/images/optimized/contact-banner.webp', alt: 'Poolside lawn, mature trees, and ornamental fencing' },
};
export const defaultHome = {
  aboutHeading: 'Local roots.\nBuilt around\nyour property.', aboutIntro: 'A familiar name. A team you can count on.',
  aboutDetail: 'Landscaping, fencing, or construction—it starts with a conversation about your property and what you need from it.',
  teamHeading: 'The people behind your project.', teamIntro: 'Meet the team coordinating your plans, schedules, and next steps.',
  servicesHeading: 'The right services. All in one place.', servicesIntro: 'From everyday upkeep to your next big project, one team for the work your property needs.',
  portfolioHeading: 'Portfolio', portfolioIntro: 'A closer look at our work. Project stories and photos are coming soon.',
  careersHeading: 'Build a career with Mitch’s.', careersIntro: 'Join our team and help maintain the outdoor spaces our community calls home.',
  closingHeading: 'Let’s make more of your outdoor space.', closingIntro: 'Start with a few details about your property. We’ll help you take the next step, with a free estimate for the work you have in mind.',
  responseNote: 'We aim to respond the same day or next business day.',
};
export const defaultContent = { site, serviceGroups, projects: portfolioProjects, positions, office: defaultOffice, home: defaultHome };
export type WebsiteContent = typeof defaultContent;
