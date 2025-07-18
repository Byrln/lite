import { Popover } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const ArrowStyle = styled("span")(({ theme }: any) => ({
    [theme.breakpoints.up("sm")]: {
        top: -7,
        zIndex: 1,
        width: 12,
        right: 20,
        height: 12,
        content: "''",
        position: "absolute",
        borderRadius: "0 0 4px 0",
        transform: "rotate(-135deg)",
        background: "#2a304d",
        borderRight: `solid 1px ${alpha(theme.palette.grey[300], 0.2)}`,
        borderBottom: `solid 1px ${alpha(theme.palette.grey[300], 0.2)}`,
    },
}));

export default function MenuPopover({ children, sx, ...other }: any) {
    return (
        <Popover
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
                sx: {
                    mt: 1.5,
                    ml: 0.5,
                    overflow: "inherit",
                    boxShadow: (theme: any) => theme.customShadows.z20,
                    border: (theme: any) =>
                        `solid 1px ${alpha(theme.palette.grey[300], 0.2)}`,
                    width: 200,
                    bgcolor: "#2a304d",
                    color: "#ffffff",
                    '& .MuiMenuItem-root:hover': {
                        bgcolor: alpha("#ffffff", 0.1)
                    },
                    ...sx,
                },
            }}
            {...other}
        >
            <ArrowStyle className="arrow" />

            {children}
        </Popover>
    );
}
