import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import StripeCheckOutForm from "./StripeCheckOutForm";

const stripeKey = import.meta.env.VITE_STRIPE_PAYMENT || "";
if (!stripeKey) {
    console.error("Stripe key is missing in .env file!");
}
const stripePromise = loadStripe(stripeKey);
const PaymentPage = () => {
    return (
        <Elements stripe={stripePromise}>
            <StripeCheckOutForm></StripeCheckOutForm>
        </Elements>
    );
};
export default PaymentPage;