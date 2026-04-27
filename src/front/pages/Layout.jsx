import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { Context } from "../store.jsx"; 
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const { store, dispatch } = useContext(Context);

    const addToCart = (product) => dispatch({ type: "add_to_cart", payload: product });
    const removeFromCart = (id) => dispatch({ type: "remove_from_cart", payload: id });
    const clearCart = () => dispatch({ type: "clear_cart" });

    return (
        <div className="d-flex flex-column min-vh-100">
            <ScrollToTop>
                {}
                <Navbar cartCount={store.cart.length} />
                <main className="flex-grow-1">
                    <Outlet context={{ 
                        store, 
                        dispatch, 
                        cart: store.cart, 
                        addToCart, 
                        removeFromCart, 
                        clearCart 
                    }} />
                </main>
                <Footer />
            </ScrollToTop>
        </div>
    );
};