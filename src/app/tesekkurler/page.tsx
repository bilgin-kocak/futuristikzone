import type {Metadata} from 'next';
export const metadata:Metadata={title:'Teşekkürler',robots:{index:false,follow:true},alternates:{canonical:'/tesekkurler/'}};
export default function Thanks(){return <main id="main-content" className="container message-page"><h1>Teşekkürler!</h1><p>Mesajınız gönderildi.</p><a href="/">Ana sayfaya dön</a></main>;}
