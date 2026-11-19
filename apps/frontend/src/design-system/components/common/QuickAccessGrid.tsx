import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { HUB_REGISTRY, PORTAL_REGISTRY, ICON_COMPONENTS_MAP } from '@/config/portals.config';
import { Star, ChevronRight } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.9 },
  visible: { opacity: 1, y: 0, scale: 1 }
};

export default function QuickAccessGrid() {
  const navigate = useNavigate();

  return (
    <motion.div
      className="flex flex-col gap-10 px-4 py-8 pb-32 bg-black"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {HUB_REGISTRY.map((hub) => {
        const hubPortals = PORTAL_REGISTRY.filter(p => p.hubId === hub.id);
        const HubIcon = ICON_COMPONENTS_MAP[hub.iconName] || Star;

        if (hubPortals.length === 0) return null;

        return (
          <div key={hub.id} className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br ${hub.color} shadow-lg shadow-black/40 border border-white/10`}>
                  <HubIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[18px] font-black text-white leading-tight tracking-tight">
                    {hub.nameBn} <span className="text-[13px] text-zinc-500 font-bold ml-1">({hub.nameEn})</span>
                  </h2>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {hub.descriptionBn}
                  </p>
                </div>
              </div>
              <div className="bg-zinc-900 p-1.5 rounded-full border border-white/5">
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </div>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-7 gap-x-3">
              {hubPortals.map((tile) => {
                const IconComponent = ICON_COMPONENTS_MAP[tile.iconName] || Star;

                return (
                  <motion.div
                    key={tile.id}
                    className="flex flex-col items-center gap-2.5 cursor-pointer group"
                    variants={itemVariants}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate(tile.route)}
                  >
                    <div
                      className={`relative w-[64px] h-[64px] rounded-[24px] flex items-center justify-center bg-zinc-900 border border-white/5 group-hover:border-white/20 group-hover:bg-zinc-800/80 transition-all duration-300 shadow-2xl overflow-hidden`}
                    >
                      <IconComponent
                        className={`w-7 h-7 bg-gradient-to-br ${tile.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300`}
                        strokeWidth={2}
                      />
                      
                      {/* Subtle background glow on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${tile.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-[24px]`} />
                      
                      {tile.status === 'upcoming' && (
                        <span className="absolute top-1 right-1 bg-amber-500 text-black text-[7px] font-black px-1 rounded-full uppercase leading-none py-0.5 shadow-sm">
                          New
                        </span>
                      )}
                    </div>
                    <div className="flex flex-col items-center leading-none text-center w-full">
                      <span className="text-[11px] font-bold text-zinc-300 group-hover:text-white transition-colors truncate w-full px-1">
                        {tile.nameBn}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
