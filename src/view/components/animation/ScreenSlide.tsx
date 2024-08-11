import React from "react";

export default function ScreenSlide({
	children,
	className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
	return <div className={className}>{children}</div>;
}
