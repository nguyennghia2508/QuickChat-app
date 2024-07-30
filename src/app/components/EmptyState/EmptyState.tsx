"use client"
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import './style.scss'
import { CgSpinner } from 'react-icons/cg';

const EmptyState = () => {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        // Show content when session data is loaded and user name is available
        setIsLoading(true)
        if (session?.user?.name) {
            setShowContent(true);
            setIsLoading(false)
        }
    }, [status === "authenticated", session?.user]);

    return (
        <div className="main" data-mobile-height="">
            <div className="chat flex-column justify-content-center text-center">
                <div className="container-xxl">
                    <div className="avatar avatar-lg mb-5">
                        <img className="avatar-img" src={session?.user.image || '/images/user.png'} alt="" />
                    </div>

                    <div className={`fade-in ${showContent ? 'visible' : ''}`}>
                        {session?.user?.name && (
                            isLoading ?
                                <CgSpinner className='w-5 h-5 text-current animate-spin' />
                                :
                                <>
                                    <h6>Hey, {session.user.name}!</h6>
                                    <p>Please select a chat to start messaging.</p>
                                </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmptyState;