// ** MUI Imports
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";

const CardStatsVertical = ({
    title,
    subtitle,
    color,
    icon,
    stats,
    trend,
    trendNumber,
}: any) => {
    // ** Props

    return (
        <Card>
            <CardContent>
                <Box
                    sx={{
                        display: "flex",
                        marginBottom: 2,
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                    }}
                >
                    <Avatar
                        sx={{
                            boxShadow: 3,
                            marginRight: 4,
                            color: "common.white",
                            backgroundColor: `${color}`,
                        }}
                    >
                        {icon}
                    </Avatar>
                </Box>
                <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {title}
                </Typography>
                <Box
                    sx={{
                        marginTop: 1,
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "flex-start",
                    }}
                >
                    <Typography variant="h6" sx={{ mr: 2 }}>
                        {stats}
                    </Typography>
                    <Typography
                        component="sup"
                        variant="caption"
                        sx={{
                            color:
                                trend === "positive"
                                    ? "success.main"
                                    : "error.main",
                        }}
                    >
                        {trendNumber}
                    </Typography>
                </Box>
                {/* <Typography variant="caption">{subtitle}</Typography> */}
            </CardContent>
        </Card>
    );
};

export default CardStatsVertical;

CardStatsVertical.defaultProps = {
    color: "primary",
    trend: "positive",
};
