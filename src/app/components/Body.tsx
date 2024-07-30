'use client';

import useConversation from '@/app/hooks/useConversation';
import { FullMessageType } from '@/app/types';
import React, { useEffect, useRef, useState } from 'react';
import MessageBox from './MessageBox/MessageBox';
import axios from 'axios';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';

interface BodyProps {
    initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({
    initialMessages
}) => {

    const [messages, setMessages] = useState(initialMessages);
    const bottomRef = useRef<HTMLDivElement>(null);
    const chatBodyRef = useRef<HTMLDivElement>(null);

    const { conversationId } = useConversation();

    useEffect(() => {
        axios.post(`/api/conversations/${conversationId}/seen`);
    }, [conversationId]);

    useEffect(() => {
        pusherClient.subscribe(conversationId);

        const messageHandler = (message: FullMessageType) => {
            axios.post(`/api/conversations/${conversationId}/seen`);

            setMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                bottomRef?.current?.scrollIntoView({ behavior: 'smooth' });

                return [...current, message];
            });
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }

                return currentMessage;
            }));
        };

        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unsubscribe(conversationId);
            pusherClient.unbind('messages:new', messageHandler);
            pusherClient.unbind('message:update', updateMessageHandler);
        };
    }, [conversationId]);

    useEffect(() => {
        bottomRef?.current?.scrollIntoView();
    }, [messages]);

    useEffect(() => {
        if (!chatBodyRef.current) return;

        const resizeObserver = new ResizeObserver(() => {
            bottomRef?.current?.scrollIntoView();
        });

        resizeObserver.observe(chatBodyRef.current);

        return () => resizeObserver.disconnect();
    }, [messages]);

    return (
        <div className="chat-body overflow-y-auto" ref={chatBodyRef}>
            {/* Chat: Content*/}
            <div className="chat-content px-lg-8">
                <div className="container-xxl py-6 py-lg-10">
                    {/* Message */}
                    {messages?.map((message, i) => (
                        <MessageBox
                            key={message.id}
                            listItem={messages}
                            isLast={i === messages.length - 1}
                            data={message}
                        />
                    ))}
                    {/* Message */}
                </div>
                {/* Scroll to end */}
                <div ref={bottomRef} id="bottom" className='bottom'></div>
            </div>
            {/* Chat: Content */}
        </div>
    );
};

export default Body;
