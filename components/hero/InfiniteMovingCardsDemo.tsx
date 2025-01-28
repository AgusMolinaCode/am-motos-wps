"use client";

import React, { useEffect, useState } from "react";
import { InfiniteMovingCards } from "../ui/infinite-moving-cards";

export function InfiniteMovingCardsDemo() {
  return (
    <div className="h-[8rem] rounded-md flex flex-col antialiased dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden mt-36">
      <InfiniteMovingCards
        items={images}
        direction="right"
        speed="slow"
      />
    </div>
  );
}

const images = [
  "/slider/13.jpg",
  "/slider/14.jpg",
  "/slider/15.jpg",
  "/slider/16.jpg",
  // ... other image paths
];
