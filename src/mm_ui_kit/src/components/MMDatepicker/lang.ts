import type { DeepPartial } from "utility-types/dist";
import { Locale } from "vue-datepicker-next";

const lang: DeepPartial<Locale> = {
  formatLocale: {
    firstDayOfWeek: 1,
  },
  monthFormat: "MMMM",
  monthBeforeYear: true,
};

export default lang;
