import Image from 'next/image';
import {Camera} from 'lucide-react';
import {editAttribute} from '@/sanity/edit-attribute';
import type {WebsiteContent} from '@/lib/website-defaults';

export default function TeamMemberCard({member,index,featured=false}:{member:WebsiteContent['site']['team'][number];index:number;featured?:boolean}){
 return <article className={`team-member${featured?' team-owner':''}`}>
  <div className="team-portrait" data-sanity={editAttribute('website',`site.team[${index}].photoUpload`)}>
   {member.photo?<Image src={member.photo} alt={member.name||member.role} fill sizes="(max-width: 760px) 50vw, 33vw"/>:member.name?<span className="team-initials" aria-hidden="true">{member.name.split(' ').map(part=>part[0]).slice(0,2).join('')}</span>:<Camera size={25} strokeWidth={1.3} aria-hidden="true"/>}
  </div>
  <div className="team-caption">
   <h3 data-sanity={editAttribute('website',`site.team[${index}].name`)}>{member.name||'Name coming soon'}</h3>
   <p data-sanity={editAttribute('website',`site.team[${index}].role`)}>{member.role}</p>
  </div>
 </article>;
}
