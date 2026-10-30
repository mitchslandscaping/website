import { stegaClean } from 'next-sanity';

export type Position = {
  id: string;
  title: string;
  division: string;
  active: boolean;
};

// One reusable Fillout form; positions never need to be duplicated in its editor.
export const applicationFormUrl = "https://embed.fillout.com/t/uc2iFLoU2Zus";
export const positions: Position[] = [
  { id: "lawn-maintenance-crew-lead", title: "Lawn Maintenance Crew Lead", division: "Lawn Maintenance", active: true },
  { id: "lawn-maintenance-technician", title: "Lawn Maintenance Technician", division: "Lawn Maintenance", active: true },
];

export function applicationUrl(position: Position) {
  const url = new URL(applicationFormUrl);
  url.searchParams.set("position", stegaClean(position.title));
  return url.toString();
}
