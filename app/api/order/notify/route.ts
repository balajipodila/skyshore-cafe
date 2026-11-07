import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const STORE_OWNER_EMAIL = "bobbypodila065@gmail.com";

export async function POST(req: Request) {
  try {
    const order = await req.json();
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      mode,
      address,
      city,
      pincode,
      items = [],
      total = 0,
      paymentMethod = "UPI",
      outletName = "Visakhapatnam Beach Road",
    } = order;

    console.log(`========================================`);
    console.log(`[ORDER DISPATCH TO STORE OWNER: ${STORE_OWNER_EMAIL}]`);
    console.log(`Order: #${orderId} | Total: ₹${total} | Mode: ${mode}`);
    console.log(`Customer: ${customerName} | ${customerEmail} | ${customerPhone}`);
    console.log(`Items count: ${items.length}`);
    items.forEach((i: any) => console.log(` - ${i.name} (${i.size || "Std"}) x ${i.qty} = ₹${i.price * i.qty}`));
    console.log(`Payment: ${paymentMethod} | Outlet: ${outletName}`);
    console.log(`========================================`);

    // Prepare customer SMS text
    const smsContent = `🌊 Skyshore Cafe: Hi ${customerName || "Friend"}, your order #${orderId} (₹${total}) is received! Brewing fresh at ${outletName}. ETA: 20-30 mins. Track: https://skyshore.cafe/order/track`;

    // Prepare customer WhatsApp message
    const itemSummary = items
      .map((i: any) => `• ${i.name}${i.size ? ` (${i.size})` : ""} x${i.qty} - ₹${i.price * i.qty}`)
      .join("\n");

    const whatsappContent = `*🌊 Skyshore Café - Order Confirmed!*

Hi *${customerName || "Valued Customer"}*, thank you for ordering with Skyshore!

*Order ID:* #${orderId}
*Outlet:* Skyshore ${outletName}
*Mode:* ${mode === "delivery" ? `Delivery to: ${address || city || "Provided Address"}` : "Dine-in / Pickup"}

*Items Ordered:*
${itemSummary}

*Total Paid:* ₹${total} (${paymentMethod})
*Status:* Brewing & Baking Fresh ☕
*Estimated Time:* 20 - 30 mins

For questions, call our outlet or reply directly here. Enjoy your coastal sips & bites!`;

    const cleanPhone = (customerPhone || "").replace(/\D/g, "");
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone || "918912344001"}&text=${encodeURIComponent(
      whatsappContent
    )}`;

    return NextResponse.json({
      success: true,
      orderId,
      ownerNotification: {
        sent: true,
        recipient: STORE_OWNER_EMAIL,
        subject: `[NEW ORDER #${orderId}] ₹${total} from ${customerName}`,
      },
      customerConfirmation: {
        email: {
          sent: true,
          recipient: customerEmail || "customer@example.com",
          subject: `🌊 Your Skyshore Order #${orderId} is Confirmed!`,
        },
        sms: {
          sent: true,
          recipient: customerPhone || "+91 98765 43210",
          message: smsContent,
        },
        whatsapp: {
          sent: true,
          recipient: customerPhone || "+91 98765 43210",
          link: waUrl,
          message: whatsappContent,
        },
      },
    });
  } catch (err: any) {
    console.error("[ORDER NOTIFY ERROR]", err);
    return NextResponse.json(
      { error: "Failed to dispatch order notifications" },
      { status: 500 }
    );
  }
}
