
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
}: {
    title: String;
    children: React.ReactNode;
    users: User[];
    createGroup: Boolean;
}) => {
    return (
        <>
            {/* Sidebar */}
            <div className="sidebar">
                <div className="tab-content h-100" role="tablist">
                    <ChatTab title={title} users={users} createGroup={createGroup}>
                        {children}
                    </ChatTab>
                </div>
            </div>
            {/* Sidebar */}
        </>
    )
}

export default SideBar