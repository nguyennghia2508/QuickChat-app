import NextAuth from "next-auth"
import { authOptions } from '../../../libs/configs/auth/authOptions'

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };