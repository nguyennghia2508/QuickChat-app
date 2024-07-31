"use client"

import { User } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import GroupChatModal from '../../GroupChatModal';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import SettingsModal from '../../sideBar/SettingModal';
import Avatar from '../../Avatar';
// import { setChatTabState } from "@/app/store/features/chatTabSlice";
// import { useAppDispatch } from "@/app/store";

const ChatTab = ({
    title,
    children,
    users,
    createGroup,
    currentUser,
}: {
    title: String;
    children: React.ReactNode;
    users: User[];
    createGroup: Boolean;
    currentUser: User | null;
}) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenProfile, setIsOpenProfile] = useState(false);

    return (
        <>
            <div className="tab-pane fade h-100 show active" id="tab-content-dialogs" role="tabpanel">
                <div className="d-flex flex-column h-100">

                    <div className="hide-scrollbar">
                        <div className="container-fluid py-6">

                            {createGroup ? (
                                <>
                                    <div className="">
                                        <div className="flex justify-between">
                                            {/* Title */}
                                            <h2 className="font-bold mb-6">{title}</h2>
                                            {/* Title */}
                                            <div
                                                onClick={() => setIsModalOpen(true)}
                                                title="Create a group chat"
                                                className="rounded-full p-2 d-flex flex-column nav-link active hover:opacity-75 transition cursor-pointer"
                                            >
                                                <i className="fe-users w-5 h-5 text-current"
                                                    style={{ fontSize: "20px" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <GroupChatModal
                                        users={users}
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                    />
                                </>

                            )
                                :
                                <div className='d-flex flex-row justify-between'>
                                    <SettingsModal
                                        currentUser={currentUser!}
                                        isOpen={isOpenProfile}
                                        onClose={() => setIsOpenProfile(false)}
                                    />
                                    <h2 className="font-bold mb-6">{title}</h2>
                                    <div
                                        onClick={() => setIsOpenProfile(true)}
                                        className="d-xl-none cursor-pointer hover:opacity-75 transition"
                                        title="Edit profile"
                                    >
                                        <Avatar user={currentUser!} />
                                    </div>
                                </div>
                            }
                            {/* Search */}
                            <form className="mb-6">
                                <div className="input-group">
                                    <input type="text" className="form-control form-control-lg" placeholder="Search for messages or users..." aria-label="Search for messages or users..." />
                                    <div className="input-group-append">
                                        <button className="btn btn-lg btn-ico btn-secondary btn-minimal" type="submit">
                                            <i className="fe-search"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                            {/* Search */}

                            {/* Chats */}
                            {children}
                            {/* Chats */}

                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default ChatTab