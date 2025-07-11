import { InvoiceRead } from "~/billing_and_invoicing/billing_and_invoicing.schemas.types";

export const getBadgeColor = (invoice: InvoiceRead): string =>
  invoice.status === "OPEN" ? "Warning" : "Active";

export const getBadgeLabel = (invoice: InvoiceRead): string =>
  invoice.status === "OPEN" ? "Open" : "Paid";
