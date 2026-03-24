import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // Nuevo estado para confirmar
    const [errorMessage, setErrorMessage] = useState(null); // Para mostrar errores
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const handleReset = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        // Validación en el Frontend: ¿Coinciden las claves?
        if (password !== confirmPassword) {
            setErrorMessage("Las contraseñas no coinciden.");
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` 
                },
                body: JSON.stringify({ password })
            });

            const data = await response.json();

            if (response.ok) {
                alert("¡Contraseña actualizada! Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                // Si el backend dice que la clave ya se usó, lo mostramos aquí
                setErrorMessage(data.msg || "El token ha expirado o es inválido.");
            }
        } catch (error) {
            console.error(error);
            setErrorMessage("Error de conexión con el servidor.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Nueva Contraseña</h2>
            <form onSubmit={handleReset} className="border p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">Escribe tu nueva clave</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="********"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirma tu nueva clave</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        placeholder="********"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required 
                    />
                </div>

                {/* Mostramos el error si existe */}
                {errorMessage && (
                    <div className="alert alert-danger p-2 small text-center">
                        {errorMessage}
                    </div>
                )}

                <button className="btn btn-success w-100">Cambiar Contraseña</button>
            </form>
        </div>
    );
};