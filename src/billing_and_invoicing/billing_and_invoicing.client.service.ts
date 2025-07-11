import { OAuthClientService } from "~/common/services/oauth.client.service";
import config from "~/mm.config.json";
import {
  AgreementExtendedRead,
  BillingAddressCreate,
  BillingAddressRead,
  StripePaymentIntent,
} from "~/billing_and_invoicing/billing_and_invoicing.types";
import { AxiosResponse } from "axios";

class BillingAndInvoicingClientService extends OAuthClientService {
  constructor() {
    super(`${config.billing_and_invoicing.url}`);
  }

  async getAgreementBillingDetails(
    service_consumer_id: string,
    agreement_id: string,
  ): Promise<AgreementExtendedRead> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-consumers/${service_consumer_id}/agreements/${agreement_id}`,
    );
    return response.data;
  }

  async getBillingAddress(
    service_consumer_id: string,
  ): Promise<BillingAddressRead> {
    const response: AxiosResponse = await this.axiosInstance.get(
      `/service-consumers/${service_consumer_id}/billing-address`,
    );
    return response.data;
  }

  async createAgreementCheckoutSession(
    service_provider_id: string,
    agreement_id: string,
  ): Promise<StripePaymentIntent> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/service-consumers/${service_provider_id}/agreements/${agreement_id}/checkout`,
    );
    return response.data;
  }

  async createInvoiceCheckoutSession(
    service_provider_id: string,
    invoice_id: string,
  ): Promise<StripePaymentIntent> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/service-consumers/${service_provider_id}/invoices/${invoice_id}/checkout`,
    );
    return response.data;
  }

  async updateBillingAddress(
    service_consumer_id: string,
    billing_address: BillingAddressCreate,
  ): Promise<BillingAddressRead> {
    const response: AxiosResponse = await this.axiosInstance.patch(
      `/service-consumers/${service_consumer_id}/billing-address`,
      billing_address,
    );
    return response.data;
  }
}

export const billingAndInvoicingClientService: BillingAndInvoicingClientService =
  new BillingAndInvoicingClientService();
