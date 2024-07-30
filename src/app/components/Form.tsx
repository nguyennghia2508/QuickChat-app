'use client';
import useConversation from '@/app/hooks/useConversation';
import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { HiPhoto } from 'react-icons/hi2';
import { FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import MessageInput from './MessageInput';
import { CldUploadButton } from 'next-cloudinary';
import { IoAttachOutline } from 'react-icons/io5';

const Form = () => {

    const { isOpen, conversationId } = useConversation();
    const [isDropFile, setIsDropFile] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: {
            errors
        }
    } = useForm<FieldValues>({
        defaultValues: {
            message: ''
        }
    });

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setValue('message', '', { shouldValidate: true });
        axios.post('/api/messages', {
            ...data,
            conversationId
        })
    }

    const handleUpload = (result: any) => {
        // Assuming result.info contains the file information
        const fileInfo = result?.info;

        // Check if fileInfo and fileInfo.format are available
        if (fileInfo && fileInfo.format) {
            // List of acceptable image formats
            const acceptedFormats = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];

            // Check if the file format is in the accepted formats
            if (acceptedFormats.includes(fileInfo.format.toLowerCase())) {
                // Proceed with uploading the image URL
                axios.post('/api/messages', {
                    image: fileInfo.secure_url,
                    conversationId,
                });
            } else {
                // Handle invalid file type
                toast.error('Please upload a valid image file.');
            }
        } else {
            // Handle cases where fileInfo is not available
            toast.error('An error occurred while uploading the file.');
        }
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent the default behavior of submitting the form
            setValue('message', e.target.value, { shouldValidate: true });
            handleSubmit(onSubmit)();
        }
    };

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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="form-row align-items-center">
                        <MessageInput
                            id="message"
                            register={register}
                            errors={errors}
                            required
                            placeholder="Type your message..."
                            onKeyDown={handleKeyDown}
                        />

                        {/* Submit button */}
                        <div className="col-auto">
                            <button className="btn btn-ico btn-primary rounded-circle" type="submit">
                                <span className="fe-send"></span>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Form
