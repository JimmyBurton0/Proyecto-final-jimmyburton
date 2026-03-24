import React from "react";

export const Home = () => {
    // Intentamos obtener los datos del usuario que guardamos en el Login
    const storedUser = localStorage.getItem("currentUser");
    const currentUser = storedUser ? JSON.parse(storedUser) : null;

    return (
        <div className="container mt-5">
            <div className="text-center border p-5 rounded bg-light shadow-sm">
                <h1>Sistema de Gestión de Repuestos</h1>
                <hr className="my-4" />
                
                {currentUser ? (
                    <div>
                        <h3>¡Bienvenido de nuevo, {currentUser.fullName}!</h3>
                        <p className="lead">Has iniciado sesión correctamente.</p>
                        <div className="mt-4">
                            <button className="btn btn-primary me-2">Ver Inventario</button>
                            <button className="btn btn-success">Agregar Repuesto</button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <h3>Bienvenido al Sistema</h3>
                        <p>Por favor, inicia sesión para gestionar tus datos.</p>
                    </div>
                )}
            </div>
        </div>
    );
};