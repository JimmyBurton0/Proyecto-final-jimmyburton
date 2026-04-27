import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Context } from "../store.jsx";

export const EditProduct = () => {
    const navigate = useNavigate();
    const { productId } = useParams();
    const { store, actions } = useContext(Context);

    const product = store.products?.find(p => p.id === parseInt(productId));

    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        priceUsd: "",
        stockQuantity: "",
        categoryId: "",
        yearStart: "",
        yearEnd: "",
        vehicleType: "carro",
        isOriginal: false,
        condition: "nuevo"
    });

    const [loading, setLoading] = useState(false);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (product) {
            setFormData({
                name: product.name || "",
                brand: product.brand || "",
                priceUsd: product.priceUsd || "",
                stockQuantity: product.stockQuantity || "",
                categoryId: product.categoryId || "",
                yearStart: product.yearStart || "",
                yearEnd: product.yearEnd || "",
                vehicleType: product.vehicleType || "carro",
                isOriginal: product.isOriginal || false,
                condition: product.condition || "nuevo"
            });
        } else {
            setNotFound(true);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const rawToken = localStorage.getItem("token");
        const token = rawToken ? rawToken.trim().replace(/^"|"$/g, '') : null;

        if (!token) {
            alert("No se encontró una sesión válida. Por favor, inicia sesión de nuevo.");
            return;
        }

        setLoading(true);

        const baseUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");

        try {
            const productData = {
                name: formData.name.trim(),
                brand: formData.brand.trim() || null,
                priceUsd: parseFloat(formData.priceUsd),
                stockQuantity: parseInt(formData.stockQuantity) || 0,
                categoryId: parseInt(formData.categoryId),
                yearStart: formData.yearStart ? parseInt(formData.yearStart) : null,
                yearEnd: formData.yearEnd ? parseInt(formData.yearEnd) : null,
                vehicleType: formData.vehicleType,
                isOriginal: formData.isOriginal,
                condition: formData.condition
            };

            if (isNaN(productData.priceUsd) || isNaN(productData.categoryId)) {
                alert("Por favor, ingresa un precio y una categoría válidos.");
                setLoading(false);
                return;
            }

            if (actions && actions.updateProduct) {
                const success = await actions.updateProduct(productId, productData);

                if (success) {
                    alert("¡Producto actualizado con éxito!");
                    navigate(`/single/${productId}`);
                } else {
                    alert("Error al actualizar el producto. Verifica que seas administrador.");
                }
            }
        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de conexión. Verifica que el backend esté activo.");
        } finally {
            setLoading(false);
        }
    };

    if (notFound) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center" role="alert">
                    <i className="fa-solid fa-exclamation-circle me-2"></i>
                    <strong>Producto no encontrado</strong>
                </div>
                <div className="text-center">
                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/")}
                    >
                        Volver al inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow border-0 p-4">
                        <h2 className="text-center mb-4 fw-bold text-primary">
                            <i className="fa-solid fa-pen-to-square me-2"></i>Editar Repuesto
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-secondary">NOMBRE DEL REPUESTO</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control form-control-lg"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Ej: Pastillas de freno"
                                    required
                                />
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">MARCA</label>
                                    <input
                                        type="text"
                                        name="brand"
                                        className="form-control"
                                        value={formData.brand}
                                        onChange={handleChange}
                                        placeholder="Ej: Toyota"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">CATEGORÍA</label>
                                    <select
                                        name="categoryId"
                                        className="form-select"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Selecciona una opción...</option>
                                        <option value="1">Motor</option>
                                        <option value="2">Faros</option>
                                        <option value="3">Carrocería</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3">
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-secondary">AÑO INICIO</label>
                                    <input
                                        type="number"
                                        name="yearStart"
                                        className="form-control"
                                        value={formData.yearStart}
                                        onChange={handleChange}
                                        placeholder="2000"
                                    />
                                </div>
                                <div className="col-md-3">
                                    <label className="form-label fw-bold small text-secondary">AÑO FIN</label>
                                    <input
                                        type="number"
                                        name="yearEnd"
                                        className="form-control"
                                        value={formData.yearEnd}
                                        onChange={handleChange}
                                        placeholder="2024"
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">TIPO DE VEHÍCULO</label>
                                    <select
                                        name="vehicleType"
                                        className="form-select"
                                        value={formData.vehicleType}
                                        onChange={handleChange}
                                    >
                                        <option value="carro">Carro</option>
                                        <option value="camioneta">Camioneta</option>
                                        <option value="moto">Moto</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row mb-3 align-items-center">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">CONDICIÓN</label>
                                    <div className="d-flex gap-3">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="condition"
                                                id="nuevo"
                                                value="nuevo"
                                                checked={formData.condition === "nuevo"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="nuevo">Nuevo</label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                name="condition"
                                                id="usado"
                                                value="usado"
                                                checked={formData.condition === "usado"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" htmlFor="usado">Usado</label>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-check form-switch mt-4">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isOriginal"
                                            name="isOriginal"
                                            checked={formData.isOriginal}
                                            onChange={handleChange}
                                        />
                                        <label className="form-check-label fw-bold" htmlFor="isOriginal">¿Es Repuesto Original?</label>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4">
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">PRECIO (USD)</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-light fw-bold">$</span>
                                        <input
                                            type="number"
                                            name="priceUsd"
                                            step="0.01"
                                            className="form-control"
                                            value={formData.priceUsd}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold small text-secondary">STOCK</label>
                                    <input
                                        type="number"
                                        name="stockQuantity"
                                        className="form-control"
                                        value={formData.stockQuantity}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-2">
                                <button
                                    type="button"
                                    className="btn btn-secondary flex-grow-1 fw-bold py-3"
                                    onClick={() => navigate(`/single/${productId}`)}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary flex-grow-1 fw-bold py-3 shadow-sm"
                                    disabled={loading}
                                >
                                    {loading ? "GUARDANDO..." : "GUARDAR CAMBIOS"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
