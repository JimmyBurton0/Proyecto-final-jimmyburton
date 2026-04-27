import { useContext } from "react";
import { Context } from "../store"

export default function useGlobalReducer() {
    const contextValue = useContext(Context);

    if (!contextValue) {
        throw new Error("useGlobalReducer must be used within the Context Provider");
    }

    return {
        dispatch: contextValue.dispatch,
        store: contextValue.store,
        actions: contextValue.actions
    };
}