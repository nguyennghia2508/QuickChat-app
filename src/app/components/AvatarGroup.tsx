'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import useActiveList from '../hooks/useActiveList';


interface AvatarGroupProps {
    users?: User[];
    isDetail?: Boolean;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
    users,
    isDetail
}) => {

    const slicedUsers = users?.slice(0, 3);

    const positionMap = {
        0: 'top-0 left-[12px]',
        1: 'bottom-0',
        2: 'bottom-0 right-0'
    }

    const { members } = useActiveList();
    const isActive = users?.map((item, index) => {
        if (item.email) {
            if (members.includes(item?.email)) {
                return true
            }
        }
        return false
    })

    return (
        <div className='relative h-11 w-11'>
            {slicedUsers?.map((user, index) => (
                <div
                    key={user.id}
                    className={`absolute inline-block rounded-full overflow-hidden w-[21px] h-[21px] ${positionMap[index as keyof typeof positionMap]}`}
                >
                    <Image
                        src={user?.image || '/images/user.png'}
                        fill
                        alt='Avatar'
                    />
                </div>
            ))}
        </div>
    )
}

export default AvatarGroup
