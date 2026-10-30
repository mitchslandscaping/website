import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  distDir: process.env.NODE_ENV==='development' && process.env.OWNER_QA_DIST_DIR ? '.next-owner-qa' : '.next',
  async headers(){return ['/owner','/api/owner/:path*'].map(source=>({source,headers:[
    {key:'Cache-Control',value:'no-store'},
    {key:'X-Frame-Options',value:'DENY'},
    {key:'Content-Security-Policy',value:"frame-ancestors 'none'"},
    {key:'Referrer-Policy',value:'no-referrer'},
    {key:'X-Content-Type-Options',value:'nosniff'},
  ]}));},
  images: { qualities: [75, 85], remotePatterns: [] },
};
export default config;
