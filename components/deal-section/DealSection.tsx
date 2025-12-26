"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CardBody, CardWithLines } from "./CardWithLines";
import { getStatusItems } from "@/lib/brands";
import Link from "next/link";
import { BrandStatus } from "@/types/interface";

export default function DealSection() {
  const [newItems, setNewItems] = useState<BrandStatus[]>([]);
  const [closingItems, setClosingItems] = useState<BrandStatus[]>([]);
  
  React.useEffect(() => {
    async function fetchStatusItems() {
      try {
        const newResponse = await getStatusItems("NEW");
        const closingResponse = await getStatusItems("CLO");
        
        setNewItems(newResponse.data);
        setClosingItems(closingResponse.data);
      } catch (error) {
        console.error("Error fetching status items:", error);
      }
    }
    fetchStatusItems();
  }, []);

  return (
    <div className="pt-4 md:pt-10 flex flex-col xl:flex-row gap-6 items-center justify-between">
      <div className="flex flex-col gap-4 justify-between w-full lg:w-2/4">
        <div className="w-full">
          <CardWithLines>
            <CardBody 
              type="newProducts" 
            />
          </CardWithLines>
        </div>

        <div className="w-full">
          <CardWithLines>
            <CardBody 
              type="deals" 
            />
          </CardWithLines>
        </div>

        <div className="w-full">
          <Link href="/brand/fly-racing">
            <Image
              src="/images/fly-banner.webp"
              alt="deal"
              width={600}
              height={600}
              className="rounded-md h-[100px] object-contain md:object-cover w-full"
            />
          </Link>
        </div>
      </div>

      <div>
        <Link href="/brand/alpinestars" className="cursor-pointer">
          <Image
            src="/images/alpinestars-mx-2026.jpg"
            alt="deal"
            width={600}
            height={600}
            className="rounded-xl object-contain md:h-[342px] w-full "
          />
        </Link>
      </div>
    </div>
  );
}
