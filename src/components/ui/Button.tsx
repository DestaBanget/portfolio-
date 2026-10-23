import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

/** One shape for every button: rounded, flat fill, no shadow. */
export const buttonBase =
  "inline-flex items-center justify-center rounded-lg font-medium transition-[background-color,border-color,color,transform] duration-150 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

export const buttonVariants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-accent-ink hover:bg-accent-light",
  outline: "border border-border bg-surface text-text-primary hover:border-text-muted hover:bg-surface-raised",
  ghost: "text-text-secondary hover:bg-surface-raised hover:text-text-primary",
  danger: "text-danger hover:bg-danger/10",
};

export const buttonSizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "min-h-9 gap-1.5 px-3 text-sm",
  md: "min-h-10 gap-2 px-4 text-sm",
  lg: "min-h-11 gap-2 px-5 text-[0.9375rem]",
};

export function Button({
  variant = "ghost",
  size = "md",
  icon,
  iconPosition = "left",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button {...props} className={`${buttonBase} ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}>
      {icon && iconPosition === "left" ? icon : null}
      {children}
      {icon && iconPosition === "right" ? icon : null}
    </button>
  );
}
