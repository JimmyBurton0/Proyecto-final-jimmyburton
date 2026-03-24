import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            
            // Log para verificar a dónde estamos enviando los datos
            console.log("Enviando registro a:", `${backendUrl}/api/signup`);

            const response = await fetch(`${backendUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    fullName: fullName
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Usuario creado exitosamente");
                alert("¡Cuenta creada con éxito! Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                // Muestra el mensaje de error que viene del backend (ej: "Correo ya registrado")
                setError(data.msg || "Error al registrarse");
            }
        } catch (err) {
            console.error("Error en la conexión:", err);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Crear Cuenta</h2>
            <form onSubmit={handleSignup} className="border p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">Nombre Completo</label>
                    <input
                        type="text"
                        className="form-control"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Tu nombre"
                        required
                    />
                </div>
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
                {error && (
                    <div className="alert alert-danger p-2 small text-center">
                        {error}
                    </div>
                )}
                <button type="submit" className="btn btn-success w-100">Registrarse</button>
            </form>
        </div>
    );
};