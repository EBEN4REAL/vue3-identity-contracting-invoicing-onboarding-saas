import { LegalDocumentTypeWithLegalDocumentRead } from "../../../src/organizations/licenses/legal-documents.types";

const legalDocumentTypes: {
  [key: string]: LegalDocumentTypeWithLegalDocumentRead;
} = {
  "001": {
    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    name: "string",
    description: "string",
    legal_documents: [
      {
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        service_consumer_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        service_provider_id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        legal_document_type: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        pdf_filename: "string",
        date_created: "2024-10-06T22:08:43.306Z",
        name: "string",
      },
    ],
  },
};

export default legalDocumentTypes;
