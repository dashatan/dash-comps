"use client";

import { useLanguage } from "@/lib";
import { useEffect } from "react";

export default function LanguageMetaData() {
  const { t } = useLanguage();

  useEffect(() => {
    // document.title = t('app.name')
  }, [t]);

  return null;
}
