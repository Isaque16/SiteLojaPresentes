export interface FeedbackProps {
  message: string;
  type: "success" | "error" | string;
}

export default function FeedbackMessage({ message, type }: FeedbackProps) {
  if (!message) return null;

  return (
    <p className={`text-${type} mt-2`} aria-live="polite">
      {message}
    </p>
  );
}
