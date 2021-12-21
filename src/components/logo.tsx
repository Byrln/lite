import { Box } from "@mui/material";

export default function Logo({ size, sx }: any) {
    return (
        <Box
            component="img"
            src={size ? "/images/logo_sm.png" : "/images/logo.png"}
            sx={{
                width: size ? 80 : "auto",
                ...sx,
            }}
        />
    );
}
