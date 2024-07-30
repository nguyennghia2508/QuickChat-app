import Image from 'next/image'
import React from 'react'
import { AuthForm } from './components'
import "./style.scss"

export default function Home() {
    return (
        <main className="flex flex-col-reverse lg:flex-row min-h-screen">
            {/* Left Column (CTA) */}
            <div
                className="lg:w-1/2 p-10 title"
            >
                <div className="flex flex-col justify-center h-full">
                    <h1 className="text-4xl font-bold mb-2 text-center text-white">
                        Welcome to<span> </span>
                        <span style={{
                            background: "linear-gradient(135deg, #0fd2ba, #647eff, #13f0e6)",
                            backgroundClip: "text",
                            color: "transparent"
                        }}>
                            QuickChat
                        </span>!
                    </h1>
                    <p className="text-lg my-6 mx-auto text-center text-white">
                        This is my demo chat app
                    </p>
                    <p className="text-sm opacity-90 mx-auto text-center text-white">
                        Join QuickChat today and connect with others effortlessly.
                    </p>
                    <a
                        href="https://github.com/nguyennghia2508"
                        className="mt-8 bg-gray-800  hover:bg-cyan-700 text-white py-2 px-8 rounded-full font-semibold shadow-md transition duration-300 ease-in-out w-auto max-w-lg mx-auto"
                        title="GitHub Repository"
                        target="_blank"
                    >
                        GitHub Code
                    </a>
                </div>
            </div>
            <div className="lg:w-1/2 bg-gray-100">
                <div className="sm:mx-auto flex flex-col justify-center h-full sm:w-full sm:max-w-md">
                    <a className="w-100" id="image-login">
                        <div className="mx-auto fill-primary" id="logo"></div>
                    </a>

                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900 tracking-tight">
                        Join QuickChat Today!
                    </h2>

                    {/* Auth Form */}
                    <AuthForm />
                </div>
            </div>
        </main>
    )
}
