import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
}

const variants: Record<ButtonVariant, string> = {
  primary: `
    relative overflow-hidden group
    bg-accent text-white font-semibold
    border border-accent
    shadow-[0_0_20px_rgba(77,126,255,0.3)]
    hover:shadow-[0_0_28px_rgba(77,126,255,0.5)]
    hover:brightness-110
    active:scale-[0.97]
    transition-all duration-200
  `,
  outline: `
    relative overflow-hidden
    bg-transparent text-accent font-semibold
    border border-accent
    hover:bg-accent hover:text-white
    hover:shadow-[0_0_20px_rgba(77,126,255,0.25)]
    active:scale-[0.97]
    transition-all duration-200
  `,
  ghost: `
    bg-transparent text-text-secondary font-medium
    border border-border
    hover:border-accent hover:text-accent
    active:scale-[0.97]
    transition-all duration-150
  `,
  danger: `
    bg-transparent text-red-400 font-medium
    border border-red-400/30
    hover:bg-red-500/10 hover:border-red-400
    active:scale-[0.97]
    transition-all duration-150
  `,
};

const sizes: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm rounded-xl gap-2",
  lg: "px-6 py-3 text-base rounded-xl gap-2.5",
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
    <button
      {...props}
      className={`inline-flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {variant === "primary" ? (
        <span
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full"
          aria-hidden
        />
      ) : null}
      {icon && iconPosition === "left" ? <span className="relative z-[1] inline-flex items-center">{icon}</span> : null}
      <span className="relative z-[1]">{children}</span>
      {icon && iconPosition === "right" ? <span className="relative z-[1] inline-flex items-center">{icon}</span> : null}
    </button>
  );
}
