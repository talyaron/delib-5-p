/* eslint-disable indent */
import React, { useState } from "react";
import "./home-tabs.scss";
import GroupActive from "@/assets/icons/group-filled-ac.png"
import ClockActive from "@/assets/icons/clock-filled-ac.png"
import StarActive from "@/assets/icons/star-filled-ac.png"
import Group from "@/assets/icons/group-filled-in.png";
import Clock from "@/assets/icons/clock-filled-in.png";
import Star from "@/assets/icons/star-filled-in.png";



interface Tab {
    name: string;
    activeIcon: string;
    inactiveIcon: string;
}

const tabs: Tab[] = [
    { name: "Group", activeIcon: GroupActive, inactiveIcon: Group },
    { name: "Last", activeIcon: ClockActive, inactiveIcon:Clock },
    { name: "Favorites", activeIcon: StarActive, inactiveIcon: Star },
];

const HomeTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("Group");

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className="homebar-main">
            {tabs.map((tab) => (
                <button
                    key={tab.name}
                    className={`homebar-main__tab ${activeTab === tab.name ? "active" : "inactive"}`}
                    onClick={() => handleTabClick(tab.name)}
                >
                    <img
                        className="homebar-main__icon"
                        src={activeTab === tab.name ? tab.activeIcon : tab.inactiveIcon}
                        alt={`${tab.name} icon`}
                    />
                    <p className={activeTab === tab.name ? "active-title" : "inactive-title"}>{tab.name}</p>
                </button>
            ))}
        </div>
    );
};

export default HomeTabs;
