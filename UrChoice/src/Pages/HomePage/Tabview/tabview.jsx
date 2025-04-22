import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeCategoryCard from '../Home_CategoryCard/home_category_card';
import CreateCategory from '../CreateCategory/CreateCategory';

const TabView = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [prevTab, setPrevTab] = useState('categories');

  const handleTabChange = (newTab) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

  const direction = activeTab === 'categories' && prevTab === 'create' ? 'left' : 'right';

  const variants = {
    initial: (direction) => ({
      opacity: 0,
      x: direction === 'left' ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: (direction) => ({
      opacity: 0,
      x: direction === 'left' ? -100 : 100,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="content w-full h-[calc(86vh-48px)] flex-grow p-4 border-red-600 border-5 rounded-lg overflow-hidden">
      {/* TabView estilo Tailwind encapsulado */}
      <div className="flex border border-cyan-400 rounded-xl overflow-hidden mb-4 bg-cyan-500">
        <a
          onClick={() => handleTabChange('categories')}
          className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
            activeTab === 'categories'
              ? 'bg-cyan-400 text-white'
              : 'hover:bg-cyan-300/40'
          }`}
        >
          Category Cards
        </a>
        <a
          onClick={() => handleTabChange('create')}
          className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
            activeTab === 'create'
              ? 'bg-cyan-400 text-white'
              : 'hover:bg-cyan-300/40'
          }`}
        >
          Rooms
        </a>
      </div>

      {/* Contenido dinámico con transición */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 'categories' ? (
            <motion.div
              key="categories"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
              <HomeCategoryCard />
            </motion.div>
          ) : (
            <motion.div
              key="create"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
              <CreateCategory />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TabView;