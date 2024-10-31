// components/Hero.tsx
const Hero: React.FC = () => (
    <section className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5">
      <h2 className="text-5xl font-bold mb-4 text-center">Welcome to GiftPool</h2>
      <p className="text-xl text-center mb-8">Effortlessly share, give, and manage funds with a click. Get started with secure giveaways and contributions.</p>
      <div className="flex space-x-4">
        <button className="bg-white text-purple-700 px-6 py-3 rounded-md font-semibold hover:bg-gray-100">Get Started</button>
        <button className="bg-purple-600 px-6 py-3 rounded-md font-semibold hover:bg-purple-500">Learn More</button>
      </div>
    </section>
  );
  
  export default Hero;
  