import { merge } from "lodash";

import Card from "./card";
import Lists from "./lists";
import Paper from "./paper";
import Input from "./input";
import Button from "./button";
import Tooltip from "./tooltip";
import Backdrop from "./backdrop";
import Typography from "./typography";
import IconButton from "./icon-button";
import Autocomplete from "./auto-complete";

export default function ComponentsOverrides(theme: any) {
    return merge(
        Card(theme),
        Lists(theme),
        Paper(),
        Input(theme),
        Button(theme),
        Tooltip(theme),
        Backdrop(theme),
        Typography(theme),
        IconButton(theme),
        Autocomplete(theme)
    );
}
