import { ServiceProviderRead } from "~/iam/iam.types";

export const getServiceProviderName = (
  serviceProviders: ServiceProviderRead[] | null | undefined,
  service_provider_id: string,
): string => {
  if (!serviceProviders) return "-";
  const serviceProviderItem = serviceProviders.find(
    (serviceProvider) => serviceProvider.id === service_provider_id,
  );
  return serviceProviderItem ? serviceProviderItem.name : "-";
};
