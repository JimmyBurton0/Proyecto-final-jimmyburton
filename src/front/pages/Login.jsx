import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            // Usamos import.meta.env para Vite
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                sessionStorage.setItem("token", data.token);
                navigate("/"); 
            } else {
                setError(data.msg || "Error al iniciar sesión");
            }
        } catch (err) {
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleLogin} className="border p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="correo@ejemplo.com"
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="********"
                        required 
                    />
                </div>
                {error && <div className="alert alert-danger p-2 small text-center">{error}</div>}
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
            </form>
        </div>
    );
};