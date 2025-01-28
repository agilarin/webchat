import {ComponentPropsWithoutRef, ElementType, ReactNode} from "react";
import clsx from "clsx";
import {Link, LinkProps} from "react-router";
import {Ripple} from "@/components/Ripple";
import classes from "./Button.module.scss";

type LinkType = "RouterLink";

type ButtonOwnProps<E extends ElementType | LinkType> = {
  children?: ReactNode;
  color?: "primary" | "gray",
  variant?: "text" | "solid",
  rounded?: "default" | "none" | "full",
  as?: E,
}
  // variant?: "text" | "filled" | "solid" | "outlined",

type ButtonProps<E extends ElementType | LinkType> = E extends ElementType ?
  ButtonOwnProps<E> & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>> :
  ButtonOwnProps<E> & LinkProps;


const defaultElement = "button";

function Button<E extends ElementType | LinkType = typeof defaultElement>(
  {
    as,
    color = "primary",
    variant = "text",
    rounded = "default",
    className,
    children,
    ...otherProps
  }: ButtonProps<E>
) {
  const TagName = as === "RouterLink" ? Link : as || defaultElement;

  return (
    <TagName
      className={clsx(classes.root, classes[color], classes[variant], classes[rounded], className)}
      {...otherProps}
    >
      <Ripple/>
      {children}
    </TagName>
  );
}

export default Button;