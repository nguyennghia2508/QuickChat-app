'use client';

import { Button, Input, Modal, Select } from '@/app/components';
import { User } from '@prisma/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';


interface GroupChatModalProps {
    isOpen?: boolean;
    onClose: () => void;
    users: User[];
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({
    isOpen,
    onClose,
    users,
}) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FieldValues>({
        mode: "onSubmit",
        defaultValues: {
            name: '',
            members: [],
        },
    });

    const members = watch('members');
    // useEffect(() => {
    //     if (errors) {
    //         if (errors.name) {
    //             toast.error(errors.name.message?.toString() || 'Please enter group name');
    //         }
    //         if (errors.members) {
    //             toast.error(errors.members.message?.toString() || 'Invalid members');
    //         }
    //     }
    // }, [errors]);

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        if (data.name === "") {
            toast.error("Please enter group name")
            return
        }
        else if (data.members.length === 0) {
            toast.error("Please enter group member")
            return
        }
        else if (data.members.length < 2) {
            toast.error("Please enter more than 2 member")
            return
        }
        else {
            setIsLoading(true);

            axios
                .post('/api/conversations', { ...data, isGroup: true })
                .then(() => {
                    router.refresh();
                    onClose();
                    toast.success('Group chat created!');
                    router.push(`/conversations`);
                })
                .catch((err) => toast.error(err.message || 'Something went wrong!'))
                .finally(() => setIsLoading(false));
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-12">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">
                            Create a group chat
                        </h2>

                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            Create a group chat to chat with multiple people at once.
                        </p>

                        <div className="mt-10 flex flex-col gap-y-8">
                            <Input
                                label="Group name"
                                id="name"
                                register={register}
                                errors={errors}
                                disabled={isLoading}
                                required
                            />
                            <Select
                                disabled={isLoading}
                                label="Members"
                                options={users.map((user) => ({
                                    label: user.name,
                                    value: user.id,
                                }))}
                                onChange={(value) =>
                                    setValue('members', value, { shouldValidate: true })
                                }
                                value={members}
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                        disabled={isLoading}
                        onClick={onClose}
                        type="button"
                        secondary
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} type="submit">
                        Create
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default GroupChatModal;
