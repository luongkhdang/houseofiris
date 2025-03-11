import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const STICKER_FOLDER = "/stickers/";
const MAX_OPEN_PER_PACK = 3;
const GRID_COLUMNS = 4;
const GRID_CELL_SIZE = 96;
const ADJUSTED_CELL_SIZE = GRID_CELL_SIZE - 30;
const CURRENT_CREDIT = 29;

interface DraggableStickerProps {
    sticker: string;
    initialPosition: { x: number; y: number };
    gridHeight: number;
  }
  
  const DraggableSticker: React.FC<DraggableStickerProps> = ({ sticker, initialPosition, gridHeight }) => (
    <motion.div
      className="sticker-container"
      drag
      dragConstraints={{ left: 10, right: 200, top: -100, bottom: Math.max(0, gridHeight - GRID_CELL_SIZE + 100) }}
      dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
      initial={{ x: initialPosition.x, y: initialPosition.y }}
      whileTap={{ scale: 0.9 }}
    >
      <Image
        src={`${STICKER_FOLDER}${sticker}`}
        alt={`Sticker ${sticker}`}
        width={80}
        height={80}
        className="sticker-image"
      />
    </motion.div>
  );

const StickerView = () => {
  const [stickerList, setStickerList] = useState([]);
  const [collectedStickers, setCollectedStickers] = useState<string[]>(
    typeof window !== "undefined" ? JSON.parse(localStorage.getItem("collectedStickers") || "[]") : []
  );
  
  const [totalCredit, setTotalCredit] = useState(CURRENT_CREDIT);

  const totalCollectedStickers = collectedStickers.length;
  let availableCredits = totalCredit - totalCollectedStickers;

  if (availableCredits < 0) {
    availableCredits = 0;
    setTotalCredit(totalCollectedStickers);
  }

  const [newStickers, setNewStickers] = useState<string[]>([]);
  const [isOpening, setIsOpening] = useState(false);
  const [showPack, setShowPack] = useState(true);
  
  const stickerGridRef = useRef<HTMLDivElement | null>(null);
  const [gridHeight, setGridHeight] = useState(0);

  useEffect(() => {
    fetchStickerList();
  }, []);


  useEffect(() => {
    if (stickerGridRef.current) {
      setGridHeight(stickerGridRef.current.clientHeight);
    }
  }, [collectedStickers]);
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("collectedStickers", JSON.stringify(collectedStickers));
    }
    if (stickerGridRef.current) {
      setGridHeight(stickerGridRef.current.clientHeight);
    }
  }, [collectedStickers]);

  const fetchStickerList = async () => {
    try {
      const response = await fetch("/api/sticker-list");
      const stickers = await response.json();
      setStickerList(stickers);
    } catch (error) {
      console.error("Failed to fetch stickers", error);
    }
  };

  const getRandomStickers = () => {
    const remainingStickers = stickerList.filter((sticker) => !collectedStickers.includes(sticker));
    const count = Math.min(Math.floor(Math.random() * MAX_OPEN_PER_PACK) + 1, remainingStickers.length);
    const selectedStickers: string[] = [];

    while (selectedStickers.length < count) {
      const randomIndex = Math.floor(Math.random() * remainingStickers.length);
      selectedStickers.push(remainingStickers[randomIndex]);
      remainingStickers.splice(randomIndex, 1);
    }
    return selectedStickers;
  };

  const openPack = () => {
    if (availableCredits > 0 && collectedStickers.length < stickerList.length) {
      setIsOpening(true);

      // Get stickers before animation
      const stickers = getRandomStickers();
      setNewStickers(stickers);

      setTimeout(() => {
        const newCollection = [...collectedStickers, ...stickers];
        setCollectedStickers(newCollection);
        setIsOpening(false);
        setShowPack(false);

        let newAvailableCredits = totalCredit - newCollection.length;
        if (newAvailableCredits < 0) {
          setTotalCredit(newCollection.length);
          newAvailableCredits = 0;
        }

        // Remove new stickers after 5 seconds
        setTimeout(() => {
          setNewStickers([]);
        }, 3000);

        // Show pack again after 5 seconds
        setTimeout(() => {
          setShowPack(true);
        }, 3000);
      }, 1500);
    }
  };

  return (
    <div className="sticker-view">
      <div className="credits-display">
        <span>Available Credits: 💳</span>
        <span className="credits-amount">{availableCredits}</span>
      </div>

      <div className="total-collected">
        <span>Total Collected Stickers: 🏆</span>
        <span className="collected-amount">{totalCollectedStickers}</span>
      </div>

      {/* Pack Opening Animation */}
      <div className="pack-container">
        <AnimatePresence>
          {showPack && (
            <motion.div
              initial={{ opacity: 1, scale: 1 }}
              animate={isOpening ? { rotate: [0, -3, 3, -3, 3, 0], scale: [1, 1.05, 0.9, 1.1, 0] } : {}}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, repeat: isOpening ? 2 : 0 }}
              className="absolute cursor-pointer"
              onClick={openPack}
            >
              <Image src="/sticker-pack.png" alt="Sticker Pack" width={60} height={60} className="sticker-pack" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fan Spread Animation */}
      <div className="new-stickers-container">
        <AnimatePresence>
          {newStickers.map((sticker, index) => (
            <motion.div
              key={sticker}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: 1,
                scale: 1,
                x: (index - 1) * 20, // Spread left and right
                y: 20, // Move upwards slightly
                rotate: (index - 1) * 15, // Slight rotation effect
              }}
              exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2, exit: { duration: 2 } }}
            >
              <Image src={`${STICKER_FOLDER}${sticker}`} alt={`Sticker ${sticker}`} width={80} height={80} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Sticker Collection Notebook */}
      <div className="notebook">
        <h2 className="notebook-title">📒 My Sticker Notebook</h2>
        <div className="sticker-grid" ref={stickerGridRef} style={{ minHeight: `${Math.ceil(collectedStickers.length / GRID_COLUMNS) * ADJUSTED_CELL_SIZE}px` }}>
          {collectedStickers.map((sticker, index) => (
            <DraggableSticker key={sticker} sticker={sticker} initialPosition={{ x: (index % GRID_COLUMNS) * ADJUSTED_CELL_SIZE, y: Math.floor(index / GRID_COLUMNS) * ADJUSTED_CELL_SIZE }} gridHeight={gridHeight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StickerView;
