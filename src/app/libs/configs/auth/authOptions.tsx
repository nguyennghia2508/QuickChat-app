import bcrypt from "bcrypt"
import NextAuth, { AuthOptions, DefaultSession, Session } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"

import prisma from "@/app/libs/prismadb"

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
        } & DefaultSession['user'];
    }
}

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'email', type: 'text' },
                password: { label: 'password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('The email/password you entered is incorrect');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('The email/password you entered is incorrect');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error('The email/password you entered is incorrect');
                }

                return user;
            }
        })
    ],
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt",
        maxAge: 10 * 60 * 60
    },
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            if (token.email) {
                const user = await prisma.user.findUnique({
                    where: {
                        email: token.email
                    }
                });

                if (!user || !user?.hashedPassword) {
                    throw new Error('The email/password you entered is incorrect');
                }

                session.user.id = user.id
                return session
            }
        },
        async jwt({ token, trigger, session }) {
            if (trigger === 'update' && session?.user.name) {
                token.name = session?.user.name;
            }
            if (trigger === 'update' && session?.user.image) {
                token.picture = session?.user.image;
            }

            return token
        },
        async redirect({ url, baseUrl }) {
            return Promise.resolve(url)
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
}