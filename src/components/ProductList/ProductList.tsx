import React, { useState, useEffect, useRef } from "react";
import styles from "./ProductList.module.css";
import { productService } from "../../services/productServices";
import { Product, ProductWithQuantity } from "../../types/product";

const ProductList: React.FC = () => {
  // Estados del componente
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [productList, setProductList] = useState<ProductWithQuantity[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const abortController = useRef<AbortController | null>(null);

  // Efecto para filtrar productos basado en la búsqueda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts([]);
      setShowDropdown(false);
      return;
    } else {
      const timeoutId = setTimeout(() => {
        abortController.current?.abort();
        const controller = new AbortController();
        abortController.current = controller;

        productService
          .getProductsBySensitiveValue(searchTerm, controller.signal)
          .then((result) => {
            console.log("Productos filtrados:", result);
            setFilteredProducts(result);
            setShowDropdown(true);
          })
          .catch((err) => {
            if (err.name !== "AbortError") console.log(err.message);
          })
          .finally(() => console.log("Busqueda completada"));
      }, 400);

      // Limpia el timeout si el usuario sigue escribiendo
      return () => {
        clearTimeout(timeoutId);
        abortController.current?.abort();
      };
    }
  }, [searchTerm]);

  const processList = () => {
    if (productList.length === 0) {
      alert("No hay productos en la lista para procesar.");
      return;
    }
    productService
      .getProductionGuideByProducts(productList)
      .then((result) => {
        console.log("Result:", result);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.log(err.message);
      })
      .finally(() => console.log("Proceso Terminado"));
  };

  // Función para manejar la selección de un producto
  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm("");
    setShowDropdown(false);
    setQuantity(1);
  };

  // Función para agregar producto a la lista
  const handleAddProduct = () => {
    if (selectedProduct && quantity > 0) {
      // Verificar si el producto ya existe en la lista
      const existingProductIndex = productList.findIndex(
        (product) => product.item === selectedProduct.item
      );

      if (existingProductIndex !== -1) {
        // Si existe, actualizar la cantidad
        const updatedList = [...productList];
        updatedList[existingProductIndex].quantity += quantity;
        setProductList(updatedList);
      } else {
        // Si no existe, agregar nuevo producto
        const newProduct: ProductWithQuantity = {
          item: selectedProduct.item,
          name: selectedProduct.name,
          quantity: quantity,
        };
        setProductList([...productList, newProduct]);
      }

      // Limpiar formulario
      setSelectedProduct(null);
      setSearchTerm("");
      setQuantity(1);
    }
  };

  // Función para eliminar producto de la lista
  const handleRemoveProduct = (item: number) => {
    setProductList(productList.filter((product) => product.item !== item));
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.card}>
          <div>
            <div style={{ textAlign: "center", marginBottom: "11px" }}>
              <img
                alt="Logo"
                src="https://storage.googleapis.com/ccit_prod/static/media/logos/logo-tinsa.svg"
                data-kt-element="logo"
                style={{ height: "60px", marginBottom: "4px" }}
              />

              <div
                style={{
                  color: "oklch(0.554 0.046 257.417)",
                  fontWeight: "600",
                  fontSize: "20px",
                }}
              >
                Guia Producción
              </div>
            </div>
          </div>
          <div className="flex justify-around items-center mb-4">
            <h3 className="">Creador, Sebastian Zapata</h3>
            <button onClick={processList} className={styles.addButton}>
              Procesar Lista
            </button>
          </div>
          <div className={styles.searchinputcontainer}>
            <div className={styles.inputGroup}>
              <label htmlFor="search-product" className={styles.label}></label>
              <input
                className={styles.input}
                placeholder="Buscar producto..."
                autoComplete="search-product"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />

              {/* Dropdown de productos filtrados */}
              {showDropdown && filteredProducts.length > 0 && (
                <div className={styles.dropdown}>
                  {filteredProducts.map((product) => (
                    <div
                      key={product.item}
                      className={styles.dropdownitem}
                      onClick={() => handleProductSelect(product)}
                    >
                      {product.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedProduct && (
              <div className={styles.quantitySection}>
                <h3>Producto seleccionado: {selectedProduct.name}</h3>
                <div className={styles.quantityInputContainer}>
                  <label htmlFor="quantity">Cantidad:</label>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className={styles.quantityInput}
                  />
                  <button
                    onClick={handleAddProduct}
                    className={styles.addButton}
                  >
                    Agregar a la Lista
                  </button>
                </div>
              </div>
            )}
          </div>
          {productList.length === 0 ? (
            <p className="empty-message">No hay productos en la lista</p>
          ) : (
            <table className="w-full max-w-[800px] text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-white uppercase bg-[#3b82f6] border-1 border-[#3b82f6] ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Item
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Nombre
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Cantidad
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Remover
                  </th>
                </tr>
              </thead>
              <tbody>
                {productList.map((product) => (
                  //{ item: 1, name: "Laptop Dell XPS 13" },
                  <tr
                    key={product.item}
                    className="bg-white border-1 dark:border-gray-700 border-gray-50"
                  >
                    <td className="px-6 py-4">{product.item}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium whitespace-nowrap"
                    >
                      {product.name}
                    </th>
                    <td className="px-6 py-4">{product.quantity}</td>
                    <td className="px-6 py-4">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                        onClick={() => handleRemoveProduct(product.item)}
                      >
                        remover
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductList;
