"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useLocale } from "@/lib/i18n/LocaleProvider";

interface DestructiveConfirmProps {
  message: string;
  confirmWord: string;
  actionLabel: string;
  pendingLabel: string;
  onConfirm: () => Promise<void>;
}

// A typed confirmation for actions that wipe more than one record (bulk
// resets) — a plain window.confirm() is too easy to dismiss on reflex for
// something that can't be undone. Single-item deletes still use
// window.confirm(); this is reserved for the more destructive bulk actions.
export function DestructiveConfirm({
  message,
  confirmWord,
  actionLabel,
  pendingLabel,
  onConfirm,
}: DestructiveConfirmProps) {
  const { dictionary } = useLocale();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const inputId = useId();

  if (!open) {
    return (
      <Button type="button" variant="destructive" onClick={() => setOpen(true)}>
        {actionLabel}
      </Button>
    );
  }

  const canConfirm = value.trim().toUpperCase() === confirmWord;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-destructive/40 bg-destructive/5 p-4">
      <p className="text-[14px] text-foreground">{message}</p>
      <div className="flex flex-col gap-2 sm:max-w-xs">
        <label htmlFor={inputId} className="text-[13px] font-medium text-foreground">
          {dictionary.admin.common.typeToConfirmTemplate.replace("{word}", confirmWord)}
        </label>
        <Input
          id={inputId}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          autoComplete="off"
          autoFocus
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="destructive"
          disabled={!canConfirm || pending}
          onClick={async () => {
            setPending(true);
            try {
              await onConfirm();
              setOpen(false);
              setValue("");
            } finally {
              setPending(false);
            }
          }}
        >
          {pending ? pendingLabel : actionLabel}
        </Button>
        <Button
          type="button"
          variant="secondary"
          disabled={pending}
          onClick={() => {
            setOpen(false);
            setValue("");
          }}
        >
          {dictionary.admin.common.cancel}
        </Button>
      </div>
    </div>
  );
}
