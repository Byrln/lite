import { useState, useEffect } from "react";
import { SketchPicker } from "react-color";
import { Box } from "@mui/material";
import styles1 from "./styles/color.module.scss";
import CloseIcon from "@mui/icons-material/Close";

const hexToRGBA = (h: string) => {
    let r: any = 0,
        g: any = 0,
        b: any = 0;

    // 3 digits
    if (h.length == 4) {
        r = "0x" + h[1] + h[1];
        g = "0x" + h[2] + h[2];
        b = "0x" + h[3] + h[3];

        // 6 digits
    } else if (h.length == 7) {
        r = "0x" + h[1] + h[2];
        g = "0x" + h[3] + h[4];
        b = "0x" + h[5] + h[6];
    }

    return {
        r: parseInt(r, 16),
        g: parseInt(g, 16),
        b: parseInt(b, 16),
        a: "1",
    };
};

const ColorPicker = ({ onColorChange }: any) => {
    const colorDefault = "#0033ff";

    const [state, setState] = useState({
        displayColorPicker: false,
        color: hexToRGBA(colorDefault),
    });

    useEffect(() => {
        onColorChange(colorDefault);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleClick = () => {
        setState({
            ...state,
            displayColorPicker: !state.displayColorPicker,
        });
    };

    const handleClose = () => {
        setState({
            ...state,
            displayColorPicker: false,
        });
    };

    const handleChange = (color: any) => {
        setState({
            ...state,
            color: color.rgb,
        });
        onColorChange(color.hex);
    };

    const styles = {
        color: {
            width: "40px",
            height: "34px",
            borderRadius: "2px",
            background: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})`,
        },
        swatch: {
            background: "#fff",
            borderRadius: "1px",
            // boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
            display: "inline-block",
            cursor: "pointer",
        },
        popover: {
            position: "absolute",
            zIndex: "2",
            bottom: "80px",
            backgroundColor: "white",
        },
        cover: {
            position: "fixed",
            top: "0px",
            right: "0px",
            bottom: "0px",
            left: "0px",
        },
    };

    return (
        <Box
            style={{ height: "34px", marginBottom: "4px", marginRight: "10px" }}
        >
            <Box sx={styles.swatch} onClick={handleClick}>
                <Box sx={styles.color} />
            </Box>
            {state.displayColorPicker ? (
                <Box className={styles1.popover}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row-reverse",
                            paddingRight: "10px",
                            paddingTop: "5px",
                        }}
                    >
                        <Box onClick={handleClose}>
                            <CloseIcon />
                        </Box>
                    </Box>

                    <SketchPicker color={state.color} onChange={handleChange} />
                </Box>
            ) : null}
        </Box>
    );
};

export default ColorPicker;
