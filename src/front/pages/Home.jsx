import React, { useContext, useState } from "react";
import { Context } from "../store";
import { useNavigate, useLocation } from "react-router-dom";

export const Home = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const [showModal, setShowModal] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    const categories = [
        { name: "Motor", icon: "fa-engine", color: "text-danger" },
        { name: "Faros", icon: "fa-lightbulb", color: "text-warning" },
        { name: "Carrocería", icon: "fa-car-rear", color: "text-info" },
    ];

    const handleNavigation = (name) => {
        const normalizedName = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        navigate(`/category/${normalizedName}`);
    };

    const filteredProducts = store.products?.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const askConfirmation = (product) => {
        setProductToDelete(product);
        setShowModal(true);
    };

    const handleConfirmDelete = async (reason) => {
        if (productToDelete) {
            const success = await actions.deleteProduct(productToDelete.id);

            if (success) {
                console.log(`Producto "${productToDelete.name}" eliminado. Razón: ${reason}`);
            } else {
                alert("No se pudo eliminar el repuesto. Verifica la conexión con el servidor.");
            }
        }

        setShowModal(false);
        setProductToDelete(null);
    };

    return (
        <div className="container-fluid bg-light min-vh-100 py-5">
            <div className="container">
                {!searchQuery && (
                    <>
                        <div className="d-flex align-items-center mb-4">
                            <h4 className="fw-bold text-dark me-3">Categorías destacadas</h4>
                            <div className="flex-grow-1 border-bottom"></div>
                        </div>

                        <div className="row g-4 justify-content-center mb-5">
                            {categories.map((cat, index) => (
                                <div key={index} className="col-6 col-md-4 col-lg-3">
                                    <div
                                        className="card h-100 border-0 shadow-sm text-center p-4 bg-white"
                                        onClick={() => handleNavigation(cat.name)}
                                        style={{ cursor: "pointer", transition: "transform 0.2s" }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                                    >
                                        <div className={`fs-1 mb-2 ${cat.color}`}>
                                            <i className={`fa-solid ${cat.icon}`}></i>
                                        </div>
                                        <span className="fw-bold text-dark small text-uppercase">{cat.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                <div className="d-flex align-items-center mb-4 mt-4">
                    <h4 className="fw-bold text-dark me-3">
                        {searchQuery ? `Resultados para: "${searchQuery}"` : "Todos los Repuestos"}
                    </h4>
                    <div className="flex-grow-1 border-bottom"></div>
                </div>

                <div className="row g-4">
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((item) => (
                            <div key={item.id} className="col-12 col-md-6 col-lg-4">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title fw-bold text-primary">{item.name}</h5>
                                        <p className="card-text text-muted mb-1">Marca: <strong>{item.brand}</strong></p>
                                        <p className="card-text text-muted mb-1">Categoría: <span className="badge bg-light text-dark">{item.category || "General"}</span></p>
                                        <h4 className="fw-bold mt-3 text-success">${item.priceUsd}</h4>

                                        <div className="d-flex gap-2 mt-2">
                                            <button
                                                className="btn btn-outline-primary flex-grow-1 fw-bold"
                                                onClick={() => navigate(`/single/${item.id}`)}
                                            >
                                                Ver Detalles
                                            </button>
                                            <button
                                                className="btn btn-outline-danger"
                                                onClick={() => askConfirmation(item)}
                                                title="Eliminar"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-5 w-100">
                            <i className="fa-solid fa-box-open fa-3x text-muted mb-3"></i>
                            <p className="lead text-muted">No encontramos repuestos que coincidan con "{searchQuery}".</p>
                        </div>
                    )}
                </div>

                { }
                {!searchQuery && (
                    <div className="mt-5 pt-5 text-center text-muted">
                        <p className="lead">¿No encuentras lo que buscas? Regístrate para recibir notificaciones.</p>
                        <button className="btn btn-primary btn-lg px-5 shadow" onClick={() => navigate("/signup")}>
                            Empezar a comprar
                        </button>
                    </div>
                )}
            </div>


            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header border-0">
                                <h5 className="modal-title fw-bold">Confirmar eliminación</h5>
                                <button type="button" className="btn-close shadow-none" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body text-center py-4">
                                <p>¿Estás seguro de eliminar <strong>{productToDelete?.name}</strong>?</p>
                            </div>
                            <div className="modal-footer border-0 d-flex justify-content-center gap-3 pb-4">
                                <button className="btn btn-danger px-4 fw-bold" onClick={() => handleConfirmDelete("Borrar")}>
                                    Confirmar Borrar
                                </button>
                                <button className="btn btn-success px-4 fw-bold" onClick={() => handleConfirmDelete("Vendido")}>
                                    Repuesto Vendido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};