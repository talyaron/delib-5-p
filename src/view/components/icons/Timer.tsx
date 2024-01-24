interface Props {
    percent: number;
}

export default function Timer({ percent }: Props) {
    const timePassedColor = "#D0E6FC";

    const xPositionArr = [
        165.863, 176.886, 184.634, 188.766, 189.102, 185.627, 178.494, 168.015,
        154.646, 138.972, 121.679, 103.522, 85.2947, 67.7935, 51.7842, 37.9651,
        26.9417, 19.1941, 15.0623, 14.7261, 18.2009, 25.3337, 35.8132,
    ];

    const yPositionArr = [
        161.659, 147.055, 130.48, 112.658, 94.3672, 76.4053, 59.5557, 44.5615,
        32.0713, 22.6328, 16.6621, 14.4141, 15.9922, 21.3242, 30.1807, 42.1689,
        56.7734, 73.3477, 91.1699, 109.461, 127.423, 144.271, 159.268,
    ];

    const transformArr = [
        -48, -60, -72, -84, -96, -108, -120, -132, -144, -156, -168, -180, 168,
        156, 144, 132, 120, 108, 96, 84, 72, 60, 48,
    ];

    const colorArr = [
        "#4FC1FF",
        "#4FC1FF",
        "#36B8FF",
        "#30A5E6",
        "#2E9EDB",
        "#2D9AD6",
        "#2C97D1",
        "#0083C8",
        "#0373C4",
        "#5C76FE",
        "#5C76FE",
        "#737BFF",
        "#6971FA",
        "#6971FA",
        "#515AFA",
        "#515AFA",
        "#4B52E6",
        "#4B52E6",
        "#444BD1",
        "#4249CC",
        "#3D43BA",
        "#3D44BD",
        "#3D44BD",
    ];

    const rectArr = xPositionArr
        .map((x, i) => (
            <rect
                key={i}
                x={x}
                y={yPositionArr[i]}
                width="3.21563"
                height="14.4144"
                rx="1.60782"
                transform={`rotate(${transformArr[i]} ${x} ${yPositionArr[i]})`}
                fill={colorArr[i]}
            />
        ))
        .map((rect, i) => {
            return (
                <rect
                    key={i}
                    x={rect.props.x}
                    y={rect.props.y}
                    width="3.21563"
                    height="14.4144"
                    rx="1.60782"
                    transform={rect.props.transform}
                    fill={
                        percent + (i + 1) * 4.3 > 100 
                            ? colorArr[i]
                            : timePassedColor
                    }
                />
            );
        });

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="204"
            height="204"
            viewBox="0 0 204 204"
            fill="none"
        >
            {rectArr}
        </svg>
    );
}
