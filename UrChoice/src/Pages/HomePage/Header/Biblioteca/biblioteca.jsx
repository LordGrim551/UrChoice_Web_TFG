
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HomeCategoryCard from '../Home_CategoryCard/home_category_card';
import CategoryRanking from '../Home_CategoryCard/Category_Ranking/categoryRanking';
import CreateRoom from '../Rooms/Rooms';

const Biblioteca = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [prevTab, setPrevTab] = useState('categories');
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

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setActiveComponent('ranking');
  };

  const handleBackToCategories = () => {
    setActiveComponent('categories');
  };

  return (
    <div className=" PADRE content w-full h-[calc(86vh-48px)] flex-grow p-4 border-red-600 border-5 rounded-lg overflow-hidden">
      {/* TabView estilo Tailwind encapsulado */}
      {activeComponent === 'categories' && (
        <div className="flex border border-cyan-400 rounded-xl overflow-hidden mb-4 bg-cyan-500">
          <a
            onClick={() => handleTabChange('favoritos')}
            className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
              activeTab === 'favoritos'
                ? 'bg-cyan-400 text-white'
                : 'hover:bg-cyan-300/40'
            }`}
          >
            Favoritos
          </a>
          <a
            onClick={() => handleTabChange('guardados')}
            className={`cursor-pointer px-6 py-3 text-white font-medium transition-all duration-300 ${
              activeTab === 'guardados'
                ? 'bg-cyan-400 text-white'
                : 'hover:bg-cyan-300/40'
            }`}
          >
            Guardados
          </a>
        </div>
      )}

      {/* Contenido dinámico con transición */}
      <div className="CONTENT relative w-full h-full">
        <AnimatePresence mode="wait" custom={direction}>
        {activeTab === 'categories' ? (
          activeComponent === 'categories' ? (
              <motion.div
                key="categories"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute w-full"
              >
                <HomeCategoryCard onCategoryClick={handleCategoryClick} />
              </motion.div>
            ) : (
              <motion.div
                key="ranking"
                custom={direction}
                variants={variants}
                className="absolute w-full"
              >
                <CategoryRanking categoryId={selectedCategory} handleBack={handleBackToCategories} />
              </motion.div>
            )
          ) : (
            activeTab === 'create' ?(
            <motion.div
              key="create"
              custom={direction}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute w-full"
            >
              <CreateRoom />
            </motion.div>
          ):(
            activeTab === 'favoritos' ? (
              <motion.div
                key="favoritos"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute w-full"
              >
                <div>Favoritos</div>
              </motion.div>
            ):(
              <motion.div
                key="guardados"
                custom={direction}
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="absolute w-full"
              >
                <div>Guardados</div>
              </motion.div>
            )
          )
          )
        }
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Biblioteca;
