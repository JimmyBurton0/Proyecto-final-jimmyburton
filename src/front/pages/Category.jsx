import React, { useState, useMemo } from "react";
import { Link, useParams, useOutletContext } from "react-router-dom";

export const Category = () => {
    const { categoryName } = useParams();
    const { addToCart, store } = useOutletContext();
    const [priceRange, setPriceRange] = useState(2000);

    const filteredProducts = useMemo(() => {
        if (!store?.products) return [];

        const normalize = (str) => 
            str ? str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : "";

        return store.products.filter((product) => {
            const productCat = typeof product.category === 'object' 
                ? normalize(product.category.name) 
                : normalize(product.category);
            
            const urlCat = normalize(categoryName);

            const matchCategory = productCat === urlCat;
            const matchPrice = parseFloat(product.priceUsd || product.price) <= priceRange;

            return matchCategory && matchPrice;
        });
    }, [store.products, categoryName, priceRange]);

    return (
        <div className="container-fluid py-4 px-lg-5 bg-light min-vh-100">
            <div className="row">
                <div className="col-12 col-md-3 col-lg-2 mb-4">
                    <h1 className="text-capitalize fw-bold mb-4 fs-3">{categoryName}</h1>
                    <p className="text-muted small">{filteredProducts.length} resultados</p>
                    
                    <h6 className="fw-bold mb-2">Precio Máximo</h6>
                    <input 
                        type="range" 
                        className="form-range" 
                        min="0" max="5000" step="50"
                        value={priceRange}
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    />
                    <div className="d-flex justify-content-between small text-muted mb-4">
                        <span>$0</span>
                        <span className="fw-bold text-primary">${priceRange}</span>
                    </div>
                </div>

                <div className="col-12 col-md-9 col-lg-10">
                    <div className="row g-3">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                <div className="card h-100 border-0 shadow-sm">
                                    <img 
                                        src={product.image_url || "https://via.placeholder.com/300x200?text=Repuesto"} 
                                        className="card-img-top p-3" 
                                        style={{ height: "180px", objectFit: "contain" }}
                                        alt={product.name}
                                    />
                                    <div className="card-body d-flex flex-column">
                                        <h6 className="fw-bold text-truncate">{product.name}</h6>
                                        <p className="text-muted small mb-1">{product.brand}</p>
                                        <p className="fs-4 fw-bold">${parseFloat(product.priceUsd).toFixed(2)}</p>
                                        <div className="d-flex gap-2 mt-auto">
                                            <button className="btn btn-primary btn-sm flex-grow-1" onClick={() => addToCart(product)}>Añadir</button>
                                            <Link to={`/single/${product.id}`} className="btn btn-outline-secondary btn-sm"><i className="fa-regular fa-eye"></i></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {filteredProducts.length === 0 && (
                            <div className="text-center py-5">
                                <h4>No hay productos en esta categoría todavía.</h4>
                                <Link to="/" className="btn btn-primary mt-3">Volver al inicio</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};