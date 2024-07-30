import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// console.log('PUSHER_APP_ID:', process.env.NEXT_PUBLIC_PUSHER_APP_ID);
// console.log('PUSHER_KEY:', process.env.NEXT_PUBLIC_PUSHER_KEY);
// console.log('PUSHER_SECRET:', process.env.NEXT_PUBLIC_PUSHER_SECRET);
// console.log('PUSHER_CLUSTER:', process.env.NEXT_PUBLIC_PUSHER_CLUSTER);
// console.log('NODE_ENV:', process.env.NODE_ENV);

export const pusherServer = new PusherServer({
    appId: process.env.NEXT_PUBLIC_PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
    secret: process.env.NEXT_PUBLIC_PUSHER_SECRET!,
    cluster: 'ap1',
    useTLS: true,
});

export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_KEY!,
    {
        channelAuthorization: {
            endpoint: '/api/pusher/auth',
            transport: 'ajax',
        },
        cluster: 'ap1',
    }
);
