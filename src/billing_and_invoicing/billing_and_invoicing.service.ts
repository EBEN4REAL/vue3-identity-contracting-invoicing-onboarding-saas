import config from "../mm.config.json";
import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import {
  AgreementCancelPreviewRead,
  AgreementExtendedRead,
  BillingAddressCreate,
  BillingAddressRead,
  PaginationSchema_InvoiceRead_,
  PaymentIntentRead,
  StripePaymentIntent,
} from "./billing_and_invoicing.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";

class BillingAndInvoicingService extends ClientService {
  client: ClientService;

  constructor() {
    super(`${config.billing_and_invoicing.url}`);
    this.client = new ClientService(`${config.billing_and_invoicing.url}`);
  }

  async getBillingAddress(
    service_consumer_id: string,
  ): Promise<BillingAddressRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/billing-address`,
      null,
      { isShowError: false },
    );
    return response.data;
  }

  async updateBillingAddress(
    service_consumer_id: string,
    billing_address: BillingAddressCreate,
  ): Promise<BillingAddressRead> {
    const response: AxiosResponse = await this.client.patch(
      `/service-consumers/${service_consumer_id}/billing-address`,
      billing_address,
    );
    return response.data;
  }

  async getAgreementBillingDetails(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<AgreementExtendedRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}`,
      null,
      { isShowError: false },
    );
    return response.data;
  }

  async getInvoices(
    service_consumer_id: string,
    agreement_id: string,
    params?: TableRequestParams,
  ): Promise<PaginationSchema_InvoiceRead_> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/invoices`,
      { ...params, agreement_id },
    );
    return response.data;
  }

  async getInvoicePdf(
    service_consumer_id: string,
    invoice_id: string,
  ): Promise<Blob> {
    const response: AxiosResponse = await this.client.getWithConfigs(
      `/service-consumers/${service_consumer_id}/invoices/${invoice_id}/pdf`,
      { responseType: "blob" },
    );
    return response.data;
  }

  async getPayments(
    service_consumer_id: string,
    params: TableRequestParams,
  ): Promise<TableResponse<PaymentIntentRead>> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/payment-intents`,
      params,
    );
    return response.data;
  }

  async getServiceConsumerAgreementCancellationPreview(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<AgreementCancelPreviewRead> {
    const response: AxiosResponse = await this.client.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}/cancel-preview`,
    );
    return response.data;
  }
  async createAgreementCheckoutSession(
    service_provider_id: string,
    agreement_id: string,
  ): Promise<StripePaymentIntent> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_provider_id}/agreements/${agreement_id}/checkout`,
    );
    return response.data;
  }

  async createInvoiceCheckoutSession(
    service_provider_id: string,
    invoice_id: string,
  ): Promise<StripePaymentIntent> {
    const response: AxiosResponse = await this.client.post(
      `/service-consumers/${service_provider_id}/invoices/${invoice_id}/checkout`,
    );
    return response.data;
  }
}

export const billingAndInvoicingService: BillingAndInvoicingService =
  new BillingAndInvoicingService();
