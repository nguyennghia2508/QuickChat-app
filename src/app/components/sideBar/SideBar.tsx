
import ChatTab from "../tab/chats/ChatTab"
import React, { useEffect, useState } from 'react';
import getCurrentUser from '@/app/actions/getCurrentUser';
import { User } from '@prisma/client';
import './style.scss'

const SideBar = ({
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
    return (
        <>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="tab-content h-100" role="tablist">
                    <ChatTab title={title} currentUser={currentUser} users={users} createGroup={createGroup}>
                        {children}
                    </ChatTab>
                </div>
            </div>
            {/* Sidebar */}
        </>
    )
}

export default SideBar