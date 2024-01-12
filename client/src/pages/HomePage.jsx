import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { DebounceInput } from "react-debounce-input";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState("");

  const getProducts = async () => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios(
        `http://localhost:4001/products?keywords=${search}&category=${category}`
      );
      setProducts(results.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4001/products/${productId}`);
    const newProducts = products.filter((product) => product._id !== productId);
    setProducts(newProducts);
  };

  useEffect(() => {
    getProducts();
  }, [search, category]);

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button
          onClick={() => {
            navigate("/product/create");
          }}
        >
          Create Product
        </button>
      </div>
      <div className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <DebounceInput
              minLength={2}
              debounceTimeout={500}
              type="text"
              placeholder="Search by name"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select
              id="category"
              name="category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
              }}
            >
              <option disabled selected>
                -- Select a category --
              </option>
              <option value="">All</option>
              <option value="it">IT</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food</option>
            </select>
          </label>
        </div>
      </div>
      <div className="product-list">
        {!products.length && !isError && (
          <div className="no-blog-posts-container">
            <h1>No Products</h1>
          </div>
        )}
        {products.map((product) => {
          return (
            <div className="product" key={product._id}>
              <div className="product-preview">
                <img
                  src={product.image}
                  alt="some product"
                  width="250"
                  height="250"
                />
              </div>
              <div className="product-detail">
                <h1>Product name: {product.name} </h1>
                <h2>Product price: {product.price}</h2>
                <h3>Category: {product.category}</h3>
                <h3>Created Time: {product.createdTime}</h3>
                <h3>Updated Time:{product?.updated_at}</h3>
                <p>Product description: {product.description} </p>
                <div className="product-actions">
                  <button
                    className="view-button"
                    onClick={() => {
                      navigate(`/product/view/${product._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(`/product/edit/${product._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failed</h1> : null}
        {isLoading ? <h1>Loading ....</h1> : null}
      </div>

      <div className="pagination">
        <button className="previous-button">Previous</button>
        <button className="next-button">Next</button>
      </div>
      <div className="pages">1/ total page</div>
    </div>
  );
}

export default HomePage;
