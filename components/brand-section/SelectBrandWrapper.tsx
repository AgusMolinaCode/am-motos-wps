import { getBrands } from "@/lib/brands";
import SelectBrand from "./SelectBrand";

export default async function SelectBrandWrapper() {
  const { data } = await getBrands();
  
  return <SelectBrand brands={data} />;
}
