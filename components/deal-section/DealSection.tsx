"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CardBody, CardWithLines } from "./CardWithLines";
import { getItemsByStatus } from "@/lib/brands";

export default function DealSection() {
  const [newItems, setNewItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchNewItems() {
      setIsLoading(true);
      try {
        const { data } = await getItemsByStatus("NEW");
        setNewItems(data);
      } catch (error) {
        console.error("Error fetching new items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNewItems();
  }, []);

  return (
    <div className="pt-4 md:pt-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col gap-4 justify-between">
        <div className="w-full">
          <CardWithLines>
            <CardBody type="newProducts" />
          </CardWithLines>
        </div>

        <div className="w-full">
          <CardWithLines>
            <CardBody type="deals" />
          </CardWithLines>
        </div>

        <div className="w-full">
          <Image
            src="/images/fly-banner.webp"
            alt="deal"
            width={600}
            height={600}
            className="rounded-md h-[100px]"
          />
        </div>
      </div>

      <div>
        <Image
          src="/images/alpine.jpg"
          alt="deal"
          width={600}
          height={600}
          className="rounded-xl object-cover h-[342px]"
        />
      </div>
    </div>
  );
}
