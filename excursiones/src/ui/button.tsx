import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";
import { LoaderIcon } from "./Icons";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
	{
		variants: {
			variant: {
				default:
					"bg-nature-600 text-primary-foreground hover:bg-nature-700 shadow-soft",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border-2 border-nature-600 bg-transparent text-nature-600 hover:bg-nature-50",
				secondary: "bg-earth-100 text-earth-900 hover:bg-earth-200",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
				success: "bg-nature-600 text-white hover:bg-nature-700 shadow-soft",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	readonly asChild?: boolean;
	/** Si el botón está en estado de carga. */
	readonly isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			isLoading = false,
			children,
			disabled,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={disabled || isLoading}
				aria-busy={isLoading}
				{...props}
			>
				{isLoading ? (
					<>
						<LoaderIcon className="animate-spin" aria-hidden="true" />
						<span className="opacity-0 w-0 h-0 overflow-hidden">
							Cargando...
						</span>
						{/* Mantenemos el children invisible para preservar el ancho del botón */}
						<span className="invisible contents">{children}</span>
					</>
				) : (
					children
				)}
			</Comp>
		);
	},
);
Button.displayName = "Button";

export { Button, buttonVariants };
