import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../lib/utils";

const alertVariants = cva(
	"relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
	{
		variants: {
			variant: {
				default: "bg-background text-foreground",
				destructive:
					"border-destructive/50 bg-destructive/10 text-destructive [&>svg]:text-destructive",
				success:
					"border-nature-600/20 bg-nature-600/10 text-nature-800 dark:text-nature-200 [&>svg]:text-nature-600",
				warning:
					"border-earth-600/20 bg-earth-600/10 text-earth-800 dark:text-earth-200 [&>svg]:text-earth-600",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const Alert = React.forwardRef<
	HTMLDivElement,
	Readonly<
		React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
	>
>(({ className, variant, ...props }, ref) => (
	<div
		ref={ref}
		role="alert"
		className={cn(alertVariants({ variant }), className)}
		{...props}
	/>
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
	HTMLHeadingElement,
	Readonly<React.HTMLAttributes<HTMLHeadingElement>>
>(({ className, children, ...props }, ref) => (
	<h5
		ref={ref}
		className={cn("mb-1 font-medium leading-none tracking-tight", className)}
		{...props}
	>
		{children}
	</h5>
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
	HTMLDivElement,
	Readonly<React.HTMLAttributes<HTMLDivElement>>
>(({ className, children, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("text-sm [&_p]:leading-relaxed", className)}
		{...props}
	>
		{children}
	</div>
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
