import {
  MetricsChart,
  OrganizationMetrics,
} from "../../../../src/iam/iam.types";

export const organizationsMetrics: { [key: string]: OrganizationMetrics } = {
  "001": {
    users: {
      total: 10,
    },
  },
};

export const organizationsMetricsActiveUsers: { [key: string]: MetricsChart } =
  {
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

export const organizationsMetricsSignups: { [key: string]: MetricsChart } = {
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

export const organizationsMetricsFailedLogins: { [key: string]: MetricsChart } =
  {
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
