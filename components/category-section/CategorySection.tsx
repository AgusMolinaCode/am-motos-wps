import { createClient } from '@/utils/supabase/server';

export default async function CategorySection() {
  const supabase = await createClient();
  const { data: items, error } = await supabase.from("wps-31-01-2025").select('sku, name, brand');
  console.log(items);
  if (error) {
    console.error("Error fetching data:", error);
    return <div>Error al cargar los datos</div>;
  }

  return (
    <ul>
      {items?.map((item: any) => (
        <li key={item.sku}>
          <strong>SKU:</strong> {item.sku} <br />
          <strong>Name:</strong> {item.name} <br />
          <strong>Brand:</strong> {item.brand}
        </li>
      ))}
    </ul>
  );
}