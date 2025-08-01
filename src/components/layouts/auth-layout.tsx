import Link from "next/link";
import { styled } from "@mui/material/styles";
import { Typography } from "@mui/material";

import Logo from "components/logo";
import { MHidden } from "components/@material-extend";

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

export default function AuthLayout({ children }: any) {
  return (
    <HeaderStyle>
      <Link href="/auth/login" passHref legacyBehavior>

        <Logo showText={true} />

      </Link>
      <MHidden width="smDown">
        <Typography
          variant="body2"
          sx={{
            mt: { md: -2 },
          }}
        >
          {children}
        </Typography>
      </MHidden>
    </HeaderStyle>
  );
}
