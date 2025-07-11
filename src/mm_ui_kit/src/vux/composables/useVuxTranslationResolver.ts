import { useTranslation } from "i18next-vue";

export function useTranslationResolver() {
  const { t } = useTranslation();

  /**
   * Checks if a translation key exists and returns its value
   * @param key - The translation key
   * @param options - Optional i18next options
   * @returns The translation value or null if not found
   */
  const resolveTranslation = (key: string, options?: object): string => {
    const translation = t(key, options);

    if (translation !== key) {
      return translation;
    }

    console.error(`Translation key not found: ${key}`);
    return `{.${key.split(".").pop()}}`;
  };

  const resolveTranslationOrNull = (
    key: string,
    options?: object,
  ): string | null => {
    const translation = t(key, options);

    if (translation !== key) {
      return translation;
    } else {
      return null;
    }
  };

  return {
    resolveTranslation,
    resolveTranslationOrNull,
  };
}
