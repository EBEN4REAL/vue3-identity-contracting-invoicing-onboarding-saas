//to be deleted after
export const handleEnums = (item) => {
  switch (item.industry) {
    case "SAA":
      item.industry = "SAAS";
      break;
    case "COM":
      item.industry = "COMMERCE";
      break;
    case "HEA":
      item.industry = "HEALTHCARE";
      break;
    case "FIN":
      item.industry = "FINANCIAL_SERVICES";
      break;
    case "DIG":
      item.industry = "DIGITAL_PRODUCTS";
      break;
    case "OTH":
      item.industry = "OTHER";
      break;
    default:
      break;
  }
  switch (item.job_role) {
    case "MAR":
      item.job_role = "MARKETING";
      break;
    case "SAL":
      item.job_role = "SALES";
      break;
    case "DEV":
      item.job_role = "DEVELOPMENT";
      break;
    case "PRO":
      item.job_role = "PRODUCT";
      break;
    case "CUS":
      item.job_role = "CUSTOMER_SUPPORT";
      break;
    case "EXE":
      item.job_role = "EXECUTIVE_MANAGEMENT";
      break;
    case "FIN":
      item.job_role = "FINANCE";
      break;
    default:
      break;
  }
};
