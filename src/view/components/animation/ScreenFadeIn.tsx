import React from "react";

export default function ScreenFadeIn({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className + " fade-in"}>{children}</div>;
}
