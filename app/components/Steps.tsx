// components/Steps.tsx
import { FC } from "react";
import { motion } from "framer-motion";

interface Step {
  icon: string;
  text: string;
}

const steps: Step[] = [
  { icon: "🔗", text: "Connect your Strava account" },
  { icon: "💰", text: "Create Fundraiser" },
  { icon: "🎯", text: "Set Goals for your project" },
  { icon: "🥾", text: "Hike & Track & Share" },
];

const Steps: FC = () => {
  return (
<>
      {steps.map((step, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.3, duration: 0.6 }}
          className="step"
        >
          <span className="icon">{step.icon}</span>
          <p className="text">{step.text}</p>
        </motion.div>
      ))}
    </>
  );
};

export default Steps;
