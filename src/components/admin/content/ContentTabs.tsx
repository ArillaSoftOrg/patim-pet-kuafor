"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import { HomepageContentForm } from "@/components/admin/forms/HomepageContentForm";
import { AboutContentForm } from "@/components/admin/forms/AboutContentForm";
import { ServicesPageContentForm } from "@/components/admin/forms/ServicesPageContentForm";
import { ContactPageContentForm } from "@/components/admin/forms/ContactPageContentForm";
import { FaqManager } from "@/components/admin/forms/FaqManager";
import { useLocale } from "@/lib/i18n/LocaleProvider";

const TAB_IDS = ["homepage", "about", "services", "contact", "faqs"] as const;
type TabId = (typeof TAB_IDS)[number];

export function ContentTabs() {
  const { dictionary } = useLocale();
  const tabs = TAB_IDS.map((id) => ({ id, label: dictionary.admin.content.tabs[id] }));
  const [active, setActive] = useState<TabId>("homepage");
  const tabRefs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const nextIndex = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActive(nextTab.id);
    tabRefs.current[nextTab.id]?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <div
        role="tablist"
        aria-label={dictionary.admin.content.tabsAriaLabel}
        className="flex flex-wrap gap-2 border-b border-border pb-3"
      >
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`content-tab-${tab.id}`}
            aria-selected={active === tab.id}
            aria-controls={`content-tabpanel-${tab.id}`}
            tabIndex={active === tab.id ? 0 : -1}
            onClick={() => setActive(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "rounded-md px-3 py-2 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active === tab.id
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`content-tabpanel-${tab.id}`}
          aria-labelledby={`content-tab-${tab.id}`}
          hidden={active !== tab.id}
        >
          {tab.id === "homepage" && (
            <Card>
              <HomepageContentForm />
            </Card>
          )}
          {tab.id === "about" && (
            <Card>
              <AboutContentForm />
            </Card>
          )}
          {tab.id === "services" && (
            <Card>
              <ServicesPageContentForm />
            </Card>
          )}
          {tab.id === "contact" && (
            <Card>
              <ContactPageContentForm />
            </Card>
          )}
          {tab.id === "faqs" && <FaqManager />}
        </div>
      ))}
    </div>
  );
}
