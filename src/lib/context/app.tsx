import { createContext, useContext, useEffect, useReducer } from "react";

const Context = createContext(null);
const { Provider }: any = Context;

const saveToLocal = (state: any) => {
    localStorage.setItem("settings", JSON.stringify(state));
};

const initialState = {
    themeColor: "#ffffff",
    editId: null,
    userRole: null,
    isShow: null,
};

const reducer = (state: any, action: any) => {
    switch (action.type) {
        case "themeColor": {
            const newState = { ...state, themeColor: action.brandColor };
            saveToLocal(newState);

            return newState;
        }
        case "editId": {
            const newState = { ...state, editId: action.editId };
            saveToLocal(newState);

            return newState;
        }
        case "isShow": {
            const newState = { ...state, isShow: action.isShow };
            saveToLocal(newState);

            return newState;
        }
        case "setup": {
            const settings = JSON.parse(
                localStorage.getItem("settings") || "{}"
            );

            return { ...state, ...settings };
        }
        case "init": {
            localStorage.removeItem("settings");

            return { ...state, ...initialState };
        }
        case "userRole": {
            const newState = { ...state, userRole: action.userRole };
            saveToLocal(newState);

            return newState;
        }
        default:
            return state;
    }
};

const AppProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        dispatch({ type: "setup" });
    }, []);

    return <Provider value={[state, dispatch]}>{children}</Provider>;
};

export default AppProvider;

export const useAppState = () => useContext(Context);
