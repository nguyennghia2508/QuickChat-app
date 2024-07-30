'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

interface SidebarItemProps {
    href: string;
    label: string;
    icon: any;
    active?: boolean;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
}

const SideBarItem: React.FC<SidebarItemProps> = ({
    label,
    icon,
    href,
    active,
    onClick,
    className,
    style,
}) => {

    const itemRef = useRef<HTMLLIElement>(null);

    useEffect(() => {
        const handleAnimationEnd = () => {
            if (itemRef.current) {
                itemRef.current.classList.remove('fade-in');
            }
        };

        const currentRef = itemRef.current;
        if (currentRef) {
            currentRef.addEventListener('animationend', handleAnimationEnd);
        }

        return () => {
            if (currentRef) {
                currentRef.removeEventListener('animationend', handleAnimationEnd);
            }
        };
    }, []);

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <li
            ref={itemRef}
            className={clsx("nav-item mt-xl-9 cursor-pointer hover:opacity-75 transition", className)}
            onClick={handleClick}
            title={label}
        >
            <Link
                href={href}
                className="nav-link position-relative p-0 py-xl-3"
                style={{ color: active ? '#0176ff' : 'inherit' }}
            >
                <i className={icon} />
                {active && <div className="badge badge-dot badge-primary badge-bottom-center" />}
            </Link>
        </li>
    );
};
export default SideBarItem;