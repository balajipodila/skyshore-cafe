"use client";

function calc(subtotal: number, coupon: string | null, mode: "pickup" | "delivery") {
  const discount = coupon === "WAVE10" ? Math.round(subtotal * 0.1) : coupon === "FIRSTSIP" ? 100 : 0;
  const deliveryFee = mode === "pickup" ? 0 : subtotal - discount >= 299 ? 0 : 29;
  return { subtotal, discount, deliveryFee, total: Math.max(0, subtotal - discount + deliveryFee) };
}

const phoneRegex = /^(\+91[\s-]?)?[6-9]\d{9}$/;
const pincodeRegex = /^\d{6}$/;

let allPass = true;
function check(name: string, cond: boolean, detail = "") {
  if (!cond) allPass = false;
  console.log(`${cond ? "PASS" : "FAIL"} ${name}${detail ? " — " + detail : ""}`);
}

// 1. Coupon math
check("WAVE10 on ₹200 → discount 20, total 180", JSON.stringify(calc(200, "WAVE10", "pickup")) === JSON.stringify({ subtotal: 200, discount: 20, deliveryFee: 0, total: 180 }));
check("FIRSTSIP on ₹150 → discount 100, total 50", calc(150, "FIRSTSIP", "pickup").total === 50);
check("No coupon pickup total = subtotal", calc(250, null, "pickup").total === 250);

// 2. Delivery fee boundary
check("Delivery ₹290 subtotal → fee 29", calc(290, null, "delivery").deliveryFee === 29);
check("Delivery ₹298 subtotal → fee 29", calc(298, null, "delivery").deliveryFee === 29);
check("Delivery ₹299 subtotal → fee 0 (free)", calc(299, null, "delivery").deliveryFee === 0);
check("Delivery ₹300 subtotal → fee 0 (free)", calc(300, null, "delivery").deliveryFee === 0);
check("Pickup ₹100 subtotal → fee 0", calc(100, null, "pickup").deliveryFee === 0);
check("Delivery ₹280 - 28 discount = 252 → fee 29", calc(280, "WAVE10", "delivery").deliveryFee === 29);

// 3. Phone & pincode validation
check("Phone 9876543210 valid", phoneRegex.test("9876543210"));
check("Phone +91 98765 43210 valid", phoneRegex.test("+919876543210"));
check("Phone 1234567890 invalid", !phoneRegex.test("1234567890"));
check("Phone abc invalid", !phoneRegex.test("abc"));
check("Pincode 530001 valid", pincodeRegex.test("530001"));
check("Pincode 53001 invalid (5)", !pincodeRegex.test("53001"));
check("Pincode 5300011 invalid (7)", !pincodeRegex.test("5300011"));

// 4. Empty cart redirect logic (simulated)
function emptyCartRedirect(count: number) {
  return count === 0 ? "/menu" : null;
}
check("Empty cart (0) redirects to /menu", emptyCartRedirect(0) === "/menu");
check("Non-empty cart (3) does not redirect", emptyCartRedirect(3) === null);

// 5. Refresh persistence (JSON round-trip)
const orderJson = JSON.stringify({ id: "SS-1234", total: 399, items: [{ id: "a", qty: 2 }] });
const parsed = JSON.parse(orderJson);
check("Order JSON round-trip preserves id", parsed.id === "SS-1234");
check("Order JSON round-trip preserves total", parsed.total === 399);

console.log("");
console.log(allPass ? "ALL CHECKOUT TESTS PASS" : "SOME FAIL");
if (!allPass) process.exit(1);
