import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface HomePageProps {
  onNext: () => void;
  onJail: () => void; // Redirect to JailPage after 2 "A little" clicks
}

const HomePage: React.FC<HomePageProps> = ({ onNext, onJail }) => {
  const [clickCount, setClickCount] = useState(0);
  const [littleClickCount, setLittleClickCount] = useState(0);
  const [exploding, setExploding] = useState(false);

  const handleALittleClick = () => {
    const newCount = littleClickCount + 1;
    setLittleClickCount(newCount);

    if (newCount >= 2) {
      onJail(); // Redirect to JailPage
    } else {
      alert("(·•᷄∩•᷅ ) A little!?? (·•᷄∩•᷅ )");
    }
  };

  const handleALotClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      setExploding(true);

      // Wait for explosion animation to finish before redirecting
      setTimeout(() => {
        setExploding(false);
        onNext();
      }, 2000); // Explosion duration
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-black text-white font-mono overflow-hidden">
<AnimatePresence>
  {exploding && (
    <motion.div
      className="motion-div"
      initial={{ scale: 1, opacity: 1 }}
      animate={{ scale: [1, 2, 3], opacity: [1, 0.8, 0] }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeInOut" }}
    >
      💥 BOOOOOOOM!!! 💥
    </motion.div>
  )}
</AnimatePresence>


      {/* Main Content */}
      {!exploding && (
        <>
          <h1 className="text-3xl mb-6">Do you love me?</h1>
          <div className="flex gap-4">
            {/* "A Little" Button */}
            <button
              className="p-4 border border-white rounded"
              onClick={handleALittleClick}
            >
              A little
            </button>

            {/* "A Lot" Button */}
            <button
              className="p-4 border border-white rounded"
              style={{ fontSize: `${1 + clickCount * 0.2}rem` }}
              onClick={handleALotClick}
            >
              A lot
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
