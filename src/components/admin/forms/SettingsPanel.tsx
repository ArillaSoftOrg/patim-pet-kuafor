"use client";

import { useState } from "react";
import { DestructiveConfirm } from "@/components/admin/DestructiveConfirm";
import { resetAllLocalContent } from "@/lib/content/resetAll";
import { useLocale } from "@/lib/i18n/LocaleProvider";

export function SettingsPanel() {
  const { dictionary } = useLocale();
  const t = dictionary.admin.settings;
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-8">
      <p className="text-[15px] text-muted-foreground">{t.intro}</p>

      <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-surface p-4">
        <span className="text-[14px] font-medium text-foreground">{t.resetAllTitle}</span>
        <p className="text-[14px] text-muted-foreground">{t.resetAllDescription}</p>
        <div className="flex items-center gap-3">
          <DestructiveConfirm
            message={t.resetAllConfirm}
            confirmWord="RESET"
            actionLabel={t.resetAllAction}
            pendingLabel={t.resetting}
            onConfirm={async () => {
              await resetAllLocalContent();
              setDone(true);
            }}
          />
          {done && <span className="text-[14px] text-success">{t.done}</span>}
        </div>
      </div>
    </div>
  );
}
