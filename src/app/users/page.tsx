'use client';

import { signOut } from 'next-auth/react'
import React from 'react'
import EmptyState from '../components/EmptyState/EmptyState';


export default function Users() {

    return (
        <EmptyState />
    )
}