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

export async function getCatalogCsv(): Promise<SupabaseCatalog[]> {
    const filePath = path.join(process.cwd(), 'public', 'csv', 'filtered5.csv');
    
    return new Promise<SupabaseCatalog[]>((resolve) => {
        fs.readFile(filePath, 'utf8', (err, fileContents) => {
            if (err) {
                console.error("Error reading CSV file:", err);
                resolve([]);
                return;
            }

            Papa.parse(fileContents, {
                header: true,
                complete: (results) => {
                    // Mapear los datos del CSV al tipo SupabaseCatalog
                    const catalogItems = (results.data as CSVItem[])
                        .filter(item => 
                            item.sku && 
                            item.name && 
                            item.brand && 
                            item.vendor_number && 
                            item.product_name && 
                            item.product_type
                        )
                        .map(item => ({
                            sku: item.sku,
                            name: item.name,
                            brand: item.brand,
                            vendor_number: item.vendor_number,
                            product_name: item.product_name,
                            product_type: item.product_type
                        }));

                    resolve(catalogItems);
                },
                error: (error: Error) => {
                    console.error("Error parsing CSV:", error);
                    resolve([]);
                }
            });
        });
    });
}

export async function getCatalogProductTypes(): Promise<Record<string, string[]>> {
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
                    // Agrupar product_type por marca, eliminando duplicados
                    const brandProductTypes = (results.data as CSVItem[]).reduce((acc: Record<string, string[]>, item) => {
                        const { brand, product_type } = item;

                        if (!brand || !product_type) return acc;

                        if (!acc[brand]) {
                            acc[brand] = [];
                        }
                        if (!acc[brand].includes(product_type)) {
                            acc[brand].push(product_type);
                        }
                        return acc;
                    }, {});

                    resolve(brandProductTypes);
                },
                error: (error: Error) => {
                    console.error("Error parsing CSV:", error);
                    resolve({});
                }
            });
        });
    });
}

