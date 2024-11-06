if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify({}));
}

let cart = JSON.parse(localStorage.getItem('cart'));

function updateCart() {
    let totally = calculateTotal();
    const cartIcon = document.getElementById('cart');
    const cartCheck = document.getElementById('cartCheck');

    if (totally !== 0) {
        cartIcon.classList.add('hidden');
        cartCheck.classList.remove('hidden');
    } else {
        cartIcon.classList.remove('hidden');
        cartCheck.classList.add('hidden');
    }
}

function updateTable() {
    let totally = calculateTotal();
    const table = document.getElementById('table');
    const emptyCart = document.getElementById('emptyCart');
    const checkOutButton = document.getElementById('checkOutButton');
    const total = document.getElementById('total');

    if (totally !== 0) {
        table.classList.remove('hidden');
        emptyCart.classList.add('hidden');
        checkOutButton.classList.remove('hidden');
        total.classList.remove('hidden');
    } else {
        table.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        checkOutButton.classList.add('hidden');
        total.classList.add('hidden');
    }

    const checkOut = document.getElementById('checkOut');

    checkOutButton.addEventListener('click', () => {
        checkOut.classList.remove('hidden');
        table.classList.add('hidden');
        emptyCart.classList.add('hidden');
        checkOutButton.classList.add('hidden');
        total.classList.add('hidden');

        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        let orderCounter = parseFloat(localStorage.getItem('orderCounter')) || 1;

        let orderJSON = {
            id: orderCounter,
            items: cart,
            price: calculateTotal(),
            date: new Date(),
        };

        orders.push(orderJSON);
        localStorage.setItem('orders', JSON.stringify(orders));

        localStorage.removeItem('cart');
        cart = {};
        localStorage.setItem('cart', JSON.stringify(cart));

        updateCart();
        orderCounter++;
        localStorage.setItem('orderCounter', orderCounter.toString());
    });
}

function contentCart() {
    const content = document.getElementById('cartItem');
    content.innerHTML = '';

    let cart = JSON.parse(localStorage.getItem('cart'));

    function inputQuantity(baking, price, quantity) {
        return () => {
            if (quantity.value === '') {
                return;
            }
            let value = parseInt(quantity.value);
            if (Number.isNaN(Number(value)) || value < 1) {
                value = 1;
            } else if (value > 100) {
                value = 100;
            }
            quantity.value = value;
            baking.amount = value;
            const newTotal = baking.price * baking.amount;
            price.innerText = `€${newTotal.toFixed(2)}`;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            updateTable();
            updateTotal(calculateTotal());
        };
    }

    function changeQuantity(baking, price, quantity) {
        return () => {
            if (quantity.value === '') {
                quantity.value = 1;
            }
            let value = parseInt(quantity.value);
            if (Number.isNaN(Number(value)) || value < 1) {
                value = 1;
            } else if (value > 100) {
                value = 100;
            }
            quantity.value = value;
            baking.amount = value;
            const newTotal = baking.price * baking.amount;
            price.innerText = `€${newTotal.toFixed(2)}`;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCart();
            updateTable();
            updateTotal(calculateTotal());
        };
    }

    function deleteRow(id) {
        return () => {
            delete cart[id];
            localStorage.setItem('cart', JSON.stringify(cart));
            contentCart();
            updateCart();
            updateTable();
            updateTotal(calculateTotal());
        };
    }

    for (let [id, baking] of Object.entries(cart)) {
        const row = document.createElement('tr');

        const article = document.createElement('td');
        article.classList.add('px-4', 'py-2');
        article.innerText = baking.title;

        const quantity = document.createElement('input');
        quantity.type = 'number';
        quantity.value = baking.amount;
        quantity.classList.add('px-2', 'py-1', 'border', 'rounded', 'w-16');

        const price = document.createElement('td');
        price.classList.add('px-4', 'py-2');
        const totalItem = baking.price * baking.amount;
        price.innerText = `€${totalItem.toFixed(2)}`;

        quantity.addEventListener('input', inputQuantity(baking, price, quantity));
        quantity.addEventListener('change', changeQuantity(baking, price, quantity));

        const amount = document.createElement('td');
        amount.classList.add('px-4', 'py-2', 'relative');
        amount.append(quantity);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('text-red-500', 'hover:text-red-600', 'font-semibold');
        deleteButton.innerText = 'X';

        deleteButton.addEventListener('click', deleteRow(id));

        const deleteItem = document.createElement('td');
        deleteItem.classList.add('px-4', 'py-2');
        deleteItem.append(deleteButton);

        row.append(article, amount, price, deleteItem);
        content.append(row);
    }

    updateTotal(calculateTotal());
}

function calculateTotal() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    let total = 0;

    for (const [id, baking] of Object.entries(cart)) {
        total += baking.price * baking.amount;
    }

    return total;
}

function updateTotal(totally) {
    const totalDiv = document.getElementById('total');
    totalDiv.innerHTML = `Totaal: €${totally.toFixed(2)}`;
}

contentCart();
updateCart();
updateTable();