import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Añadimos Link para la navegación interna

export const Login = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userPassword, setUserPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(null);

        const loginData = {
            email: userEmail,
            password: userPassword
        };

        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData)
            });

            const data = await response.json();

            if (response.ok) {
                // El programador ve 'accessToken', el usuario ve el resultado
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                
                navigate("/"); 
            } else {
                // Mensaje en español para el usuario
                setErrorMessage(data.msg || "Correo o contraseña incorrectos");
            }
        } catch (err) {
            // Mensaje en español para el usuario
            setErrorMessage("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleLoginSubmit} className="border p-4 shadow-sm rounded bg-light">
                <div className="mb-3">
                    <label className="form-label">Correo Electrónico</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        value={userEmail} 
                        onChange={(e) => setUserEmail(e.target.value)} 
                        placeholder="correo@ejemplo.com"
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={userPassword} 
                        onChange={(e) => setUserPassword(e.target.value)} 
                        placeholder="********"
                        required 
                    />
                </div>
                {errorMessage && (
                    <div className="alert alert-danger p-2 small text-center">
                        {errorMessage}
                    </div>
                )}
                <button type="submit" className="btn btn-primary w-100">Entrar</button>
                
                {/* Enlace para la recuperación de contraseña (H-5) */}
                <div className="text-center mt-3">
                    <Link to="/forgot" className="small text-decoration-none">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
                
                {/* Enlace opcional para ir al registro si no tiene cuenta */}
                <div className="text-center mt-2">
                    <span className="small text-muted">¿No tienes cuenta? </span>
                    <Link to="/signup" className="small text-decoration-none">
                        Regístrate
                    </Link>
                </div>
            </form>
        </div>
    );
};