
"use client"
import { User } from "@prisma/client";
import SideBarItem from "../sideBar/SideBarItem";
import "./navBar.scss"
import { useState } from "react";
import useRoutes from "@/app/hooks/useRoutes";
import Avatar from "../Avatar";
import SettingsModal from "../sideBar/SettingModal";
interface SideBarProps {
    user: User;
}

const NavBar: React.FC<SideBarProps> = ({ user }) => {
    const routes = useRoutes();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <SettingsModal
                currentUser={user}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
            {/* Navbar */}
            <div className="navigation navbar navbar-light justify-content-center py-xl-7">
                {/* Brand */}
                <a href="#" className="d-none d-xl-block mb-2" id="index">
                    <div className="mx-auto fill-primary" id="logo"></div>
                </a>

                {/* Menu */}
                <ul className="nav navbar-nav flex-row flex-xl-column flex-grow-1 py-3 py-lg-0" role="tablist">

                    {routes.map((route, index) => (
                        <SideBarItem
                            key={route.label}
                            href={route.href}
                            label={route.label}
                            icon={route.icon}
                            active={route.active}
                            onClick={route.onClick}
                            style={{ animationDelay: `${index * 0.5}s` }}
                            className="fade-in"
                        />
                    ))}
                </ul>
                {/* Menu */}

                <nav className="sideBar-avt flex flex-col justify-between items-center mt-8">
                    <div
                        onClick={() => setIsOpen(true)}
                        className="cursor-pointer hover:opacity-75 transition"
                        title="Edit profile"
                    >
                        <Avatar user={user} />
                    </div>
                </nav>

            </div>
            {/* Navbar */}
        </>
    )
}

export default NavBar