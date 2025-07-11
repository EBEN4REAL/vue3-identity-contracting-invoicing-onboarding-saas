import { InvoiceRead } from "../../../src/billing_and_invoicing/billing_and_invoicing.types";
export const invoices: {
  [key: string]: InvoiceRead;
} = {
  "001": {
    id: "Invoice001",
    billing_period_number: 0,
    date: "2024-07-30 12:17:36.230",
    currency: "EUR",
    remaining_amount: 0,
    total_amount: 50,
    stripe_payment_intent_id: null,
    payment_due_date: "2024-07-30 12:17:36.230",
    service_provider_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    service_consumer_id: "4a6f01d0-f3c6-4923-ad98-112d6d97355b",
    status: "OPEN",
    quaderno_invoice_number: "Invoice001",
  },
};
