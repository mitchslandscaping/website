import {z} from 'zod';
import {cookies,draftMode} from 'next/headers';
import {generateRegistrationOptions,verifyRegistrationResponse,generateAuthenticationOptions,verifyAuthenticationResponse,type RegistrationResponseJSON,type AuthenticationResponseJSON,type AuthenticatorTransport} from '@simplewebauthn/server';
import {sameOrigin,siteIdentity,checkAttempts,failedAttempt,clearAttempts,createOwnerSession,signOut,OwnerError,ownerError} from '@/lib/owner/auth';
import {ownerStore,digest} from '@/lib/owner/passkey-store';
export const runtime='nodejs';
const challengeCookie=process.env.NODE_ENV==='production'?'__Host-mitch_owner_challenge':'mitch_owner_challenge';
const json=(value:unknown)=>Response.json(value,{headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){try{
 sameOrigin(request);
 if(Number(request.headers.get('content-length')||0)>20000)throw new OwnerError('Request too large.',413);
 const text=await request.text();if(text.length>20000)throw new OwnerError('Request too large.',413);
 const parsed=z.object({action:z.enum(['register-options','register-verify','login-options','login-verify','logout']),setupCode:z.string().max(100).optional(),response:z.record(z.string(),z.unknown()).optional()}).strict().safeParse(JSON.parse(text));
 if(!parsed.success)throw new OwnerError('Please check your sign-in request.');
 const {action,setupCode,response}=parsed.data;const jar=await cookies();
 if(action==='logout'){await signOut();jar.delete(challengeCookie);(await draftMode()).disable();jar.delete('mitch_owner_preview');return json({ok:true});}
 const identity=siteIdentity();if(request.headers.get('origin')!==identity.origin)throw new OwnerError(`Open ${identity.origin}/owner to use your passkey.`,403);
 const store=ownerStore();if(!store)throw new OwnerError('Owner access needs private server storage before it can be used.',503);
 await checkAttempts();
 // Count all new ceremonies, not only failures, and persist the limiter across restarts.
 if(action.endsWith('-options'))await failedAttempt();
 const credential=await store.credential();
 const remember=async (challenge:string,purpose:'register'|'login',enrollment:string|null=null)=>{
  const nonce=await store.challenge({challenge,purpose,...identity,enrollment});
  jar.set(challengeCookie,nonce,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict',path:'/',maxAge:300});
 };
 if(action==='register-options'){
  if(credential)throw new OwnerError('Your passkey is already registered. Additional passkeys cannot be added.',403);
  if(!setupCode||!await store.enrollmentValid(setupCode))throw new OwnerError('A valid private setup code is required.',403);
  const options=await generateRegistrationOptions({rpName:'Mitch’s Landscaping',rpID:identity.rpID,userName:'Mitch’s owner',userDisplayName:'Website owner',userID:new Uint8Array(Buffer.from(await store.userID(),'base64url')),attestationType:'none',authenticatorSelection:{residentKey:'required',userVerification:'required'},supportedAlgorithmIDs:[-7,-257],timeout:60000});
  await remember(options.challenge,'register',digest(setupCode));return json(options);
 }
 if(action==='login-options'){
  if(!credential)throw new OwnerError('The owner passkey has not been registered.',403);
  if(credential.origin!==identity.origin||credential.rpID!==identity.rpID)throw new OwnerError('This passkey belongs to a different website address. Contact your developer.',403);
  const options=await generateAuthenticationOptions({rpID:identity.rpID,allowCredentials:[{id:credential.id,transports:credential.transports as AuthenticatorTransport[]}],userVerification:'required',timeout:60000});
  await remember(options.challenge,'login');return json(options);
 }
 const nonce=jar.get(challengeCookie)?.value;jar.delete(challengeCookie);
 const challenge=nonce?await store.takeChallenge(nonce,action==='register-verify'?'register':'login'):null;
 if(!challenge||challenge.origin!==identity.origin||challenge.rpID!==identity.rpID||!response)throw new OwnerError('Sign-in expired or was already used. Please try again.',401);
 try{
  const clientData=JSON.parse(Buffer.from((response as unknown as RegistrationResponseJSON).response.clientDataJSON,'base64url').toString('utf8'));
  if(clientData.crossOrigin===true||clientData.topOrigin)throw Error('Framed authentication is not accepted.');
  if(action==='register-verify'){
   if(credential||!challenge.enrollment)throw Error('Enrollment closed.');
   const result=await verifyRegistrationResponse({response:response as unknown as RegistrationResponseJSON,expectedChallenge:challenge.challenge,expectedOrigin:identity.origin,expectedRPID:identity.rpID,requireUserVerification:true,supportedAlgorithmIDs:[-7,-257]});
   if(!result.verified)throw Error('Not verified.');const info=result.registrationInfo;
   await store.register({id:info.credential.id,publicKey:Buffer.from(info.credential.publicKey).toString('base64url'),counter:info.credential.counter,transports:info.credential.transports||[],deviceType:info.credentialDeviceType,backedUp:info.credentialBackedUp,...identity},challenge.enrollment);
  }else{
   if(!credential||response.id!==credential.id)throw Error('Unknown credential.');
   const userHandle=(response as unknown as AuthenticationResponseJSON).response.userHandle;
   if(userHandle&&userHandle!==await store.userID())throw Error('Unknown owner.');
   const result=await verifyAuthenticationResponse({response:response as unknown as AuthenticationResponseJSON,expectedChallenge:challenge.challenge,expectedOrigin:identity.origin,expectedRPID:identity.rpID,requireUserVerification:true,credential:{id:credential.id,publicKey:new Uint8Array(Buffer.from(credential.publicKey,'base64url')),counter:credential.counter,transports:credential.transports as AuthenticatorTransport[]}});
   if(!result.verified)throw Error('Not verified.');
   await store.updateCounter(credential,result.authenticationInfo.newCounter,result.authenticationInfo.credentialBackedUp);
  }
 }catch{await failedAttempt();throw new OwnerError('The passkey could not be verified. Please try again.',401);}
 await clearAttempts();await createOwnerSession();return json({ok:true});
 }catch(error){if(error instanceof SyntaxError)return ownerError(new OwnerError('Please check your sign-in request.'));return ownerError(error);}}
