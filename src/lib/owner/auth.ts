import 'server-only';
import {cookies} from 'next/headers';
import {ownerStore,SESSION_SECONDS} from './passkey-store';
export class OwnerError extends Error {constructor(message:string,public status=400){super(message);}}
export async function credentials(){return await ownerStore()?.credential()||null;}
const cookieName=()=>process.env.NODE_ENV==='production'?'__Host-mitch_owner':'mitch_owner';
export async function isOwner(){const token=(await cookies()).get(cookieName())?.value;return !!token&&!!await ownerStore()?.validSession(token);}
export async function requireOwner(){if(!await isOwner())throw new OwnerError('Please sign in to continue.',401);}
export async function createOwnerSession(){const store=ownerStore();if(!store)throw new OwnerError('Owner access is not configured.',503);await signOut();const token=await store.newSession();(await cookies()).set(cookieName(),token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:SESSION_SECONDS});}
export async function signOut(){const jar=await cookies();const token=jar.get(cookieName())?.value;if(token)await ownerStore()?.revoke(token);jar.delete(cookieName());jar.delete('mitch_owner');}
export function siteIdentity(){
 const raw=process.env.OWNER_SITE_ORIGIN||(process.env.NODE_ENV!=='production'?'http://localhost:3000':'');
 let url:URL;try{url=new URL(raw);}catch{throw new OwnerError('The private sign-in address needs to be configured.',503);}
 if(url.origin!==raw||(process.env.NODE_ENV==='production'?url.protocol!=='https:':!['localhost','127.0.0.1'].includes(url.hostname)))throw new OwnerError('The private sign-in address needs to be configured.',503);
 return {origin:url.origin,rpID:url.hostname};
}
export function sameOrigin(request:Request){
 const origin=request.headers.get('origin');const host=request.headers.get('host');
 let matches=false;try{const url=new URL(origin||'');matches=!!host&&['http:','https:'].includes(url.protocol)&&url.host===host&&(!process.env.OWNER_SITE_ORIGIN||url.origin===process.env.OWNER_SITE_ORIGIN);}catch{}
 if(!matches||request.headers.get('sec-fetch-site')==='cross-site')throw new OwnerError('This request must come from this website.',403);
}
export async function checkAttempts(){if(await ownerStore()?.limited())throw new OwnerError('Too many attempts. Please try again in 15 minutes.',429);}
export async function failedAttempt(){await ownerStore()?.attempt();}
export async function clearAttempts(){await ownerStore()?.clearAttempts();}
export function ownerError(error:unknown){const status=error instanceof OwnerError?error.status:500;if(status===500)console.error('Owner editor request failed.');return Response.json({error:status===500?'The request could not be completed. Please try again.':(error as Error).message},{status,headers:{'Cache-Control':'no-store'}});}
