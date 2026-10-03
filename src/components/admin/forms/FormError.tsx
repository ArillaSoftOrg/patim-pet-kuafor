interface FormErrorProps {
  message: string | null;
}

// Shared error banner so every admin form reports failures the same way.
export function FormError({ message }: FormErrorProps) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-[14px] text-destructive"
    >
      {message}
    </p>
  );
}
