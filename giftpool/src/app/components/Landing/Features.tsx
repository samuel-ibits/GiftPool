// components/Features.tsx
import FeatureCard from './FeatureCard';

const Features: React.FC = () => (
  <section id="features" className="py-20 px-10 bg-gray-100">
    <h3 className="text-4xl font-bold text-center mb-10 text-gray-800">Why GiftPool?</h3>
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <FeatureCard
        title="Create Giveaways"
        description="Effortlessly set up fund giveaways in cash, recharge cards, data, and more."
        icon="🎁"
      />
      <FeatureCard
        title="Real-Time Stats"
        description="Track live participation, stats, and view who’s claiming the giveaway."
        icon="📊"
      />
      <FeatureCard
        title="Group Contributions"
        description="Collect and manage group contributions, and assign contribution tiers."
        icon="🤝"
      />
    </div>
  </section>
);

export default Features;
