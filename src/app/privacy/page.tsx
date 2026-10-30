import type { Metadata } from 'next';
import SiteFooter from '@/components/site-footer';
export const metadata: Metadata = { title: 'Privacy | Mitch’s Landscaping', alternates: { canonical: '/privacy' } };
export default function PrivacyPage() {
  return <><main className="container" style={{maxWidth:900,paddingTop:64,paddingBottom:80,lineHeight:1.8}}>
    <a href="/">← Back to Mitch’s Landscaping</a>
    <h1 style={{fontSize:'clamp(32px,6vw,56px)',marginTop:32}}>Privacy information</h1>
    <p>Updated October 30, 2026</p>
    <h2>Quote requests and applications</h2>
    <p>When you request an estimate, we receive the contact information, property details, description of work, and optional photos you provide. When you apply for a job, we receive your contact details, application answers, and any résumé you choose to upload. We use this information to review your request or application and contact you about it.</p>
    <h2>Services that help run this website</h2>
    <p>Our forms are processed and stored by Fillout, and submission notifications are delivered to our company email. Our website is hosted by Vercel. Editable website content and owner sign-in records are stored with Neon. These services may process technical information such as IP addresses and browser information to operate and protect their services.</p>
    <p>Learn more in the <a href="https://www.fillout.com/privacy" target="_blank" rel="noopener noreferrer">Fillout privacy policy</a>, <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel privacy policy</a>, and <a href="https://neon.com/privacy-policy" target="_blank" rel="noopener noreferrer">Neon privacy policy</a>.</p>
    <h2>Cookies and external links</h2>
    <p>The owner area uses cookies for sign-in and previews. Embedded forms may use cookies or similar storage as described by Fillout. Links to Google reviews and directions open services with their own privacy practices.</p>
    <h2>Your information and choices</h2>
    <p>Please provide only information relevant to your request. Do not upload identity documents, financial account details, or other sensitive personal documents. To ask about information you have submitted, request a correction or deletion, or ask how long we retain it, contact our office. We will review your request and explain any information we need to retain for ongoing work or recordkeeping.</p>
    <h2>Contact us</h2>
    <p>Mitch’s Landscaping<br/><a href="mailto:contact@mitchlandscaping.com">contact@mitchlandscaping.com</a><br/><a href="tel:9856936354">(985) 693-6354</a><br/>13957 E Main St, Larose, LA 70373</p>
  </main><SiteFooter/></>;
}
