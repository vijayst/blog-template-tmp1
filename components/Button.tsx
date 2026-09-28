import { Button as RadixButton } from "@radix-ui/themes";
import { PropsWithChildren } from "react";

type RadixColor = "gray" | "indigo" | "blue" | "green" | "red" | "yellow";

interface ButtonProps extends PropsWithChildren {
  secondary?: boolean;
  onClick?: () => void;
  size?: "2" | "1" | "3" | "4";
  color?: RadixColor;
  variant?: "solid" | "soft" | "outline" | "ghost";
  type?: "button" | "submit" | "reset";
  radius?: "none" | "small" | "medium" | "large" | "full";
  className?: string;
}

export const Button = ({
  children,
  onClick,
  secondary,
  size = "2",
  color,
  variant,
  className,
  radius = "large",
  type = "button",
}: ButtonProps) => {
  const finalVariant = variant || (secondary ? "soft" : "solid");
  const finalColor = color || (secondary ? "gray" : "indigo");

  return (
    <RadixButton
      size={size}
      variant={finalVariant}
      color={finalColor}
      onClick={onClick}
      radius={radius}
      type={type}
      className={className}
    >
      {children}
    </RadixButton>
  );
};
