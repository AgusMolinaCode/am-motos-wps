import React from "react";
import { createClient } from "@/utils/supabase/server";
import { usePriceCalculation } from "@/hooks/usePriceCalculation";

export default async function page() {
  const supabase = await createClient();
  const { data: ItemsUsados } = await supabase.from("ItemsUsados").select();

  const { formatPrice } = usePriceCalculation();

  // formateamos price a ARS pesos argentinos
  const formattedItemsUsados = ItemsUsados?.map((item) => ({
    ...item,
    price: formatPrice(item.price || 0),
  }));

  return (
    <div>
      <h1>Items Usados</h1>
      <pre>{JSON.stringify(formattedItemsUsados, null, 2)}</pre>
    </div>
  );
}


