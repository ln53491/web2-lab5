import * as React from "react";

export function useAddToHomescreenPrompt(){
    const [prompt, setState] = React.useState(
        null
    );

    const promptToInstall = () => {
        if (prompt != null) {
            return prompt.prompt();
        }
    };

    React.useEffect(() => {
        const ready = (e) => {
            e.preventDefault();
            setState(e);
        };

        window.addEventListener("beforeinstallprompt", ready);

        return () => {
            window.removeEventListener("beforeinstallprompt", ready);
        };
    }, []);

    return [prompt, promptToInstall];
}