import { Box, Typography, Stack } from "@mui/material";

export default function Logo({ size, sx, showText = true }: any) {
  const isSmall = size === "sm" || size === true;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{
        ...sx,
        width: isSmall ? 'auto' : 'auto'
      }}
    >
      <Box
        component="img"
        src="/images/logo_sm.png"
        sx={{
          width: isSmall ? 40 : 60,
          height: isSmall ? 40 : "auto",
          objectFit: "contain",
        }}
      />
      {showText && (
        <Stack spacing={0}>
          <Typography
            variant={isSmall ? "h5" : "h4"}
            sx={{
              fontWeight: 700,
              lineHeight: 1.2,
              color: sx?.color || 'inherit'
            }}
          >
            <span className="text-[#00c9ef]">Ho</span><span className="text-[#804fe6]">Re</span><span className="text-[#ff4d76]">Ca</span><span>Soft</span>
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: isSmall ? "0.5rem" : "0.62rem",
              opacity: 0.8,
              color: sx?.color || 'inherit'
            }}
          >
            Hotel, Resort, Camp Software
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
