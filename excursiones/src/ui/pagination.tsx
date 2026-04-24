import * as React from "react";
import { cn } from "../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "./Icons";

function PaginationRoot({
	className,
	...props
}: Readonly<React.ComponentProps<"nav">>) {
	return (
		<nav
			role="navigation"
			aria-label="pagination"
			className={cn(
				"mx-auto flex w-full justify-center lg:justify-start",
				className,
			)}
			{...props}
		/>
	);
}
PaginationRoot.displayName = "Pagination";

const PaginationContent = React.forwardRef<
	HTMLUListElement,
	Readonly<React.ComponentProps<"ul">>
>(({ className, ...props }, ref) => (
	<ul
		ref={ref}
		className={cn("flex flex-row items-center gap-2", className)}
		{...props}
	/>
));
PaginationContent.displayName = "PaginationContent";

const PaginationItem = React.forwardRef<
	HTMLLIElement,
	Readonly<React.ComponentProps<"li">>
>(({ className, ...props }, ref) => (
	<li ref={ref} className={cn("", className)} {...props} />
));
PaginationItem.displayName = "PaginationItem";

type PaginationLinkProps = {
	isActive?: boolean;
	disabled?: boolean;
} & React.ComponentProps<"button">;

function PaginationLink({
	className,
	isActive,
	disabled,
	...props
}: PaginationLinkProps) {
	return (
		<button
			aria-current={isActive ? "page" : undefined}
			disabled={disabled}
			className={cn(
				"flex h-10 min-w-10 items-center justify-center rounded-md border border-border/50 px-3 text-sm font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				isActive
					? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 -translate-y-0.5"
					: "bg-background hover:bg-accent hover:text-accent-foreground hover:border-border hover:-translate-y-0.5",
				disabled &&
					"pointer-events-none opacity-50 border-none shadow-none translate-y-0",
				className,
			)}
			{...props}
		/>
	);
}
PaginationLink.displayName = "PaginationLink";

function PaginationPrevious({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Ir a la página anterior"
			className={cn("gap-1 pl-2.5", className)}
			{...props}
		>
			<ChevronLeftIcon size={18} />
			<span className="hidden sm:inline">Anterior</span>
		</PaginationLink>
	);
}
PaginationPrevious.displayName = "PaginationPrevious";

function PaginationNext({
	className,
	...props
}: React.ComponentProps<typeof PaginationLink>) {
	return (
		<PaginationLink
			aria-label="Ir a la página siguiente"
			className={cn("gap-1 pr-2.5", className)}
			{...props}
		>
			<span className="hidden sm:inline">Siguiente</span>
			<ChevronRightIcon size={18} />
		</PaginationLink>
	);
}
PaginationNext.displayName = "PaginationNext";

function PaginationEllipsis({
	className,
	...props
}: React.ComponentProps<"span">) {
	return (
		<span
			aria-hidden
			className={cn(
				"flex h-10 w-10 items-center justify-center text-muted-foreground",
				className,
			)}
			{...props}
		>
			<MoreHorizontalIcon size={18} />
			<span className="sr-only">Más páginas</span>
		</span>
	);
}
PaginationEllipsis.displayName = "PaginationEllipsis";

export {
	PaginationRoot as Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
};
