'use client';
import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { Controller, FieldValues, SubmitHandler, useForm } from 'react-hook-form';
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
    const { data: session, status, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const [darkModeFromLocalStorage, setDarkModeFromLocalStorage] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const getUserfromLocalStorage = localStorage.getItem("darkMode");
            if (getUserfromLocalStorage !== undefined) {
                setDarkModeFromLocalStorage(getUserfromLocalStorage && JSON.parse(getUserfromLocalStorage));
            }
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            setIsClosing(false);
        }
    }, [isOpen]);

    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        reset,
        setValue,
        watch,
    } = useForm<FieldValues>({
        defaultValues: {
            name: currentUser?.name,
            image: currentUser?.image,
            darkMode: darkModeFromLocalStorage ? darkModeFromLocalStorage : session?.darkMode,
        },
    });

    const image = watch('image');

    const MaterialUISwitch = styled(Switch)(({ theme }) => ({
        width: 62,
        height: 34,
        padding: 7,
        '& .MuiSwitch-switchBase': {
            margin: 1,
            padding: 0,
            transform: 'translateX(6px)',
            '&.Mui-checked': {
                color: '#fff',
                transform: 'translateX(22px)',
                '& .MuiSwitch-thumb:before': {
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                        '#fff',
                    )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
                },
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
                },
            },
        },
        '& .MuiSwitch-thumb': {
            backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
            width: 32,
            height: 32,
            '&::before': {
                content: "''",
                position: 'absolute',
                width: '100%',
                height: '100%',
                left: 0,
                top: 0,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
            },
        },
        '& .MuiSwitch-track': {
            opacity: 1,
            backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            borderRadius: 20 / 2,
        },
    }));

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
            toast.error("Please enter your name");
            return;
        }
        if (isClosing) {
            return;
        }
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
                    darkMode: data?.darkMode
                };
                await update(newSession);
                localStorage.setItem('darkMode', data?.darkMode);
                toast.success('Profile updated successfully.');
                router.refresh();
                onClose();
            })
            .catch(() => toast.error('Something went wrong!'))
            .finally(() => setIsLoading(false));
    };

    const handleClose = () => {
        setIsClosing(true);
        onClose();
        reset();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit(onSubmit)} className='modal-setting'>
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
                                    Dark mode
                                </label>
                                <Controller
                                    name="darkMode"
                                    control={control}
                                    defaultValue={session?.darkMode}
                                    render={({ field: { onChange, value } }) => (
                                        <MaterialUISwitch sx={{ m: 1 }}
                                            className='mx-0'
                                            checked={value}
                                            onChange={(e) => {
                                                onChange(e.target.checked)
                                            }}
                                        />
                                    )}
                                />
                            </div>
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
                        <Button disabled={isLoading} onClick={handleClose} secondary>
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
