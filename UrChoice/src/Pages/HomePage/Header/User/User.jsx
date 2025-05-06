import React, { useState } from 'react';
import Perfil from './Perfil/perfil';
import MisCategorias from './MisCategorias/MisCategorias';
import { motion, AnimatePresence } from 'framer-motion';

const User = () => {
  const [activeTab, setActiveTab] = useState('perfil');
  const [prevTab, setPrevTab] = useState('perfil');

  const handleTabChange = (newTab) => {
    setPrevTab(activeTab);
    setActiveTab(newTab);
  };

  const direction = activeTab === 'perfil' && prevTab === 'categorias' ? 'left' : 'right';

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
      <div className="flex border border-cyan-400 rounded-xl overflow-hidden mb-4 bg-cyan-500">
        <button
          onClick={() => handleTabChange('perfil')}
          className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
            activeTab === 'perfil'
              ? 'bg-cyan-400 text-white'
              : 'hover:bg-cyan-300/40'
          }`}
        >
          Perfil
        </button>
        <button
          onClick={() => handleTabChange('categorias')}
          className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
            activeTab === 'categorias'
              ? 'bg-cyan-400 text-white'
              : 'hover:bg-cyan-300/40'
          }`}
        >
          Mis categorías
        </button>
      </div>

      {/* Contenido dinámico con transición */}
      <div className="CONTENT relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
          {activeTab === 'perfil' ? (
            <motion.div
              key="perfil"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
              <Perfil />
            </motion.div>
          ) : (
            <motion.div
              key="categorias"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
              <MisCategorias />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default User;