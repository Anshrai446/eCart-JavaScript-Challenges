const productContainer = document.getElementById("product-container");

// ==========================================
// CHALLENGE 3 - RECENTLY VIEWED
// ==========================================

const seen = new Set();
const history = [];


// ==========================================
// CHALLENGE 4 - CART
// ==========================================

const cart = new Map();

const undoStack = [];
const redoStack = [];


// ==========================================
// ADD PRODUCT
// ==========================================

function addProduct(productId) {

    if (cart.has(productId)) {

        cart.set(
            productId,
            cart.get(productId) + 1
        );

    } else {

        cart.set(productId, 1);
    }

    const operation = {
        type: "ADD",
        productId: productId,
        quantity: 1
    };

    undoStack.push(operation);

    // New action clears redo history
    redoStack.length = 0;

    console.log("Added:", productId);
    console.log("Cart:", cart);
}


// ==========================================
// REMOVE PRODUCT
// ==========================================

function removeProduct(productId) {

    if (!cart.has(productId)) {
        return;
    }

    // Save quantity before removing
    const quantity = cart.get(productId);

    cart.delete(productId);

    const operation = {
        type: "REMOVE",
        productId: productId,
        quantity: quantity
    };

    undoStack.push(operation);

    redoStack.length = 0;

    console.log("Removed:", productId);
    console.log("Cart:", cart);
}


// ==========================================
// INCREASE QUANTITY
// ==========================================

function increaseQuantity(productId) {

    if (!cart.has(productId)) {
        return;
    }

    cart.set(
        productId,
        cart.get(productId) + 1
    );

    const operation = {
        type: "INCREASE",
        productId: productId,
        quantity: 1
    };

    undoStack.push(operation);

    redoStack.length = 0;

    console.log("Increased:", productId);
}


// ==========================================
// DECREASE QUANTITY
// ==========================================

function decreaseQuantity(productId) {

    if (!cart.has(productId)) {
        return;
    }

    const currentQuantity = cart.get(productId);

    if (currentQuantity > 1) {

        cart.set(
            productId,
            currentQuantity - 1
        );

    } else {

        cart.delete(productId);
    }

    const operation = {
        type: "DECREASE",
        productId: productId,
        quantity: 1
    };

    undoStack.push(operation);

    redoStack.length = 0;

    console.log("Decreased:", productId);
}


// ==========================================
// UNDO
// ==========================================

function undo() {

    if (undoStack.length === 0) {
        return;
    }

    const operation = undoStack.pop();

    // Move operation to redo stack
    redoStack.push(operation);


    // --------------------------------------
    // UNDO ADD
    // --------------------------------------

    if (operation.type === "ADD") {

        const currentQuantity =
            cart.get(operation.productId);

        if (currentQuantity > operation.quantity) {

            cart.set(
                operation.productId,
                currentQuantity - operation.quantity
            );

        } else {

            cart.delete(operation.productId);
        }
    }


    // --------------------------------------
    // UNDO REMOVE
    // --------------------------------------

    else if (operation.type === "REMOVE") {

        cart.set(
            operation.productId,
            operation.quantity
        );
    }


    // --------------------------------------
    // UNDO INCREASE
    // --------------------------------------

    else if (operation.type === "INCREASE") {

        const currentQuantity =
            cart.get(operation.productId);

        if (currentQuantity > operation.quantity) {

            cart.set(
                operation.productId,
                currentQuantity - operation.quantity
            );

        } else {

            cart.delete(operation.productId);
        }
    }


    // --------------------------------------
    // UNDO DECREASE
    // --------------------------------------

    else if (operation.type === "DECREASE") {

        if (cart.has(operation.productId)) {

            cart.set(
                operation.productId,
                cart.get(operation.productId) +
                operation.quantity
            );

        } else {

            cart.set(
                operation.productId,
                operation.quantity
            );
        }
    }

    console.log("UNDO:", operation);
    console.log("Cart:", cart);
}


// ==========================================
// REDO
// ==========================================

function redo() {

    if (redoStack.length === 0) {
        return;
    }

    const operation = redoStack.pop();


    // --------------------------------------
    // REDO ADD
    // --------------------------------------

    if (operation.type === "ADD") {

        if (cart.has(operation.productId)) {

            cart.set(
                operation.productId,
                cart.get(operation.productId) +
                operation.quantity
            );

        } else {

            cart.set(
                operation.productId,
                operation.quantity
            );
        }
    }


    // --------------------------------------
    // REDO REMOVE
    // --------------------------------------

    else if (operation.type === "REMOVE") {

        cart.delete(operation.productId);
    }


    // --------------------------------------
    // REDO INCREASE
    // --------------------------------------

    else if (operation.type === "INCREASE") {

        if (cart.has(operation.productId)) {

            cart.set(
                operation.productId,
                cart.get(operation.productId) +
                operation.quantity
            );

        } else {

            cart.set(
                operation.productId,
                operation.quantity
            );
        }
    }


    // --------------------------------------
    // REDO DECREASE
    // --------------------------------------

    else if (operation.type === "DECREASE") {

        const currentQuantity =
            cart.get(operation.productId);

        if (currentQuantity > operation.quantity) {

            cart.set(
                operation.productId,
                currentQuantity - operation.quantity
            );

        } else {

            cart.delete(operation.productId);
        }
    }


    // Redone operation becomes undoable again
    undoStack.push(operation);

    console.log("REDO:", operation);
    console.log("Cart:", cart);
}


// ==========================================
// FIND PRODUCT BY ID
// ==========================================

function findProduct(productId) {

    let foundProduct = null;

    storeData.categories.forEach(category => {

        category.subcategories.forEach(subcategory => {

            subcategory.products.forEach(product => {

                if (product.id === productId) {
                    foundProduct = product;
                }

            });

        });

    });

    return foundProduct;
}


