import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const useSlideAndSubStatement = (parentId: string) => {
    const location = useLocation();
    const [toSlide, setToSlide] = useState(false);
    const [toSubStatement, setToSubStatement] = useState(false);

    useEffect(() => {
        if (!location.state) return;

        if (location.state.from === "/home") {
            setToSubStatement(true);
            setToSlide(true);
            return;
        }
        const testToSlide = location.state
            ? location.state.from.split("/").length === 4
            : false;

        const previousStateId = location.state
            ? location.state.from.split("/")[2]
            : null;

        if (previousStateId === parentId) {
            setToSubStatement(true);
        } else {
            setToSubStatement(false);
        }

        setToSlide(testToSlide);
    }, [parentId, location.state]);

    return { toSlide, toSubStatement };
};

export default useSlideAndSubStatement;
