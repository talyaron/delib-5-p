import { ReactNode, useState } from "react";
import pricingImg from "../../../assets/images/pricing.png";

import { useAppSelector } from "../../../functions/hooks/reduxHooks";
import { userSelector } from "../../../model/users/userSlice";
import { useNavigate } from "react-router-dom";

// icons
import GroupCommunicationOne from "../../../assets/icons/groupCommunicationOneIcon.svg?react";
import GroupCommunicationTwo from "../../../assets/icons/groupCommunicationTwoIcon.svg?react";
import GroupCommunicationThree from "../../../assets/icons/groupCommunicationThreeIcon.svg?react";
import GroupCommunicationFour from "../../../assets/icons/groupCommunicationFourIcon.svg?react";
import GroupCommunicationFive from "../../../assets/icons/groupCommunicationFiveIcon.svg?react";
import RadioBox from "../../components/radioBox/RadioBox";

interface PricePlan {
    price: string;
    range: string;
    icon: ReactNode;
    from?: number;
    to?: number;
}

export default function PricingPlan() {
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
            icon: <GroupCommunicationTwo />,
            from: 11,
            to: 100,
        },
        {
            price: "30",
            range: "Groups from",
            icon: <GroupCommunicationThree />,
            from: 101,
            to: 300,
        },
        {
            price: "50",
            range: "Groups from",
            icon: <GroupCommunicationFour />,
            from: 301,
            to: 1000,
        },
        {
            price: "100",
            range: "Groups from",
            icon: <GroupCommunicationFive />,
            from: 1001,
        },
    ];

    const navigate = useNavigate();

    const [plan, setPlan] = useState("free");

    const user = useAppSelector(userSelector);

    const handleChoosePlan = () => {
        if (plan === "free") {
            navigate("/home/addStatment", {
                state: { from: window.location.pathname },
            });

            return;
        }

        if (user?.isAnonymous) {
            navigate("/login-first", {
                state: { from: window.location.pathname },
            });
        }

        // Else navigate to payment page....
    };

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
                                        participants
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
                <button className="btn" onClick={handleChoosePlan}>
                    Choose your plan
                </button>
            </div>
        </div>
    );
}
