import { AxiosResponse } from "axios";
import ClientService from "~/common/services/client.service";
import config from "../mm.config.json";
import {
  PaginationSchema_UserRead_,
  LoginAttemptRead,
  TOTPConfirmationRead,
  TOTPRead,
  TOTPUpdate,
  TOTPVerificationRead,
  UserRead,
  UserSessionRead,
  UserSocialAccountRead,
  UserUpdate,
  UserEmailRead,
  UserEmailOTPStatusUpdate,
  UserMagicLinkRead,
  WebAuthnRead,
  WebAuthnOptionsRead,
  WebAuthnUpdate,
  WebAuthnStatusRead,
  UserMagicLinkUpdate,
  UserEmailOTPStatusRead,
  MFARead,
  UserMFARequiredStatusUpdate,
  UserMFARequiredStatusRead,
  UserAccess,
} from "~/iam/iam.types";
import {
  TableRequestParams,
  TableResponse,
} from "~/mm_ui_kit/src/types/table.types";
import { handleEnums } from "./handleEnums";

export type GetUsersRequest = {
  offset?: string;
  limit?: string;
  organization_id?: string;
  organization_group_id?: string;
  generic_email_name_search?: string;
  is_active?: boolean;
  order_by?: string;
};

class UsersService {
  client: ClientService;

  constructor() {
    this.client = new ClientService(`${config.iam.url}/iam/users`);
  }

  async getUser(userId: string): Promise<UserRead> {
    const response: AxiosResponse = await this.client.get(`/${userId}`);

    return response.data;
  }

  async resetUserPassword(userId: string): Promise<string> {
    const url = `/${userId}/password-reset`;
    const response: AxiosResponse = await this.client.post(url);

    return response.data;
  }

  async resetAdminUserTOTP(userId: string): Promise<void> {
    const url = `/${userId}/totp`;
    await this.client.delete(url);
  }

  async getUserMe(): Promise<UserRead> {
    const response: AxiosResponse = await this.client.get(`/@me`);
    //to be deleted after
    (response.data as UserRead).organization_users?.forEach((user) => {
      handleEnums(user);
    });
    return response.data;
  }

  async getUserMeEmails(): Promise<UserEmailRead[]> {
    const response: AxiosResponse = await this.client.get("/@me/emails");

    return response.data.emails;
  }

  async deleteUserEmail(email_id: string): Promise<string> {
    const response: AxiosResponse = await this.client.delete(
      `/@me/emails/${email_id}`,
    );

    return response.data;
  }

  async getUserMeSessions(
    params: TableRequestParams,
  ): Promise<TableResponse<UserSessionRead>> {
    const urlParams: string = new URLSearchParams(params).toString();
    const query: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(
      `/@me/sessions${query}`,
    );

    return response.data;
  }

  async getUserMeLoginHistories(
    params: TableRequestParams,
  ): Promise<TableResponse<LoginAttemptRead>> {
    const urlParams: string = new URLSearchParams(params).toString();
    const query: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;
    const client = new ClientService(`${config.iam.url}/iam`);

    const response: AxiosResponse = await client.get(
      `/login-attempts/@me${query}`,
    );

    return response.data;
  }

  async getUserMeSocialAccounts(): Promise<UserSocialAccountRead[]> {
    const response: AxiosResponse =
      await this.client.get(`/@me/social-accounts`);

    return response.data;
  }

  async getUserSocialAccounts(user_id): Promise<UserSocialAccountRead[]> {
    const response: AxiosResponse = await this.client.get(
      `/${user_id}/social-accounts`,
    );

    return response.data;
  }

  async deleteUserMeSession(token: string): Promise<string> {
    const response: AxiosResponse = await this.client.delete(
      `/@me/sessions/${token}`,
    );

    return response.data;
  }

  async deleteUserMeSocialAccount(type: string): Promise<void> {
    await this.client.delete(`/@me/social-accounts/${type}`);
  }

  async changeUserMePassword(
    oldPassword: string,
    newPassword: string,
    isOverridePwned?: boolean,
  ): Promise<string> {
    const params = isOverridePwned ? { override_pwned: true } : null;

    const response: AxiosResponse = await this.client.put(
      `/@me/password`,
      {
        old: oldPassword,
        new: newPassword,
      },
      {
        params,
      },
    );

    return response.data;
  }

  async changeUserMeEmail(password: string, newEmail: string): Promise<string> {
    const response: AxiosResponse = await this.client.put(`/@me/email`, {
      password: password,
      email: newEmail,
    });

    return response.data;
  }

