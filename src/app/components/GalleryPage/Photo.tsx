import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getOptimizedUrl } from "./utils/getOptimizedUrl";
import { Photo as PhotoType } from "./types";

type PhotoProps = {
  photo: PhotoType;
  position: "left" | "center" | "right";
  isCurrent: boolean;
  dragOffset?: number;
};

const Photo: React.FC<PhotoProps> = ({ photo, position, isCurrent }) => {
  const { mainUrl, secondaryUrl } = getOptimizedUrl(photo.url);

  const variants = {
    left: { scale: 0.8, x: -120, opacity: 0.5 },
    center: { scale: 1, x: 0, opacity: 1 },
    right: { scale: 0.8, x: 120, opacity: 0.5 },
  };

  return (
    <motion.div
      className="absolute"
      initial={variants[position]}
      animate={variants[position]}
      transition={{ duration: 0.3 }}
    >
      <Image
        src={mainUrl}
        alt={photo.title || "Photo"}
        width={isCurrent ? 380 : 300}
        height={isCurrent ? 380 : 300}
        className="rounded-xl shadow-lg"
        placeholder="blur"
        blurDataURL={secondaryUrl}  // Use secondary URL as the placeholder
        priority={isCurrent}
        style={{ objectFit: "cover" }}
      />
    </motion.div>
  );
};

export default Photo;
