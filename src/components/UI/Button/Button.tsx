import {ComponentPropsWithoutRef, ComponentProps, ElementType, forwardRef, ReactNode, ForwardedRef, ReactElement} from "react";
import clsx from "clsx";
import {Ripple} from "@/components/Ripple";
import classes from "./Button.module.scss";


type ButtonOwnProps<E extends ElementType> = {
  children?: ReactNode,
  icon?: boolean,
  color?: "primary" | "default",
  variant?: "text" | "solid",
  shape?: "default" | "round" | "none",
  as?: E,
}
// "text" | "filled" | "solid" | "outlined"

export type PolymorphicRef<
  E extends ElementType
> = ComponentProps<E>['ref']

type ButtonProps<
  E extends ElementType
> = ButtonOwnProps<E> & Omit<ComponentPropsWithoutRef<E>, keyof ButtonOwnProps<E>>


const defaultElement = "button";

export const Button = forwardRef(
  function<E extends ElementType = typeof defaultElement>(
    {
      as,
      icon,
      color = "default",
      variant = "text",
      shape = "default",
      className,
      children,
      ...otherProps
    }: ButtonProps<E>,
    ref?: ForwardedRef<any>
  ) {
    const TagName = as || defaultElement;
    const classNames = clsx(
      classes.root,
      icon && classes.btnIcon,
      classes[color + "Color"],
      classes[variant],
      classes[shape + "Shape"],
      className
    );

    return (
      <TagName
        className={classNames}
        {...otherProps}
        ref={ref}
      >
        <Ripple/>
        {children}
      </TagName>
    );
  }
) as <E extends ElementType = typeof defaultElement>(props: ButtonProps<E> & { ref?: PolymorphicRef<E> }) => ReactElement