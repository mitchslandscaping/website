import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  async headers(){return ['/owner','/api/owner/:path*'].map(source=>({source,headers:[
    {key:'Cache-Control',value:'no-store'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'Content-Security-Policy',value:"frame-ancestors 'none'"},
    {key:'Referrer-Policy',value:'no-referrer'},
    {key:'X-Content-Type-Options',value:'nosniff'},
  ]}));},
  images: { qualities: [75, 85], remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }] },
};
export default config;
