import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const OrderItemSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(150),
  price: z.number().min(0).max(5000),
  qty: z.number().int().min(1).max(20),
  size: z.string().max(30).optional(),
});

const schema = z.object({
  orderId: z.string().min(1).max(50),
  customerName: z.string().min(1).max(100),
  customerPhone: z.string().min(10).max(20),
  customerEmail: z.string().email().max(254).optional(),
  mode: z.enum(["pickup", "delivery"]),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().regex(/^\d{6}$/).optional(),
  items: z.array(OrderItemSchema).min(1).max(50),
  total: z.number().min(0).max(10000),
  paymentMethod: z.enum(["UPI", "Card", "COD"]).default("UPI"),
  outletName: z.string().max(150).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid order data" }, { status: 400 });

    const { orderId, total, paymentMethod } = parsed.data;
    console.log(`[ORDER NOTIFY] Order #${orderId} | total ₹${total} | mode: ${parsed.data.mode} | items: ${parsed.data.items.length}`);

    return NextResponse.json({
      success: true,
      orderId,
      ownerNotification: { sent: false, mock: true },
      customerConfirmation: { email: { sent: false, mock: true }, sms: { sent: false, mock: true }, whatsapp: { sent: false, mock: true } },
    });
  } catch {
    return NextResponse.json({ error: "Unable to process order" }, { status: 500 });
  }
}
