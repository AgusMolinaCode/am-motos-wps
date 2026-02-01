"use server";

import { prisma } from "@/lib/prisma";
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

export async function getCatalog() {
    // Por ahora retorna array vacío -有待实现从PostgreSQL获取目录
    return [];
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
    // Por ahora retorna array vacío -有待实现从PostgreSQL获取二手商品
    return [];
}
