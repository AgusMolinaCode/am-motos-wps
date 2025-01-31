"use server";

import { parse } from 'csv-parse/sync';
import fs from 'fs/promises';

export async function getUniqueBrands() {
  try {
    const csvPath = process.cwd() + '/public/csv/master-item-list.csv';
    const fileContent = await fs.readFile(csvPath);
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    const brands = records
      .map((row: any) => row.brand?.trim())
      .filter((brand: string) => brand)
      .filter((value: string, index: number, self: string[]) => 
        self.indexOf(value) === index
      )
      .sort((a: string, b: string) => a.localeCompare(b));

      console.log(brands)
    return brands as string[];
    
  } catch (error) {
    console.error("Error obteniendo marcas:", error);
    return [];
  }
}
