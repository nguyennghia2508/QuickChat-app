'use client';

import React, { useEffect, useState } from 'react';
import { FullMessageType } from '@/app/types';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import './style.scss'
import { Avatar } from '@/app/components';
import { format } from 'date-fns';
import Image from 'next/image';
import { BsCheckAll } from 'react-icons/bs';
import ImageMoal from '../ImageModal';

interface MessageBoxProps {
    listItem: FullMessageType[]
    data: FullMessageType;
    isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({
    data,
    isLast,
    listItem
}) => {

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [showSenderName, setShowSenderName] = useState(false);
    const session = useSession();
    let currentMessage: FullMessageType;
    let prevMessage: FullMessageType | null;

    const isOwn = session?.data?.user?.email === data?.sender?.email;

    const seenList = (data.seen || [])
        .filter((user) => user?.email !== data?.sender?.email)
        .map((user) => user?.name)
        .join(', ');

    const container = clsx('message', isOwn ? 'message-right' : 'message-left');
    const avatar = clsx(isOwn && 'avatar avatar-sm ml-lg-5 d-none d-lg-block');
    const body = clsx('message-body');
    const message = clsx(
        'text-sm w-fit overflow-hidden px-4 py-2.5',
        isOwn ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-b-xl rounded-tl-xl' : 'bg-gray-100 rounded-b-xl rounded-tr-xl text-gray-800',
        data.image ? 'rounded-md p-0' : 'py-2 px-3'
    );

    useEffect(() => {
        const getPrevMessage = (currentIndex: number) => {
            // Tìm phần tử trước currentMessage mà không phải của người dùng hiện tại
            for (let i = currentIndex - 1; i >= 0; i--) {
                if (listItem[i].senderId !== session?.data?.user.id) {
                    return listItem[i];
                }
            }
            return null;
        };

        const updatedShowSenderNames = listItem.map((currentMessage, index) => {
            if (session?.data?.user) {
                if (listItem.length > 1) {
                    if (currentMessage.id === data.id && index === 0) {
                        setShowSenderName(true);
                    }
                    else if (currentMessage.id === data.id && index !== 0) {
                        if (currentMessage.senderId !== session.data.user.id) {
                            currentMessage = data;
                            const prevMessage = getPrevMessage(index);
                            if (!prevMessage) {
                                setShowSenderName(true)
                            }
                            else {
                                if (listItem[index - 1].senderId === session.data.user.id) {
                                    setShowSenderName(true);
                                }
                                else {
                                    const currentCreatedAt = new Date(currentMessage?.createdAt).getTime();
                                    const prevCreatedAt = new Date(prevMessage?.createdAt).getTime();

                                    const timeDiffInMilliseconds = currentCreatedAt - prevCreatedAt;
                                    const timeDiffInMinutes = timeDiffInMilliseconds / (1000 * 60);

                                    if (timeDiffInMinutes < 20) {
                                        setShowSenderName(false);
                                    } else if (timeDiffInMinutes >= 20) {
                                        setShowSenderName(true);
                                    }
                                }
                            }
                        }
                    }
                }
                else {
                    setShowSenderName(true)
                }
            }
        });
    }, [listItem, session.status === "authenticated"]);

    return (
        <>
            <div className={container}>
                {!isOwn &&
                    <div className={avatar}>
                        <Avatar user={data.sender} avtChat={true} />
                    </div>
                }
                <div className={body}>
                    <div className="message-row">
                        <div className={isOwn ? 'd-flex align-items-center justify-content-end' : data?.image ? 'd-flex align-items-start flex-column' : 'd-flex align-items-center'}>
                            {isOwn && <div className="dropdown">
                                <a className="text-muted opacity-60 ml-3" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fe-more-vertical"></i>
                                </a>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        Edit <span className="ml-auto fe-edit-3"></span>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        Share <span className="ml-auto fe-share-2"></span>
                                    </a>
                                    <a className="dropdown-item d-flex align-items-center" href="#">
                                        Delete <span className="ml-auto fe-trash-2"></span>
                                    </a>
                                </div>
                            </div>}
                            {!data.image &&
                                <>
                                    <div className={isOwn ? data?.image ? 'text-white' : 'message-content bg-primary text-white' : data?.image ? 'message-content bg-light' : 'message-content bg-light'}>
                                        {!isOwn && showSenderName && <h6 className='mb-2'>{data.sender.name}</h6>}

                                        <div id="message-text" className='text-break'>{data.body}</div>
                                        <div className={'d-flex flex gap-2 justify-content-end'}>
                                            <div className="mt-1 d-flex align-items-center">
                                                <small className="opacity-65">{format(new Date(data.createdAt), 'p')}</small>
                                            </div>
                                            {seenList.length > 0 && (
                                                <div className="text-xs text-blue-500 d-flex align-items-center">
                                                    <BsCheckAll className='w-4 h-4 text-current' color='blue' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {!isOwn && <div className="dropdown">
                                        <a className="text-muted opacity-60 ml-3" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fe-more-vertical"></i>
                                        </a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Edit <span className="ml-auto fe-edit-3"></span>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Share <span className="ml-auto fe-share-2"></span>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Delete <span className="ml-auto fe-trash-2"></span>
                                            </a>
                                        </div>
                                    </div>}
                                </>
                            }
                            {data?.image && isOwn ?
                                <div className=''>
                                    <div className={'d-flex justify-content-end'}>
                                        <ImageMoal
                                            src={data.image}
                                            isOpen={imageModalOpen}
                                            onClose={() => setImageModalOpen(false)}
                                        />
                                        <Image
                                            src={data.image}
                                            alt='Image'
                                            onClick={() => setImageModalOpen(true)}
                                            width={288}
                                            height={288}
                                            className='avatar-img cursor-pointer hover:opacity-75 transition'
                                        />
                                    </div>
                                    <div className={'d-flex flex gap-2 justify-content-end'}>
                                        <div className="mt-1 d-flex align-items-center">
                                            <small className="opacity-65">{format(new Date(data.createdAt), 'p')}</small>
                                        </div>
                                        {seenList.length > 0 && (
                                            <div className="text-xs text-blue-500 d-flex align-items-center">
                                                <BsCheckAll className='w-4 h-4 text-current' color='blue' />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                :
                                data?.image &&
                                <div className="d-flex align-items-center">
                                    <div className=''>
                                        {showSenderName && <div className={'message-content bg-light'}
                                            style={{ width: "100%", maxWidth: "100%", borderRadius: "0.625rem 0.625rem 0 0" }}
                                        >
                                            {<h6 className='mb-2'>{data.sender.name}</h6>}
                                        </div>
                                        }
                                        <div className={'d-flex justify-content-end'}>
                                            <ImageMoal
                                                src={data.image}
                                                isOpen={imageModalOpen}
                                                onClose={() => setImageModalOpen(false)}
                                            />
                                            <Image
                                                src={data.image}
                                                alt='Image'
                                                onClick={() => setImageModalOpen(true)}
                                                width={288}
                                                height={288}
                                                className='avatar-img cursor-pointer hover:opacity-75 transition'
                                            />
                                        </div>
                                        <div className={'d-flex flex gap-2 justify-content-end'}>
                                            <div className="mt-1 d-flex align-items-center">
                                                <small className="opacity-65">{format(new Date(data.createdAt), 'p')}</small>
                                            </div>
                                            {seenList.length > 0 && (
                                                <div className="text-xs text-blue-500 d-flex align-items-center">
                                                    <BsCheckAll className='w-4 h-4 text-current' color='blue' />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="dropdown">
                                        <a className="text-muted opacity-60 ml-3" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <i className="fe-more-vertical"></i>
                                        </a>
                                        <div className="dropdown-menu">
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Edit <span className="ml-auto fe-edit-3"></span>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Share <span className="ml-auto fe-share-2"></span>
                                            </a>
                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                Delete <span className="ml-auto fe-trash-2"></span>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                            }
                        </div>
                        {isLast && isOwn && seenList.length > 0 && (
                            <div className='opacity-65 d-flex justify-content-end mt-2' style={{ fontSize: "12px" }}>
                                {`Seen by ${seenList}`}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default MessageBox;
