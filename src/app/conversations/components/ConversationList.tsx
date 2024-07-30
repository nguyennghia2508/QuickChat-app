'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullConversationType } from '@/app/types';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react'
import { IoPeople } from 'react-icons/io5';
import ConversationBox from './ConversationBox';
// import GroupChatModal from './GroupChatModal';
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';


interface ConversationListProps {
    initialItems: FullConversationType[];
    users: User[];
}

const ConversationList: React.FC<ConversationListProps> = ({
    initialItems,
    users
}) => {

    const session = useSession();

    const [items, setItems] = useState(initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const router = useRouter();

    const { conversationId, isOpen } = useConversation();

    const pusherKey = useMemo(() => {
        return session?.data?.user?.email;
    }, [session?.data?.user?.email]);

    useEffect(() => {
        if (!pusherKey) {
            return;
        }

        pusherClient.subscribe(pusherKey);

        const updateHandler = (conversation: FullConversationType) => {
            setItems((current) => current.map((currentConversation) => {
                if (currentConversation.id === conversation.id) {
                    return {
                        ...currentConversation,
                        messages: conversation.messages
                    };
                }

                return currentConversation;
            }));
        }

        const newHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                if (find(current, { id: conversation.id })) {
                    return current;
                }

                return [conversation, ...current]
            });
        }

        const removeHandler = (conversation: FullConversationType) => {
            setItems((current) => {
                return [...current.filter((convo) => convo.id !== conversation.id)]
            });
        }

        pusherClient.bind('conversation:update', updateHandler)
        pusherClient.bind('conversation:new', newHandler)
        pusherClient.bind('conversation:remove', removeHandler)
    }, [pusherKey, router]);

    return (
        <>
            <nav className="nav d-block list-discussions-js mb-n6">
                {items?.map((item) => (
                    <ConversationBox
                        key={item.id}
                        data={item}
                        selected={conversationId === item.id}
                    />
                ))}
                {/* Chat link */}
                {/* <a className="text-reset nav-link p-0 mb-6" href="#chats-friend-1">
                <div className="card card-active-listener">
                    <div className="card-body">

                        <div className="media">


                            <div className="avatar mr-5">
                                <img style={{ width: '100%', height: 'auto' }} className="avatar-img" src="images/avatars/11.jpg" alt="Bootstrap Themes" />
                            </div>

                            <div className="media-body overflow-hidden">
                                <div className="d-flex align-items-center mb-1">
                                    <h6 className="text-truncate mb-0 mr-auto">Bootstrap Themes</h6>
                                    <p className="small text-muted text-nowrap ml-4">10:42 am</p>
                                </div>
                                <div className="text-truncate">Anna Bridges: Hey, Maher! How are you? The weather is great isn't it?</div>
                            </div>
                        </div>

                    </div>


                    <div className="badge badge-circle badge-primary badge-border-light badge-top-right">
                        <span>3</span>
                    </div>

                </div>
            </a> */}
                {/* Chat link */}
            </nav >
        </>
    )
}

export default ConversationList
