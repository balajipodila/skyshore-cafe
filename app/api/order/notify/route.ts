import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const order = await req.json();
    const { orderId, customerName, customerEmail, customerPhone, mode, items = [], total = 0, paymentMethod = "UPI", outletName = "Visakhapatnam Beach Road" } = order;

    console.log(`[ORDER NOTIFY] Order #${orderId} | ${customerName} | ${customerEmail} | Total: ₹${total} | Items: ${items.length}`);

    // Mock: no external service, no email/SMTP, no SMS, no WhatsApp API
    // Return structured confirmation for UI only
    return NextResponse.json({
      success: true,
      orderId,
      ownerNotification: { sent: false, mock: true, note: "No email sent (mock)" },
      customerConfirmation: {
        email: { sent: false, mock: true, recipient: customerEmail || "customer@example.com" },
        sms: { sent: false, mock: true, recipient: customerPhone },
        whatsapp: { sent: false, mock: true, note: "No WhatsApp API call" },
      },
    });
  } catch (err: any) {
    console.error("[ORDER NOTIFY ERROR]", err);
    return NextResponse.json({ error: "Failed to process order notification" }, { status: 500 });
  }
}
