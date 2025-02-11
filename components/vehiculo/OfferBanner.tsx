"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface Offer {
  id: number;
  imageUrl: string;
  link: string;
}

const offers: Offer[] = [
  {
    id: 1,
    imageUrl: '/images/alpine.jpg',
    link: '/offer1',
  },
  {
    id: 2,
    imageUrl: '/images/escudo.png',
    link: '/offer2',
  },
  {
    id: 3,
    imageUrl: '/images/fmf.webp',
    link: '/offer3',
  },
  {
    id: 4,
    imageUrl: '/images/offer4.jpg',
    link: '/offer4',
  },
  {
    id: 5,
    imageUrl: '/images/offer5.jpg',
    link: '/offer5',
  },
];

const OfferBanner: React.FC = () => {
  const [currentOffer, setCurrentOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const now = new Date();
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );
    const offerIndex = dayOfYear % offers.length;
    setCurrentOffer(offers[offerIndex]);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const dayOfYear = Math.floor(
        (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
      );
      const offerIndex = dayOfYear % offers.length;
      setCurrentOffer(offers[offerIndex]);
    }, 24 * 60 * 60 * 1000); // 24 horas en milisegundos

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!currentOffer) {
    return null;
  }

  return (
    <div className="relative">
      <a href={currentOffer.link}>
        <Image
          src={currentOffer.imageUrl}
          alt="Offer Banner"
          width={1200}
          height={400}
          className="w-full h-auto"
        />
      </a>
    </div>
  );
};

export default OfferBanner; 