// ==========================================
// RENDER CART
// ==========================================

function renderCart() {

    const cartContainer =
        document.getElementById("cart-container");

    const cartCount =
        document.getElementById("cart-count");

    const cartTotal =
        document.getElementById("cart-total");

    cartContainer.innerHTML = "";

    let totalItems = 0;
    let totalPrice = 0;


    cart.forEach((quantity, productId) => {

        const product = findProduct(productId);

        if (!product) {
            return;
        }


        // Calculate total items
        totalItems += quantity;


        // Calculate total price
        totalPrice += product.price * quantity;


        // Create cart item
        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <h3>${product.name}</h3>

            <p>
                Price: ₹${product.price}
            </p>

            <p>
                Quantity: ${quantity}
            </p>

            <button
                class="increase-btn"
                data-id="${productId}">
                +
            </button>

            <button
                class="decrease-btn"
                data-id="${productId}">
                -
            </button>

            <button
                class="remove-btn"
                data-id="${productId}">
                Remove
            </button>
        `;

        cartContainer.appendChild(cartItem);
    });


    // Update cart summary
    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrice;


    // ======================================
    // INCREASE BUTTONS
    // ======================================

    document
        .querySelectorAll(".increase-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                increaseQuantity(button.dataset.id);

                renderCart();
            });
        });


    // ======================================
    // DECREASE BUTTONS
    // ======================================

    document
        .querySelectorAll(".decrease-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                decreaseQuantity(button.dataset.id);

                renderCart();
            });
        });


    // ======================================
    // REMOVE BUTTONS
    // ======================================

    document
        .querySelectorAll(".remove-btn")
        .forEach(button => {

            button.addEventListener("click", () => {

                removeProduct(button.dataset.id);

                renderCart();
            });
        });


    updateUndoRedoButtons();
}


// ==========================================
// UNDO / REDO BUTTON STATE
// ==========================================

function updateUndoRedoButtons() {

    const undoButton =
        document.getElementById("undo-btn");

    const redoButton =
        document.getElementById("redo-btn");

    undoButton.disabled =
        undoStack.length === 0;

    redoButton.disabled =
        redoStack.length === 0;
}


// ==========================================
// RECENTLY VIEWED
// ==========================================

function renderRecentlyViewed() {

    const recentContainer =
        document.getElementById("recently-viewed");

    const emptyHistory =
        document.getElementById("empty-history");

    recentContainer.innerHTML = "";


    if (history.length === 0) {

        emptyHistory.style.display = "block";

        return;
    }


    emptyHistory.style.display = "none";


    history.forEach(historyId => {

        storeData.categories.forEach(category => {

            category.subcategories.forEach(subcategory => {

                subcategory.products.forEach(product => {

                    if (product.id === historyId) {

                        const card =
                            document.createElement("div");

                        card.className = "product-card";

                        card.innerHTML = `
                            <h3>${product.name}</h3>

                            <p>
                                Brand: ${product.brand}
                            </p>

                            <p>
                                Price: ₹${product.price}
                            </p>

                            <p>
                                Rating: ⭐ ${product.rating}
                            </p>
                        `;

                        recentContainer.appendChild(card);
                    }

                });

            });

        });

    });
}


// ==========================================
// RENDER PRODUCTS
// ==========================================

storeData.categories.forEach(category => {

    category.subcategories.forEach(subcategory => {

        subcategory.products.forEach(product => {

            const card =
                document.createElement("div");

            card.className = "product-card";


            card.innerHTML = `
                <h3>${product.name}</h3>

                <p>
                    Brand: ${product.brand}
                </p>

                <p>
                    Price: ₹${product.price}
                </p>

                <p>
                    Rating: ⭐ ${product.rating}
                </p>

                <button
                    class="view-btn"
                    data-id="${product.id}">
                    View Product
                </button>

                <button
                    class="add-cart-btn"
                    data-id="${product.id}">
                    Add to Cart
                </button>
            `;


            productContainer.appendChild(card);


            // ==================================
            // VIEW PRODUCT
            // ==================================

            const viewButton =
                card.querySelector(".view-btn");


            viewButton.addEventListener("click", () => {

                const productId =
                    viewButton.dataset.id;


                if (seen.has(productId)) {

                    const index =
                        history.indexOf(productId);

                    history.splice(index, 1);

                } else {

                    seen.add(productId);
                }


                history.unshift(productId);


                // Keep maximum 5 products
                if (history.length > 5) {

                    const removeId =
                        history.pop();

                    seen.delete(removeId);
                }


                console.log(
                    "Viewed Product ID:",
                    productId
                );

                console.log(
                    "History:",
                    history
                );


                renderRecentlyViewed();
            });


            // ==================================
            // ADD TO CART
            // ==================================

            const addCartButton =
                card.querySelector(".add-cart-btn");


            addCartButton.addEventListener("click", () => {

                const productId =
                    addCartButton.dataset.id;

                addProduct(productId);

                renderCart();
            });

        });

    });

});


// ==========================================
// CLEAR RECENT HISTORY
// ==========================================

document
    .getElementById("clear-history")
    .addEventListener("click", () => {

        history.length = 0;

        seen.clear();

        renderRecentlyViewed();
    });


// ==========================================
// UNDO BUTTON
// ==========================================

document
    .getElementById("undo-btn")
    .addEventListener("click", () => {

        undo();

        renderCart();
    });


// ==========================================
// REDO BUTTON
// ==========================================

document
    .getElementById("redo-btn")
    .addEventListener("click", () => {

        redo();

        renderCart();
    });


// ==========================================
// INITIAL CART RENDER
// ==========================================

renderCart();