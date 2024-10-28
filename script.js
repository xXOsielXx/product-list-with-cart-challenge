async function populate() {
    const requestURL =
      "http://127.0.0.1:5500/data.json";
    const request = new Request(requestURL);
  
    const response = await fetch(request);
    const products = await response.json();

    displayProducts(products);
}

const productList = document.querySelector("#productList");

function displayProducts(products) {
    products.forEach(product => {
        const productElement = document.createElement("li");
        productElement.classList.add("product");
        productElement.dataset.thumbnail = product.image.thumbnail;
        productElement.dataset.name = product.name;
        productElement.dataset.price = product.price;
        
        productElement.innerHTML = `
            <picture>
                <source media="(min-width: 1024px)" srcset="${product.image.desktop}">
                <source media="(min-width: 604px)" srcset="${product.image.tablet}">
                <img class="product__img" src="${product.image.mobile}" alt="${product.name}" title="${product.name}">
            </picture>
            <button class="add-to-cart-btn"><i class="add-to-cart-icon"></i>Add to Cart</button>
            <div class="adjust-quantity-btn">
                <button class="decrement-quantity-btn">
                    <svg class="decrement-quantity-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="2" fill="none" viewBox="0 0 10 2"><path fill="currentColor" d="M0 .375h10v1.25H0V.375Z"/></svg>
                </button>
                <span class="quantity"></span>
                <button class="increment-quantity-btn">
                    <svg class="increment-quantity-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="currentColor" d="M10 4.375H5.625V0h-1.25v4.375H0v1.25h4.375V10h1.25V5.625H10v-1.25Z"/></svg>
                </button>
            </div>
            <div class="product__info">
                <p class="product__category">${product.category}</p>
                <h3 class="product__name">${product.name}</h3>
                <p class="product__price">$${product.price.toFixed(2)}</p>
            </div>
        `
        productList.appendChild(productElement);
    });
}

populate();

const Cart = [];

function Product(thumbnail, name, quantity, price, totalPrice) {
    this.thumbnail = thumbnail;
    this.name = name;
    this.quantity = quantity;
    this.price = price;
    this.totalPrice = totalPrice;
}

const bodyElement = document.querySelector("body");

// Change content of cart section based on the number of products in the cart
function changeCartContent(content) {
    const cartEmpty = document.querySelector("#cartEmpty"); // Cart section when empty
    const cartFilled = document.querySelector("#cartFilled"); // Cart section when filled

    if (content == "empty") {
        cartEmpty.classList.remove("hidden");
        cartFilled.classList.add("hidden");
    }
    else if (content == "filled") {
        cartEmpty.classList.add("hidden");
        cartFilled.classList.remove("hidden");
    }
}

