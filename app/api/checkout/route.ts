import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: Request) {
  const { items } = await req.json();

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items,
      mode: "payment",
      success_url: `${req.headers.get(
        "origin"
      )}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get("origin")}/cart`,
      shipping_address_collection: {
        allowed_countries: ["IN"], // Add other countries if needed
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "inr",
            },
            display_name: "Free shipping",
          },
        },
      ],
    });

    return NextResponse.json({ id: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}
