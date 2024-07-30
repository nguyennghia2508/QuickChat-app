// import type { ChildrenProps } from '@/app/types';
// import Script from 'next/script'
// import dynamic from "next/dynamic";
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ReduxProvider = dynamic(() => import("@/app/store/redux-provider"), {
//     ssr: false
//   });

// export default function MainLayout({ children }: ChildrenProps) {

//   return (
//     <html lang="en">
//         <head>
//             {/* <link href="/css/template.min.css" rel="stylesheet"/> */}
//             <link href="/css/template.dark.min.css" rel="stylesheet" media="(prefers-color-scheme: dark)"/>
//         </head>
//         <body>
//             <ToastContainer/>
//             <ReduxProvider> {children}</ReduxProvider>
//             {/* <Script src="/js/libs/jquery.min.js"/>
//             <Script src="/js/bootstrap/bootstrap.bundle.min.js"/>
//             <Script src="/js/plugins/plugins.bundle.js"/>
//             <Script src="/js/template.js"/> */}
//         </body>
//     </html>
//   );
// }