/* eslint-disable indent */
import React, { useState } from "react";
import "./home-tabs.scss";

interface Tab {
    name: string;
    activeIcon: string;
    inactiveIcon: string;
}

const tabs: Tab[] = [
    { name: "Group", activeIcon: "/src/assets/icons/group-filled-ac.png", inactiveIcon: "/src/assets/icons/group-filled-in.png" },
    { name: "Last", activeIcon: "/src/assets/icons/clock-filled-ac.png", inactiveIcon: "/src/assets/icons/clock-filled-in.png" },
    { name: "Favorites", activeIcon: "/src/assets/icons/star-filled-ac.png", inactiveIcon: "/src/assets/icons/star-filled-in.png" },
];

const HomeTabs: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>("Group");

    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    return (
        <div className="homebar-main">
            {tabs.map((tab) => (
                <div
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
                </div>
            ))}
        </div>
    );
};

export default HomeTabs;
