"use client"

import { useEffect, useMemo, useState, ChangeEvent } from 'react';
import { EmojiButton } from '@joeattardi/emoji-button';
import "./mainContent.scss"
import $ from 'jquery';
import { Conversation, User } from '@prisma/client';
import { FullConversationType, FullMessageType } from '@/app/types';
import useConversation from '@/app/hooks/useConversation';
import Body from '../Body';
import { format } from 'date-fns';
import Form from '../Form';
import useActiveList from '@/app/hooks/useActiveList';
import useOtherUser from '@/app/hooks/useOtherUser';
import AvatarGroup from '../AvatarGroup';
import Avatar from '../Avatar';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import ImageMoal from '../ImageModal';
import { pusherClient } from '@/app/libs/pusher';
import { find } from 'lodash';
import { useSession } from 'next-auth/react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

interface MainContentProps {
    conversation: Conversation & {
        users: User[];
    };
    messages: FullMessageType[];
}

const MainContent: React.FC<MainContentProps> = ({
    conversation,
    messages
}) => {

    const router = useRouter();
    const session = useSession()
    const [newMessages, setNewMessages] = useState(messages);
    const otherUser: User = useOtherUser(conversation);
    const { conversationId, isOpen } = useConversation();
    const { members } = useActiveList()
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [detailslOpen, setDetailslOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const isActive = members.indexOf(otherUser?.email!) !== -1;

    const joinedDate = useMemo(() => {
        return format(new Date(conversation?.createdAt), 'PP');
    }, [conversation?.createdAt]);


    const highlightText = (text: string, search: string) => {
        if (search === '') {
            return text
        }
        else {
            const regex = new RegExp(`(${search})`, 'gi');
            return `${text.replace(regex, '<mark>$1</mark>')}`;
        }
    };

    const normalText = (text: string, search: string) => {
        const regex = new RegExp(`(${search})`, 'gi');
        return text.replace(regex, '$1');
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const elements = document.querySelectorAll("#message-text");
        let found = false;
        let bottom = document.getElementById("bottom");

        elements.forEach((element) => {
            const divText = element.textContent?.toLowerCase();
            console.log(divText);
            if (divText?.includes(e.target.value.toLowerCase())) {
                // Highlight the search text
                const highlightedText = highlightText(element.textContent || '', e.target.value);
                element.innerHTML = highlightedText;

                element.scrollIntoView();
                found = true;
                return;
            } else {
                element.innerHTML = normalText(element.textContent || '', e.target.value);
                // bottom?.scrollIntoView();
            }
        });

        if (e.target.value === '') {
            bottom?.scrollIntoView();
        }

        if (!found) {
            console.log("The div text doesn't contain search text");
        }
    };


    const isActiveMember = (user: User) => {
        return members.indexOf(user.email!) !== -1;
    };

    const isActiveGroup = conversation?.users?.map((item, index) => {
        if (item.email) {
            if (members.includes(item?.email)) {
                return true
            }
            else {
                return false
            }
        }
    })

    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleImageClick = (src: string | null) => {
        setSelectedImage(src);
        setImageModalOpen(true);
    };

    const statusText = useMemo(() => {
        if (conversation?.isGroup) {
            return `${conversation?.users?.length} members`;
        }
        return isActive ? 'Online' : 'Offline';
    }, [conversation, isActive]);

    useEffect(() => {

        const messageHandler = (message: FullMessageType) => {
            setNewMessages((current) => {
                if (find(current, { id: message.id })) {
                    return current;
                }

                return [...current, message];
            });
        };

        const updateMessageHandler = (newMessage: FullMessageType) => {
            setNewMessages((current) => current.map((currentMessage) => {
                if (currentMessage.id === newMessage.id) {
                    return newMessage;
                }

                return currentMessage;
            }));
        };

        pusherClient.bind('messages:new', messageHandler);
        pusherClient.bind('message:update', updateMessageHandler);

        return () => {
            pusherClient.unbind('messages:new', messageHandler);
            pusherClient.unbind('message:update', updateMessageHandler);
        };
    }, [conversationId]);

    useEffect(() => {
        // Sử dụng jQuery trong useEffect để đảm bảo nó chạy sau khi component được render
        $(document).ready(function () {

            [].forEach.call(document.querySelectorAll('[data-horizontal-scroll]'), function (el: any) {
                function scrollHorizontally(e: any) {
                    e = window.event || e;
                    var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
                    el.scrollLeft -= (delta * 28);
                    e.preventDefault();
                }

                if (el.addEventListener) {
                    el.addEventListener("mousewheel", scrollHorizontally, false);
                    el.addEventListener("DOMMouseScroll", scrollHorizontally, false);
                } else {
                    el.attachEvent("onmousewheel", scrollHorizontally);
                }
            });

            var isMobile = {
                Android: function () {
                    return navigator.userAgent.match(/Android/i);
                },
                BlackBerry: function () {
                    return navigator.userAgent.match(/BlackBerry/i);
                },
                iOS: function () {
                    return navigator.userAgent.match(/iPhone|iPod|iPad/i);
                },
                Opera: function () {
                    return navigator.userAgent.match(/Opera Mini/i);
                },
                Windows: function () {
                    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
                },
                any: function () {
                    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
                }
            };

            //
            // Modified accordion(settings.html)
            //

            if (!isMobile.any()) {
                [].forEach.call(document.querySelectorAll('.modified-accordion [data-toggle="collapse"]'), function (e: any) {
                    e.addEventListener('click', function (event: any) {
                        event.preventDefault();
                        event.stopPropagation();
                    });
                });

                [].forEach.call(document.querySelectorAll('.modified-accordion .collapse'), function (e: any) {
                    e.classList.add('show');
                });
            }

            //
            // Emoji
            //

            if (!isMobile.any()) {
                [].forEach.call(document.querySelectorAll('[data-emoji-form]'), function (form: any) {
                    var button = form.querySelector('[data-emoji-btn]');

                    var picker = new EmojiButton({
                        position: "top",
                        zIndex: 1020
                    });

                    picker.on('emoji', function (emoji: any) {
                        form.querySelector('[data-emoji-input]').value += emoji;
                    });

                    let isPickerVisible = false; // Biến để theo dõi trạng thái của picker

                    button.addEventListener('click', function () {
                        if (isPickerVisible) {
                            picker.hidePicker();
                            isPickerVisible = false;
                        } else {
                            picker.showPicker(button);
                            isPickerVisible = true;
                        }
                    });
                });
            } else {
                [].forEach.call(document.querySelectorAll('[data-emoji-form]'), function (form: any) {
                    form.querySelector('[data-emoji-btn]').style.display = 'none';
                });
            }


            //
            // Close all chat`s sidebars
            //

            [].forEach.call(document.querySelectorAll('[data-chat-sidebar-close]'), function (a: any) {
                a.addEventListener('click', function (event: any) {
                    event.preventDefault();
                    document.body.classList.remove('sidebar-is-open');
                    [].forEach.call(document.querySelectorAll('.chat-sidebar'), function (a: any) {
                        a.classList.remove('chat-sidebar-visible');
                    });
                }, false);
            });

            function mobileScreenHeight() {
                if (document.querySelectorAll('.navigation').length && document.querySelectorAll('.sidebar').length) {
                    var sideBar = document.querySelector('.sidebar') as HTMLElement;
                    var navigation = document.querySelector('.navigation') as HTMLElement;
                    if (sideBar && navigation) {
                        sideBar.style.height = windowHeight - navigation.offsetHeight + 'px';
                    }
                }
            }

            if (isMobile.any() && (document.documentElement.clientWidth < 1024)) {
                var windowHeight = document.documentElement.clientHeight;
                mobileScreenHeight();

                window.addEventListener('resize', function (event) {
                    if (document.documentElement.clientHeight != windowHeight) {
                        windowHeight = document.documentElement.clientHeight;
                        mobileScreenHeight();
                    }
                });
            }

            window.addEventListener('load', function () {
                // Lấy phần tử .dropzone-previews-js
                var dropzonePreviews = document.querySelector('.dropzone-previews-js') as HTMLElement;
                if (dropzonePreviews) {
                    var colLG4Elements = dropzonePreviews.querySelectorAll('.col-lg-4');

                    var additionalHeight = 20; // Số pixel cần thêm cho mỗi phần tử .col-lg-4
                    var newHeight = 100 + (colLG4Elements.length * additionalHeight);

                    dropzonePreviews.style.height = newHeight + 'px';
                }
            });

        });
    }, [isOpen]);

    useEffect(() => {
        if (typeof document === 'undefined') return; // Guard clause for SSR

        return () => {
            //
            // Toggle chat`s sidebar
            //

            document.querySelectorAll('[data-chat-sidebar-toggle]').forEach(e => {
                e.addEventListener('click', function (event: any) {
                    event.preventDefault();
                    var chat_sidebar_id = e.getAttribute('data-chat-sidebar-toggle');
                    if (chat_sidebar_id) {
                        var chat_sidebar = document.querySelector(chat_sidebar_id);

                        if (typeof (chat_sidebar) != 'undefined' && chat_sidebar != null) {
                            if (chat_sidebar.classList.contains('chat-sidebar-visible')) {
                                chat_sidebar.classList.remove('chat-sidebar-visible')
                                document.body.classList.remove('sidebar-is-open');
                            } else {
                                document.querySelectorAll('.chat-sidebar').forEach(e => {
                                    e.classList.remove('chat-sidebar-visible');
                                    document.body.classList.remove('sidebar-is-open');
                                });
                                chat_sidebar.classList.add('chat-sidebar-visible');
                                document.body.classList.add('sidebar-is-open');
                            }
                        }
                    }
                });
            })

        };
    }, [isOpen]);

    useEffect(() => {
        if (typeof document === 'undefined') return; // Guard clause for SSR

        // Cleanup function to remove event listeners
        return () => {
            document.querySelectorAll('[data-chat="open"]').forEach(a => {
                a.addEventListener('click', function (event) {
                    var main = document.querySelector('.main')
                    if (main) {
                        main.classList.toggle('main-visible');
                        event.preventDefault();
                        event.stopPropagation();
                    }
                }, false);
            });
        };
    }, [isOpen]);

    return (
        <>
            {isOpen ?
                <div className={isOpen ? `main main-visible` : `main`} data-mobile-height="" style={{ zIndex: "5" }}>
                    <div className="chat dropzone-form-js">
                        {/* Chat: body */}
                        <div className="chat-body">
                            <ConfirmModal
                                isOpen={isConfirmModalOpen}
                                onClose={() => setIsConfirmModalOpen(false)}
                            />
                            {/* Chat: Header */}
                            <div className="chat-header border-bottom py-4 py-lg-6 px-lg-8">
                                <div className="container-xxl">

                                    <div className="row align-items-center">

                                        {/* Close chat(mobile) */}
                                        <div className="col-3 d-xl-none">
                                            <ul className="list-inline mb-0">
                                                <li className="list-inline-item">
                                                    <a className="text-muted px-0" onClick={() => router.push('/conversations')}>
                                                        <i className="icon-md fe-chevron-left" />
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>

                                        {/* Chat photo */}
                                        <div className="col-6 col-xl-6">
                                            <div className="media text-center text-xl-left">
                                                <div className="d-none d-xl-inline-block mr-5">
                                                    {conversation.isGroup ? (
                                                        <AvatarGroup users={conversation?.users} />

                                                    ) : (
                                                        <Avatar user={otherUser} isImageFix={true} />
                                                    )}
                                                </div>

                                                <div className="media-body align-self-center text-truncate">
                                                    <h6 className="text-truncate mb-n1">{conversation.name || otherUser.name}</h6>
                                                    {conversation.isGroup ? (
                                                        <>
                                                            <small className="text-muted">{statusText}</small>
                                                            <small className="text-muted mx-2"> • </small>
                                                            <small className="text-muted">{
                                                                isActiveGroup.filter(member => member).length > 0
                                                                    ? `${isActiveGroup.filter(member => member).length} Online` : "Offline"}</small>
                                                        </>
                                                    ) : (
                                                        <small className="text-muted">{statusText}</small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Chat toolbar */}
                                        <div className="col-3 col-xl-6 text-right">
                                            <ul className="nav justify-content-end">
                                                <li className="nav-item list-inline-item d-none d-xl-block mr-5 cursor-pointer">
                                                    <a className="nav-link text-muted px-3" data-toggle="collapse" data-target="#chat-search" title="Search this chat">
                                                        <i className="icon-md fe-search"></i>
                                                    </a>
                                                </li>
                                                {conversation.isGroup &&
                                                    <li className="nav-item list-inline-item d-none d-xl-block mr-3 cursor-pointer">
                                                        <a className="nav-link text-muted px-3" data-chat-sidebar-toggle="#chat-members" title="Add People">
                                                            <i className="icon-md fe-user-plus"></i>
                                                        </a>
                                                    </li>
                                                }

                                                <li className="nav-item list-inline-item d-none d-xl-block mr-0 cursor-pointer">
                                                    <a className="nav-link text-muted px-3" title="Details" onClick={() => setDetailslOpen(true)}>
                                                        <i className="icon-md fe-more-vertical"></i>
                                                    </a>
                                                </li>

                                                {/* Mobile nav */}
                                                <li className="nav-item list-inline-item d-block d-xl-none">
                                                    <div className="dropdown">
                                                        <a className="nav-link text-muted px-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <i className="icon-md fe-more-vertical"></i>
                                                        </a>
                                                        <div className="dropdown-menu">
                                                            <a className="dropdown-item d-flex align-items-center" data-toggle="collapse" data-target="#chat-search">
                                                                Search <span className="ml-auto pl-5 fe-search"></span>
                                                            </a>

                                                            <a className="dropdown-item d-flex align-items-center" >
                                                                Chat Info <span className="ml-auto pl-5 fe-more-horizontal" onClick={() => setDetailslOpen(true)}></span>
                                                            </a>
                                                            {conversation.isGroup &&
                                                                <a className="dropdown-item d-flex align-items-center" data-chat-sidebar-toggle="#chat-members">
                                                                    Add Members <span className="ml-auto pl-5 fe-user-plus"></span>
                                                                </a>
                                                            }
                                                        </div>
                                                    </div>
                                                </li>
                                                {/* Mobile nav */}
                                            </ul>
                                        </div>

                                    </div>{/* .row */}

                                </div>
                            </div>
                            {/* Chat: Header */}

                            {/* Chat: Search */}
                            <div className="form-group m-0">
                                <div className="collapse border-bottom px-lg-8" id="chat-search">
                                    <div className="container-xxl py-4 py-lg-6">

                                        <div className="input-group">
                                            <input type="text" className="form-control form-control-lg" placeholder="Search this chat" aria-label="Search this chat" onChange={handleChange} />

                                            <div className="input-group-append">
                                                <button className="btn btn-lg btn-ico btn-secondary btn-minimal">
                                                    <i className="fe-search"></i>
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                            {/* Chat: Search */}

                            {/* Chat: Content*/}
                            <Body initialMessages={messages} />
                            {/* Chat: Content */}

                            <Form />
                        </div>
                        {/* Chat: body */}

                        {/* Chat Details */}
                        <div id="chat-info" className={`chat-sidebar ${detailslOpen ? "chat-sidebar-visible" : "chat-sidebar"}`}>
                            <div className="d-flex h-100 flex-column">

                                {/* Header */}
                                <div className="border-bottom py-4 py-lg-6">
                                    <div className="container-fluid">

                                        <ul className="nav justify-content-between align-items-center">
                                            {/* Close sidebar */}
                                            <li className="nav-item list-inline-item cursor-pointer">
                                                <a className="nav-link text-muted px-0" onClick={() => setDetailslOpen(false)}>
                                                    <i className="icon-md fe-chevron-left"></i>
                                                </a>
                                            </li>

                                            {/* Title(mobile) */}
                                            <li className="text-center d-block d-lg-none">
                                                <h6 className="mb-n2">{conversation.name || otherUser.name}</h6>
                                                <small className="text-muted">Chat Details</small>
                                            </li>

                                            {/* Dropdown */}
                                            <li className="nav-item list-inline-item">
                                                <div className="dropdown">
                                                    <a className="nav-link text-muted px-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="icon-md fe-sliders"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item d-flex align-items-center">
                                                            Mute
                                                            <span className="ml-auto fe-bell"></span>
                                                        </a>
                                                        <a className="dropdown-item d-flex align-items-center" onClick={() => setIsConfirmModalOpen(true)}>
                                                            Delete
                                                            <span className="ml-auto fe-trash-2"></span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                                {/* Header */}

                                {/* Body */}
                                <div className="hide-scrollbar flex-fill">

                                    {conversation.isGroup
                                        ? (
                                            <>
                                                <div className='px-5 pt-8 pb-6'>
                                                    <div className='media d-flex justify-content-center mb-5'>
                                                        <AvatarGroup users={conversation?.users} />
                                                    </div>
                                                    <div className='text-center'>
                                                        <h5>{conversation.name || otherUser.name}</h5>
                                                    </div>
                                                </div>
                                                <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                    <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                        <div>
                                                            <hr />
                                                            <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">
                                                                Created
                                                            </dt>
                                                            <dd className="mt-1 font-medium text-sm text-gray-400 sm:col-span-2">
                                                                <time dateTime={joinedDate}>
                                                                    {joinedDate}
                                                                </time>
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </>
                                        )
                                        :
                                        (
                                            <>
                                                <div className="border-bottom text-center py-5 px-5">
                                                    {/* Photo */}
                                                    <Avatar user={otherUser} isDetail={true} />
                                                    <h5>{conversation.name || otherUser.name}</h5>
                                                </div>
                                                <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                                                    <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                                                        <div>
                                                            <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">
                                                                Email
                                                            </dt>
                                                            <dd className="mt-1 font-medium text-sm text-gray-400 sm:col-span-2">
                                                                {otherUser?.email}
                                                            </dd>
                                                        </div>
                                                        <hr />
                                                        <div>
                                                            <dt className="text-sm font-medium sm:w-40 sm:flex-shrink-0">
                                                                Joined
                                                            </dt>
                                                            <dd className="mt-1 font-medium text-sm text-gray-400 sm:col-span-2">
                                                                <time dateTime={joinedDate}>
                                                                    {joinedDate}
                                                                </time>
                                                            </dd>
                                                        </div>
                                                    </dl>
                                                </div>
                                            </>
                                        )
                                    }
                                    {/* Navs */}
                                    <ul className="nav nav-tabs nav-justified bg-light rounded-0" role="tablist">
                                        {conversation.isGroup && (
                                            <li className="nav-item">
                                                <a href="#chat-id-members" className="nav-link active" data-toggle="tab" role="tab" aria-selected="true">Members</a>
                                            </li>
                                        )}
                                        <li className="nav-item">
                                            <a href="#chat-id-files" className={clsx("nav-link", conversation.isGroup ? "" : "active")} data-toggle="tab" role="tab">Files</a>
                                        </li>
                                    </ul>
                                    {/* Navs */}

                                    <div className="tab-content">
                                        {/* Members */}
                                        {conversation.isGroup && (
                                            <div id="chat-id-members" className="tab-pane fade show active">
                                                <ul className="list-group list-group-flush list-group-no-border-first">
                                                    {/* Member */}
                                                    {conversation?.users.map((item, index) => (
                                                        <li className="list-group-item py-6" key={item.id}>
                                                            <div className="media align-items-center">
                                                                <div className={isActiveMember(item) ? "avatar avatar-sm avatar-online mr-5" : "avatar avatar-sm mr-5"}>
                                                                    <img className="avatar-img" src={item?.image! || '/images/user.png'} alt="Anna Bridges" />
                                                                </div>


                                                                <div className="media-body">
                                                                    <h6 className="mb-0">
                                                                        <a href="#" className="text-reset">{item.name}</a>
                                                                    </h6>
                                                                    <small className="text-muted">{isActiveMember(item) ? "Online" : "Offline"}</small>
                                                                </div>

                                                                <div className="align-self-center ml-5">
                                                                    <div className="dropdown">
                                                                        <a href="#" className="btn btn-sm btn-ico btn-link text-muted w-auto" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <i className="fe-more-vertical"></i>
                                                                        </a>
                                                                        <div className="dropdown-menu">
                                                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                                                Promote <span className="ml-auto fe-trending-up"></span>
                                                                            </a>
                                                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                                                Restrict <span className="ml-auto fe-trending-down"></span>
                                                                            </a>
                                                                            <a className="dropdown-item d-flex align-items-center" href="#">
                                                                                Delete <span className="ml-auto fe-user-x"></span>
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                    {/* Member */}
                                                </ul>
                                            </div>
                                        )}
                                        {/* Members */}

                                        {/* Files */}
                                        <div id="chat-id-files" className={clsx("tab-pane fade", conversation.isGroup ? "" : "show active")}>
                                            <div className="container-fluid" style={{ width: '100%' }}>
                                                <div className="row">
                                                    {/* File */}
                                                    <ImageMoal
                                                        src={selectedImage}
                                                        isOpen={imageModalOpen}
                                                        onClose={() => setImageModalOpen(false)}
                                                    />
                                                    {newMessages?.map((item, index) => (
                                                        item.image &&
                                                        <div className='col-12 col-sm-6 col-md-4 border' key={item.id}
                                                            style={{ width: '150px', height: '150px' }}
                                                        >
                                                            <Image
                                                                src={item.image}
                                                                alt='Image'
                                                                onClick={() => handleImageClick(item.image)}
                                                                fill
                                                                style={{ objectFit: "cover" }}
                                                                className='avatar-img cursor-pointer hover:opacity-75 transition'
                                                            />
                                                        </div>
                                                    ))}
                                                    {/* Files */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Body */}

                            </div>
                        </div>
                        {/* Chat Details */}

                        {/* New members */}
                        <div id="chat-members" className="chat-sidebar">
                            <div className="d-flex h-100 flex-column">

                                {/* Header */}
                                <div className="border-bottom py-4 py-lg-6">
                                    <div className="container-fluid">

                                        <ul className="nav justify-content-between align-items-center">
                                            {/* Close sidebar */}
                                            <li className="nav-item">
                                                <a className="nav-link text-muted px-0" href="#" data-chat-sidebar-close="">
                                                    <i className="icon-md fe-chevron-left"></i>
                                                </a>
                                            </li>

                                            {/* Title(mobile) */}
                                            <li className="text-center d-block d-lg-none">
                                                <h6 className="mb-n2">Bootstrap Themes</h6>
                                                <small className="text-muted">Add Members</small>
                                            </li>

                                            {/* Dropdown */}
                                            <li className="nav-item">
                                                <div className="dropdown">
                                                    <a className="nav-link text-muted px-0" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="icon-md fe-sliders"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                                            Mute
                                                            <span className="ml-auto fe-bell"></span>
                                                        </a>
                                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                                            Delete
                                                            <span className="ml-auto fe-trash-2"></span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                                {/* Header */}

                                {/* Body */}
                                <div className="hide-scrollbar flex-fill">
                                    {/* Search */}
                                    <div className="border-bottom py-7">
                                        <div className="container-fluid">

                                            <form action="#">
                                                <div className="input-group">
                                                    <input type="text" className="form-control form-control-lg" placeholder="Search for users..." aria-label="Search users..." />
                                                    <div className="input-group-append">
                                                        <button className="btn btn-lg btn-ico btn-secondary btn-minimal" type="submit">
                                                            <i className="fe-search"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                    {/* Search */}

                                    {/* Members */}
                                    <form action="#">
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">A</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">


                                                    <div className="avatar avatar-sm avatar-online mr-5">
                                                        <img className="avatar-img" src="/images/avatars/10.jpg" alt="Anna Bridges" />
                                                    </div>


                                                    <div className="media-body">
                                                        <h6 className="mb-0">Anna Bridges</h6>
                                                        <small className="text-muted">Online</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-1" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-1"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-1"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">B</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/6.jpg" alt="Brian Dawson" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">Brian Dawson</h6>
                                                        <small className="text-muted">last seen 2 hours ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-2" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-2"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-2"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">L</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/5.jpg" alt="Leslie Sutton" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">Leslie Sutton</h6>
                                                        <small className="text-muted">last seen 3 days ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-3" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-3"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-3"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">M</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/4.jpg" alt="Matthew Wiggins" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">Matthew Wiggins</h6>
                                                        <small className="text-muted">last seen 3 days ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-4" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-4"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-4"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">S</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/7.jpg" alt="Simon Hensley" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">Simon Hensley</h6>
                                                        <small className="text-muted">last seen 3 days ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-5" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-5"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-5"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">W</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/9.jpg" alt="William Wright" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">William Wright</h6>
                                                        <small className="text-muted">last seen 3 days ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-6" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-6"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-6"></label>
                                            </li>
                                            {/* Member */}
                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/3.jpg" alt="William Greer" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">William Greer</h6>
                                                        <small className="text-muted">last seen 10 minutes ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-7" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-7"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-7"></label>
                                            </li>
                                            {/* Member */}


                                            <li className="list-group-item py-4">
                                                <small className="text-uppercase">Z</small>
                                            </li>

                                            {/* Member */}
                                            <li className="list-group-item py-6">
                                                <div className="media align-items-center">



                                                    <div className="avatar avatar-sm mr-5">
                                                        <img className="avatar-img" src="/images/avatars/7.jpg" alt="Zane Mayes" />
                                                    </div>

                                                    <div className="media-body">
                                                        <h6 className="mb-0">Zane Mayes</h6>
                                                        <small className="text-muted">last seen 3 days ago</small>
                                                    </div>

                                                    <div className="align-self-center ml-auto">
                                                        <div className="custom-control custom-checkbox">
                                                            <input className="custom-control-input" id="id-add-user-chat-1-user-8" type="checkbox" />
                                                            <label className="custom-control-label" htmlFor="id-add-user-chat-1-user-8"></label>
                                                        </div>
                                                    </div>

                                                </div>

                                                {/* Label */}
                                                <label className="stretched-label" htmlFor="id-add-user-chat-1-user-8"></label>
                                            </li>
                                            {/* Member */}

                                        </ul>
                                    </form>
                                    {/* Members */}
                                </div>
                                {/* Body */}

                                {/* Button */}
                                <div className="border-top py-7">
                                    <div className="container-fluid">
                                        <button className="btn btn-lg btn-block btn-primary d-flex align-items-center" type="submit">
                                            Add members
                                            <span className="fe-user-plus ml-auto"></span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* New members */}

                        {/* User's details */}
                        <div id="chat-user-profile" className="chat-sidebar">
                            <div className="d-flex h-100 flex-column">

                                {/* Header */}
                                <div className="border-bottom py-4 py-lg-6">
                                    <div className="container-fluid">

                                        <ul className="nav justify-content-between align-items-center">
                                            {/* Close sidebar */}
                                            <li className="nav-item list-inline-item">
                                                <a className="nav-link text-muted px-0" href="#" data-chat-sidebar-close="">
                                                    <i className="icon-md fe-chevron-left"></i>
                                                </a>
                                            </li>

                                            {/* Title(mobile) */}
                                            <li className="text-center d-block d-lg-none">
                                                <h6 className="mb-n2">William Wright</h6>
                                                <small className="text-muted">User Details</small>
                                            </li>

                                            {/* Dropdown */}
                                            <li className="nav-item list-inline-item">
                                                <div className="dropdown">
                                                    <a className="nav-link text-muted px-0" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                        <i className="icon-md fe-sliders"></i>
                                                    </a>
                                                    <div className="dropdown-menu">
                                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                                            Mute <span className="ml-auto fe-bell"></span>
                                                        </a>
                                                        <a className="dropdown-item d-flex align-items-center" href="#">
                                                            Delete <span className="ml-auto fe-trash-2"></span>
                                                        </a>
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>

                                    </div>
                                </div>
                                {/* Header */}

                                {/* Body */}
                                <div className="hide-scrollbar flex-fill">

                                    <div className="border-bottom text-center py-9 px-10">
                                        {/* Photo */}
                                        <div className="avatar avatar-xl mx-5 mb-5">
                                            <img className="avatar-img" src="/images/avatars/9.jpg" alt="" />
                                            <div className="badge badge-sm badge-pill badge-primary badge-border-basic badge-top-right">
                                                <span className="text-uppercase">Pro</span>
                                            </div>
                                        </div>
                                        <h5>William Wright</h5>
                                        <p className="text-muted">Bootstrap is an open source toolkit for developing web with HTML, CSS, and JS.</p>
                                    </div>

                                    <ul className="list-group list-group-flush mb-8">
                                        <li className="list-group-item py-6">
                                            <div className="media align-items-center">
                                                <div className="media-body">
                                                    <p className="small text-muted mb-0">Country</p>
                                                    <p>Warsaw, Poland</p>
                                                </div>
                                                <i className="text-muted icon-sm fe-globe"></i>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-6">
                                            <div className="media align-items-center">
                                                <div className="media-body">
                                                    <p className="small text-muted mb-0">Phone</p>
                                                    <p>+39 02 87 21 43 19</p>
                                                </div>
                                                <i className="text-muted icon-sm fe-mic"></i>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-6">
                                            <div className="media align-items-center">
                                                <div className="media-body">
                                                    <p className="small text-muted mb-0">Email</p>
                                                    <p>anna@gmail.com</p>
                                                </div>
                                                <i className="text-muted icon-sm fe-mail"></i>
                                            </div>
                                        </li>

                                        <li className="list-group-item py-6">
                                            <div className="media align-items-center">
                                                <div className="media-body">
                                                    <p className="small text-muted mb-0">Time</p>
                                                    <p>10:03 am</p>
                                                </div>
                                                <i className="text-muted icon-sm fe-clock"></i>
                                            </div>
                                        </li>
                                    </ul>

                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item py-6">
                                            <a href="#" className="media text-muted">
                                                <div className="media-body align-self-center">
                                                    Twitter
                                                </div>
                                                <i className="icon-sm fe-twitter"></i>
                                            </a>
                                        </li>

                                        <li className="list-group-item py-6">
                                            <a href="#" className="media text-muted">
                                                <div className="media-body align-self-center">
                                                    Facebook
                                                </div>
                                                <i className="icon-sm fe-facebook"></i>
                                            </a>
                                        </li>

                                        <li className="list-group-item py-6">
                                            <a href="#" className="media text-muted">
                                                <div className="media-body align-self-center">
                                                    Github
                                                </div>
                                                <i className="icon-sm fe-github"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* Body */}

                                {/* Button */}
                                <div className="border-top py-7">
                                    <div className="container-fluid">
                                        <button className="btn btn-lg btn-block btn-primary d-flex align-items-center" type="submit">
                                            Add friend
                                            <span className="fe-user-plus ml-auto"></span>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>
                        {/* User's details */}

                    </div>
                </div >
                :
                <div className={isOpen ? `main main-visible` : `main`} data-mobile-height="">
                    <div className="chat flex-column justify-content-center text-center">
                        <div className="container-xxl">

                            <div className="avatar avatar-lg mb-5">
                                <img className="avatar-img" src="/images/avatars/12.jpg" alt="" />
                            </div>

                            <h6>Hey, Matthew!</h6>
                            <p>Please select a chat to start messaging.</p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default MainContent