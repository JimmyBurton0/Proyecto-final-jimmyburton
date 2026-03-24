import React, { useState } from "react";
import { Link } from "react-router-dom";

export const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);

    const handleRequest = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/recovery-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            
            // Como no hay servidor de correo, mostramos el token en consola para pruebas
            console.log("Token recibido del backend:", data.recovery_token);
            setMessage("Si el correo existe, se ha generado un token. Búscalo en la consola (F12).");
        } catch (error) {
            setMessage("Error al conectar con el servidor.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Recuperar Clave</h2>
            <form onSubmit={handleRequest} className="border p-4 shadow-sm rounded bg-light">
                <p className="small text-muted">Ingresa tu correo y te daremos un token para cambiar tu clave.</p>
                <div className="mb-3">
                    <input 
                        type="email" 
                        className="form-control" 
                        placeholder="correo@ejemplo.com"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required 
                    />
                </div>
                <button className="btn btn-primary w-100">Obtener Token</button>
                <div className="text-center mt-3">
                    <Link to="/login">Volver al Login</Link>
                </div>
            </form>
            {message && <div className="alert alert-info mt-3 small text-center">{message}</div>}
        </div>
    );
};