// Import necessary hooks and functions from React.
import { useContext } from "react";
import { Context } from "../store"  // Import the Context from store.jsx

// Custom hook to access the global state and dispatch function.
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