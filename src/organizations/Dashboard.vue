<script setup lang="ts">
import { MetricsChart, OrganizationMetrics } from "~/iam/iam.types";
import { onMounted, ref, Ref, watch } from "vue";
import { authService } from "~/auth/auth.service";
import { organizationsService } from "~/organizations/organizations.service";
import { Line } from "vue-chartjs";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import {
  activeUsers,
  activeUsersDateRange,
  chartOptions,
  dateRanges,
  failedLoginDateRange,
  failedLogins,
  getFromDate,
  getUntilDate,
  metricsChartToChartData,
  signups,
  signupsDateRange,
} from "~/mm_ui_kit/src/helpers/metrics";

const organizationId: Ref<string | null> = ref(null);
const organizationMetrics: Ref<OrganizationMetrics | null> = ref(null);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const fetchActiveUsers = async () => {
  if (!organizationId.value) {
    return;
  }
  const activeUsersMetrics: MetricsChart =
    await organizationsService.getOrganizationMetricsActiveUsers(
      organizationId.value,
      getFromDate(activeUsersDateRange.value),
      getUntilDate(activeUsersDateRange.value),
    );
  activeUsers.value = metricsChartToChartData(activeUsersMetrics);
};

const fetchSignups = async () => {
  if (!organizationId.value) {
    return;
  }
  const signupsMetrics: MetricsChart =
    await organizationsService.getOrganizationSignups(
      organizationId.value,
      getFromDate(signupsDateRange.value),
      getUntilDate(signupsDateRange.value),
    );
  signups.value = metricsChartToChartData(signupsMetrics);
};

const fetchFailedLogins = async () => {
  if (!organizationId.value) {
    return;
  }
  const failedLoginsMetrics: MetricsChart =
    await organizationsService.getOrganizationMetricsFailedLogins(
      organizationId.value,
      getFromDate(failedLoginDateRange.value),
      getUntilDate(failedLoginDateRange.value),
    );
  failedLogins.value = metricsChartToChartData(failedLoginsMetrics);
};

onMounted(async () => {
  const profile = await authService.getProfile();
  if (profile?.org) {
    organizationId.value = profile.org;
    organizationMetrics.value =
      await organizationsService.getOrganizationMetrics(profile.org);
  }
});

watch(organizationId, async () => {
  await fetchActiveUsers();
  await fetchSignups();
  await fetchFailedLogins();
});

watch(activeUsersDateRange, async () => {
  await fetchActiveUsers();
});

watch(signupsDateRange, async () => {
  await fetchSignups();
});

watch(failedLoginDateRange, async () => {
  await fetchFailedLogins();
});
</script>

<template>
  <v-container>
    <v-responsive class="align-center text-center fill-height">
      <h2>Organization dashboard</h2>
      <v-row
        id="organization-metrics"
        align="center"
        justify="center"
        class="mt-4"
      >
        <v-col cols="auto">
          <v-card max-width="260" variant="outlined">
            <v-card-item>
              <v-card-title>Total users</v-card-title>
              <v-card-subtitle
                v-if="organizationMetrics"
                id="organization-total-users"
                class="text-red"
              >
                {{ organizationMetrics.users.total }}
              </v-card-subtitle>
              <v-card-text v-if="!organizationMetrics" class="mt-3">
                <m-m-progress-circular indeterminate />
              </v-card-text>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Active users</v-card-title>
            <v-card-subtitle>
              <v-select
                v-model="activeUsersDateRange"
                label="Date Range"
                :items="dateRanges"
              />
            </v-card-subtitle>
            <v-card-text v-if="!activeUsers">
              <m-m-progress-circular indeterminate :size="64" :width="6" />
            </v-card-text>
            <v-card-text v-if="activeUsers">
              <Line
                id="active-users-chart"
                :options="chartOptions"
                :data="activeUsers"
              />
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Signups</v-card-title>
            <v-card-subtitle>
              <v-select
                v-model="signupsDateRange"
                label="Date Range"
                :items="dateRanges"
              />
            </v-card-subtitle>
            <v-card-text v-if="!signups">
              <m-m-progress-circular indeterminate :size="64" :width="6" />
            </v-card-text>
            <v-card-text v-if="signups">
              <Line
                id="signups-chart"
                :options="chartOptions"
                :data="signups"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Failed logins</v-card-title>
            <v-card-subtitle>
              <v-select
                v-model="failedLoginDateRange"
                label="Date Range"
                :items="dateRanges"
              />
            </v-card-subtitle>
            <v-card-text v-if="!failedLogins">
              <m-m-progress-circular indeterminate :size="64" :width="6" />
            </v-card-text>
            <v-card-text v-if="failedLogins">
              <Line
                id="failed-logins-chart"
                :options="chartOptions"
                :data="failedLogins"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<style scoped></style>
