import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const vehicleId = searchParams.get("vehicleId");
  const cursor = searchParams.get("cursor");
  const productType = searchParams.get("productType");

  if (!vehicleId) {
    return NextResponse.json({ error: "Missing vehicleId" }, { status: 400 });
  }

  const headers: HeadersInit = {
    Authorization: process.env.PUBLIC_WPS ?? "",
  };

  try {
    let url = `https://api.wps-inc.com/vehicles/${vehicleId}/items?page[size]=30`;

    if (cursor) {
      url += `&page[cursor]=${encodeURIComponent(cursor)}`;
    }

    if (productType) {
      const escaped = productType.replace(/&/g, "%26");
      url += `&filter[product_type]=${encodeURIComponent(escaped)}`;
    }

    const response = await fetch(url, { method: "GET", headers });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("API Error:", errorData);
      return NextResponse.json(
        { error: `API responded with status ${response.status}` },
        { status: response.status }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      data: result.data || [],
      meta: {
        cursor: result.meta?.cursor || null,
      },
    });
  } catch (error) {
    console.error("Error fetching vehicle items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
