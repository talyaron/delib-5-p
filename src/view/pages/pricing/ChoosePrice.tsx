import { ReactNode, useState } from "react";
import pricingImg from "../../../assets/images/pricing.png";
import RadioBox from "../../components/radioBox/RadioBox";
import GroupCommunicationOne from "../../components/icons/GroupCommunicationOne";
import GroupCommunicationtwo from "../../components/icons/GroupCommunicationtwo";
import GroupCommunicationthree from "../../components/icons/GroupCommunicationthree";
import GroupCommunicationfour from "../../components/icons/GroupCommunicationFour";
import GroupCommunicationfive from "../../components/icons/GroupCommunicationFive";

interface PricePlan {
    price: string;
    range: string;
    icon: ReactNode;
    from?: number;
    to?: number;
}

export default function ChoosePrice() {
    const pricesPlanArr: PricePlan[] = [
        {
            price: "free",
            range: "Groups up to",
            icon: <GroupCommunicationOne />,
            to: 10,
        },
        {
            price: "10",
            range: "Groups from",
            icon: <GroupCommunicationtwo />,
            from: 11,
            to: 100,
        },
        {
            price: "30",
            range: "Groups from",
            icon: <GroupCommunicationthree />,
            from: 101,
            to: 300,
        },
        {
            price: "50",
            range: "Groups from",
            icon: <GroupCommunicationfour />,
            from: 301,
            to: 1000,
        },
        {
            price: "100",
            range: "Groups from",
            icon: <GroupCommunicationfive />,
            from: 1001,
        },
    ];
    const [plan, setPlan] = useState("free");

    return (
        <div className="page">
            <div className="pricing">
                <h1 className="pricing__title">Pricing plans</h1>
                <img src={pricingImg} alt="pricing-illustration" width="40%" />
                <p className="pricing__text">
                    Select the appropriate plan to maximize your performance and
                    get better results
                </p>
                <div className="pricing__radioBoxArea">
                    {pricesPlanArr.map((item) => (
                        <RadioBox
                            key={item.price}
                            currentValue={plan}
                            setCurrentValue={setPlan}
                            radioValue={item.price}
                        >
                            <div className="pricingDescription">
                                <div className="pricingDescription__icon">
                                    {item.icon}
                                </div>
                                <div className="pricingDescription__textArea">
                                    <p className="pricingDescription__textArea__text">
                                        {item.from && item.to ? (
                                            <>
                                                <span>{item.range}</span>{" "}
                                                <b>{item.from}</b>
                                                {" to "}
                                                <b>{item.to}</b>
                                            </>
                                        ) : item.to ? (
                                            <>
                                                <span>{item.range}</span>{" "}
                                                <b>{item.to}</b>
                                            </>
                                        ) : (
                                            <>
                                                <span>{item.range}</span>{" "}
                                                <b>{item.from}</b>
                                            </>
                                        )}{" "}
                                        patricipants
                                    </p>
                                    <p className="pricingDescription__textArea__price">
                                        {item.price === "free"
                                            ? "Free"
                                            : `$${item.price}`}
                                    </p>
                                </div>
                            </div>
                        </RadioBox>
                    ))}
                </div>
                <button className="btn">Choose your plan</button>
            </div>
        </div>
    );
}