bodyElement.addEventListener("click", e => {
    const productElement = e.target.closest(".product");
    const removeItemBtn = e.target.closest(".remove-item-btn");

    function updateCartTitle() {
        const cartTitle = document.querySelector("#cartTitle");
        cartTitle.innerText = `Your Cart (${Cart.reduce((acc, product) => acc + product.quantity, 0)})`;
    }

    if (productElement) {
        const decrementQuantityBtn = e.target.closest(".decrement-quantity-btn");
        const incrementQuantityBtn = e.target.closest(".increment-quantity-btn");

        const productData = productElement.dataset;

        const addToCartBtn = productElement.querySelector(".add-to-cart-btn");

        function updateProductQuantity() {
            // Update quantity text of current product
            const quantity = productElement.querySelector(".quantity");
            quantity.innerText = Cart[productData.index].quantity;
        }

        // Update products information in cart section
        function updateProductInfo() {
            const cartProduct = document.querySelector(`.cart-product[data-index="${productData.index}"]`);
            cartProduct.innerHTML = `
                <div>
                    <p class="cart-product-name">${Cart[cartProduct.dataset.index].name}</p>
                    <span class="cart-product-quantity">${Cart[cartProduct.dataset.index].quantity}x</span>
                    <span class="cart-product-price">@ $${Cart[cartProduct.dataset.index].price}</span>
                    <span class="cart-product-total-price">$${Cart[cartProduct.dataset.index].totalPrice}</span>
                </div>
                <button class="remove-item-btn">
                    <svg class="remove-item-icon xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 10 10"><path fill="currentColor" d="M8.375 9.375 5 6 1.625 9.375l-1-1L4 5 .625 1.625l1-1L5 4 8.375.625l1 1L6 5l3.375 3.375-1 1Z"/></svg>
                </button>
            `;
            
        }

        if (e.target.closest(".add-to-cart-btn")) {
            productElement.classList.add("product_active");

            if (Cart.length == 0) {
                changeCartContent("filled");
            }

            const product = new Product(productData.thumbnail, productData.name, 1, Number(productData.price), Number(productData.price));
            product.price = product.price.toFixed(2);
            product.totalPrice = product.totalPrice.toFixed(2);

            Cart.push(product);

            if (!productData.index) {
                productData.index = Cart.length - 1;
            }

            updateProductQuantity();
            updateCartTitle();

            const cartList = document.querySelector("#cartList");
            const cartProduct = document.createElement("li"); // Product info in cart
            cartProduct.classList.add("cart-product");
            cartList.appendChild(cartProduct);
            cartProduct.dataset.index = Cart.length - 1;
            updateProductInfo();

            displayOrderTotal();
        }
        else if (decrementQuantityBtn || incrementQuantityBtn) {function updateCartTitle() {
            const cartTitle = document.querySelector("#cartTitle");
            cartTitle.innerText = `Your Cart (${Cart.reduce((acc, product) => acc + product.quantity, 0)})`;
        }
            if (decrementQuantityBtn) {
                Cart[productData.index].quantity -= 1;
                if (Cart[productData.index].quantity <= 0) {
                    Cart.splice(productData.index, 1);

                    const products = productList.querySelectorAll(".product");
                    products.forEach(product => {
                        if (product.dataset.index > productData.index) {
                            product.dataset.index -= 1;
                        }
                    });

                    const cartProducts = document.querySelectorAll(".cart-product");
                    cartProducts.forEach(product => {
                        if (product.dataset.index > productData.index) {
                            product.dataset.index -= 1;
                        }
                    });

                    const cartProduct = document.querySelector(`.cart-product[data-index="${productData.index}"]`);
                    cartProduct.remove();
                    productData.index = "";

                    productElement.classList.remove("product_active");

                    if (Cart.length == 0) {
                        changeCartContent("empty");
                    }
                }
            }
            else if (incrementQuantityBtn) {
                Cart[productData.index].quantity += 1;
            }
            
            if (Cart.length > 0 && productData.index) {
                Cart[productData.index].totalPrice = productData.price * Cart[productData.index].quantity;
                Cart[productData.index].totalPrice = Cart[productData.index].totalPrice.toFixed(2);
                updateProductQuantity();
                updateProductInfo();
            }

            updateCartTitle();
            displayOrderTotal();
        }
    }
    else if (removeItemBtn) {
        const cartProduct = e.target.closest(".cart-product");

        const productElement = productList.querySelector(`.product[data-index="${cartProduct.dataset.index}"]`);
        productElement.dataset.index = "";
        productElement.classList.remove("product_active");

        const products = productList.querySelectorAll(".product");
        products.forEach(product => {
            if (product.dataset.index > cartProduct.dataset.index) {
                product.dataset.index -= 1;
            }
        });
        
        const cartProducts = bodyElement.querySelectorAll(".cart-product");
        cartProducts.forEach(product => {
            if (product.dataset.index > cartProduct.dataset.index) {
                product.dataset.index -= 1;
            }
        });

        Cart.splice(cartProduct.dataset.index, 1);
        cartProduct.remove();

        displayOrderTotal();
        updateCartTitle();

        if (Cart.length == 0) {
            changeCartContent("empty");
        }
    }
})

function displayOrderTotal() {
    const orderTotalElements = document.querySelectorAll(".order-total");
    orderTotalElements.forEach(orderTotal => {
        orderTotal.innerHTML = `
            <strong>$${Cart.reduce((acc, product) => acc + Number(product.totalPrice), 0).toFixed(2)}</strong>
        `;
    })
}

function resetOrderTotal() {
    const orderTotalElements = document.querySelectorAll(".order-total");
    orderTotalElements.forEach(orderTotal => {
        orderTotal.innerHTML = `<strong>$0.00</strong>`;
    })
}

const orderModal = document.querySelector("#orderModal");

const confirmOrderBtn = document.querySelector("#confirmOrderBtn");

confirmOrderBtn.addEventListener("click", () => {
    orderModal.showModal();

    const orderModalList = document.querySelector("#orderModalList");
    orderModalList.innerHTML = "";
    Cart.forEach(product => {
        const orderModalProduct = document.createElement("li");
        orderModalProduct.classList.add("order-modal__product");
        orderModalProduct.innerHTML = `
            <img class="order-modal__thumbnail" src="${product.thumbnail}" alt="${product.name}">
            <div>
                <p class="order-modal__name">${product.name}</p>
                <span class="order-modal__quantity">${product.quantity}x</span>
                <span class="order-modal__price">@ $${product.price}</span>
            </div>
            <span class="order-modal__total-price">$${product.totalPrice}</span>
        `;
        orderModalList.appendChild(orderModalProduct);
    })

    displayOrderTotal();
})

bodyElement.addEventListener("keydown", e => {
    if (e.key === "Escape") {
        if (orderModal.open) {
            startNewOrder();
        }
    }
})

const startNewOrderBtn = document.querySelector("#startNewOrderBtn");
startNewOrderBtn.addEventListener("click", startNewOrder)

function startNewOrder() {
    Cart.length = 0;
    
    const products = productList.querySelectorAll(".product");
    products.forEach(product => {
        if (product.classList.contains("product_active")) {
            product.classList.remove("product_active");
            product.dataset.index = "";
        }
    });

    const cartList = document.querySelector("#cartList");
    cartList.innerHTML = "";

    const orderModalList = document.querySelector("#orderModalList");
    orderModalList.innerHTML = "";

    const cartTitle = document.querySelector("#cartTitle");
    cartTitle.innerText = "Your Cart (0)";

    resetOrderTotal();

    changeCartContent("empty");

    orderModal.close();
}