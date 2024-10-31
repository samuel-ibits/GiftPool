// components/FeatureCard.tsx
interface FeatureCardProps {
    title: string;
    description: string;
    icon: string;
  }
  
  const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h4 className="text-2xl font-semibold mb-2">{title}</h4>
      <p className="text-gray-700">{description}</p>
    </div>
  );
  
  export default FeatureCard;
  