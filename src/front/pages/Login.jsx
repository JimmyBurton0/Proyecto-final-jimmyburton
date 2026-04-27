import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store";

export const Login = () => {
    const { dispatch } = useContext(Context);
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);
        setLoading(true);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail, password: userPassword })
            });

            const data = await response.json();

            if (response.ok) {
                const tokenParaGuardar = data.accessToken || data.token;

                if (tokenParaGuardar) {
                    localStorage.setItem("token", tokenParaGuardar);
                    localStorage.setItem("currentUser", JSON.stringify(data.user));
                    
                    dispatch({
                        type: "set_user",
                        payload: {
                            user: data.user,
                            token: tokenParaGuardar
                        }
                    });
                    
                    navigate("/"); 
                } else {
                    setErrorMessage("El servidor no envió un token válido");
                }
            } else {
                setErrorMessage(data.msg || "Correo o contraseña incorrectos");
            }
        } catch (err) {
            setErrorMessage("Error de conexión con el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-5" style={{ minHeight: "80vh" }}>
            <div className="card border-0 shadow-sm p-4" style={{ width: "100%", maxWidth: "400px" }}>
                <h2 className="text-center fw-bold mb-4">Iniciar Sesión</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Correo Electrónico</label>
                        <input type="email" className="form-control py-2" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="correo@ejemplo.com" required />
                    </div>
                    <div className="mb-3">
                        <label className="form-label small fw-bold">Contraseña</label>
                        <input type="password" className="form-control py-2" value={userPassword} onChange={(e) => setUserPassword(e.target.value)} placeholder="********" required />
                    </div>

                    {errorMessage && (
                        <div className="alert alert-danger py-2 small text-center">
                            {errorMessage}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100 py-2 shadow-sm fw-bold" disabled={loading}>
                        {loading ? "Entrando..." : "Entrar"}
                    </button>
                    
                    <div className="text-center mt-3">
                        <Link to="/forgot" className="small text-decoration-none text-muted">¿Olvidaste tu contraseña?</Link>
                    </div>
                    
                    <hr className="my-4 text-muted" />

                    <div className="text-center">
                        <span className="small text-muted">¿No tienes cuenta? </span>
                        <Link to="/signup" className="small fw-bold text-decoration-none">Regístrate</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};