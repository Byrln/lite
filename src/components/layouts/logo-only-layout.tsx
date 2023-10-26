import Link from "next/link";
import { styled } from "@mui/material/styles";

import Logo from "components/logo";

const HeaderStyle = styled("header")(({ theme }) => ({
    top: 0,
    left: 0,
    lineHeight: 0,
    width: "100%",
    position: "absolute",
    padding: theme.spacing(3, 3, 0),
    [theme.breakpoints.up("md")]: {
        padding: theme.spacing(5, 5, 0),
    },
}));

export default function LogoOnlyLayout({ children }: any) {
    return (
        <>
            <HeaderStyle>
                {/* <Link href="/">
                    <a>
                        <Logo size="small" />
                    </a>
                </Link> */}
            </HeaderStyle>

            {children}
        </>
    );
}
