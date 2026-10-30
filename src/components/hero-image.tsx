import Image from 'next/image';
import {preload} from 'react-dom';
import images from '@/data/hero-images.json';

// Prebuilt responsive files avoid a cold image-optimization request on navigation.
export default function HeroImage({src, alt}: {src: string; alt: string}) {
  const image = images[src as keyof typeof images];
  if (!image) return <Image src={src} alt={alt} fill preload sizes="100vw" />;
  preload(src, {as: 'image', imageSrcSet: image.srcSet, imageSizes: '100vw', fetchPriority: 'high'});
  return <img src={src} srcSet={image.srcSet} sizes="100vw" alt={alt}
    loading="eager" fetchPriority="high" decoding="async"
    style={{position:'absolute',inset:0,width:'100%',height:'100%'}} />;
}
