'use client';
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import React, { useState, useCallback } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { IoAttachOutline } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';

const Form = () => {
    const { conversationId } = useConversation();
    const [isDropFile, setIsDropFile] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = useCallback(async (data) => {
        try {
            setValue('message', '', { shouldValidate: true });
            await axios.post('/api/messages', {
                ...data,
                conversationId
            });
        } catch (error) {
            toast.error('Failed to send message');
        }
    }, [conversationId, setValue]);

    const handleUpload = useCallback(async (result: any) => {
        const fileInfo = result?.info;
        if (fileInfo && fileInfo.format) {
            const acceptedFormats = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];
            if (acceptedFormats.includes(fileInfo.format.toLowerCase())) {
                try {
                    await axios.post('/api/messages', {
                        image: fileInfo.secure_url,
                        conversationId,
                    });
                } catch (error) {
                    toast.error('Failed to upload image');
                }
            } else {
                toast.error('Please upload a valid image file.');
            }
        } else {
            toast.error('An error occurred while uploading the file.');
        }
    }, [conversationId]);

    const handleKeyDown = useCallback((e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(onSubmit)();
        }
    }, [handleSubmit, onSubmit]);

    return (
        <div className="chat-footer border-top py-4 py-lg-6 px-lg-8">
            <div className="container-xxl">
                <CldUploadButton
                    options={{ maxFiles: 1 }}
                    onSuccess={handleUpload}
                    uploadPreset='messager-nextjs'
                >
                    <div className='text-blue-500 hover:text-blue-700 transition cursor-pointer w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center'>
                        <IoAttachOutline className='w-5 h-5 text-blue-500 rotate-45' />
                    </div>
                </CldUploadButton>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-row align-items-center">
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            required
                            placeholder="Type your message..."
                            onKeyDown={handleKeyDown}
                        />
                        <div className="col-auto">
                            <button className="btn btn-ico btn-primary rounded-circle" type="submit">
                                <span className="fe-send"></span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Form;