"use server";

import  {SupabaseCatalog} from "@/types/interface";
import { createClient } from "@/utils/supabase/server";
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

interface CSVItem {
    brand: string;
    product_type: string;
    sku: string;
    name: string;
    vendor_number: string;
    product_name: string;
}

export async function getCatalog(): Promise<SupabaseCatalog[]> {
    const supabase = await createClient();
    const { data: items, error } = await supabase.from("wps-31-01-2025").select('sku, name, brand, vendor_number, product_name, product_type');
    if (error) {
        console.error("Error fetching data:", error);
        return [];
    }
    return items as SupabaseCatalog[];
}

export async function getCatalogProductTypes(): Promise<Record<string, string[]>> {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'brands_with_ids.json');
    
    return new Promise<Record<string, string[]>>((resolve) => {
        fs.readFile(filePath, 'utf8', (err, fileContents) => {
            if (err) {
                console.error("Error reading JSON file:", err);
                resolve({});
                return;
            }

            try {
                const brandsData = JSON.parse(fileContents);
                const brandProductTypes = Object.entries(brandsData).reduce((acc, [brandName, brandInfo]) => {
                    const { id, product_types } = brandInfo as { id: number; product_types: string[] };
                    acc[id] = product_types;
                    return acc;
                }, {} as Record<string, string[]>);
                resolve(brandProductTypes);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                resolve({});
            }
        });
    });
}

export async function getProductTypeBrands(): Promise<Record<string, string[]>> {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'filtered5.csv');
    
    return new Promise<Record<string, string[]>>((resolve) => {
        fs.readFile(filePath, 'utf8', (err, fileContents) => {
            if (err) {
                console.error("Error reading CSV file:", err);
                resolve({});
                return;
            }

            Papa.parse(fileContents, {
                header: true,
                complete: (results) => {
                    // Agrupar marcas por product_type, eliminando duplicados
                    const productTypeBrands = (results.data as CSVItem[]).reduce((acc: Record<string, string[]>, item) => {
                        const { brand, product_type } = item;

                        if (!brand || !product_type) return acc;

                        if (!acc[product_type]) {
                            acc[product_type] = [];
                        }
                        if (!acc[product_type].includes(brand)) {
                            acc[product_type].push(brand);
                        }
                        return acc;
                    }, {});

                    resolve(productTypeBrands);
                },
                error: (error: Error) => {
                    console.error("Error parsing CSV:", error);
                    resolve({});
                }
            });
        });
    });
}

export async function getLatestUsedItems() {
    const supabase = await createClient();
    const { data: items, error } = await supabase
        .from("productos")
        .select("*")
        .order('id', { ascending: false })
        .limit(3);
    
    if (error) {
        console.error("Error fetching latest used items:", error);
        return [];
    }
    
    // Transformar los datos para que sean compatibles con ItemSheet
    const transformedItems = items?.map(item => ({
        ...item,
        name: item.titulo,
        brand: item.marca,
        brand_id: 0, // Los productos usados no tienen brand_id
        supplier_product_id: item.id.toString(),
        standard_dealer_price: "0",
        list_price: "0",
        weight: 1, // Peso por defecto para productos usados
        images: { data: [] }, // Estructura compatible
    })) || [];
    
    return transformedItems;
}

