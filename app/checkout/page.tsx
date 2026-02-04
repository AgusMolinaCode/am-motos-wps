import { createPreference } from "./_actions/create-preference";
import CheckoutForm from "./CheckoutForm";
import { auth } from "@clerk/nextjs/server";

export default async function CheckoutPage() {
  const { userId } = await auth();
  
  return <CheckoutForm 
    createPreferenceAction={createPreference} 
    clerkUserId={userId || undefined}
  />;
}
