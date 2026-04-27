import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store";

export const Navbar = ({ cartCount }) => {
    const { store, dispatch } = useContext(Context);
    const [search, setSearch] = useState("");
    const navigate = useNavigate();

    const currentUser = store.user || JSON.parse(localStorage.getItem("currentUser"));

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        navigate(`/?query=${encodeURIComponent(value)}`);
    };

    const handleLogout = () => {
        dispatch({ type: "logout" });
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3 shadow-sm sticky-top">
            <div className="container-fluid px-lg-5">
                <Link to="/" className="navbar-brand fw-bold d-flex align-items-center" onClick={() => setSearch("")}>
                    <i className="fa-solid fa-gears me-2 text-primary fs-3"></i>
                    <span className="fs-4">Repuestos</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarContent">
                    {}
                    <div className="d-flex mx-auto w-50 my-2 my-lg-0">
                        <div className="input-group">
                            <input 
                                type="text" 
                                className="form-control border-0 shadow-none" 
                                placeholder="Busca repuestos por nombre..." 
                                value={search}
                                onChange={handleSearchChange}
                            />
                            <button className="btn btn-white bg-white border-0" type="button">
                                <i className="fa-solid fa-magnifying-glass text-muted"></i>
                            </button>
                        </div>
                    </div>

                    <ul className="navbar-nav align-items-center">
                        <li className="nav-item">
                            <Link className="nav-link px-3 d-flex align-items-center" to="/add-product">
                                <i className="fa-solid fa-circle-plus me-1 text-primary"></i>
                                Agregar Producto
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link px-3 position-relative" to="/cart">
                                <i className="fa-solid fa-cart-shopping fs-5"></i>
                                {cartCount > 0 && (
                                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.7rem" }}>
                                        {cartCount}
                                    </span>
                                )}
                            </Link>
                        </li>

                        <div className="vr d-none d-lg-block mx-3 text-white" style={{opacity: "0.3"}}></div>

                        {currentUser ? (
                            <li className="nav-item dropdown">
                                <button className="btn btn-link nav-link dropdown-toggle d-flex align-items-center" data-bs-toggle="dropdown">
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" style={{width: "32px", height: "32px"}}>
                                        <span className="text-white small fw-bold">
                                            {currentUser.fullName?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <span className="d-none d-xl-inline">{currentUser.fullName}</span>
                                </button>
                                <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2">
                                    <li><Link className="dropdown-item" to="/profile">Mi Perfil</Link></li>
                                    <li><hr className="dropdown-divider" /></li>
                                    <li>
                                        <button className="dropdown-item text-danger" onClick={handleLogout}>
                                            Cerrar Sesión
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link className="nav-link px-3" to="/login">Ingresar</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="btn btn-primary ms-lg-2 rounded-pill px-4" to="/signup">Crear cuenta</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};