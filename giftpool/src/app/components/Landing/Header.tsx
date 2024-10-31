// components/Header.tsx
import Link from 'next/link';

const Header: React.FC = () => (
  <header className="flex justify-between items-center py-6 px-10 bg-white shadow-md">
    <h1 className="text-2xl font-bold text-purple-600">GiftPool</h1>
    <nav className="flex space-x-4">
      <Link href="#features" className="text-gray-700 hover:text-purple-600">Features</Link>
      <Link href="#pricing" className="text-gray-700 hover:text-purple-600">Pricing</Link>
      <Link href="#contact" className="text-gray-700 hover:text-purple-600">Contact</Link>
      <Link href="/auth/login" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Get Started</Link>
    </nav>
  </header>
);

export default Header;
