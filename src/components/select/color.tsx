import {useState, useEffect} from "react";
import {SketchPicker} from "react-color";
import {Box, hexToRgb} from "@mui/material";
import styles1 from "styles/select/color.module.scss";

const hexToRGBA = (h: string) => {
    let r: any = 0, g: any = 0, b: any = 0;

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
        a: '1'
    };
}

const ColorPicker = ({onColorChange}: any) => {

    const colorDefault = "#f17013";

    const [state, setState] = useState({
        displayColorPicker: false,
        color: hexToRGBA(colorDefault),
        // color: {
        //     r: '241',
        //     g: '112',
        //     b: '19',
        //     a: '1',
        // },
    });

    useEffect(() => {
        onColorChange(colorDefault);
    }, []);

    const handleClick = () => {
        setState({
            ...state,
            displayColorPicker: !state.displayColorPicker
        });
    };

    const handleClose = () => {
        setState({
            ...state,
            displayColorPicker: false
        })
    };

    const handleChange = (color: any) => {
        setState({
            ...state,
            color: color.rgb
        })
        onColorChange(color.hex);
    };


    const styles = {
        color: {
            width: '50px',
            height: '40px',
            borderRadius: '2px',
            background: `rgba(${state.color.r}, ${state.color.g}, ${state.color.b}, ${state.color.a})`,
        },
        swatch: {
            padding: '5px',
            background: '#fff',
            borderRadius: '1px',
            boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
            display: 'inline-block',
            cursor: 'pointer',
            mt: 1.5,
        },
        popover: {
            position: "absolute",
            zIndex: "2",
            bottom: "80px",
        },
        cover: {
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
        },
    };


    return (
        <Box>
            <Box sx={styles.swatch} onClick={handleClick}>
                <Box sx={styles.color}/>
            </Box>
            {state.displayColorPicker ?
                <Box className={styles1.popover}>
                    <Box onClick={handleClose}/>
                    <SketchPicker color={state.color} onChange={handleChange}/>
                </Box> : null}
        </Box>
    );

};

export default ColorPicker;
