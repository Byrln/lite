export default function IconButton(theme: any) {
    return {
        MuiIconButton: {
            variants: [
                {
                    props: { color: "default" },
                    style: {
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                },
                {
                    props: { color: "inherit" },
                    style: {
                        "&:hover": {
                            backgroundColor: theme.palette.action.hover,
                        },
                    },
                },
            ],

            styleOverrides: {
                root: {},
            },
        },
    };
}
