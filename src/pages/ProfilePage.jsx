import { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { useMyContext } from "../context/MyContext";

const ProfilePage = () => {
  const { setCount } = useMyContext();
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState(-1);

  const getData = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: "GET",
      });
      const result = await resp.json();
      console.log("result -->", result);
      setProducts(result.data.products);
    } catch (err) {
      console.warn("error while getting products -->", err.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const title = e.target.title.value;
      const price = e.target.price.value;
      const description = e.target.description.value;
      const quantity = e.target.quantity.value;

      const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products`, {
        method: "POST",
        body: JSON.stringify({ title, price, description, quantity }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (resp.status == 201) {
        alert("Product added!");
        getData();
      } else {
        const result = await resp.json();
        alert(`Invalid data: ${result.message}`);
      }
    } catch (err) {
      alert(`Cannot create product: ${err.message}`);
    }
  };

  const handleUpdateProduct = async (productId) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products/${productId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ price: updatedPrice }),
          headers: { "content-type": "application/json" },
        }
      );
      const result = await res.json();
      if (res.status === 200) {
        alert("Product Updated");
        setEditProductId("");
        getData();
      } else {
        alert(`Error while updating: ${result?.message || JSON.stringify(result)}`);
      }
    } catch (err) {
      alert("Cannot update product: " + err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="mx-auto my-6 flex flex-col gap-5 p-6 bg-white max-w-xl rounded-lg shadow-md"
      >
        {["title", "price", "description", "quantity"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="font-semibold text-gray-700 capitalize mb-1">
              {field}
            </label>
            <input
              name={field}
              type={field === "price" || field === "quantity" ? "number" : "text"}
              className="border border-gray-300 py-2 px-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
        >
          Add Product
        </button>
      </form>

      {/* Product List */}
      <div className="flex flex-wrap gap-6 justify-center p-6">
        {products.map((elem) => (
          <div
            key={elem._id}
            className="p-5 rounded-xl border border-gray-300 shadow-md w-64 bg-white transition hover:shadow-lg"
          >
            <p className="font-bold text-lg text-blue-800">{elem.title}</p>

            {elem._id === editProductId ? (
              <>
                <input
                  value={updatedPrice}
                  onChange={(e) => setUpdatedPrice(e.target.value)}
                  className="mt-3 py-1 px-2 border border-gray-300 rounded-md w-full"
                />
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditProductId("")}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateProduct(elem._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Update
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mt-2 text-gray-700 font-medium">₹ {elem.price}</p>
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditProductId(elem._id)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setCount((prev) => prev + 1)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Add To Cart
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { ProfilePage };
