import config from "~/mm.config.json";

// TODO: Implement vue-stripe plugin once vue3 support is available
const stripe = Stripe(config.stripe_publishable_key);

export const displayPaymentStatus = async () => {
  // get "payment_intent_client_secret" from local storage and store it in clientSecret (this is set in router middleware)
  const clientSecret = localStorage.getItem("payment_intent_client_secret");
  const setupIntentClientSecret = localStorage.getItem(
    "setup_intent_client_secret",
  );

  // remove item from local storage
  localStorage.removeItem("payment_intent_client_secret");
  localStorage.removeItem("setup_intent_client_secret");
  localStorage.removeItem("license_id");

  if (!clientSecret && !setupIntentClientSecret) {
    return;
  }

  let status = "error";
  if (clientSecret) {
    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);
    status = paymentIntent.status;
  } else if (setupIntentClientSecret) {
    const { setupIntent } = await stripe.retrieveSetupIntent(
      setupIntentClientSecret,
    );
    status = setupIntent.status;
  }

  switch (status) {
    case "succeeded":
      return "succeeded";
    case "processing":
      return "processing";
    case "requires_payment_method":
      return "error";
    default:
      return "error";
  }
};
