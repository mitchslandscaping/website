import type {Metadata} from 'next';
import {ownerStore} from '@/lib/owner/passkey-store';
import {credentials,isOwner} from '@/lib/owner/auth';
import OwnerEditor from './owner-editor';
import './owner.css';
export const metadata:Metadata={title:'Owner area | Mitch’s Landscaping',robots:{index:false,follow:false}};
export default async function OwnerPage(){
 const configured=!!await credentials();const authenticated=await isOwner();
 const setupAllowed=!!ownerStore();
 return <OwnerEditor configured={configured} authenticated={authenticated} setupAllowed={setupAllowed}/>;
}
