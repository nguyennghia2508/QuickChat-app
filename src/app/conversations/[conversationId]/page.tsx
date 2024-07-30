import getConversationById from "@/app/actions/getConversationById";
import getMessages from "@/app/actions/getMessages";
import { EmptyState } from "@/app/components";
import MainContent from "@/app/components/mainContent/MainContent";
// import { Body, Form, Header } from "./components";


export const metadata = {
    title: 'Chats - Messenger',
    description: 'Messenger Clone',
}

interface IParams {
    conversationId: string;
}

const ChatId = async ({ params }: { params: IParams }) => {
    const conversation = await getConversationById(params.conversationId);
    const messages = await getMessages(params.conversationId);

    if (!conversation) {
        return (
            <div className="lg:pl-80 h-full">
                <div className="h-full flex flex-col">
                    <EmptyState />
                </div>
            </div>
        )
    }

    return (
        <MainContent
            conversation={conversation}
            messages={messages}
        />
    );
}

export default ChatId;