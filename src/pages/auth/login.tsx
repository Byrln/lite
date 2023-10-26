/* eslint-disable @next/next/no-img-element */
import { styled } from "@mui/material/styles";
import {
    Card,
    Stack,
    Link as MaterialLink,
    Container,
    Typography,
} from "@mui/material";
import Link from "next/link";

import AuthLayout from "components/layouts/auth-layout";
import Page from "components/page";
import { MHidden } from "components/@material-extend";
import { LoginForm } from "components/authentication/login";
import AuthSocial from "components/authentication/auth-social";

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    // width: "100%",
    maxWidth: "auto",
    display: "flex",
    height: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: "0 !important",
    filter: "drop-shadow(-4px 0px 4px #000000)",
}));

const ContentStyle = styled("div")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(12, 0),
}));

export default function Login() {
    return (
        <RootStyle title="Login | Horeca">
            {/* <AuthLayout>
                Don’t have an account? &nbsp;
                <Link href="#" passHref>
                    <MaterialLink underline="none" variant="subtitle2">
                        Get started
                    </MaterialLink>
                </Link>
            </AuthLayout> */}

            <MHidden width="mdDown">
                <SectionStyle>
                    {/* <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                        Тавтай морил
                    </Typography> */}
                    {/* <img
                        src="/static/illustrations/illustration_login.png"
                        alt="login"
                    /> */}
                    <img
                        src="/images/login_banner.jpeg"
                        alt="login"
                        style={{ height: "100%", objectFit: "cover" }}
                    />
                </SectionStyle>
            </MHidden>

            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ display: "flex", alignItems: "center" }}>
                        <img
                            src="/images/logo.png"
                            alt="login"
                            style={{ width: "60%", objectFit: "cover" }}
                        />
                    </Stack>

                    <LoginForm />

                    {/* <MHidden width="smUp">
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ mt: 3 }}
                        >
                            Don’t have an account?&nbsp;
                            <Link href="#" passHref>
                                <MaterialLink variant="subtitle2">
                                    Get started
                                </MaterialLink>
                            </Link>
                        </Typography>
                    </MHidden> */}
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
