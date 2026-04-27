import React, { useReducer, createContext, useEffect } from "react";

export const Context = createContext(null);

export const initialStore = () => {
  const savedCart = localStorage.getItem("cart");
  return {
    user: JSON.parse(localStorage.getItem("currentUser")) || null,
    token: localStorage.getItem("token") || null,
    products: [],
    productDetail: null,
    cart: savedCart ? JSON.parse(savedCart) : [],
    exchangeRate: 36.50,
    cartTotal: { usd: "0.00", ves: "0.00" }
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_user':
      return { ...store, user: action.payload.user, token: action.payload.token };
    case 'logout':
      localStorage.removeItem("token");
      localStorage.removeItem("currentUser");
      return { ...store, user: null, token: null, cart: [] };
    case 'set_products':
      return { ...store, products: action.payload };
    case 'remove_product':
      return {
        ...store,
        products: store.products.filter(item => item.id !== action.payload)
      };
    case 'update_product':
      return {
        ...store,
        products: store.products.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'add_to_cart':
      if (store.cart.find(item => item.id === action.payload.id)) return store;
      const newCartAdd = [...store.cart, action.payload];
      localStorage.setItem("cart", JSON.stringify(newCartAdd));
      return { ...store, cart: newCartAdd };
    case 'remove_from_cart':
      const newCartRem = store.cart.filter(item => item.id !== action.payload);
      localStorage.setItem("cart", JSON.stringify(newCartRem));
      return { ...store, cart: newCartRem };
    case 'clear_cart':
      localStorage.removeItem("cart");
      return { ...store, cart: [] };
    default:
      return store;
  }
}

export const injectContext = (PassedComponent) => {
  const StoreWrapper = (props) => {
    const [store, dispatch] = useReducer(storeReducer, initialStore());

    const baseUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "");

    const loadProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/products`);
        if (response.ok) {
          const data = await response.json();
          dispatch({ type: "set_products", payload: data });
        }
      } catch (error) {
        console.error("Error cargando productos de la DB:", error);
      }
    };

    const deleteProduct = async (id) => {
      try {
        if (!store.token) {
          console.error("No hay un token disponible. Debes estar logueado.");
          return false;
        }

        const response = await fetch(`${baseUrl}/api/products/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${store.token}`
          }
        });

        if (response.ok) {
          dispatch({ type: "remove_product", payload: id });
          return true;
        } else {
          const errorData = await response.json();
          console.error("Error del servidor:", errorData.msg || "No autorizado");
          return false;
        }
      } catch (error) {
        console.error("Error al eliminar el producto:", error);
        return false;
      }
    };

    const updateProduct = async (id, productData) => {
      try {
        if (!store.token) {
          console.error("No hay un token disponible. Debes estar logueado.");
          return false;
        }

        const response = await fetch(`${baseUrl}/api/products/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${store.token}`
          },
          body: JSON.stringify(productData)
        });

        if (response.ok) {
          const updatedProduct = await response.json();
          dispatch({ type: "update_product", payload: updatedProduct });
          return true;
        } else {
          const errorData = await response.json();
          console.error("Error del servidor:", errorData.msg || "No autorizado");
          return false;
        }
      } catch (error) {
        console.error("Error al actualizar el producto:", error);
        return false;
      }
    };

    useEffect(() => {
      loadProducts();
    }, []);

    return (
      <Context.Provider value={{
        store,
        dispatch,
        actions: {
          loadProducts,
          deleteProduct,
          updateProduct
        }
      }}>
        <PassedComponent {...props} />
      </Context.Provider>
    );
  };
  return StoreWrapper;
};