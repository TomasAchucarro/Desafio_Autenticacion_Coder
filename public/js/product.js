const socket = io();
const cart = "64c0894b2757073ec064cb39";
const addCart = async (id) => {
  try {
    const res = await fetch(`/api/carts/${cart}/product/${id}`, {
      method: "POST",
    });
    const result = await res.json();
    if (result.status === "error") throw new Error(result.error);

  } catch (error) {
    console.log(error);
  }
};

const emptyCart = async () => {
  try {
    const res = await fetch(`/api/carts/${cart}`, {
      method: "DELETE",
    });
    const result = await res.json();
    if (result.status === "error") throw new Error(result.error);
    else socket.emit("cartList", result);

  } catch (error) {
    console.log(error);
  }
};

const cartBody = document.querySelector("#cartBody");
socket.on("updatedCarts", (products) => {
  console.log(products.payload);
  cartBody.innerHTML = `
    <div >
      <h2>Cart Empty</h2>
    </div>
  `;
});