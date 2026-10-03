"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import Image from "next/image";
import { useLocale } from "@/lib/i18n/LocaleProvider";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

interface LanguageSwitcherProps {
  className?: string;
}

// Local SVG files (public/flags/*.svg), not emoji — Unicode regional-
// indicator flag emoji render as plain two-letter codes ("GB"/"TR"/"RU")
// on Windows, which has no built-in color-flag emoji font. An <img> against
// a same-origin static asset has no such font dependency and makes no
// external request.
const LOCALE_FLAGS: Record<Locale, string> = {
  en: "/flags/gb.svg",
  tr: "/flags/tr.svg",
  ru: "/flags/ru.svg",
};

// Custom listbox (WAI-ARIA "Listbox Popup" pattern) rather than a native
// <select> — a native <select>'s <option> content is plain text only, so
// there is no way to put a flag image next to a label inside one. Roving
// focus/tabindex: when the popup opens, real DOM focus moves onto the
// current option and Arrow/Home/End move it between <li role="option">
// elements, same as a native listbox — this is what makes arrow-key
// navigation and screen reader option announcements work without any
// aria-activedescendant bookkeeping.
export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const { locale, dictionary, switchLocale } = useLocale();
  const listboxId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(() => LOCALES.indexOf(locale));
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Re-sync which option is "active" the moment the popup transitions to
  // open, so it always starts on the current selection rather than
  // wherever it was last left — adjusted directly during render (React's
  // own recommended pattern for "reset state when a value changes", same
  // technique MobileNavigation.tsx uses for its own open/close state)
  // rather than in an effect, since setState directly inside an effect
  // body causes an extra cascading render.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) setActiveIndex(LOCALES.indexOf(locale));
  }

  // Moving DOM focus itself is a real effect (synchronizing with the
  // browser, not React state) — this part does belong in useEffect. Runs
  // only on the open transition, not on every activeIndex change, since
  // Arrow-key handling below already calls .focus() directly on the option
  // it moves to.
  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function commit(index: number) {
    const value = LOCALES[index];
    setOpen(false);
    buttonRef.current?.focus();
    if (value !== locale) switchLocale(value);
  }

  function onButtonKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
    }
  }

  function moveFocus(index: number) {
    setActiveIndex(index);
    optionRefs.current[index]?.focus();
  }

  function onListKeyDown(event: ReactKeyboardEvent<HTMLUListElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        moveFocus((activeIndex + 1) % LOCALES.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        moveFocus((activeIndex - 1 + LOCALES.length) % LOCALES.length);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(LOCALES.length - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
        break;
      case "Tab":
        // Let focus continue leaving naturally — just close the popup so it
        // doesn't linger open over whatever comes next.
        setOpen(false);
        break;
      default:
        break;
    }
  }

  return (
    <div ref={containerRef} className={cn("relative inline-flex", className)}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label={dictionary.language.label}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKeyDown}
        className="flex h-11 w-full min-w-[44px] items-center gap-2 rounded-md border border-border bg-surface px-3 text-[14px] font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image src={LOCALE_FLAGS[locale]} alt="" width={20} height={14} unoptimized className="h-[14px] w-5 flex-shrink-0 rounded-[2px]" />
        <span className="whitespace-nowrap">{LOCALE_LABELS[locale]}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true" className="ml-auto h-4 w-4 flex-shrink-0 text-muted-foreground">
          <path d="M5.5 7.5l4.5 4.5 4.5-4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={dictionary.language.label}
          onKeyDown={onListKeyDown}
          className="absolute left-0 top-full z-20 mt-1 min-w-full overflow-hidden rounded-md border border-border bg-surface py-1 shadow-lg"
        >
          {LOCALES.map((value, index) => (
            <li
              key={value}
              ref={(el) => {
                optionRefs.current[index] = el;
              }}
              role="option"
              aria-selected={value === locale}
              tabIndex={-1}
              onClick={() => commit(index)}
              onMouseEnter={() => setActiveIndex(index)}
              className={cn(
                "flex cursor-pointer items-center gap-2 px-3 py-2 text-[14px] font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
                value === locale ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted",
              )}
            >
              <Image src={LOCALE_FLAGS[value]} alt="" width={20} height={14} unoptimized className="h-[14px] w-5 flex-shrink-0 rounded-[2px]" />
              <span className="whitespace-nowrap">{LOCALE_LABELS[value]}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
