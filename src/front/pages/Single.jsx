import { Link, useParams, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Single = () => {
  const { store } = useGlobalReducer();
  const { theId } = useParams();
  const navigate = useNavigate();

  const product = store.products?.find(p => p.id === parseInt(theId));

  if (!product) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-warning" role="alert">
          <i className="fa-solid fa-exclamation-triangle me-2"></i>
          <strong>Producto no encontrado</strong>
        </div>
        <Link to="/" className="btn btn-primary mt-3">
          <i className="fa-solid fa-arrow-left me-2"></i>Volver al inicio
        </Link>
      </div>
    );
  }

  const isAdmin = store.user?.role?.toLowerCase() === 'administrador';

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 mx-auto">
          <div className="card border-0 shadow-lg">
            <div className="card-body p-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="card-title fw-bold text-primary m-0">{product.name}</h2>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => navigate("/")}
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>

              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Marca</label>
                    <p className="h5 fw-bold text-dark">{product.brand || "N/A"}</p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Categoría</label>
                    <p className="h5 fw-bold">
                      <span className="badge bg-primary">{product.category || "General"}</span>
                    </p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Stock</label>
                    <p className="h5 fw-bold">
                      {product.stockQuantity > 0 ? (
                        <span className="badge bg-success">{product.stockQuantity} disponibles</span>
                      ) : (
                        <span className="badge bg-danger">Sin stock</span>
                      )}
                    </p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Precio</label>
                    <p className="display-6 fw-bold text-success">${parseFloat(product.priceUsd).toFixed(2)}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Tipo de Vehículo</label>
                    <p className="h5 fw-bold text-dark">{product.vehicleType || "General"}</p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Condición</label>
                    <p className="h5 fw-bold">
                      <span className="badge bg-info">{product.condition || "nuevo"}</span>
                    </p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Original</label>
                    <p className="h5 fw-bold">
                      {product.isOriginal ? (
                        <span className="badge bg-success">Sí, Original</span>
                      ) : (
                        <span className="badge bg-secondary">Compatible</span>
                      )}
                    </p>
                  </div>

                  <div className="detail-item mb-3">
                    <label className="text-muted small text-uppercase fw-bold">Años Compatibles</label>
                    <p className="h5 fw-bold text-dark">
                      {product.yearStart && product.yearEnd
                        ? `${product.yearStart} - ${product.yearEnd}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="d-flex gap-2 mt-5 pt-3 border-top">
                <button
                  className="btn btn-primary flex-grow-1 fw-bold py-2"
                  onClick={() => navigate("/")}
                >
                  <i className="fa-solid fa-arrow-left me-2"></i>Volver
                </button>

                {isAdmin && (
                  <button
                    className="btn btn-warning flex-grow-1 fw-bold py-2"
                    onClick={() => navigate(`/edit-product/${product.id}`)}
                  >
                    <i className="fa-solid fa-pen-to-square me-2"></i>Editar
                  </button>
                )}

                <button
                  className="btn btn-success flex-grow-1 fw-bold py-2"
                  onClick={() => {
                    alert(`${product.name} añadido al carrito`);
                  }}
                >
                  <i className="fa-solid fa-shopping-cart me-2"></i>Añadir al carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
