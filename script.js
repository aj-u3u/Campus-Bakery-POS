
"use strict";

// Stage 2: Campus Bakery POS product list and shopping cart.

const products = [
    {
        id: 1,
        name: "Pandesal (pack of 5)",
        price: 25.00,
        icon: "🥖",
        description: "A classic Filipino breakfast favorite."
    },
    {
        id: 2,
        name: "Ensaymada",
        price: 20.00,
        icon: "🥐",
        description: "Soft, sweet bread with a rich flavor."
    },
    {
        id: 3,
        name: "Spanish Bread",
        price: 15.00,
        icon: "🥯",
        description: "Soft bread with a sweet filling."
    },
    {
        id: 4,
        name: "Chocolate Cupcake",
        price: 30.00,
        icon: "🧁",
        description: "A chocolate treat for your break."
    },
    {
        id: 5,
        name: "Loaf Bread",
        price: 55.00,
        icon: "🍞",
        description: "A loaf for sharing or taking home."
    },
    {
        id: 6,
        name: "Brewed Coffee (cup)",
        price: 25.00,
        icon: "☕",
        description: "A warm cup of freshly brewed coffee."
    }
];

// Each cart entry stores a product and its quantity.
// Example: cart.get(1) might contain { product: ..., quantity: 2 }.
const cart = new Map();

let paymentComplete = false;

// Payment interface elements
const paymentInput = document.getElementById("payment-amount");
const confirmPaymentButton = document.getElementById("confirm-payment");
const paymentMessage = document.getElementById("payment-message");
const changeDisplay = document.getElementById("change-display");
const changeAmountDisplay = document.getElementById("change-amount");

const receiptSection = document.getElementById("receipt-section");
const receiptReference = document.getElementById("receipt-reference");
const receiptDateTime = document.getElementById("receipt-datetime");
const receiptItems = document.getElementById("receipt-items");
const receiptTotal = document.getElementById("receipt-total");
const receiptPaid = document.getElementById("receipt-paid");
const receiptChange = document.getElementById("receipt-change");
const newTransactionButton = document.getElementById("new-transaction");



// Get the HTML elements we need to update.
const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const subtotalDisplay = document.getElementById("subtotal");
const totalDisplay = document.getElementById("total");

// Format a number as Philippine pesos.
function formatPeso(amount) {
    return amount.toLocaleString("en-PH", {
        style: "currency",
        currency: "PHP"
    });
}

// Create and display the product cards.
function displayProducts() {
    productList.replaceChildren();

    products.forEach(function (product) {
        const card = document.createElement("article");
        card.className = "product-card";

        const icon = document.createElement("div");
        icon.className = "product-icon";
        icon.textContent = product.icon;

        const name = document.createElement("h3");
        name.textContent = product.name;

        const description = document.createElement("p");
        description.className = "product-description";
        description.textContent = product.description;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPeso(product.price);

        const addButton = document.createElement("button");
        addButton.type = "button";
        addButton.className = "add-button";
        addButton.textContent = "+ Add to Cart";
        addButton.disabled = paymentComplete;

        // Add the selected product to the cart.
        addButton.addEventListener("click", function () {
            addToCart(product.id);
        });

        bottom.append(price, addButton);
        card.append(icon, name, description, bottom);
        productList.appendChild(card);
    });
}

