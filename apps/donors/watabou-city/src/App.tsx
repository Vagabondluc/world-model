// @ts-nocheck
import React, { useEffect } from 'react';
import { CityControls } from './app/controls';
import { CityCanvas } from './app/canvas';
import { useCityStore } from './app/state';
import { motion } from 'motion/react';
import { Building2 } from 'lucide-react';

export default function App() {
  const generate = useCityStore(state => state.generate);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-stone-200 z-50">
        <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-stone-900">URBAN_SYNTH</h1>
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em]">Procedural City Generator</p>
            </div>
          </div>
          

        </div>
      </header>

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 xl:col-span-3 sticky top-24"
          >
            <CityControls />
          </motion.div>

          {/* Main Viewport */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 xl:col-span-9 aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-12rem)]"
          >
            <CityCanvas />
          </motion.div>
        </div>
      </main>

      <footer className="py-4 border-t border-stone-200 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6">
        </div>
      </footer>
    </div>
  );
}
