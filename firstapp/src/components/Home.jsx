import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const role = localStorage.getItem("role")
  const navigate = useNavigate()

  useEffect(() => {
    fetchProducts()
  }, [])

  function addToCart(productId) {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      alert("Login first to access the products")
      return false
    }

    // Find the current product to check stock locally before calling API
    const targetProduct = products.find(p => p._id === productId)
    if (targetProduct && targetProduct.stock <= 0) {
      alert("Out of Stock!")
      return
    }

    axios.post("http://localhost:4000/api/cart/add",
      { productId, quantity: 1 },
      { params: { userId } }
    )

      .then(res => {
        if (res.status === 200) {
          // Update the local state to decrease the stock by 1
          setProducts(prevProducts =>
            prevProducts.map(item =>
              item._id === productId
                ? { ...item, stock: item.stock - 1 }
                : item
            )
          )

          Swal.fire({
            title: "Good job!",
            text: "product added successfully to cart",
            icon: "success"
          });
          navigate("/cart")
        }
        else {
          alert(res.data.message)
        }
      })
      .catch(err => {
        console.log("error from add cart logic ", err)
      })
  }

  async function fetchProducts() {
    axios.get("http://localhost:4000/api/product")
      .then((res) => {
        if (res.status === 200) {
          setProducts(res.data)
          setLoading(false)
        }
      })
  }

  return (
    <div className='container mt-4'>
      <h2>Products</h2>
      {
        loading ? (<p>Loading...</p>) : (
          <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>
            {
              products.map((i) => (
                <div className="col" key={i._id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title"><b>Name:</b>{i.name}</h5>
                      <p className="card-text"><b>Price: </b>₹{i.price}</p>
                      <p className="card-text"><b>Category: </b>{i.category}</p>
                      <p className="card-text"><b>Description: </b>{i.description}</p>
                      <p className="card-text"><b>Stock: </b>
                        <span className={i.stock > 0 ? "text-success" : "text-danger"}>
                          {i.stock > 0 ? i.stock : "Out of Stock"}
                        </span>
                      </p>
                      {
                        role === "admin" ? (
                          <button className='btn btn-danger'>Delete</button>
                        ) : (
                          <button
                            onClick={() => addToCart(i._id)}
                            className='btn btn-warning text-white'
                            disabled={i.stock <= 0}
                          >
                            {i.stock > 0 ? "Add to Cart" : "Sold Out"}
                          </button>
                        )
                      }
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}