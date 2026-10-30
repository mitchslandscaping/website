"use client";
import {useQuote} from './quote-provider';
import {useWebsiteContent} from './website-content';
export default function MobileMenuActions({onClose}: {onClose: () => void}) {
  const {openQuote} = useQuote();
  const {site} = useWebsiteContent();
  return <div className="mobile-menu-actions">
    {site.phone && <a className="button mobile-call-button" href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} onClick={onClose}>Call</a>}
    <button className="button button-blue" onClick={() => {onClose(); openQuote();}}>Request Quote</button>
  </div>;
}
