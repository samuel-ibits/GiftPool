// pages/index.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import Header from './components/Landing/Header';
import Hero from './components/Landing/Hero';
import Features from './components/Landing/Features';
import CallToAction from './components/Landing/CallToAction';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>GiftPool | Share Generosity</title>
        <meta name="description" content="Effortlessly share, give, and manage funds with GiftPool." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <Hero />
      <Features />
      <CallToAction />
    </div>
  );
};

export default Home;
