import {ownerStore} from '../src/lib/owner/passkey-store.ts';
// Only a trusted operator with server filesystem access can open initial enrollment.
const store=ownerStore();
if(!store)throw Error('Set OWNER_DATABASE_URL to a private managed database (or OWNER_AUTH_DB on a persistent server) and OWNER_SITE_ORIGIN to the final HTTPS origin first.');
const code=await store.invite();
console.log('Private owner setup code (expires in 15 minutes; do not share):\n');
console.log(code);
console.log(`\nOpen ${process.env.OWNER_SITE_ORIGIN||'http://localhost:3000'}/owner, paste this code, then create your passkey yourself.\nOnly one passkey can be enrolled. There is no website reset or recovery route.\nA localhost passkey will not work on the future public domain.`);
await store.close();
