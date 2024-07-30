'use client';

import Modal from './Modal';
import Image from 'next/image';
import React from 'react';


interface ImageModalProps {
    src?: string | null;
    isOpen?: boolean;
    onClose: () => void;
}

const ImageMoal: React.FC<ImageModalProps> = ({
    isOpen,
    src,
    onClose
}) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className='p-8 flex items-center justify-center'>
                <div className='w-80 h-80'>
                    <Image
                        src={src!}
                        alt='Image not found'
                        fill
                        // style={{ objectFit: "cover" }}
                        className='object-contain'
                    />
                </div>
            </div>
        </Modal>
    )
}

export default ImageMoal
