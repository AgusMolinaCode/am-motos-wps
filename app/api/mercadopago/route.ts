import { NextRequest } from 'next/server';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || '',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar que el precio sea válido
    const price = Number(body.price);
    if (isNaN(price) || price <= 0) {
      console.error('Precio inválido recibido:', body.price);
      return new Response(JSON.stringify({ error: 'Precio inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const preferenceData = {
      items: [
        {
          id: body.title.replace(/\s+/g, '-').toLowerCase(),
          title: body.title,
          quantity: Number(body.quantity) || 1,
          unit_price: price,
          currency_id: 'ARS',
        },
      ],
      back_urls: {
        success: 'https://www.am-motos-repuestos.com.ar/payment/success',
        failure: 'https://www.am-motos-repuestos.com.ar/payment/failure',
        pending: 'https://www.am-motos-repuestos.com.ar/payment/pending',
      },
      auto_return: 'approved',
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: preferenceData });

    return new Response(JSON.stringify({ id: result.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Error al crear la preferencia' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}