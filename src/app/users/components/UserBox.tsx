'use client';

import { Avatar, LoadingModal } from '@/app/components';
import { User } from '@prisma/client'
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useCallback, useState } from 'react'


interface UserBoxProps {
    data: User;
}

const UserBox: React.FC<UserBoxProps> = ({
    data
}) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = useCallback(() => {
        setIsLoading(true);

        axios.post('/api/conversations', { userId: data.id })
            .then((data) => {
                router.push(`/conversations/${data.data.id}`);
            })
        // .finally(() => setIsLoading(false));
    }, [data, router]);


    return (
        <div>
            {isLoading && (
                <LoadingModal />
            )}
            <a
                onClick={handleClick}
                className='text-reset nav-link p-0 mb-6'
            >
                <div className="card card-active-listener cursor-pointer hover:opacity-75 transition">
                    <div className="card-body">
                        <div className="media">
                            <Avatar user={data!} />
                            <div className="media-body overflow-hidden ml-5">
                                <div className="d-flex align-items-center mb-1">
                                    <h6 className="text-truncate mb-0 mr-auto">{data?.name}</h6>
                                </div>
                                <div className="text-truncate">Open chat</div>
                            </div>
                        </div>

                    </div>
                    {/* 
                    <div className="badge badge-circle badge-primary badge-border-light badge-top-right">
                        <span>3</span>
                    </div> */}
                </div>
            </a>
        </div>
    )
}

export default UserBox
