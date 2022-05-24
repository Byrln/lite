import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

import axios from "lib/utils/axios";

const login = "/auth/login";
const unprotectedRoutes = ["/auth/login"];

const WithAuth = ({ children }: any) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSession().then((session) => {
            if (!session) {
                axios.defaults.headers.common["Authorization"] = "";

                if (unprotectedRoutes.indexOf(router.pathname) === -1) {
                    router.push(login).then(() => setLoading(false));
                } else {
                    setLoading(false);
                }
            } else {
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${session.token}`;

                setLoading(false);
            }
        });
    }, [router]);

    if (loading) {
        return (
            <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
                justifyContent="center"
                style={{ minHeight: "100vh" }}
            >
                <CircularProgress color="primary" />
            </Grid>
        );
    }

    return children;
};

export default WithAuth;
