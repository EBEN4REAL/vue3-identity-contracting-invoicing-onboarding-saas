import { ChartData, ChartOptions } from "chart.js";
import { MetricsChart, MetricsDataset } from "~/iam/iam.types";
import { ref, Ref } from "vue";

export enum DateRange {
  THIS_MONTH = "TM",
  LAST_2_MONTHS = "L2M",
  LAST_6_MONTHS = "L6M",
  THIS_YEAR = "TY",
}

export const activeUsersDateRange: Ref<DateRange> = ref(DateRange.THIS_MONTH);
export const activeUsers: Ref<ChartData<"line"> | null> = ref(null);
export const signupsDateRange: Ref<DateRange> = ref(DateRange.THIS_MONTH);
export const signups: Ref<ChartData<"line"> | null> = ref(null);
export const failedLoginDateRange: Ref<DateRange> = ref(DateRange.THIS_MONTH);
export const failedLogins: Ref<ChartData<"line"> | null> = ref(null);

export const dateRanges = [
  {
    title: "This Month",
    value: DateRange.THIS_MONTH,
  },
  {
    title: "Last 2 Months",
    value: DateRange.LAST_2_MONTHS,
  },
  {
    title: "Last 6 Months",
    value: DateRange.LAST_6_MONTHS,
  },
  {
    title: "This Year",
    value: DateRange.THIS_YEAR,
  },
];

export const getFromDate = (
  dateRange: string = DateRange.THIS_MONTH,
): string => {
  const date: Date = new Date();
  let monthDiff: number = 0;
  if (dateRange === DateRange.LAST_2_MONTHS) {
    monthDiff = 1;
  } else if (dateRange === DateRange.LAST_6_MONTHS) {
    monthDiff = 5;
  }
  const fromDate: Date = new Date(date);
  fromDate.setDate(1);
  if (dateRange === DateRange.THIS_YEAR) {
    fromDate.setMonth(0);
  } else {
    fromDate.setMonth(date.getMonth() - monthDiff);
  }
  return fromDate.toISOString().substring(0, 10);
};

export const getUntilDate = (
  dateRange: string = DateRange.THIS_MONTH,
): string => {
  const date: Date = new Date();
  const untilDate: Date = new Date(date);
  if (dateRange === DateRange.THIS_YEAR) {
    untilDate.setMonth(12);
  } else {
    untilDate.setMonth(date.getMonth() + 1);
  }
  untilDate.setDate(0);
  return untilDate.toISOString().substring(0, 10);
};

export const chartOptions: ChartOptions<"line"> = {
  interaction: {
    intersect: false,
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
    },
  },
  responsive: true,
  scales: {
    x: {
      display: false,
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
      min: 0,
      ticks: {
        precision: 0,
      },
    },
  },
};

export const metricsChartToChartData = (
  metricsChart: MetricsChart,
): ChartData<"line"> => {
  return {
    labels: metricsChart.labels,
    datasets: metricsChart.datasets.map(
      (dataset: MetricsDataset, index: number) => ({
        backgroundColor: index === 0 ? "red" : "blue",
        borderColor: index === 0 ? "red" : "blue",
        data: dataset.data,
        label: dataset.label,
      }),
    ),
  };
};
