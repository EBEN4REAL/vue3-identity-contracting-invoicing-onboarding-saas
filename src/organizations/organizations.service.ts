import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import { authService } from "~/auth/auth.service";
import config from "../mm.config.json";
import {
  MetricsChart,
  OrganizationGroupCreate,
  OrganizationGroupRead,
  OrganizationGroupUpdate,
  OrganizationMetrics,
  OrganizationRead,
  OrganizationUnitCreate,
  OrganizationUnitRead,
  OrganizationUnitReadWithUsers,
  OrganizationUnitUpdate,
  OrganizationUpdate,
  OrganizationUserRead,
  OrganizationUsersCreate,
  OrganizationUserUpdate,
  PaginationSchema_OrganizationUserRead_,
  SubOrganizationCreate,
  UserIdNameSchema,
  ServiceProviderRead,
  LoginAttemptRead,
  OrganizationOIDCCreate,
  OrganizationOIDCRead,
  OrganizationUserImportRead,
  OrganizationUserStatusUpdate,
} from "~/iam/iam.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { GetServiceProvidersRequest } from "~/service-providers/service-providers.service";
import { handleEnums } from "~/users/handleEnums";
import { AttributeSetRead } from "~/onboarding/onboarding.types";
import { reactive } from "vue";

export type GetOrganizationsRequest = {
  offset?: string;
  limit?: string;
  sort?: string;
  query?: string;
};

class OrganizationsService {
  client: ClientService;

