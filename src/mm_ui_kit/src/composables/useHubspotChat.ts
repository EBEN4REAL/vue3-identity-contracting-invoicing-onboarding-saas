import { onMounted } from "vue";
import { usersService } from "~/users/users.service";
import { authService } from "~/auth/auth.service";

export function useHubSpotChat() {
  const loadHubSpotScript = () => {
    return new Promise((resolve, reject) => {
      if (document.getElementById("hs-script-loader")) {
        resolve(null);
        return;
      }

      const script = document.createElement("script");
      script.src = "//js-eu1.hs-scripts.com/144898776.js";
      script.async = true;
      script.defer = true;
      script.id = "hs-script-loader";
      script.onload = () => resolve(null);
      script.onerror = reject;
      document.body.appendChild(script);
    });
  };
  const loadHubspotWidget = async () => {
    window.hsConversationsSettings = {
      loadImmediately: false,
    };

    try {
      const response = await usersService.getUserMeHubspotChatToken();
      const userProfile = await authService.getProfile();
      window.hsConversationsSettings = {
        identificationEmail: userProfile?.email,
        identificationToken: response.token,
      };

      await loadHubSpotScript();

      if (window.HubSpotConversations) {
        window.HubSpotConversations.widget.load();
      } else {
        console.warn("HubSpotConversations is not available yet.");
      }
    } catch (error) {
      console.error(
        "Failed to fetch HubSpot chat token or load script:",
        error,
      );
    }
  };
  onMounted(async () => {
    const loggedInUser = await authService.getUser();
    if (loggedInUser?.access_token) await loadHubspotWidget();
  });
}
