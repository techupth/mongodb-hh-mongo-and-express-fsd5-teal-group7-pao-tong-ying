import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const getProduct = async () => {
    try {
      setIsError(false);
      setIsLoading(true);

      const results = await axios(
        `http://localhost:4500/products?category=${category}&name=${searchInput}&page=${page}`
      );
      console.log(results)
      console.log("asewedqrqwertqewtwetryewtywretyrtyredt")
      setTotalPage(results.data.totalPage);
      setProducts(results.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const convertTimeFormat = (createTime) => {
    const date = new Date(createTime);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    return `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()} ${date.toLocaleTimeString()}`;
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4500/products/${productId}`);
    const results = await axios.get(
      `http://localhost:4500/products?category=${category}&name=${searchInput}&page=${page}`
    );

    setProducts(results.data.data);
  };

  const setPrevios = (num) => {
    if (page <= 1) {
      setPage(page);
    } else {
      setPage(page - num);
    }
  };

  const setNext = (num) => {
    if (totalPage === page) {
      setPage(page);
    } else if (page < totalPage) {
      setPage(page + num);
    }
  };

  useEffect(() => {
    getProduct();
  }, [category, searchInput, page]);

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
            <input
              type="text"
              placeholder="Search by name"
              onChange={(e) => {
                setSearchInput(e.target.value);
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
              onChange={(event) => {
                setCategory(event.target.value);
              }}
            >
              <option disabled value="">
                -- Select a category --
              </option>
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
                <h3>Created Time:{convertTimeFormat(product.create_at)}</h3>
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
        <button className="previous-button" onClick={() => setPrevios(1)}>
          Previous
        </button>
        <button className="next-button" onClick={() => setNext(1)}>
          Next
        </button>
      </div>
      <div className="pages">
        {page}/ {totalPage}
      </div>
    </div>
  );
}

export default HomePage;