  async setUserMePassword(
    newPassword: string,
    isOverridePwned?: boolean,
  ): Promise<UserRead> {
    const params = isOverridePwned ? { override_pwned: true } : null;

    const response: AxiosResponse = await this.client.post(
      `/@me/password`,
      {
        new: newPassword,
      },
      {
        params,
      },
    );

    return response.data;
  }

  async getUsers(
    getUsersRequest: GetUsersRequest,
  ): Promise<PaginationSchema_UserRead_> {
    const urlParams: string = new URLSearchParams(
      getUsersRequest as URLSearchParams,
    ).toString();
    const url: string = `${urlParams.length > 0 ? "?" : ""}${urlParams}`;

    const response: AxiosResponse = await this.client.get(url);

    return response.data;
  }

  async updateUser(userId: string, userUpdate: UserUpdate): Promise<UserRead> {
    const response: AxiosResponse = await this.client.patch(
      `/${userId}`,
      userUpdate,
    );

    return response.data;
  }

  async updateUserMe(userUpdate: UserUpdate): Promise<UserRead> {
    const response: AxiosResponse = await this.client.patch("/@me", userUpdate);

    return response.data;
  }

  async updateUserDisable(userId: string): Promise<UserRead> {
    const response: AxiosResponse = await this.client.put(`/${userId}/disable`);

    return response.data;
  }

  async updateUserEnable(userId: string): Promise<UserRead> {
    const response: AxiosResponse = await this.client.put(`/${userId}/enable`);

    return response.data;
  }

  async getUserMeTOTP(): Promise<TOTPRead> {
    const response: AxiosResponse = await this.client.get("/@me/totp", null, {
      isShowError: false,
    });

    return response.data;
  }

  async getUserMeMFA(): Promise<MFARead> {
    const response: AxiosResponse = await this.client.get("/@me/mfa");

    return response.data;
  }

  async getUserMeWebAuthn(): Promise<WebAuthnRead> {
    const response: AxiosResponse = await this.client.get(
      "/@me/webauthn",
      null,
      { isShowError: false },
    );

    return response.data;
  }

  async resetUserMeWebAuthn(): Promise<string> {
    const response: AxiosResponse = await this.client.delete("/@me/webauthn");

    return response.data;
  }

  async deleteAdminUser(userId: string): Promise<void> {
    const response: AxiosResponse = await this.client.delete(`/${userId}`);
    return response.data;
  }

  async setupUserMeWebAuthn(): Promise<WebAuthnOptionsRead> {
    const response: AxiosResponse = await this.client.post("/@me/webauthn");
    return response.data;
  }

  async updateUserMeWebAuthn(
    payload: WebAuthnUpdate,
  ): Promise<WebAuthnStatusRead> {
    const response: AxiosResponse = await this.client.put(
      "/@me/webauthn",
      payload,
    );

    return response.data;
  }

  async deleteUserMeAccount(): Promise<string> {
    const response: AxiosResponse = await this.client.delete("/@me");

    return response.data;
  }

  async postUserMeTOTP(): Promise<TOTPConfirmationRead> {
    const response: AxiosResponse = await this.client.post("/@me/totp");

    return response.data;
  }

  async updateUserMeTOTP(payload: TOTPUpdate): Promise<TOTPVerificationRead> {
    const response: AxiosResponse = await this.client.put("/@me/totp", payload);
    return response.data;
  }

  async updateMagicLink(
    payload: UserMagicLinkUpdate,
  ): Promise<UserMagicLinkRead> {
    const response: AxiosResponse = await this.client.put(
      "/@me/magic_link",
      payload,
    );

    return response.data;
  }

  async updateEmailOTPSetting(
    payload: UserEmailOTPStatusUpdate,
  ): Promise<UserEmailOTPStatusRead> {
    const response: AxiosResponse = await this.client.put(
      "/@me/email-otp",
      payload,
    );

    return response.data;
  }

  async updateMFARequiredSetting(
    payload: UserMFARequiredStatusUpdate,
  ): Promise<UserMFARequiredStatusRead> {
    const response: AxiosResponse = await this.client.put(
      "/@me/mfa_required",
      payload,
    );

    return response.data;
  }

  async deleteUserMeTOTP(): Promise<void> {
    await this.client.delete("/@me/totp");
  }

  async getUserAccess(): Promise<UserAccess> {
    const response: AxiosResponse = await this.client.get(`/@me/access`, null, {
      isShowError: false,
    });
    return response.data;
  }
}

export const usersService: UsersService = new UsersService();
