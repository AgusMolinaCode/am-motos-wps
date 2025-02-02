"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CardBody, CardWithLines } from "./CardWithLines";
import { getStatusItems } from "@/lib/brands";

export default function DealSection() {
  const [newItems, setNewItems] = useState<any[]>([]);
  const [closingItems, setClosingItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    async function fetchStatusItems() {
      setIsLoading(true);
      try {
        const newResponse = await getStatusItems("NEW");
        const closingResponse = await getStatusItems("CLO");
        
        setNewItems(newResponse.data);
        setClosingItems(closingResponse.data);
      } catch (error) {
        console.error("Error fetching status items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStatusItems();
  }, []);

  return (
    <div className="pt-4 md:pt-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col gap-4 justify-between">
        <div className="w-full">
          <CardWithLines>
            <CardBody 
              type="newProducts" 
              itemCount={newItems.length}
            />
          </CardWithLines>
        </div>

        <div className="w-full">
          <CardWithLines>
            <CardBody 
              type="deals" 
              itemCount={closingItems.length}
            />
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
