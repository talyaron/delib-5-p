import { useState } from "react";
import pricingImg from "../../../assets/images/pricing.png";
import RadioBox from "../../components/radioBox/RadioBox";

export default function ChoosePrice() {
    const [plan, setPlan] = useState("free");

    return (
        <div className="page">
            <div className="pricing">
                <h1 className="pricing__title">Pricing plans</h1>
                <img src={pricingImg} alt="pricing-illustration" width="50%" />
                <p className="pricing__text">
                    Select the appropriate plan to maximize your performance and
                    get better results.
                </p>
                <RadioBox
                    currentValue={plan}
                    setCurrentValue={setPlan}
                    radioValue="free"
                >
                    <div>PLAN</div>
                </RadioBox>
                <RadioBox
                    currentValue={plan}
                    setCurrentValue={setPlan}
                    radioValue="10"
                >
                    <div>PLAN</div>
                </RadioBox>
                <RadioBox
                    currentValue={plan}
                    setCurrentValue={setPlan}
                    radioValue="30"
                >
                    <div>PLAN</div>
                </RadioBox>
                <RadioBox
                    currentValue={plan}
                    setCurrentValue={setPlan}
                    radioValue="50"
                >
                    <div>PLAN</div>
                </RadioBox>
                <RadioBox
                    currentValue={plan}
                    setCurrentValue={setPlan}
                    radioValue="100"
                >
                    <div>PLAN</div>
                </RadioBox>
                <button className="settings__submitBtn">
                    Choose your plan
                </button>
            </div>
        </div>
    );
}
