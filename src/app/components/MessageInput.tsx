'use client';

import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form';


interface MessageInputProps {
    id: string;
    placeholder?: string;
    type?: string;
    required?: boolean;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    onKeyDown: any
}
const MessageInput: React.FC<MessageInputProps> = ({
    id,
    placeholder,
    type,
    required,
    register,
    errors,
    onKeyDown
}) => {
    return (
        <div className="col">
            <div className="input-group">

                {/* Textarea */}
                <textarea
                    id={id}
                    autoComplete={id}
                    {...register(id, { required: true })}
                    className="form-control bg-transparent border-0"
                    placeholder={placeholder}
                    onKeyDown={onKeyDown}
                    rows={1}
                    data-emoji-input=""
                    data-autosize="true"
                ></textarea>
            </div>
        </div>
    )
}

export default MessageInput
