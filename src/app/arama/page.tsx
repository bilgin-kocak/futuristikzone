import type {Metadata} from 'next';
import Search from '@/components/Search';
import Sidebar from '@/components/Sidebar';
import {searchIndex} from '@/lib/content';
export const metadata:Metadata={title:'Arama',robots:{index:false,follow:true},alternates:{canonical:'/arama/'}};
export default function SearchPage(){return <div className="site-columns container inner-page"><main id="main-content"><h1 className="page-title">Arama</h1><Search posts={searchIndex()}/></main><Sidebar/></div>;}
