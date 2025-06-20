import { CheckCircle2 } from "lucide-react";

interface FeaturesListProps {
  title: string;
  features: string[];
}

const FeaturesList = ({ title, features }: FeaturesListProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <ul className="mt-6 space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-white fill-[#662CB2]" />
            <span className="text-gray-700 dark:text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturesList;
