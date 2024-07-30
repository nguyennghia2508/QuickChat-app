'use client';

import React, { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Conversation, Message, User } from '@prisma/client';
import { format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { FullConversationType } from '@/app/types';
import useOtherUser from '@/app/hooks/useOtherUser';
import { Avatar, AvatarGroup } from '@/app/components';
import MainContent from '@/app/components/mainContent/MainContent';

interface ConversationBoxProps {
    data: FullConversationType;
    selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({
    data,
    selected
}) => {

    const otherUser = useOtherUser(data);
    const session = useSession();
    const router = useRouter();

    const handleClick = useCallback(() => {
        router.push(`/conversations/${data.id}`);
    }, [data, router]);

    const lastMessage = useMemo(() => {
        const messages = data.messages || [];

        return messages[messages.length - 1];
    }, [data.messages]);

    const unSeenMessageLength = () => {
        const messages = data?.messages || [];

        // here filter or map through data array & get those unseen messages[messages.length-1];

        // display the last message is send by the current user then show that last message text to "You: message" 
    };

    const userEmail = useMemo(() => session.data?.user?.email,
        [session.data?.user?.email]);

    const hasSeen = useMemo(() => {
        if (!lastMessage) {
            return false;
        }

        const seenArray = lastMessage.seen || [];

        if (!userEmail) {
            return false;
        }

        return seenArray
            .filter((user: any) => user.email === userEmail).length !== 0;
    }, [userEmail, lastMessage]);

    const lastMessageText = useMemo(() => {
        if (lastMessage?.image) {
            return 'Sent an image';
        }

        if (lastMessage?.body) {
            return lastMessage.body;
        }

        return 'Started a conversation';
    }, [lastMessage]);

    return (
        <a
            onClick={handleClick}
            className='text-reset nav-link p-0 mb-6'
        >
            <div className="card card-active-listener cursor-pointer hover:opacity-75 transition">
                <div className="card-body">
                    <div className="media">
                        {data.isGroup ? (
                            <AvatarGroup users={data?.users} />
                        ) : (
                            <Avatar user={otherUser} />
                        )}
                        <div className="media-body overflow-hidden ml-5">
                            <div className="d-flex align-items-center mb-1">
                                <h6 className="text-truncate mb-0 mr-auto">{data.name || otherUser?.name}</h6>
                                {lastMessage?.createdAt && (
                                    <p className="small text-muted text-nowrap ml-4">{format(new Date(lastMessage.createdAt), 'p')}</p>
                                )}
                            </div>
                            <div className={`${hasSeen ? 'text-truncate space-x-3' : !lastMessage ? 'text-truncate space-x-3' : 'text-truncate font-weight-bold'}`}
                            >
                                {lastMessageText}
                            </div>
                        </div>
                    </div>

                </div>
                {!hasSeen &&
                    <div className="badge badge-circle badge-primary badge-border-light badge-top-right">
                        <span>!</span>
                    </div>
                }

            </div>
        </a>
    )
}

export default ConversationBox
