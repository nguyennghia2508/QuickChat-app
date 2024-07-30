'use client';

import { User } from '@prisma/client';
import React, { useState } from 'react'
import UserBox from './UserBox';
import { FullConversationType } from '@/app/types';


interface UserListsProps {
    items: User[];
}

const UserLists: React.FC<UserListsProps> = ({
    items,
}) => {

    return (
        <nav className="nav d-block list-discussions-js mb-n6">
            {items?.map((item) => (
                <UserBox
                    key={item.id}
                    data={item}
                />
            ))}
        </nav >
    )
}

export default UserLists
