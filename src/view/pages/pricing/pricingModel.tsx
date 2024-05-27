// icons
import GroupCommunicationOne from "../../../assets/icons/groupCommunicationOneIcon.svg?react";
import GroupCommunicationTwo from "../../../assets/icons/groupCommunicationTwoIcon.svg?react";
import GroupCommunicationThree from "../../../assets/icons/groupCommunicationThreeIcon.svg?react";
import GroupCommunicationFour from "../../../assets/icons/groupCommunicationFourIcon.svg?react";
import GroupCommunicationFive from "../../../assets/icons/groupCommunicationFiveIcon.svg?react";
import { ReactNode } from "react";

interface PricePlan {
    price: string;
    range: string;
    icon: ReactNode;
    from?: number;
    to?: number;
}

export const pricingPlans: PricePlan[] = [
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
