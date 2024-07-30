'use client';

import { useState } from 'react';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { CldUploadButton } from 'next-cloudinary';
import axios from 'axios';
import toast from 'react-hot-toast';
import Modal from '../Modal';
import Input from '../Input/Input';
import Image from 'next/image';
import Button from '../Button/Button';
import { useSession } from 'next-auth/react';

interface SettingsModalProps {
    currentUser: User;
    isOpen?: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    currentUser,
    isOpen,
    onClose,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
        },
    });

    const image = watch('image');
    const { data: session, status, update } = useSession();

    const handleUpload = (result: any) => {
        const fileInfo = result?.info;

        // Check if fileInfo and fileInfo.format are available
        if (fileInfo && fileInfo.format) {
            // List of acceptable image formats
            const acceptedFormats = ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp'];

            // Check if the file format is in the accepted formats
            if (acceptedFormats.includes(fileInfo.format.toLowerCase())) {
                // Proceed with uploading the image URL
                setValue('image', result?.info?.secure_url, {
                    shouldValidate: true,
                });
            } else {
                // Handle invalid file type
                toast.error('Please upload a valid image file.');
            }
        } else {
            // Handle cases where fileInfo is not available
            toast.error('An error occurred while uploading the file.');
        }
    };

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (data.name === "") {
            toast.error("Please enter your name")
            return
        }
        else {
            setIsLoading(true);

            axios
                .post('/api/settings', data)
                .then(async () => {
                    const newSession = {
                        user: {
                            ...session?.user,
                            name: data?.name,
                            image: data?.image
                        },
                    };
                    await update(newSession);

                    toast.success('Change image success.');
                    router.refresh();
                    onClose();
                })
                .catch(() => toast.error('Something went wrong!'))
                .finally(() => setIsLoading(false));
        }
    };

    const handleClose = () => {
        onClose()
        reset()
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Profile
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Edit your profile details.
                        </p>

                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                disabled={isLoading}
                                label="Name"
                                id="name"
                                errors={errors}
                                register={register}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium leading-6 text-gray-900">
                                    Photo
                                </label>
                                <div className="mt-2 flex items-center gap-x-3">
                                    <Image
                                        width={48}
                                        height={48}
                                        src={image || currentUser?.image || '/images/user.png'}
                                        alt="avatar"
                                        className="avatar rounded-full border-0 bg-transparent"
                                    />
                                    <CldUploadButton
                                        options={{ maxFiles: 1 }}
                                        onSuccess={handleUpload}
                                        uploadPreset='messager-nextjs'
                                        className={`flex justify-center rounded-md px-4 py-2 text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                            ${isLoading && 'opacity-50 cursor-default'} text-gray-900 hover:bg-gray-100`}
                                    >
                                        Change
                                    </CldUploadButton>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-x-6">
                        <Button disabled={isLoading} onClick={onClose} secondary>
                            Cancel
                        </Button>
                        <Button disabled={isLoading} type="submit">
                            Save
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
};

export default SettingsModal;