"use client";

import { loadStripe } from "@stripe/stripe-js";

const SubscribeButton = ({ planId }: { planId: string }) => {
  const processSubscription = async (planId: string) => {
    const response = await fetch(`http://localhost:3000/api/subscription/${planId}`);

    const data = await response.json();
    
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);
    await stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return (
    <button onClick={async () => processSubscription(planId)}>
      プランに契約する
    </button>
  );
};

export default SubscribeButton;
