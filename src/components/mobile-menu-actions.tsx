"use client";
import {Phone, ArrowUpRight} from 'lucide-react';
import {useQuote} from './quote-provider';
import {useWebsiteContent} from './website-content';
export default function MobileMenuActions({onClose}: {onClose: () => void}) {
  const {openQuote} = useQuote();
  const {site} = useWebsiteContent();
  return <div className="mobile-menu-actions">
    <button className="button button-blue" onClick={() => {onClose(); openQuote();}}>Request Quote <ArrowUpRight size={17} /></button>
    {site.phone && <a className="button mobile-call-button" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} onClick={onClose}>Call <Phone size={17} /></a>}
  </div>;
}
