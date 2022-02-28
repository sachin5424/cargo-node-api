import React, { useContext } from "react";
import { useState } from "react/cjs/react.development";
const themes = {
    light: {
        foreground: "#000000",
        background: "#eeeeee"
    },
    dark: {
        foreground: "#ffffff",
        background: "#222222"
    }
};

const ThemeContext = React.createContext();
const SetThemeContext = React.createContext();

export default function App() {

    const [theme, setTheme] = useState('light');

    return (
        <ThemeContext.Provider value={theme}>
            <SetThemeContext.Provider value={setTheme}>
                <Toolbar />
            </SetThemeContext.Provider>
        </ThemeContext.Provider>
    );
}

function Toolbar(props) {
    return (
        <div>
            <ThemedButton />
        </div>
    );
}

function ThemedButton() {
    const theme = useContext(ThemeContext);
    const setTheme = useContext(SetThemeContext);
    return (
        <button style={{ background: theme.background, color: theme.foreground }} onClick={()=>{setTheme('dark')}}>
            I am styled by theme context!
        </button>
    );
}