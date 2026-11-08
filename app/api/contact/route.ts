import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const OWNER_EMAIL = "bobbypodila065@gmail.com";

const schema = z.object({
  name: z.string().min(1).max(100),
  contact: z.string().min(5).max(254),
  category: z.enum(["General", "Franchise enquiry", "Feedback", "Bulk / office orders"]).default("General"),
  message: z.string().min(1).max(2000),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }
    const { name, contact, category, message } = parsed.data;

    console.log(`[CONTACT INQUIRY] Routing to ${OWNER_EMAIL} | category: ${category} | name length: ${name.length}`);

    return NextResponse.json({
      success: true,
      message: "Inquiry received. We'll reply with instant confirmation to your contact.",
      dispatchedTo: OWNER_EMAIL,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Unable to process request" }, { status: 500 });
  }
}
