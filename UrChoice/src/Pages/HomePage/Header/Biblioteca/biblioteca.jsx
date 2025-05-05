import React, { useEffect, useState } from 'react';
import Favoritos from './favoritos';
import Guardados from './guardados'
import { motion, AnimatePresence } from 'framer-motion';

const Biblioteca = () => {
  const [activeTab, setActiveTab] = useState('favoritos');
  const [prevTab, setPrevTab] = useState('favoritos');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeComponent, setActiveComponent] = useState('categories');

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
    <div className="PADRE content w-full h-[calc(86vh-48px)] flex-grow p-4 border-red-600 border-5 rounded-lg overflow-hidden">
      {/* TabView estilo Tailwind encapsulado */}
      {activeComponent === 'categories' && (
        <div className="flex border border-cyan-400 rounded-xl overflow-hidden mb-4 bg-cyan-500">
          <button
            onClick={() => handleTabChange('favoritos')}
            className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
              activeTab === 'favoritos'
                ? 'bg-cyan-400 text-white'
                : 'hover:bg-cyan-300/40'
            }`}
          >
            Favoritos
          </button>
          <button
            onClick={() => handleTabChange('guardados')}
            className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
              activeTab === 'guardados'
                ? 'bg-cyan-400 text-white'
                : 'hover:bg-cyan-300/40'
            }`}
          >
            Guardados
          </button>
        </div>
      )}

      {/* Contenido dinámico con transición */}
      <div className="CONTENT relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 'favoritos' ? (
            <motion.div
              key="favoritos"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >

              <Favoritos/>
            </motion.div>
          ) : (
            <motion.div
              key="guardados"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
        
              <Guardados/>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Biblioteca;