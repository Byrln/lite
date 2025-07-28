export default function Tooltip(theme: any) {
  return {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: theme.palette.grey[800],
          transition: 'opacity 3000ms ease-in-out, transform 3000ms ease-in-out',
          opacity: 1,
          transform: 'scale(1)',
        },
        arrow: {
          color: theme.palette.grey[800],
        },
      },
    },
  };
}
