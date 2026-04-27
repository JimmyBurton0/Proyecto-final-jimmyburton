import React from "react";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Category } from "./pages/Category";
import { Cart } from "./pages/Cart";
import { AddProduct } from "./pages/AddProduct";
import { Signup } from "./pages/Signup";
import { Login } from "./pages/Login";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";
import { injectContext } from "./store.jsx"; 

const AppRoutes = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Layout />} errorElement={<div className="text-center py-5"><h1>Not found!</h1></div>}>
                <Route index element={<Home />} />
                <Route path="single/:theId" element={<Single />} />
                <Route path="category/:categoryName" element={<Category />} />
                <Route path="cart" element={<Cart />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="signup" element={<Signup />} />
                <Route path="login" element={<Login />} />
                <Route path="forgot" element={<ForgotPassword />} />
                <Route path="reset" element={<ResetPassword />} />
            </Route>
        )
    );

    return <RouterProvider router={router} />;
};

export default injectContext(AppRoutes);