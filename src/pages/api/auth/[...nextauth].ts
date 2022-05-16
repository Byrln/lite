import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";

import axios from "lib/utils/axios";

export default NextAuth({
    providers: [
        CredentialProvider({
            name: "credentials",
            credentials: {} as any,
            authorize: async (credentials: any) => {
                const params = new URLSearchParams();
                params.append("username", credentials.username);
                params.append("password", credentials.password);
                params.append("grant_type", "password");

                const config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                };

                const url = `${process.env.NEXT_PUBLIC_ENTRYPOINT}/token`;

                const result = await axios
                    .post(url, params, config)
                    .then(async (response) => {
                        return response;
                    })
                    .catch(() => {
                        return null;
                    });

                if (result) {
                    return {
                        accessToken: result.data.access_token,
                    };
                }

                // login failed
                return null;
            },
        }),
    ],
    callbacks: {
        jwt: async ({ token, user }) => {
            // first time jwt callback is run, user object is available
            if (user) {
                token.accessToken = user.accessToken;
            }

            return token;
        },
        session: async ({ session, token }) => {
            if (token) {
                session.token = token.accessToken;
            }

            return session;
        },
    },
    // Enable debug messages in the console if you are having problems
    debug: false,
    secret: "9/fJVE4kGYxv16NSgHHcqmhTLgp9DYY92v3fLE4Rm8A=",
    jwt: {
        secret: "9/fJVE4kGYxv16NSgHHcqmhTLgp9DYY92v3fLE4Rm8A=",
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60,
    },
    pages: {
        signIn: "auth/login",
    },
});
