import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createOrRetrieveCustomer } from "@/lib/stripe/adminTask";
import { stripe } from "@/lib/stripe";
import { getURL } from "@/lib/utils";

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Could not find the user");

    const customer = await createOrRetrieveCustomer({
      email: user.email || "",
      uuid: user.id || "",
    });

    if (!customer) throw new Error("No Customer");
    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/dashboard`,
    });

    return NextResponse.json({ url });
  } catch (error) {
    console.log("Error", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
