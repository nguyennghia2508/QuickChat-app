import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import useConversation from "./useConversation";

const useRoutes = () => {
  const pathname = usePathname();
  const { conversationId } = useConversation();

  const routes = useMemo(() => [
    {
      label: 'Users',
      href: '/users',
      icon: "icon-lg fe-users",
      active: pathname === '/users'
    },
    {
      label: 'Chat',
      href: '/conversations',
      icon: "icon-lg fe-message-square",
      active: pathname === '/conversations' || !!conversationId
    },
    {
      label: 'Logout',
      onClick: () => signOut(),
      href: '#',
      icon: 'icon-lg fe-log-out',
    }
  ], [pathname, conversationId]);

  return routes;
};

export default useRoutes;
