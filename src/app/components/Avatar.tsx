'use client';

import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react'
import useActiveList from '../hooks/useActiveList';


interface AvatarProps {
    user: User;
    isDetail?: Boolean;
    isImageFix?: Boolean;
    avtChat?: Boolean
}

const Avatar: React.FC<AvatarProps> = ({
    user,
    isDetail,
    isImageFix,
    avtChat
}) => {
    // console.log(user?.image)

    const { members } = useActiveList();
    const isActive = members.indexOf(user?.email!) !== -1;

    return (
        <div className={`relative ${isImageFix ? "h-11 w-11" : ""}`}>
            {isDetail ?
                <div className={isActive ? 'avatar avatar-online avatar-xl mx-5 mb-5' : 'avatar avatar avatar-xl mx-5 mb-5'}>
                    <Image
                        src={user?.image! || '/images/user.png'}
                        alt='User'
                        width={1000}
                        height={1000}
                        className="avatar-img"
                    />
                </div>
                :
                <div className={avtChat ? 'avatar avatar mr-4 mr-lg-5'
                    : isActive ? 'avatar avatar-online' : 'avatar avatar'}
                    style={{
                        height: avtChat && "2rem",
                        minHeight: avtChat && "2rem",
                        width: avtChat && "2rem",
                        minWidth: avtChat && "2rem",
                    }}
                >
                    <Image
                        src={user?.image! || '/images/user.png'}
                        alt='User'
                        width={500}
                        height={500}
                        className="avatar-img"
                        style={{
                            height: avtChat && "2rem",
                            minHeight: avtChat && "2rem",
                            width: avtChat && "2rem",
                            minWidth: avtChat && "2rem",
                        }}
                    />
                </div>
            }
        </div >
    )
}

export default Avatar
