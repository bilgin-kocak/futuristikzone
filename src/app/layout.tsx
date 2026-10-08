import type {Metadata} from 'next';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/work-sans/700.css';
import '@/styles/global.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {imageFor,selectPosts,site} from '@/lib/content';
export const metadata:Metadata={metadataBase:new URL('https://futuristikzone.com'),title:{default:'FuturistikZone - Geleceği Şekillendirin',template:'%s - FuturistikZone'},description:'FuturistikZone: bilim, teknoloji ve geleceği şekillendiren gelişmeler.',openGraph:{siteName:'FuturistikZone',locale:'tr_TR',type:'website'},twitter:{card:'summary_large_image'}};
export default function RootLayout({children}:{children:React.ReactNode}){const logo=imageFor(site.logo)?.localPath||'';return <html lang="tr"><body id="top"><a className="skip-link" href="#main-content">İçeriğe geç</a><Header logo={logo} popular={selectPosts(site.popular).map(p=>({path:p.path,title:p.title}))}/>{children}<Footer/></body></html>;}
