import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";

export const Cart = () => {
    const { cart, removeFromCart, clearCart } = useOutletContext();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => acc + parseFloat(item.price || 0), 0).toFixed(2);

    return (
        <div className="container py-5">
            <div className="row g-4">
                {}
                <div className="col-md-8">
                    <h4 className="fw-bold mb-4">Carrito de Compras ({cart.length})</h4>
                    {cart.length === 0 ? (
                        <div className="text-center p-5 bg-white rounded shadow-sm">
                            <i className="fa-solid fa-cart-shopping fs-1 text-muted mb-3"></i>
                            <p className="text-muted">Tu carrito está vacío.</p>
                            <button className="btn btn-primary px-4 rounded-pill" onClick={() => navigate("/")}>
                                Volver a la tienda
                            </button>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="card mb-3 border-0 shadow-sm p-3 bg-white">
                                <div className="d-flex align-items-center">
                                    <img 
                                        src={item.image_url || "https://via.placeholder.com/100"} 
                                        alt={item.name} 
                                        style={{width: "80px", height: "80px", objectFit: "contain"}} 
                                        className="rounded border" 
                                    />
                                    <div className="ms-3 flex-grow-1">
                                        <h6 className="mb-0 fw-bold">{item.name}</h6>
                                        <span className="text-primary fw-bold">${item.price}</span>
                                    </div>
                                    <button 
                                        className="btn btn-outline-danger border-0" 
                                        onClick={() => removeFromCart(item.id)}
                                        title="Eliminar producto"
                                    >
                                        <i className="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {}
                <div className="col-md-4">
                    <div className="card border-0 shadow-sm p-4 bg-white sticky-top" style={{ top: "100px" }}>
                        <h5 className="fw-bold mb-4 border-bottom pb-2">Resumen de compra</h5>
                        
                        <div className="d-flex justify-content-between mb-2">
                            <span className="text-muted">Subtotal ({cart.length} prod.)</span>
                            <span>${total}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-3">
                            <span className="text-muted">Envío</span>
                            <span className="text-success fw-bold">Gratis</span>
                        </div>
                        
                        <hr />
                        
                        <div className="d-flex justify-content-between mb-4">
                            <span className="fw-bold fs-5">Total</span>
                            <span className="fw-bold text-primary fs-4">${total}</span>
                        </div>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-uppercase text-muted">Método de Pago</label>
                            <select className="form-select border-0 bg-light shadow-none py-2">
                                <option value="card">💳 Tarjeta de Crédito / Débito</option>
                                <option value="zelle">📧 Zelle</option>
                                <option value="pagomovil">📲 Pago Móvil</option>
                                <option value="transfer">🏦 Transferencia Bancaria</option>
                            </select>
                        </div>

                        <button 
                            className="btn btn-primary w-100 py-3 fw-bold rounded-pill shadow-sm" 
                            disabled={cart.length === 0}
                            onClick={() => {
                                alert("💳 ¡Pago procesado con éxito! Gracias por tu compra.");
                                clearCart();
                                navigate("/");
                            }}
                        >
                            Finalizar Pedido
                        </button>
                        
                        <p className="text-center text-muted small mt-3">
                            <i className="fa-solid fa-lock me-1"></i> Pago seguro y encriptado
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};