// Add a product or increase its quantity if it is already in the cart.
function addToCart(productId) {
    if (paymentComplete) return;
    const product = products.find(function (item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    if (cart.has(productId)) {
        const cartItem = cart.get(productId);
        cartItem.quantity += 1;
    } else {
        cart.set(productId, {
            product: product,
            quantity: 1
        });
    }

    updateCart();
}

// Increase the quantity of a cart item.
function increaseQuantity(productId) {
    if (paymentComplete) return;
    const cartItem = cart.get(productId);

    if (!cartItem) {
        return;
    }

    cartItem.quantity += 1;
    updateCart();
    increaseButton.disabled = paymentComplete;
}

// Decrease the quantity of a cart item.
// If it reaches zero, remove the item.
function decreaseQuantity(productId) {
    if (paymentComplete) return;
    const cartItem = cart.get(productId);

    if (!cartItem) {
        return;
    }

    cartItem.quantity -= 1;

    if (cartItem.quantity <= 0) {
        cart.delete(productId);
    }

    updateCart();
    decreaseButton.disabled = paymentComplete;
}

// Remove a product from the cart regardless of its quantity.
function removeFromCart(productId) {
    if (paymentComplete) return;
    cart.delete(productId);
    updateCart();
    removeButton.disabled = paymentComplete;
}

// Calculate the total of all cart items.
function calculateTotal() {
    let total = 0;

    cart.forEach(function (cartItem) {
        total += cartItem.product.price * cartItem.quantity;
    });

    return total;
}

// Display the cart items and refresh the order totals.
function updateCart() {
    cartItems.replaceChildren();

    if (cart.size === 0) {
        cartItems.className = "cart-empty";

        const icon = document.createElement("div");
        icon.className = "empty-icon";
        icon.textContent = "🧺";

        const heading = document.createElement("h3");
        heading.textContent = "Your cart is empty";

        const message = document.createElement("p");
        message.textContent = "Products you select will appear here.";

        cartItems.append(icon, heading, message);
    } else {
        cartItems.className = "cart-list";

        cart.forEach(function (cartItem, productId) {
            const product = cartItem.product;
            const quantity = cartItem.quantity;
            const itemSubtotal = product.price * quantity;

            const row = document.createElement("div");
            row.className = "cart-item";

            const details = document.createElement("div");
            details.className = "cart-item-details";

            const name = document.createElement("h3");
            name.className = "cart-item-name";
            name.textContent = product.name;

            const unitPrice = document.createElement("p");
            unitPrice.className = "cart-unit-price";
            unitPrice.textContent = formatPeso(product.price) + " each";

            const itemTotal = document.createElement("strong");
            itemTotal.className = "cart-item-subtotal";
            itemTotal.textContent = formatPeso(itemSubtotal);

            details.append(name, unitPrice, itemTotal);

            const controls = document.createElement("div");
            controls.className = "quantity-controls";

            const decreaseButton = document.createElement("button");
            decreaseButton.type = "button";
            decreaseButton.className = "quantity-button";
            decreaseButton.textContent = "−";
            decreaseButton.setAttribute(
                "aria-label",
                "Decrease " + product.name + " quantity"
            );
            decreaseButton.addEventListener("click", function () {
                decreaseQuantity(productId);
            });

            const quantityDisplay = document.createElement("span");
            quantityDisplay.className = "quantity-value";
            quantityDisplay.textContent = quantity;

            const increaseButton = document.createElement("button");
            increaseButton.type = "button";
            increaseButton.className = "quantity-button";
            increaseButton.textContent = "+";
            increaseButton.setAttribute(
                "aria-label",
                "Increase " + product.name + " quantity"
            );
            increaseButton.addEventListener("click", function () {
                increaseQuantity(productId);
            });

            controls.append(
                decreaseButton,
                quantityDisplay,
                increaseButton
            );

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.className = "remove-button";
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", function () {
                removeFromCart(productId);
            });

            row.append(details, controls, removeButton);
            cartItems.appendChild(row);
        });
    }

    // Recalculate the total whenever the cart changes.
    const total = calculateTotal();

    subtotalDisplay.textContent = formatPeso(total);
    totalDisplay.textContent = formatPeso(total);
}

function generateReceipt(amountPaid, change) {
    const transactionDate = new Date();

    // Create a readable reference number for this transaction.
    const datePart = [
        transactionDate.getFullYear(),
        String(transactionDate.getMonth() + 1).padStart(2, "0"),
        String(transactionDate.getDate()).padStart(2, "0")
    ].join("");

    const timePart = [
        String(transactionDate.getHours()).padStart(2, "0"),
        String(transactionDate.getMinutes()).padStart(2, "0"),
        String(transactionDate.getSeconds()).padStart(2, "0")
    ].join("");

    const randomPart = Math.floor(Math.random() * 9000) + 1000;
    const reference = `CB-${datePart}-${timePart}-${randomPart}`;

    receiptReference.textContent = reference;
    receiptDateTime.textContent = transactionDate.toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "medium"
    });

    // Clear any previous receipt rows.
    receiptItems.replaceChildren();

    // Add each purchased product to the receipt.
    cart.forEach(function (cartItem) {
        const product = cartItem.product;
        const quantity = cartItem.quantity;
        const itemSubtotal = product.price * quantity;

        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const quantityCell = document.createElement("td");
        quantityCell.textContent = quantity;

        const priceCell = document.createElement("td");
        priceCell.textContent = formatPeso(product.price);

        const subtotalCell = document.createElement("td");
        subtotalCell.textContent = formatPeso(itemSubtotal);

        row.append(
            nameCell,
            quantityCell,
            priceCell,
            subtotalCell
        );

        receiptItems.appendChild(row);
    });

    // Display the final payment information.
    receiptTotal.textContent = formatPeso(calculateTotal());
    receiptPaid.textContent = formatPeso(amountPaid);
    receiptChange.textContent = formatPeso(change);

    // Reveal the receipt and New Transaction button.
    receiptSection.hidden = false;
    newTransactionButton.hidden = false;
}

