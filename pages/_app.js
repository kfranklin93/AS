// Import your new global CSS file
import '../styles/globals.css';

// This is the App component that Next.js uses
function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;