import { getRecommendedItems } from "@/lib/brands";
import BestSellersClient from "./BestSellersClient";

export default async function BestSellersServer() {
  const { data: recommendedItems } = await getRecommendedItems();

  return <BestSellersClient recommendedItems={recommendedItems} />;
}
