'use client';

export default function ConfirmSubmitButton({ children, message, className, formAction }) {
  return (
    <button
      formAction={formAction}
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
