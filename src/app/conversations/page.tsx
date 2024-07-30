'use client';

import useConversation from '@/app/hooks/useConversation';

import EmptyState from '../components/EmptyState/EmptyState';

export default function Home() {

    const { isOpen } = useConversation();

    return (
        <EmptyState />
    )
}