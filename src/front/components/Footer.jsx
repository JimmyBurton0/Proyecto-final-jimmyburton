import React, { useState } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <footer className="footer mt-auto bg-white border-top position-relative">
            <div className="container">
                {}
                <div 
                    className={`info-tab shadow-sm bg-light border-start border-end border-top rounded-top ${isExpanded ? "show-tab" : ""}`}
                >
                    <div className="container py-4">
                        <div className="row text-center text-md-start g-3">
                            <div className="col-12 col-md-4">
                                <h6 className="fw-bold mb-2 small">Ayuda</h6>
                                <ul className="list-unstyled mb-0">
                                    <li><Link to="/ayuda" className="text-decoration-none text-muted small">Centro de Seguridad</Link></li>
                                    <li><Link to="/ayuda" className="text-decoration-none text-muted small">Resolución de problemas</Link></li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-4">
                                <h6 className="fw-bold mb-2 small">Mi cuenta</h6>
                                <ul className="list-unstyled mb-0">
                                    <li><Link to="/login" className="text-decoration-none text-muted small">Ingresa</Link></li>
                                    <li><Link to="/signup" className="text-decoration-none text-muted small">Vender</Link></li>
                                </ul>
                            </div>
                            <div className="col-12 col-md-4 text-center">
                                <h6 className="fw-bold mb-2 small">Redes sociales</h6>
                                <div className="d-flex justify-content-center gap-3">
                                    <a href="#" className="text-muted"><i className="fa-brands fa-facebook small"></i></a>
                                    <a href="#" className="text-muted"><i className="fa-brands fa-instagram small"></i></a>
                                    <a href="#" className="text-muted"><i className="fa-brands fa-x-twitter small"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {}
                <div className="py-3 bg-white position-relative" style={{ zIndex: 10 }}>
                    <div className="d-flex justify-content-center border-bottom pb-2 mb-2">
                        <button 
                            className="btn btn-link text-decoration-none text-primary fw-medium p-0 d-flex align-items-center" 
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            style={{ fontSize: "0.85rem" }}
                        >
                            Más información
                            <i className={`fa-solid fa-chevron-up ms-2 transition-icon ${isExpanded ? "rotate-icon" : ""}`}></i>
                        </button>
                    </div>
                    <div className="text-center">
                        <p className="text-muted mb-0" style={{ fontSize: "0.7rem" }}>
                            Copyright © 1999-2026 Repuestos UCAB S.R.L.
                        </p>
                    </div>
                </div>
            </div>

            <style>
                {`
                .info-tab {
                    position: absolute;
                    bottom: 100%; 
                    left: 50%;
                    transform: translateX(-50%) translateY(10px); 
                    width: 90%;
                    max-width: 900px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    z-index: 5;
                }

                .show-tab {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(-50%) translateY(0); 
                }

                .transition-icon {
                    transition: transform 0.3s ease;
                }

                .rotate-icon {
                    transform: rotate(180deg);
                }

                .footer {
                    z-index: 1000;
                }
                `}
            </style>
        </footer>
    );
};