  state: {
    importOrganizationUsersStatus: OrganizationUserImportRead | null;
  };

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam/organizations`);
    this.state = reactive({
      importOrganizationUsersStatus: null,
    });
  }

  async getOrganizations(
    getOrganizationsRequest: GetOrganizationsRequest,
  ): Promise<TableResponse<OrganizationRead> | null> {
    const urlParams: string = new URLSearchParams(
      getOrganizationsRequest,
    ).toString();
    const url: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(url);

    return response.data;
  }

  async getServiceProvidersByOrganization(
    organization_id: string,
    serviceProviderIds: string[],
  ): Promise<ServiceProviderRead[]> {
    const queryParams: string = serviceProviderIds
      .map(
        (serviceProviderId: string) =>
          `service_provider_id=${encodeURIComponent(serviceProviderId)}`,
      )
      .join("&");
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/service-providers?${queryParams}`,
    );

    return response.data;
  }

  async resetUserPassword(
    userId: string,
    organizationId: string,
  ): Promise<string> {
    const url = `/${organizationId}/users/${userId}/password-reset`;
    const response: AxiosResponse = await this.client.post(url);

    return response.data;
  }

  async resetUserTOTP(userId: string, organizationId: string): Promise<void> {
    const url = `/${organizationId}/users/${userId}/totp`;
    await this.client.delete(url);
  }

  async getOrganizationGroups(
    organizationId: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationGroupRead>> {
    const urlParams: string = new URLSearchParams(params).toString();
    const queryString: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/groups${queryString}`,
    );

    return response.data;
  }

  async getOrganizationGroup(
    groupId: string,
    organizationId: string,
  ): Promise<OrganizationGroupRead> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/groups/${groupId}`,
    );

    return response.data;
  }

  async getOrganizationUserGroups(
    organizationId: string,
    userId: string,
    params?: GetServiceProvidersRequest,
  ): Promise<TableResponse<OrganizationGroupRead>> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/users/${userId}/groups`,
      params,
    );

    return response.data;
  }

  async createOrganizationGroup(
    organization_group_create: OrganizationGroupCreate,
  ): Promise<OrganizationGroupRead> {
    const userProfile = await authService.getProfile();

    const org_id = userProfile?.org;
    const response: AxiosResponse = await this.client.post(
      `/${org_id}/groups`,
      organization_group_create,
    );

    return response.data;
  }

  async getOrganizationUsers(
    organizationId: string,
    params?: GetServiceProvidersRequest,
  ): Promise<TableResponse<OrganizationUserRead>> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/users`,
      params,
    );
    //to be deleted after
    (response.data as TableResponse<OrganizationUserRead>)?.results.forEach(
      (item) => {
        handleEnums(item);
      },
    );
    return response.data;
  }

  async getOrganizationUnitUsers(
    organization_id: string,
    organization_unit_id: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationUserRead>> {
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/users?organization_unit_id=${organization_unit_id}`,
      params,
    );

    return response.data;
  }

  async createOrganizationUsers(
    organizationId: string,
    organizationUsers: OrganizationUsersCreate,
  ): Promise<OrganizationUserRead[]> {
    const accessToken: string | null = await authService.getAccessToken();

    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/users`,
      organizationUsers,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  }

  async updateOrganizationGroup(
    organizationGroup: OrganizationGroupUpdate,
    organizationId: string,
    groupId: string,
  ): Promise<OrganizationGroupRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${organizationId}/groups/${groupId}`,
      organizationGroup,
    );

    return response.data;
  }

  async deleteOrganizationGroup(
    organization_group_id: string,
    organization_id: string,
  ): Promise<OrganizationGroupRead> {
    const response: AxiosResponse = await this.client.delete(
      `/${organization_id}/groups/${organization_group_id}`,
    );

    return response.data;
  }

  async getOrganizationMetrics(
    organizationId: string,
  ): Promise<OrganizationMetrics> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/metrics`,
    );

    return response.data;
  }

  async getOrganizationMetricsShared(
    metrics: string,
    organizationId: string,
    fromDate: string,
    untilDate: string,
  ): Promise<MetricsChart> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/metrics/${metrics}?from_date=${fromDate}&until_date=${untilDate}`,
    );

    return response.data;
  }

  async getOrganizationMetricsActiveUsers(
    organizationId: string,
    fromDate: string,
    untilDate: string,
  ): Promise<MetricsChart> {
    return this.getOrganizationMetricsShared(
      "active-users",
      organizationId,
      fromDate,
      untilDate,
    );
  }

  async getOrganizationSignups(
    organizationId: string,
    fromDate: string,
    untilDate: string,
  ): Promise<MetricsChart> {
    return this.getOrganizationMetricsShared(
      "signups",
      organizationId,
      fromDate,
      untilDate,
    );
  }

  async getOrganizationMetricsFailedLogins(
    organizationId: string,
    fromDate: string,
    untilDate: string,
  ): Promise<MetricsChart> {
    return this.getOrganizationMetricsShared(
      "failed-logins",
      organizationId,
      fromDate,
      untilDate,
    );
  }

  async getOrganizationUser(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/users/${userId}`,
    );
    //to be deleted after
    handleEnums(response?.data);
    return response.data;
  }

  async updateOrganizationUser(
    organizationId: string,
    userId: string,
    organizationUserUpdate: OrganizationUserUpdate,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${organizationId}/users/${userId}`,
      organizationUserUpdate,
    );
    //to be deleted after
    handleEnums(response?.data);
    return response.data;
  }

  async updateOrganizationUserEnable(
    organizationId: string,
    organizationUserId: string,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.client.put(
      `/${organizationId}/users/${organizationUserId}/enable`,
    );

    return response.data;
  }

  async updateOrganizationUserDisable(
    organizationId: string,
    organizationUserId: string,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.client.put(
      `/${organizationId}/users/${organizationUserId}/disable`,
    );

    return response.data;
  }

  async deleteOrganizationUser(
    organizationId: string,
    userId: string,
  ): Promise<OrganizationUserRead> {
    const response: AxiosResponse = await this.client.delete(
      `/${organizationId}/users/${userId}`,
    );
    return response.data;
  }

  async getOrganization(organizationId: string): Promise<OrganizationRead> {
    const response = await this.client
      .get(`/${organizationId}`)
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          return;
        }
      });
    //to be deleted after
    if (response?.data) {
      handleEnums(response?.data);
    }
    return response?.data;
  }

  async getOrganizationUnits(
    organizationId: string,
  ): Promise<OrganizationUnitRead[]> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/units`,
    );
    return response.data;
  }

  async createOrganizationUnit(
    organizationId: string,
    data: OrganizationUnitCreate,
  ): Promise<OrganizationUnitRead> {
    try {
      const response: AxiosResponse = await this.client.post(
        `/${organizationId}/units`,
        data,
      );

      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getOrganizationUnit(
    organizationId: string,
    unitId: string,
  ): Promise<OrganizationUnitReadWithUsers> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/units/${unitId}`,
    );
    //to be deleted after
    (response.data as OrganizationUnitReadWithUsers).users?.forEach((user) => {
      handleEnums(user);
    });
    return response.data;
  }

  async updateOrganizationUnit(
    organizationId: string,
    unitId: string,
    data: OrganizationUnitUpdate,
  ): Promise<OrganizationUnitRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${organizationId}/units/${unitId}`,
      data,
    );

    return response?.data;
  }

  async deleteOrganizationUnit(
    organizationId: string,
    unitId: string,
  ): Promise<void> {
    await this.client.delete(`/${organizationId}/units/${unitId}`);
  }

  async deleteOrganization(
    organizationId: string,
    code?: string,
    replacement_organization_id?: string,
  ) {
    const params: Record<string, string> = {};
    if (replacement_organization_id) {
      params.replacement_organization_id = replacement_organization_id;
    }
    if (code) {
      params.code = code;
    }
    return await this.client.delete(`/${organizationId}`, { params });
  }

  async deleteUserFromOrganizationUnit(
    organizationId: string,
    unitId: string,
    organizationUserId: string,
  ): Promise<void> {
    await this.client.delete(
      `/${organizationId}/units/${unitId}/organization_users/${organizationUserId}`,
    );
  }
  async updateOrganization(
    organizationId: string,
    organizationUpdate: OrganizationUpdate,
  ): Promise<OrganizationRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${organizationId}`,
      organizationUpdate,
    );

    return response?.data;
  }

  async getOrganizationGroupUsers(
    organizationId: string,
    groupId: string,
    params?: TableRequestParams,
  ): Promise<TableResponse<OrganizationUserRead>> {
    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/groups/${groupId}/users`,
      params,
    );
    //to be deleted after
    (response.data as TableResponse<OrganizationUserRead>)?.results.forEach(
      (item) => {
        handleEnums(item);
      },
    );
    return response.data;
  }

  async createOrganizationGroupUsers(
    organizationId: string,
    groupId: string,
    userIds: string[],
  ): Promise<UserIdNameSchema[]> {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/groups/${groupId}/organization_users`,
      userIds,
    );
    return response.data;
  }

  async addOrganizationUnitUsers(
    organizationId: string,
    unitId: string,
    userIds: string[],
  ) {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/units/${unitId}/users`,
      userIds,
    );

    return response.data;
  }

  async addOrganizationUserToGroups(
    organizationId: string,
    groupId: string,
    userIds: string[],
  ): Promise<UserIdNameSchema[]> {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/groups/${groupId}/users`,
      userIds,
    );
    return response.data;
  }

  async deleteUserFromOrganizationGroup(
    organizationId: string,
    groupId: string,
    unitId: string,
  ): Promise<void> {
    try {
      await this.client.delete(
        `/${organizationId}/groups/${groupId}/users/${unitId}`,
      );
    } catch (err) {
      console.error(err);
      throw "Error while deleting user from group";
    }
  }

  async getSubOrganizations(
    organizationId: string,
    params: GetOrganizationsRequest,
  ): Promise<TableResponse<OrganizationRead>> {
    const urlParams: string = new URLSearchParams(params).toString();
    const queryString: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(
      `/${organizationId}/sub-organizations${queryString}`,
    );
    //to be deleted after
    (response.data as TableResponse<OrganizationRead>)?.results.forEach(
      (item) => {
        handleEnums(item);
      },
    );
    return response.data;
  }

  async createSubOrganization(
    organizationId: string,
    data: SubOrganizationCreate,
  ): Promise<OrganizationRead> {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/sub-organizations`,
      data,
    );
    //to be deleted after
    handleEnums(response.data);

    return response.data;
  }

  async addOrganizationSSOConfig(
    organizationId: string,
    data: OrganizationOIDCCreate & { enabled: boolean },
  ): Promise<OrganizationOIDCRead> {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/oidc`,
      data,
    );
    return response.data;
  }

  async updateOrganizationSSOConfig(
    organizationId: string,
    data: OrganizationOIDCCreate & { enabled: boolean },
  ): Promise<OrganizationOIDCRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${organizationId}/oidc`,
      data,
    );
    return response.data;
  }

  async getOrganizationSSOConfig(
    organization_id: string,
  ): Promise<OrganizationOIDCRead> {
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/oidc`,
      null,
      { isShowError: false },
    );
    return response.data;
  }

  async deleteOrganizationSSOConfig(organizationId: string): Promise<string> {
    const response: AxiosResponse = await this.client.delete(
      `/${organizationId}/oidc`,
    );

    return response.data;
  }

  async deleteSubOrganization(
    organizationId: string,
    subOrganizationId: string,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.delete(
      `/${organizationId}/sub-organizations/${subOrganizationId}`,
    );

    return response.data;
  }

  async updateOrganizationUserStatus(
    organizationId: string,
    userId: string,
    payload: OrganizationUserStatusUpdate,
  ): Promise<string> {
    const response: AxiosResponse = await this.client.put(
      `/${organizationId}/users/${userId}/status`,
      payload,
    );

    return response.data;
  }

  async createInvitationEmailForOrganizationUser(
    organizationId: string,
    userId: string,
  ): Promise<void> {
    await this.client.post(
      `/${organizationId}/users/${userId}/invitation`,
      null,
      { isShowError: false },
    );
  }

  async getOrganizationUsersName(
    organization_id: string,
    organization_user_ids: (string | null)[],
  ): Promise<PaginationSchema_OrganizationUserRead_> {
    const orgIds = {
      organization_id: organization_user_ids,
    };

    const params = new URLSearchParams();
    orgIds.organization_id.forEach((id) => {
      if (id) {
        params.append("organization_user_id", id);
      }
    });

    const urlParams: string = params.toString();
    const queryString: string = `/${organization_id}/users${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(queryString);

    return response.data;
  }

  async getOrganizationServiceProvidersDetails(
    organization_id: string,
    service_provider_ids: (string | null)[],
  ): Promise<ServiceProviderRead[]> {
    const params = new URLSearchParams();
    service_provider_ids.forEach((id) => {
      if (id) {
        params.append("organization_user_id", id);
      }
    });
    const urlParams: string = params.toString();

    const queryString: string = `/${organization_id}/service-providers${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(queryString);

    return response.data;
  }

  async getOrganizationServiceProvidersDetailsByServiceProviderIds(
    organization_id: string,
    service_provider_ids: (string | null)[],
  ): Promise<ServiceProviderRead[]> {
    const params = new URLSearchParams();
    service_provider_ids.forEach((id) => {
      if (id) params.append("service_provider_id", id);
    });
    const urlParams: string = params.toString();

    const queryString: string = `/${organization_id}/service-providers${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(queryString);

    return response.data;
  }
  async getOrganizationServiceProvider(
    service_provider_id: string,
    organization_id: string,
  ): Promise<ServiceProviderRead> {
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/service-providers/${service_provider_id}`,
    );
    return response.data;
  }

  async getOrganizationUserLoginHistories(
    organization_id: string,
    organization_user_id: string,
    params: TableRequestParams,
  ): Promise<TableResponse<LoginAttemptRead>> {
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/users/${organization_user_id}/login-attempts`,
      { ...params },
    );

    return response.data;
  }

  async getImportOrganizationUsers(
    organization_id: string,
    organization_user_import_id: string,
  ): Promise<void> {
    const response: AxiosResponse = await this.client.get(
      `/${organization_id}/users/imports/${organization_user_import_id}`,
    );

    this.state.importOrganizationUsersStatus = response.data;
  }

  async postImportOrganizationUsers(
    organization_id: string,
    body: FormData,
  ): Promise<OrganizationUserImportRead> {
    const response: AxiosResponse = await this.client.post(
      `/${organization_id}/users/imports`,
      body,
    );

    return response.data;
  }

  async registerOrgAsSP(organizationId: string): Promise<AttributeSetRead> {
    const response: AxiosResponse = await this.client.post(
      `/${organizationId}/service-providers`,
    );
    return response.data;
  }
}

export const organizationsService: OrganizationsService =
  new OrganizationsService();
