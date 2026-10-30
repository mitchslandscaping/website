import sharp from 'sharp';
import {requireOwner,sameOrigin,OwnerError,ownerError} from '@/lib/owner/auth';
import {contentStore} from '@/lib/owner/content-store';
export async function POST(request:Request){try{
 sameOrigin(request);await requireOwner();
 if(Number(request.headers.get('content-length'))>4*1024*1024)throw new OwnerError('This image is too large. Please choose a smaller photo.');
 const form=await request.formData();const file=form.get('file');
 if(!(file instanceof File)||file.size>3*1024*1024||!file.size)throw new OwnerError('Please choose an image smaller than 3 MB after resizing.');
 const input=Buffer.from(await file.arrayBuffer());
 let bytes:Buffer;
 try{
  const image=sharp(input,{limitInputPixels:40_000_000,animated:false});const meta=await image.metadata();
  if(!['jpeg','png','webp'].includes(meta.format||''))throw Error('Unsupported image.');
  bytes=await image.rotate().resize({width:2400,height:2400,fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
  if(bytes.length>1024*1024)bytes=await sharp(bytes).resize({width:1800,height:1800,fit:'inside'}).webp({quality:72}).toBuffer();
 }catch{throw new OwnerError('Please choose a valid JPG, PNG, or WebP photo.');}
 if(bytes.length>1024*1024)throw new OwnerError('This photo is too detailed to store. Please use a smaller version.');
 let id:string;try{id=await contentStore().putMedia(bytes);}catch(error){if(error instanceof Error&&error.message.startsWith('Photo storage is full'))throw new OwnerError(error.message,413);throw error;}
 return Response.json({image:{_type:'image',asset:{_type:'reference',_ref:id}},url:`/api/media/${id}`},{headers:{'Cache-Control':'no-store'}});
 }catch(error){return ownerError(error);}}
