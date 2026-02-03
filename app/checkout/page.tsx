import { createPreference } from "./_actions/create-preference";
import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
  // El Server Component pasa la Server Action al Client Component
  return <CheckoutForm createPreferenceAction={createPreference} />;
}
