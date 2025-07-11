/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/service-providers/{service_provider_id}/service-consumers/{service_consumer_id}": {
    /** Retrieves Consumer Details */
    get: operations["service_consumer_read_service_providers__service_provider_id__service_consumers__service_consumer_id__get"];
  };
  "/service-providers/{service_provider_id}/agreement-types/{agreement_type_id}": {
    /** Retrieve an Agreement Type */
    get: operations["agreement_type_get_service_providers__service_provider_id__agreement_types__agreement_type_id__get"];
    /** Updates an Agreement Type */
    patch: operations["update_agreement_type_service_providers__service_provider_id__agreement_types__agreement_type_id__patch"];
  };
  "/service-providers/{service_provider_id}/agreements/{agreement_id}": {
    /** Retrieves an Agreement billing details */
    get: operations["agreement_read_service_providers__service_provider_id__agreements__agreement_id__get"];
  };
  "/service-providers/{service_provider_id}/invoices": {
    /** Retrieves Invoices */
    get: operations["invoices_read_service_providers__service_provider_id__invoices_get"];
  };
  "/service-providers/{service_provider_id}/payment-intents": {
    /** Retrieves PaymentIntents */
    get: operations["payment_intents_read_service_providers__service_provider_id__payment_intents_get"];
  };
  "/service-consumers/{service_consumer_id}/agreements/{agreement_id}": {
    /** Retrieves an Agreement billing details */
    get: operations["agreement_read_service_consumers__service_consumer_id__agreements__agreement_id__get"];
  };
  "/service-consumers/{service_consumer_id}/agreements/{agreement_id}/checkout": {
    /** Creates a checkout to change the payment method for an agreement */
    post: operations["create_agreement_checkout_session_service_consumers__service_consumer_id__agreements__agreement_id__checkout_post"];
  };
  "/service-consumers/{service_consumer_id}/agreements/{agreement_id}/cancel-preview": {
    /** Retrieves the cancellation cost and effective date for an agreement */
    get: operations["get_agreement_cancel_preview_service_consumers__service_consumer_id__agreements__agreement_id__cancel_preview_get"];
  };
  "/service-consumers/{service_consumer_id}/invoices": {
    /** Retrieves Invoices */
    get: operations["invoices_read_service_consumers__service_consumer_id__invoices_get"];
  };
  "/service-consumers/{service_consumer_id}/invoices/{invoice_id}/checkout": {
    /** Creates a checkout for an open invoice */
    post: operations["create_checkout_session_service_consumers__service_consumer_id__invoices__invoice_id__checkout_post"];
  };
  "/service-consumers/{service_consumer_id}/invoices/{invoice_id}/pdf": {
    /** Get the PDF file for an invoice. */
    get: operations["get_invoice_pdf_service_consumers__service_consumer_id__invoices__invoice_id__pdf_get"];
  };
  "/service-consumers/{service_consumer_id}/payment-intents": {
    /** Retrieves PaymentIntents */
    get: operations["payment_intents_read_service_consumers__service_consumer_id__payment_intents_get"];
  };
  "/service-consumers/{service_consumer_id}/billing-address": {
    /** Retrieves the Billing Address of the Service Consumer */
    get: operations["billing_addresses_read_service_consumers__service_consumer_id__billing_address_get"];
    /** Delete a Billing Address for the Service Consumer */
    delete: operations["billing_address_delete_service_consumers__service_consumer_id__billing_address_delete"];
    /** Updates a Billing Address of the Service Consumer */
    patch: operations["update_billing_address_service_consumers__service_consumer_id__billing_address_patch"];
  };
  "/load/{dataset_id}": {
    /**
     * Load Data
     * @description Loads initial dataset in DEBUG / Dev Environment.
     * Not usable for (pre-)production
     * The dataset id corresponds with the datasets in the tests part of the project
     */
    get: operations["load_data_load__dataset_id__get"];
  };
  "/unload/e2e": {
    /** Unload E2E */
    get: operations["unload_e2e_unload_e2e_get"];
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
    /** AgreementBasicRead */
    AgreementBasicRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /**
       * Agreement Type Id
       * Format: uuid
       */
      agreement_type_id: string;
      /**
       * Service Consumer Id
       * Format: uuid
       */
      service_consumer_id: string;
      /** Billing Period Start */
      billing_period_start?: string | null;
      /** Cancelled */
      cancelled: boolean;
    };
    /** AgreementCancelPreviewRead */
    AgreementCancelPreviewRead: {
      price: components["schemas"]["PriceBase"];
      /**
       * Effective Date
       * Format: date-time
       */
      effective_date: string;
    };
    /** AgreementExtendedRead */
    AgreementExtendedRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /**
       * Agreement Type Id
       * Format: uuid
       */
      agreement_type_id: string;
      /**
       * Service Consumer Id
       * Format: uuid
       */
      service_consumer_id: string;
      /** Billing Period Start */
      billing_period_start?: string | null;
      /** Cancelled */
      cancelled: boolean;
      /** Prices */
      prices: components["schemas"]["PriceRead"][];
      /** Invoices */
      invoices: components["schemas"]["InvoiceRead"][];
      /** Payment Intents */
      payment_intents: components["schemas"]["PaymentIntentRead"][];
      agreement_type: components["schemas"]["AgreementTypeRead"];
      /** Service Consumer Name */
      service_consumer_name?: string | null;
      /** Next Billing Due Date */
      next_billing_due_date?: string | null;
      /** Current Cost Per Billing Period Amount */
      current_cost_per_billing_period_amount?: number | null;
      currency?: components["schemas"]["Currency"] | null;
    };
    /**
     * AgreementTypeCategory
     * @enum {string}
     */
    AgreementTypeCategory: "UNKNOWN" | "ACCESS" | "SUBSCRIPTION";
    /** AgreementTypeExtendedRead */
    AgreementTypeExtendedRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      billing_type: components["schemas"]["BillingType"] | null;
      /** Billing Period Length */
      billing_period_length: number | null;
      billing_period_unit: components["schemas"]["BillingPeriodUnit"] | null;
      price?: components["schemas"]["PriceRead"] | null;
      category: components["schemas"]["AgreementTypeCategory"];
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Service Provider Name */
      service_provider_name?: string | null;
      /**
       * Service Provider Id
       * Format: uuid
       */
      service_provider_id: string;
      /** Stripe Product Id */
      stripe_product_id?: string | null;
      /** Agreements */
      agreements: components["schemas"]["AgreementBasicRead"][];
    };
    /** AgreementTypeRead */
    AgreementTypeRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      billing_type: components["schemas"]["BillingType"] | null;
      /** Billing Period Length */
      billing_period_length: number | null;
      billing_period_unit: components["schemas"]["BillingPeriodUnit"] | null;
      price?: components["schemas"]["PriceRead"] | null;
      category: components["schemas"]["AgreementTypeCategory"];
      /** Name */
      name?: string | null;
      /** Description */
      description?: string | null;
      /** Service Provider Name */
      service_provider_name?: string | null;
    };
    /** AgreementTypeUpdate */
    AgreementTypeUpdate: {
      /** Name */
      name?: string | null;
      billing_type?: components["schemas"]["BillingType"] | null;
      /** Billing Period Length */
      billing_period_length?: number | null;
      billing_period_unit?: components["schemas"]["BillingPeriodUnit"] | null;
      price?: components["schemas"]["PriceUpdate"] | null;
      category?: components["schemas"]["AgreementTypeCategory"] | null;
    };
    /** BillingAddressRead */
    BillingAddressRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /**
       * Service Consumer Id
       * Format: uuid
       */
      service_consumer_id: string;
      /** Address Line 1 */
      address_line_1?: string | null;
      /** Address Line 2 */
      address_line_2?: string | null;
      /** Town City */
      town_city?: string | null;
      /** Postal Code */
      postal_code?: string | null;
      /** Country */
      country?: string | null;
    };
    /** BillingAddressUpdate */
    BillingAddressUpdate: {
      /** Address Line 1 */
      address_line_1?: string | null;
      /** Address Line 2 */
      address_line_2?: string | null;
      /** Town City */
      town_city?: string | null;
      /** Postal Code */
      postal_code?: string | null;
      /** Country */
      country?: string | null;
    };
    /**
     * BillingPeriodUnit
     * @enum {string}
     */
    BillingPeriodUnit: "DAY" | "WEEK" | "MONTH" | "YEAR";
    /**
     * BillingType
     * @enum {string}
     */
    BillingType: "FREE" | "ONCE_OFF" | "FLAT_FEE_RECURRING" | "SEAT_BASED_RECURRING" | "USER_BASED_RECURRING" | "TRANSACTION_BASED_RECURRING";
    /**
     * Currency
     * @enum {string}
     */
    Currency: "EUR";
    /** HTTPValidationError */
    HTTPValidationError: {
      /** Detail */
      detail?: components["schemas"]["ValidationError"][];
    };
    /** InvoiceLineItemRead */
    InvoiceLineItemRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Name */
      name: string;
      currency: components["schemas"]["Currency"];
      /** Amount */
      amount: number;
      /**
       * Invoice Id
       * Format: uuid
       */
      invoice_id: string;
      /** Quantity */
      quantity: number;
      /** Total */
      total: number;
    };
    /** InvoiceRead */
    InvoiceRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Billing Period Number */
      billing_period_number: number;
      /**
       * Date
       * Format: date-time
       */
      date: string;
      currency: components["schemas"]["Currency"];
      /** Remaining Amount */
      remaining_amount: number;
      /** Total Amount */
      total_amount: number;
      /** Stripe Payment Intent Id */
      stripe_payment_intent_id: string | null;
      /**
       * Payment Due Date
       * Format: date-time
       */
      payment_due_date: string;
      /**
       * Service Provider Id
       * Format: uuid
       */
      service_provider_id: string;
      /**
       * Service Consumer Id
       * Format: uuid
       */
      service_consumer_id: string;
      status: components["schemas"]["InvoiceStatusEnum"];
      /** Line Items */
      line_items: components["schemas"]["InvoiceLineItemRead"][];
      /** Quaderno Id */
      quaderno_id?: string | null;
      /** Quaderno Pdf */
      quaderno_pdf?: string | null;
      /** Quaderno Invoice Number */
      quaderno_invoice_number?: string | null;
    };
    /**
     * InvoiceStatusEnum
     * @enum {string}
     */
    InvoiceStatusEnum: "OPEN" | "CLOSED";
    /** PaginationSchema[InvoiceRead] */
    PaginationSchema_InvoiceRead_: {
      /** Offset */
      offset: number;
      /** Limit */
      limit: number;
      /** Results */
      results: components["schemas"]["InvoiceRead"][];
      /** Size */
      size: number;
      /** Total */
      total?: number | null;
    };
    /** PaginationSchema[PaymentIntentRead] */
    PaginationSchema_PaymentIntentRead_: {
      /** Offset */
      offset: number;
      /** Limit */
      limit: number;
      /** Results */
      results: components["schemas"]["PaymentIntentRead"][];
      /** Size */
      size: number;
      /** Total */
      total?: number | null;
    };
    /** PaymentIntentRead */
    PaymentIntentRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      /** Invoice Id */
      invoice_id?: string | null;
      /** Journal Id */
      journal_id?: string | null;
      /**
       * Service Provider Id
       * Format: uuid
       */
      service_provider_id: string;
      /**
       * Service Consumer Id
       * Format: uuid
       */
      service_consumer_id: string;
      /** Service Consumer Name */
      service_consumer_name?: string | null;
      currency: components["schemas"]["Currency"];
      payment_method: components["schemas"]["PaymentsEnum"];
      /**
       * Date
       * Format: date-time
       */
      date: string;
      /** Amount */
      amount: number;
      /** From Credit Balance */
      from_credit_balance: boolean;
      /** Succeeded */
      succeeded: boolean;
      /** Failure Reason */
      failure_reason?: string | null;
      /** Stripe Payment Intent Id */
      stripe_payment_intent_id?: string | null;
    };
    /**
     * PaymentsEnum
     * @enum {string}
     */
    PaymentsEnum: "STRIPE";
    /** PriceBase */
    PriceBase: {
      /** Amount */
      amount: number;
      currency: components["schemas"]["Currency"];
      /** Description */
      description?: string | null;
      /**
       * Agreement Type Id
       * Format: uuid
       */
      agreement_type_id: string;
    };
    /** PriceRead */
    PriceRead: {
      /** Amount */
      amount: number;
      currency: components["schemas"]["Currency"];
      /** Description */
      description?: string | null;
      /**
       * Agreement Type Id
       * Format: uuid
       */
      agreement_type_id: string;
      /**
       * Id
       * Format: uuid
       */
      id: string;
    };
    /** PriceUpdate */
    PriceUpdate: {
      /** Amount */
      amount: number;
      currency: components["schemas"]["Currency"];
      /** Description */
      description?: string | null;
    };
    /** ServiceConsumerRead */
    ServiceConsumerRead: {
      /**
       * Id
       * Format: uuid
       */
      id: string;
      billing_address?: components["schemas"]["BillingAddressRead"] | null;
      /** Total Revenue */
      total_revenue?: number | null;
      /** Tax Number */
      tax_number?: string | null;
      /** Tax Country */
      tax_country?: string | null;
    };
    /** StripeClientSecret */
    StripeClientSecret: {
      /** Client Secret */
      client_secret: string;
    };
    /** ValidationError */
    ValidationError: {
      /** Location */
      loc: (string | number)[];
      /** Message */
      msg: string;
      /** Error Type */
      type: string;
    };
  };
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export interface operations {

  /** Retrieves Consumer Details */
  service_consumer_read_service_providers__service_provider_id__service_consumers__service_consumer_id__get: {
    parameters: {
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
        /** @description ID of the Service Provider */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description Consumer Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["ServiceConsumerRead"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Not Found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieve an Agreement Type */
  agreement_type_get_service_providers__service_provider_id__agreement_types__agreement_type_id__get: {
    parameters: {
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
        /** @description ID of the Agreement Type */
        agreement_type_id: string;
      };
    };
    responses: {
      /** @description Agreement Type Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["AgreementTypeExtendedRead"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Not Found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Updates an Agreement Type */
  update_agreement_type_service_providers__service_provider_id__agreement_types__agreement_type_id__patch: {
    parameters: {
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
        /** @description ID of the Agreement Type */
        agreement_type_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["AgreementTypeUpdate"];
      };
    };
    responses: {
      /** @description Agreement Type Updated */
      200: {
        content: {
          "application/json": components["schemas"]["AgreementTypeRead"];
        };
      };
      /** @description You can't update Agreement type which already has Agreements */
      400: {
        content: never;
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Not Found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves an Agreement billing details */
  agreement_read_service_providers__service_provider_id__agreements__agreement_id__get: {
    parameters: {
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
        /** @description ID of the Agreement */
        agreement_id: string;
      };
    };
    responses: {
      /** @description Agreement Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["AgreementExtendedRead"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Missing Agreement */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves Invoices */
  invoices_read_service_providers__service_provider_id__invoices_get: {
    parameters: {
      query?: {
        /** @description ID of the Service consumer */
        service_consumer_id?: string | null;
        /** @description A search query is used to search Invoices using (total_amount, remaining_amount) */
        query?: number | null;
        /** @description Offset */
        offset?: number;
        /** @description Max number of Invoices to return */
        limit?: number;
        /** @description ID of the Agreement */
        agreement_id?: string | null;
        /** @description Attribute used to sort the Invoices: ['invoice.date', 'invoice.payment_due_date'] */
        sort?: string | null;
      };
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
      };
    };
    responses: {
      /** @description Invoices Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["PaginationSchema_InvoiceRead_"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves PaymentIntents */
  payment_intents_read_service_providers__service_provider_id__payment_intents_get: {
    parameters: {
      query?: {
        /** @description ID of the Service Consumer */
        service_consumer_id?: string | null;
        /** @description ID of the Agreement */
        agreement_id?: string | null;
        /** @description Offset */
        offset?: number;
        /** @description Max number of PaymentIntents to return */
        limit?: number;
        /** @description Attribute used to sort Payment Intents: ['date'] */
        sort?: string | null;
      };
      path: {
        /** @description ID of the Service Provider */
        service_provider_id: string;
      };
    };
    responses: {
      /** @description PaymentIntents Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["PaginationSchema_PaymentIntentRead_"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves an Agreement billing details */
  agreement_read_service_consumers__service_consumer_id__agreements__agreement_id__get: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
        /** @description ID of the Agreement */
        agreement_id: string;
      };
    };
    responses: {
      /** @description Agreement Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["AgreementExtendedRead"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Missing Agreement */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Creates a checkout to change the payment method for an agreement */
  create_agreement_checkout_session_service_consumers__service_consumer_id__agreements__agreement_id__checkout_post: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
        /** @description ID of the agreement */
        agreement_id: string;
      };
    };
    responses: {
      /** @description Manual checkout created */
      201: {
        content: {
          "application/json": components["schemas"]["StripeClientSecret"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Error calling on Stripe API */
      500: {
        content: never;
      };
    };
  };
  /** Retrieves the cancellation cost and effective date for an agreement */
  get_agreement_cancel_preview_service_consumers__service_consumer_id__agreements__agreement_id__cancel_preview_get: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
        /** @description ID of the Agreement */
        agreement_id: string;
      };
    };
    responses: {
      /** @description Cancellation cost preview retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["AgreementCancelPreviewRead"];
        };
      };
      /** @description Invalid Agreement */
      400: {
        content: never;
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Missing Agreement */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves Invoices */
  invoices_read_service_consumers__service_consumer_id__invoices_get: {
    parameters: {
      query?: {
        /** @description A search query is used to search Invoices using (total_amount, remaining_amount) */
        query?: number | null;
        /** @description Offset */
        offset?: number;
        /** @description Max number of Invoices to return */
        limit?: number;
        /** @description ID of the Agreement */
        agreement_id?: string | null;
        /** @description Attribute used to sort the Invoices: ['invoice.date', 'invoice.payment_due_date'] */
        sort?: string | null;
      };
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description Invoices Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["PaginationSchema_InvoiceRead_"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Creates a checkout for an open invoice */
  create_checkout_session_service_consumers__service_consumer_id__invoices__invoice_id__checkout_post: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
        /** @description ID of the invoice */
        invoice_id: string;
      };
    };
    responses: {
      /** @description Manual checkout created */
      201: {
        content: {
          "application/json": components["schemas"]["StripeClientSecret"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Error calling on Stripe API */
      500: {
        content: never;
      };
    };
  };
  /** Get the PDF file for an invoice. */
  get_invoice_pdf_service_consumers__service_consumer_id__invoices__invoice_id__pdf_get: {
    parameters: {
      path: {
        /** @description ID of the Invoice */
        invoice_id: string;
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description Invoice PDF retrieved */
      200: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Invoice PDF Not Found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
      /** @description Quaderno Service Exception */
      503: {
        content: never;
      };
    };
  };
  /** Retrieves PaymentIntents */
  payment_intents_read_service_consumers__service_consumer_id__payment_intents_get: {
    parameters: {
      query?: {
        /** @description ID of the Agreement */
        agreement_id?: string;
        /** @description ID of the Service Provider */
        service_provider_id?: string | null;
        /** @description Offset */
        offset?: number;
        /** @description Max number of PaymentIntents to return */
        limit?: number;
        /** @description Attribute used to sort Payment Intents: ['date'] */
        sort?: string | null;
      };
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description PaymentIntents Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["PaginationSchema_PaymentIntentRead_"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Retrieves the Billing Address of the Service Consumer */
  billing_addresses_read_service_consumers__service_consumer_id__billing_address_get: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description Billing addresses Retrieved */
      200: {
        content: {
          "application/json": components["schemas"]["BillingAddressRead"];
        };
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Billing addresses not found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Delete a Billing Address for the Service Consumer */
  billing_address_delete_service_consumers__service_consumer_id__billing_address_delete: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    responses: {
      /** @description Billing Address Deleted */
      204: {
        content: never;
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Billing Address or Service Consumer not found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Updates a Billing Address of the Service Consumer */
  update_billing_address_service_consumers__service_consumer_id__billing_address_patch: {
    parameters: {
      path: {
        /** @description ID of the Service Consumer */
        service_consumer_id: string;
      };
    };
    requestBody: {
      content: {
        "application/json": components["schemas"]["BillingAddressUpdate"];
      };
    };
    responses: {
      /** @description Billing Address Updated */
      200: {
        content: {
          "application/json": components["schemas"]["BillingAddressRead"];
        };
      };
      /** @description Invalid input data */
      400: {
        content: never;
      };
      /** @description Unauthorized */
      401: {
        content: never;
      };
      /** @description Forbidden */
      403: {
        content: never;
      };
      /** @description Billing Address not found */
      404: {
        content: never;
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /**
   * Load Data
   * @description Loads initial dataset in DEBUG / Dev Environment.
   * Not usable for (pre-)production
   * The dataset id corresponds with the datasets in the tests part of the project
   */
  load_data_load__dataset_id__get: {
    parameters: {
      path: {
        dataset_id: string;
      };
    };
    responses: {
      /** @description Successful Response */
      201: {
        content: {
          "application/json": unknown;
        };
      };
      /** @description Validation Error */
      422: {
        content: {
          "application/json": components["schemas"]["HTTPValidationError"];
        };
      };
    };
  };
  /** Unload E2E */
  unload_e2e_unload_e2e_get: {
    responses: {
      /** @description Successful Response */
      204: {
        content: never;
      };
    };
  };
}
