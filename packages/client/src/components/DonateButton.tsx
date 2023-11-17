import Button from "@mui/material/Button";
import { loadStripe } from "@stripe/stripe-js";

export const DonationButton = () => {
  if (!import.meta.env.VITE_APP_STRIPE_PK) {
    return <></>;
  }

  const stripePromise = loadStripe(import.meta.env.VITE_APP_STRIPE_PK);

  const handleDonationClick = async () => {
    const stripe = await stripePromise;
    stripe!
      .redirectToCheckout({
        lineItems: [
          { price: import.meta.env.VITE_APP_STRIPE_PRODUCT_ID, quantity: 1 },
        ],
        mode: "payment",
        successUrl: window.location.protocol + "//team-tools.mattvieira.ca",
        cancelUrl: window.location.protocol + "//team-tools.mattvieira.ca",
        submitType: "donate",
      })
      .then(function (result) {
        if (result.error) {
          console.log(result);
        }
      });
  };

  return (
    <Button color="secondary" variant="contained" onClick={handleDonationClick}>
      Donate
    </Button>
  );
};
