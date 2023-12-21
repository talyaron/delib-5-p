import { useEffect, useState } from "react";

const useDirection = (): "row" | "row-reverse" => {
    const [direction, setDirection] = useState<"row" | "row-reverse">("row");

    useEffect(() => {
        setDirection(
            document.body.style.direction === "rtl" ? "row-reverse" : "row"
        );
    }, [document.body.style.direction]);

    return direction;
};

export default useDirection;
