//selecting
const cartBtn = document.querySelector(".cart-btn");
const cartModal = document.querySelector(".cart");
const backDrop = document.querySelector(".backdrop");
const closeModal = document.querySelector(".cart-item-confirm");
const productsDom = document.querySelector(".products-center");
const cartTotal = document.querySelector(".cart-total");
const cartItems = document.querySelector(".cart-items");
const cartContent = document.querySelector(".cart-content");
const clearCart = document.querySelector(".clear-cart");
//import data
import { productsData } from "./products.js";
let cart = [];
let buttonsDOM = [];
//1.get product

class Products {
  //get from api end point
  getProducts() {
    return productsData;
  }
}

//2. display products
class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `<div class="product">
        <div class="img-container">
          <img src=${item.imageUrl} class="product-img" >
        </div>
        <div class="product-desc">
          <p class="product-price">$ ${item.price}</p>
          <p class="product-title">${item.title}</p>
        </div>
        <button class="btn add-to-cart" data-id=${item.id}>
        افزودن به سبد خرید  
          <i class="fas fa-shopping-cart"></i>
      
        </button>
        </div>`;

      productsDom.innerHTML = result;
    });
  }
  getAddToCartBtns() {
    const addTocartBtn = [...document.querySelectorAll(".add-to-cart")];
    buttonsDOM = addTocartBtn;
    addTocartBtn.forEach((btn) => {
      const id = btn.dataset.id;
      const isInCart = cart.find((p) => p.id === parseInt(id));
      if (isInCart) {
        btn.innerText = "موجود در سبد خرید";
        btn.disabled = true;
      }
      btn.addEventListener("click", (e) => {
        e.target.innerText = "موجود در سبد خرید";
        e.target.disabled = true;
        //add to cart
        //console.log(e.target.dataset.id);
        const addedProduct = { ...Storage.getProduct(id), quantity: 1 };
        console.log(addedProduct);
        cart = [...cart, addedProduct];
        //save cart to local storage
        Storage.saveCart(cart);
        //update cart value
        this.setCartValue(cart);
        //add to cart item
        this.addCartItem(addedProduct);
      });
    });
  }
  setCartValue(cart) {
    let tempCartItem = 0;
    const totalPrice = cart.reduce((acc, curr) => {
      tempCartItem += curr.quantity;
      return acc + curr.quantity * curr.price;
    }, 0);

    cartTotal.innerText = `قیمت کل : ${totalPrice.toFixed(2)} $`;
    cartItems.innerText = tempCartItem;
    console.log(tempCartItem);
  }
  addCartItem(cartItem) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
    <img class="cart-item-img" src=${cartItem.imageUrl} />
    <div class="cart-item-desc">
      <h4>${cartItem.title}</h4>
      <h5>$ ${cartItem.price}</h5>
    </div>
    <div class="cart-item-conteoller">
      <i class="fas fa-chevron-up" data-id=${cartItem.id}></i>
      <p>${cartItem.quantity}</p>
      <i class="fas fa-chevron-down" data-id=${cartItem.id}></i>
      
    </div>
    <i class="far fa-trash-alt" data-id=${cartItem.id}></i>`;
    cartContent.appendChild(div);
  }
  setUpApp() {
    // get cart from storage
    cart = Storage.getCart() || [];
    //add cart itrm
    cart.forEach((cartItem) => this.addCartItem(cartItem));
    //set values
    this.setCartValue(cart);
  }
  cartLogic() {
    //clear cart
    clearCart.addEventListener("click", () => this.clearCart());
  }
  clearCart() {
    cart.forEach((cItem) => this.removeItem(cItem.id));
    while (cartContent.children.length) {
      cartContent.removeChild(cartContent.children[0]);
    }
    closeModalFunction();
  }
  removeItem(id) {
    //update cart
    cart = cart.filter((cItem) => cItem.id !== id);
    //
    this.setCartValue(cart);
    Storage.saveCart(cart);
    //get add to cart btn => update text and disable
    // const button = buttonsDOM.find((btn) => btn.dataset.id === parseInt(id));
    // button.innerText = "add to cart";
    // buttonsDOM.disabled = false;
    this.getSinglebutton(id);
  }
  getSinglebutton(id) {
    const button = buttonsDOM.find(
      (btn) => parseInt(btn.dataset.id) == parseInt(id)
    );

    button.innerText = "افزودن به سبد خرید";
    button.disabled = false;
  }
}
//3. storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    const _products = JSON.parse(localStorage.getItem("products"));
    return _products.find((p) => p.id === parseInt(id));
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
}

document.addEventListener("DOMContentLoaded", (e) => {
  // set up: get cart and set up app:
  //console.log("click");
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setUpApp();
  ui.displayProducts(productsData);
  ui.getAddToCartBtns();
  ui.cartLogic();
  Storage.saveProducts(productsData);
});
//cart items modal
function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = "1";
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = "0";
  cartModal.style.top = "100%";
}

cartBtn.addEventListener("click", showModalFunction);
cartModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
