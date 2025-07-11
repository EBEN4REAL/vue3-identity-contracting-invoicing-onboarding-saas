import { TableResponse } from "../../../../src/mm_ui_kit/src/types/table.types";
import {
  LegalDocumentRead,
  LegalDocumentTypePdfPreSignUrl,
} from "../../../../src/organizations/licenses/legal-documents.types";

export const documents: {
  [key: string]: TableResponse<LegalDocumentRead>;
} = {
  "001": {
    offset: 0,
    limit: 0,
    results: [
      {
        id: "dbdbb2e6-b590-48d2-b171-f13e4afc6af9",
        service_consumer_id: "00000000-0000-0000-0002-000000000001",
        service_provider_id: "00000000-0000-0000-0002-000000000001",
        legal_document_type: "4130255b-1d38-41ac-be63-e77d6ef4d076",
        pdf_filename: "doc name",
        name: "doc name",
        date_created: "",
      },
    ],
    size: 1,
    total: 1,
  },
};

export const documentUrl: LegalDocumentTypePdfPreSignUrl = {
  pdf_url: "cucumber/downloads/testDocDownload.html",
};