function processPayment() {
    // Do not accept payment for an empty cart.
    if (cart.size === 0) {
        showPaymentMessage(
            "Your cart is empty. Add products before confirming payment.",
            "error"
        );
        return;
    }

    const enteredAmount = paymentInput.value.trim();

    // Reject blank input.
    if (enteredAmount === "") {
        showPaymentMessage(
            "Please enter the cash amount received.",
            "error"
        );
        paymentInput.focus();
        return;
    }

    // Convert the entered text into a number.
    const amountPaid = Number(enteredAmount);

    // Reject text, Infinity, and other invalid numeric values.
    if (!Number.isFinite(amountPaid)) {
        showPaymentMessage(
            "Invalid payment. Please enter a numeric amount.",
            "error"
        );
        paymentInput.focus();
        return;
    }

    // Reject negative payment amounts.
    if (amountPaid < 0) {
        showPaymentMessage(
            "Payment cannot be negative.",
            "error"
        );
        paymentInput.focus();
        return;
    }

    // Calculate the current order total.
    const total = calculateTotal();

    // Reject payments that do not cover the total.
    if (amountPaid < total) {
        showPaymentMessage(
            "Insufficient payment. Amount due: " + formatPeso(total) + ".",
            "error"
        );
        paymentInput.focus();
        return;
    }

    // Calculate change to two decimal places.
    const change = Math.round((amountPaid - total) * 100) / 100;

    // Mark payment as successful.
   
    // Mark payment as successful.
    paymentComplete = true;

    // Display the change and generate the receipt.
    changeAmountDisplay.textContent = formatPeso(change);
    changeDisplay.hidden = false;

    generateReceipt(amountPaid, change);


    showPaymentMessage(
        "Payment successful! The order has been paid.",
        "success"
    );

    // Lock the payment controls.
    paymentInput.disabled = true;
    confirmPaymentButton.disabled = true;

    // Refresh the cart to disable its controls.
    updateCart();

    // Re-render products so their Add to Cart buttons are disabled.
    displayProducts();
}

// Show a success or error message.
function showPaymentMessage(message, type) {
    paymentMessage.textContent = message;
    paymentMessage.className = "payment-message " + type;
}

// Connect the Confirm Payment button to the payment function.
confirmPaymentButton.addEventListener("click", processPayment);


function startNewTransaction() {
    // Clear all products from the cart.
    cart.clear();

    // Allow product and quantity controls to work again.
    paymentComplete = false;

    // Reset the payment input.
    paymentInput.value = "";
    paymentInput.disabled = false;

    // Enable payment confirmation for the next order.
    confirmPaymentButton.disabled = false;

    // Clear previous messages and change information.
    paymentMessage.textContent = "";
    paymentMessage.className = "payment-message";

    changeAmountDisplay.textContent = formatPeso(0);
    changeDisplay.hidden = true;

    // Hide the previous receipt.
    receiptSection.hidden = true;
    receiptItems.replaceChildren();

    receiptReference.textContent = "";
    receiptDateTime.textContent = "";
    receiptTotal.textContent = "";
    receiptPaid.textContent = "";
    receiptChange.textContent = "";

    // Hide the New Transaction button until the next payment.
    newTransactionButton.hidden = true;

    // Refresh the interface.
    displayProducts();
    updateCart();
}

// Connect the button to the reset function.
newTransactionButton.addEventListener("click", startNewTransaction);


// Initialize the product list and empty cart.
displayProducts();
updateCart();
