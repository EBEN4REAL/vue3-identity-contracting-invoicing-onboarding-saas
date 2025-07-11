import {
  MetricsChart,
  ServiceProviderMetrics,
} from "../../../../src/iam/iam.types";

export const servicesProvidersMetrics: {
  [key: string]: ServiceProviderMetrics;
} = {
  "001": {
    organizations: {
      total: 4,
    },
    users: {
      total: 10,
    },
    average_org_users: {
      total: 3,
    },
  },
};

export const servicesProvidersMetricsActiveUsers: {
  [key: string]: MetricsChart;
} = {
  "001": {
    labels: ["1", "2"],
    datasets: [
      {
        label: "This Range",
        data: [2, 5],
      },
    ],
  },
};

export const servicesProvidersMetricsSignups: { [key: string]: MetricsChart } =
  {
    "001": {
      labels: ["1", "2"],
      datasets: [
        {
          label: "This Range",
          data: [5, 3],
        },
      ],
    },
  };

export const servicesProvidersMetricsFailedLogins: {
  [key: string]: MetricsChart;
} = {
  "001": {
    labels: ["1", "2"],
    datasets: [
      {
        label: "This Range",
        data: [20, 10],
      },
    ],
  },
};
