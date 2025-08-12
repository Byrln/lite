import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { Box } from "@mui/material";
import styles1 from "./styles/color.module.scss";
import CloseIcon from "@mui/icons-material/Close";



const ColorPicker = ({ onColorChange }: any) => {
    const colorDefault = "#0033ff";

    const [state, setState] = useState({
        displayColorPicker: false,
        color: colorDefault,
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

    const handleChange = (color: string) => {
        setState({
            ...state,
            color: color,
        });
        onColorChange(color);
    };

    const styles = {
        color: {
            width: "40px",
            height: "34px",
            borderRadius: "2px",
            background: state.color,
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
            top: "40px",
            left: "0px",
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
            style={{ height: "34px", marginBottom: "4px", marginRight: "10px", position: "relative" }}
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

                    <HexColorPicker color={state.color} onChange={handleChange} />
                </Box>
            ) : null}
        </Box>
    );
};

export default ColorPicker;
