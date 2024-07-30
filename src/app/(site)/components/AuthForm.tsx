'use client';

import Button from '@/app/components/Button/Button';
import Input from '@/app/components/Input/Input';
import React, { useCallback, useEffect, useState } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import AuthSocialButton from './AuthSocialButton';
import { BsGithub, BsGoogle } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { signIn, useSession } from 'next-auth/react';
import { CgSpinner } from 'react-icons/cg';
import { useRouter } from 'next/navigation';

type Varient = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

    const session = useSession();
    const router = useRouter();
    const [variant, setVariant] = useState<Varient>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (session?.status === 'authenticated') {
            router?.push('/users');
        }
    }, [session?.status]);

    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {
        register,
        handleSubmit,
        formState: {
            errors,
        }
    } = useForm<FieldValues>({
        defaultValues: {
            name: '',
            email: '',
            password: ''
        }
    });

    // const onSubmit: SubmitHandler<FieldValues> = (data) => {
    //     setIsLoading(true);

    //     if (variant === 'REGISTER') {
    //         axios.post('/api/register', data)
    //             .then(() => signIn('credentials', {
    //                 ...data,
    //                 redirect: false,
    //             }))
    //             .then((callback) => {
    //                 if (callback?.error) {
    //                     toast.error('Invalid credentials!');
    //                 }

    //                 // if (callback?.ok) {
    //                 //     router.push('/conversations')
    //                 // }
    //             })
    //             .catch(() => toast.error('Something went wrong!'))
    //             .finally(() => setIsLoading(false))
    //     }

    //     if (variant === 'LOGIN') {
    //         signIn('credentials', {
    //             ...data,
    //             redirect: false
    //         })
    //             .then((callback) => {
    //                 if (callback?.error) {
    //                     toast.error('Invalid credentials!');
    //                 }

    //                 if (callback?.ok) {
    //                     router.push('/conversations')
    //                 }
    //             })
    //             .finally(() => setIsLoading(false))
    //     }
    // }

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        if (variant === 'REGISTER') {
            axios.post('/api/register', data)
                .then(() => {
                    signIn('credentials', data);
                    toast.success('You are Logged In!');
                })
                .catch(() => toast.error('Something went wrong!'))
                .finally(() => setIsLoading(false))
        }

        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false
            })
                .then((callback) => {
                    if (callback?.error) {
                        toast.error('The email/password is incorrect.');
                    }

                    if (callback?.ok && !callback?.error) {
                        toast.success('You are Logged In!');
                        router.push('/users')
                    }
                })
                .finally(() => setIsLoading(false))
        }
    }

    const socialAction = (action: string) => {
        setIsLoading(true);

        signIn(action, { redirect: false })
            .then((callback) => {
                if (callback?.error) {
                    toast.error('Invalid credentials!');
                }

                if (callback?.ok && !callback?.error) {
                    router.push('/conversations');
                    toast.success('You are Logged In!');
                }
            })
            .finally(() => setIsLoading(false));
    }

    return (
        <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
            <div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
                <form
                    className='space-y-6'
                    // @ts-ignore
                    onSubmit={handleSubmit(onSubmit)}
                >
                    {variant === 'REGISTER' && (
                        <Input
                            id='name'
                            label='Name'
                            required
                            register={register}
                            errors={errors}
                        />
                    )}
                    <Input
                        id='email'
                        label='Email'
                        type='email'
                        required
                        register={register}
                        errors={errors}
                    />
                    <Input
                        id='password'
                        label='Password'
                        type='password'
                        required
                        register={register}
                        errors={errors}
                    />
                    <div>
                        <Button
                            disabled={isLoading}
                            fullWidth
                            type='submit'
                        >
                            {isLoading ? (
                                <CgSpinner className='w-5 h-5 text-current animate-spin' />
                            ) : (
                                <>
                                    {variant === 'LOGIN' ? 'Sign In' : 'Register'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
                <div className='mt-6'>
                    <div className='relative'   >
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300' />
                        </div>
                        <div className='flex relative justify-center text-sm'>
                            <span className='bg-white px-2 text-gray-500'>
                                OR
                            </span>
                        </div>
                    </div>
                    <div className='mt-6 flex gap-2'>
                        <AuthSocialButton
                            icon={BsGithub}
                            onClick={() => socialAction('github')}
                        />
                        <AuthSocialButton
                            icon={BsGoogle}
                            onClick={() => socialAction('google')}
                        />
                    </div>
                </div>
                <div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
                    <div>
                        {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
                    </div>
                    <div className='hover:underline cursor-pointer' onClick={toggleVariant}>
                        {variant === 'LOGIN' ? 'Create an account' : 'Login'}
                    </div>
                </div>
            </div>
        </div>
        // <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        //     <div
        //         className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        //         <form
        //             className="space-y-6"
        //             onSubmit={handleSubmit(onSubmit)}
        //         >
        //             {variant === 'REGISTER' && (
        //                 <Input
        //                     disabled={isLoading}
        //                     register={register}
        //                     errors={errors}
        //                     required
        //                     id="name"
        //                     label="Name"
        //                 />
        //             )}
        //             <Input
        //                 disabled={isLoading}
        //                 register={register}
        //                 errors={errors}
        //                 required
        //                 id="email"
        //                 label="Email address"
        //                 type="email"
        //             />
        //             <Input
        //                 disabled={isLoading}
        //                 register={register}
        //                 errors={errors}
        //                 required
        //                 id="password"
        //                 label="Password"
        //                 type="password"
        //             />
        //             <div>
        //                 <Button disabled={isLoading} fullWidth type="submit">
        //                     {variant === 'LOGIN' ? 'Sign in' : 'Register'}
        //                 </Button>
        //             </div>
        //         </form>

        //         <div className="mt-6">
        //             <div className="relative">
        //                 <div className="absolute inset-0 flex items-center">
        //                     <div className="w-full border-t border-gray-300" />
        //                 </div>
        //                 <div className="relative flex justify-center text-sm">
        //                     <span className="bg-white px-2 text-gray-500">
        //                         Or continue with
        //                     </span>
        //                 </div>
        //             </div>

        //             <div className="mt-6 flex gap-2">
        //                 <AuthSocialButton
        //                     icon={BsGithub}
        //                     onClick={() => socialAction('github')}
        //                 />
        //                 <AuthSocialButton
        //                     icon={BsGoogle}
        //                     onClick={() => socialAction('google')}
        //                 />
        //             </div>
        //         </div>
        //         <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
        //             <div>
        //                 {variant === 'LOGIN' ? 'New to Messenger?' : 'Already have an account?'}
        //             </div>
        //             <div
        //                 onClick={toggleVariant}
        //                 className="hover:text-gray-600 cursor-pointer"
        //             >
        //                 {variant === 'LOGIN' ? 'Create an account' : 'Login'}
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default AuthForm