const weatherKey = "5845423edd9898163659b407e337a129";

const suffixMap = {
    temp: {
        standard: "K",
        metric: "\u2103",
        imperial: "\u2109"
    },
    speed: {
        standard: "m/s",
        metric: "m/s",
        imperial: "mph"
    },
    volume: "mm",
    percent: "%",
}

export { weatherKey, suffixMap };
