export type OwnerPhoto = {_key:string; alt:string; src?:string; srcUpload?:{_type:'image';asset:{_type:'reference';_ref:string}}};
export type OwnerMember = {_key:string;name:string;role:string;active:boolean;photo?:string;photoUpload?:OwnerPhoto['srcUpload']};
export type OwnerRecord = {
  id:string; revision:string|null; publishedRevision:string|null; draft:boolean; published:boolean;
  title:string; division?:string; active:boolean; order:number; slug?:string; spotlight?:boolean;
  serviceSlug?:string; category?:string; description?:string; city?:string; completed?:string;
  propertyType?:string; services?:string[]; photos?:OwnerPhoto[];
};
export type OwnerData = {
  team:{revision:string;publishedRevision:string|null;draft:boolean;members:OwnerMember[]};
  projects:OwnerRecord[]; careers:OwnerRecord[]; canWrite:boolean;
};
