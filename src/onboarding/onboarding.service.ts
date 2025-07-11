import config from "../mm.config.json";
import { AxiosResponse } from "axios";
import { reactive } from "vue";
import {
  AttributesConsentUpdate,
  AttributeTypeCreate,
  AttributeTypeRead,
  AttributeTypeUpdate,
  FlowReadParams,
  FlowSchema,
  FlowStageSchema,
  OrganizationCreate,
  OrganizationRead,
  OrganizationUpdate,
  OrganizationUsersInvite,
  ServiceProviderAttributesConsentsRead,
  UserRead,
  UserUpdate,
  UserWelcomeComponentRead,
  WelcomeComponentsCreateParams,
  WelcomeComponentsRead,
  WelcomeComponentsReadParams,
} from "~/onboarding/onboarding.types";
import { OAuthClientService } from "~/common/services/oauth.client.service";
import ClientService from "~/common/services/client.service";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";

class OnboardingService extends OAuthClientService {
  state: {
    flowStages: FlowStageSchema[];
    stageActive: FlowStageSchema | null;
  };

  constructor() {
    super(config.onboarding.url);

    this.state = reactive({
      flowStages: [],
      stageActive: null,
    });
  }

  get getFlowStages() {
    return this.state.flowStages.map((stage: FlowStageSchema) => ({
      index: stage.index,
      title: stage.title,
      active: stage.active,
      completed: stage.completed,
    }));
  }

  async getFlow(params?: FlowReadParams): Promise<FlowSchema> {
    const response: AxiosResponse = await this.axiosInstance.get("/flow", {
      params,
    });

    this.state.flowStages = response.data.stages;

    return response.data;
  }

  async updateUser(user_update: UserUpdate): Promise<UserRead> {
    const response: AxiosResponse = await this.axiosInstance.patch(
      `/users/${this.oAuthManager?.session?.userId}`,
      user_update,
    );

    return response.data;
  }

  async inviteUsers(
    organizationId: string,
    invitedusers: OrganizationUsersInvite,
  ): Promise<UserRead> {
    const response: AxiosResponse = await this.axiosInstance.post(
      `/organizations/${organizationId}/invite_users`,
      invitedusers,
    );

    return response.data;
  }

  async createOrganization(
    organization_create: OrganizationCreate,
  ): Promise<OrganizationRead> {
    const response: AxiosResponse = await this.axiosInstance.post(
      "/organizations",
      organization_create,
    );

    return response.data;
  }

  async updateOrganization(
    organizationUpdateData: OrganizationUpdate,
    organizationId: string,
  ): Promise<OrganizationRead> {
    const response: AxiosResponse = await this.axiosInstance.patch(
      `/organizations/${organizationId}`,
      organizationUpdateData,
    );

    return response.data;
  }

  async patchUserMeConsents(payload: AttributesConsentUpdate): Promise<void> {
    await this.axiosInstance.patch("/users/@me/consents", payload);
  }

  async patchOrganizationConsents(
    id: string,
    payload: AttributesConsentUpdate,
  ): Promise<void> {
    await this.axiosInstance.patch(`/organizations/${id}/consents`, payload);
  }
}

class OnboardingServiceAuth {
  client: ClientService;

  constructor() {
    this.client = new ClientService(config.onboarding.url);
  }

  async getAllAttributeTypes(
    params: TableRequestParams,
  ): Promise<TableResponse<AttributeTypeRead>> {
    const response: AxiosResponse = await this.client.get(
      "/attribute-types",
      params,
    );

    return response.data;
  }

  async postAttributeType(payload: AttributeTypeCreate): Promise<void> {
    await this.client.post("/attribute-types", payload);
  }

  async updateAttributeType(
    id: string,
    payload: AttributeTypeUpdate,
  ): Promise<void> {
    await this.client.patch(`/attribute-types/${id}`, payload);
  }

  async deleteAttributeType(id: string): Promise<void> {
    await this.client.delete(`/attribute-types/${id}`);
  }

  async getWelcomeComponents(
    params: WelcomeComponentsReadParams,
  ): Promise<WelcomeComponentsRead> {
    const response: AxiosResponse = await this.client.get(
      `/welcome/${params.app}`,
    );
    return response.data;
  }

  async createWelcomeComponent(
    params: WelcomeComponentsCreateParams,
  ): Promise<UserWelcomeComponentRead> {
    const response: AxiosResponse = await this.client.post(
      `/welcome/${params.app}/${params.component}`,
    );
    return response.data;
  }

  async deleteWelcomeComponent(
    params: WelcomeComponentsCreateParams,
  ): Promise<UserWelcomeComponentRead> {
    const response: AxiosResponse = await this.client.delete(
      `/welcome/${params.app}/${params.component}`,
    );
    return response.data;
  }

  async getUserMeConsents(): Promise<ServiceProviderAttributesConsentsRead[]> {
    const response: AxiosResponse = await this.client.get(
      "/users/@me/consents",
    );

    return response.data.service_providers;
  }

  async patchUserMeConsents(payload: AttributesConsentUpdate): Promise<void> {
    await this.client.patch("/users/@me/consents", payload);
  }

  async deleteUserMeConsent(service_provider_id: string): Promise<void> {
    await this.client.delete(`/users/@me/consents/${service_provider_id}`);
  }

  async getOrganizationConsents(
    organization_id: string,
  ): Promise<ServiceProviderAttributesConsentsRead[]> {
    const response: AxiosResponse = await this.client.get(
      `/organizations/${organization_id}/consents`,
      null,
      { isShowError: false },
    );

    return response.data.service_providers;
  }

  async deleteOrganizationConsents(
    organization_id: string,
    service_provider_id: string,
  ): Promise<void> {
    await this.client.delete(
      `/organizations/${organization_id}/consents/${service_provider_id}`,
    );
  }
}

export const onboardingService: OnboardingService = new OnboardingService();

export const onboardingServiceAuth = new OnboardingServiceAuth();
