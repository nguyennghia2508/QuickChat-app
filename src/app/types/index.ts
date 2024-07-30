import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import type { ReactNode } from 'react';
import { Conversation, Message, User } from "@prisma/client";

export type NextPageWithLayout = NextPage & {
  getLayout?: () => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export type ChildrenProps = {
  children: ReactNode;
};

export type FullMessageType = Message & {
  sender: User,
  seen: User[]
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[]
};