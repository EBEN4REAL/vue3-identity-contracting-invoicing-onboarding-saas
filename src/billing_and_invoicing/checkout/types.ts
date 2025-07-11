import { legalDocumentsService } from "~/service-providers/legal-documents.service";
import { policiesService } from "~/service-providers/policies.service";
import { billingAndInvoicingService } from "../billing_and_invoicing.service";
import { policiesClientService } from "~/policies/policies.client.service";
import { contractingClientService } from "~/contracting/contracting.client.service";
import { billingAndInvoicingClientService } from "../billing_and_invoicing.client.service";

export enum EntityType {
  SC = "sc",
  SP = "sp",
}
export type PoliciesServiceType =
  | typeof policiesService
  | typeof policiesClientService;
export type ContractingServiceType =
  | typeof legalDocumentsService
  | typeof contractingClientService;
export type BillingServiceType =
  | typeof billingAndInvoicingService
  | typeof billingAndInvoicingClientService;
