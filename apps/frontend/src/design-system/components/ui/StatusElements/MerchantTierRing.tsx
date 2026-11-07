import React from 'react';
import { motion } from 'motion/react';

export type Tier = 'bronze' | 'silver' | 'gold' | 'platinum';

interface Props {
  tier: Tier;
  size?: number;
  imageUrl: string;
  alt: string;
}

const tierConfig = {
  bronze: { color: "#CD7F32", stroke: "4" },
  silver: { color: "#C0C0C0", stroke: "4" },
  gold: { color: "#FFD700", stroke: "4" },
  platinum: { color: "#E5E4E2", stroke: "4" },
};

export const MerchantTierRing: React.FC<Props> = ({ tier, size = 64, imageUrl, alt }) => {
  const config = tierConfig[tier];
  
  return (
    <span className="relative flex items-center justify-center p-1" style={{ width: size, height: size }}>
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke={config.color}
          strokeWidth={config.stroke}
          strokeDasharray="20 4"
        />
      </motion.svg>
      <img
        src={imageUrl}
        alt={alt}
        className="rounded-full w-[85%] h-[85%] object-cover border-2 border-white/10"
      />
    </span>
  );
};
