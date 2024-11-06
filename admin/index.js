function goToProducts() {
    const products = document.getElementById('products');
    const tableProducts = document.getElementById('tableProducts');

    const orders = document.getElementById('orders');
    const tableOrders = document.getElementById('tableOrders');

    const addItem = document.getElementById('addItem');
    const reset = document.getElementById('reset');

    products.addEventListener('click', async () => {
        if (localStorage.getItem('bakery') === null) {
            await fetchJSON();
        }

        products.classList.add('bg-yellow-500');
        tableProducts.classList.remove('hidden');
        orders.classList.remove('bg-yellow-500');
        orders.classList.add('bg-orange-200', 'hover:bg-yellow-500');
        tableOrders.classList.add('hidden');
        addItem.classList.remove('hidden');
        reset.classList.remove('hidden');
    });
    products.classList.add('bg-yellow-500');
    tableProducts.classList.remove('hidden');
    orders.classList.remove('bg-yellow-500');
    orders.classList.add('bg-orange-200', 'hover:bg-yellow-500');
    tableOrders.classList.add('hidden');
    addItem.classList.remove('hidden');
    reset.classList.remove('hidden');

    getProducts();
}

goToProducts();

function getProducts() {
    const bakery = JSON.parse(localStorage.getItem('bakery')) || {};

    const productItem = document.getElementById('productItem');

    productItem.innerHTML = '';

    for (const baking of bakery) {
        const row = document.createElement('tr');

        const id = document.createElement('td');
        id.innerText = baking.id;
        id.classList.add('px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'border-b', 'border-gray-200');

        const name = document.createElement('td');
        name.innerText = baking.title;
        name.classList.add('px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'border-b', 'border-gray-200');

        const price = document.createElement('td');
        price.innerText = `€${baking.price.toFixed(2)}`;
        price.classList.add('px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'border-b', 'border-gray-200');

        const image = document.createElement('td');
        image.innerText = baking.image;
        image.classList.add('px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'border-b', 'border-gray-200');

        const edit = document.createElement('td');
        edit.innerText = 'wijzigen';
        edit.classList.add('px-4', 'py-2', 'sm:px-6', 'sm:py-3', 'border-b', 'border-gray-200');

        const editButton = document.createElement('button');
        editButton.classList.add('text-blue-400', 'hover:text-blue-500');
        editButton.innerText = 'Wijzigen';
        editButton.addEventListener('click', () => {
            editPopup(baking);
        });

        const editItem = document.createElement('td');
        editItem.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');
        editItem.append(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('text-red-400', 'hover:text-red-500', 'font-semibold');
        deleteButton.innerText = 'X';
        deleteButton.addEventListener('click', () => {
            bakery.splice(bakery.indexOf(baking), 1);
            row.remove();
            localStorage.setItem('bakery', JSON.stringify(bakery));
            getProducts();
        });

        const deleteItem = document.createElement('td');
        deleteItem.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');
        deleteItem.append(deleteButton);

        row.append(id, name, price, image, editItem, deleteItem);
        productItem.append(row);
    }
}

function editPopup(baking) {
    const bakery = JSON.parse(localStorage.getItem('bakery')) || {};

    const popupModify = document.getElementById('popupModify');
    popupModify.classList.remove('hidden');

    const closePopupModify = document.getElementById('closePopupModify');
    closePopupModify.addEventListener('click', () => {
        popupModify.classList.add('hidden');
        goToProducts();
    });

    const titleInput = document.getElementById('titleModify');
    const priceInput = document.getElementById('priceModify');
    const imageURLInput = document.getElementById('imageURLModify');
    const infoInput = document.getElementById('infoModify');
    const ingredientsInput = document.getElementById('ingredientsModify');

    titleInput.value = baking.title;
    priceInput.value = baking.price;
    imageURLInput.value = baking.image;
    infoInput.value = baking.info;
    ingredientsInput.value = baking.ingredients;

    const submitModify = document.getElementById('submitModify');
    submitModify.addEventListener('click', (event) => {
        event.preventDefault();

        const newTitle = titleInput.value.trim();
        const newPrice = parseFloat(priceInput.value);
        const newImageURL = imageURLInput.value.trim();
        const newInfo = infoInput.value.trim();
        const newIngredients = infoInput.value.trim();

        document.getElementById('titleModifyError').classList.add('hidden');
        document.getElementById('priceModifyError').classList.add('hidden');
        document.getElementById('imageURLModifyError').classList.add('hidden');
        document.getElementById('infoModifyError').classList.add('hidden');
        document.getElementById('ingredientsModifyError').classList.add('hidden');

        if (newTitle === '') {
            document.getElementById('titleModifyError').classList.remove('hidden');
            return;
        }

        if (Number.isNaN(Number(newPrice)) || newPrice <= 0) {
            document.getElementById('priceModifyError').classList.remove('hidden');
            return;
        }

        if (newImageURL === '') {
            document.getElementById('imageURLModifyError').classList.remove('hidden');
            return;
        }

        if (newInfo === '') {
            document.getElementById('infoModifyError').classList.remove('hidden');
            return;
        }

        if (newIngredients === '') {
            document.getElementById('ingredientsURLModifyError').classList.remove('hidden');
            return;
        }

        bakery.forEach(item => {
            if (baking.id === item.id) {
                item.title = newTitle;
                item.price = newPrice;
                item.image = newImageURL;
                item.info = newInfo;
                item.ingredients = newIngredients;
            }
        });

        localStorage.setItem('bakery', JSON.stringify(bakery));
        popupModify.classList.add('hidden');
        goToProducts();
    });
}

function addPopup() {
    const bakery = JSON.parse(localStorage.getItem('bakery')) || {};

    const closePopupAdd = document.getElementById('closePopupAdd');
    const popupAdd = document.getElementById('popupAdd');

    closePopupAdd.addEventListener('click', () => {
        popupAdd.classList.add('hidden');
        goToProducts();
    });

    const titleInput = document.getElementById('titleAdd');
    const priceInput = document.getElementById('priceAdd');
    const imageURLInput = document.getElementById('imageURLAdd');
    const infoInput = document.getElementById('infoAdd');
    const ingredientsInput = document.getElementById('ingredientsAdd');
    const submitAdd = document.getElementById('submitAdd');

    submitAdd.addEventListener('click', (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const price = parseFloat(priceInput.value);
        const imageURL = imageURLInput.value.trim();
        const info = infoInput.value.trim();
        const ingredients = ingredientsInput.value.trim();

        const titleError = document.getElementById('titleAddError');
        const priceError = document.getElementById('priceAddError');
        const imageURLError = document.getElementById('imageURLAddError');
        const infoError = document.getElementById('infoAddError');
        const ingredientsError = document.getElementById('ingredientsAddError');

        titleError.classList.add('hidden');
        priceError.classList.add('hidden');
        imageURLError.classList.add('hidden');
        infoError.classList.add('hidden');
        ingredientsError.classList.add('hidden');

        if (title === '') {
            titleError.classList.remove('hidden');
            return;
        }

        if (Number.isNaN(Number(price)) || price <= 0) {
            priceError.classList.remove('hidden');
            return;
        }

        if (imageURL === '') {
            imageURLError.classList.remove('hidden');
            return;
        }

        if (info === '') {
            infoError.classList.remove('hidden');
            return;
        }

        if (ingredients === '') {
            ingredientsError.classList.remove('hidden');
            return;
        }

        let existingID = 1;
        bakery.forEach(item => {
            if (item.id > existingID) {
                existingID = item.id;
            }
        });

        const nextID = existingID + 1;

        const newItem = {
            id: nextID,
            title: title,
            price: price,
            image: imageURL,
            info: info,
            ingredients: ingredients,
        };

        bakery.push(newItem);
        localStorage.setItem('bakery', JSON.stringify(bakery));
        popupAdd.classList.add('hidden');
        getProducts();
        titleInput.value = '';
        priceInput.value = '';
        imageURLInput.value = '';
        infoInput.value = '';
        ingredientsInput.value = '';
    });
}

function openPopup() {
    const addItem = document.getElementById('addItem');
    const popupAdd = document.getElementById('popupAdd');

    addItem.addEventListener('click', () => {
        popupAdd.classList.remove('hidden');
        addPopup();
    });
}

openPopup();

function goToOrders() {
    const orders = document.getElementById('orders');
    const tableOrders = document.getElementById('tableOrders');

    const products = document.getElementById('products');
    const tableProducts = document.getElementById('tableProducts');

    const addItem = document.getElementById('addItem');
    const reset = document.getElementById('reset');

    orders.addEventListener('click', () => {
        orders.classList.add('bg-yellow-500');
        tableOrders.classList.remove('hidden');
        tableProducts.classList.add('hidden');
        products.classList.remove('bg-yellow-500');
        products.classList.add('bg-orange-200', 'hover:bg-yellow-500');
        addItem.classList.add('hidden');
        reset.classList.add('hidden');
    });

    getOrders();
}

goToOrders();

function getOrders() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];

    const orderItem = document.getElementById('orderItem');

    if (orders.length === 0) {
        const noOrders = document.getElementById('noOrders');
        noOrders.classList.remove('hidden');
    }

    orderItem.innerHTML = '';

    for (const order of orders.reverse()) {
        const row = document.createElement('tr');

        const id = document.createElement('td');
        id.innerText = order.id;
        id.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');

        const price = document.createElement('td');
        price.innerText = `€${order.price.toFixed(2)}`;
        price.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');

        const date = document.createElement('td');

        let orderDate = new Date(order.date);
        let dateFormat = orderDate.toLocaleDateString('nl-NL');
        let timeFormat = orderDate.toLocaleTimeString('nl-NL', { timeZone: 'Europe/Amsterdam' });
        let format = dateFormat + " " + timeFormat;
        date.innerText = format;
        date.classList.add('px-4', 'py-2', 'border-b', 'border-gray-200');

        row.append(id, price, date);
        orderItem.append(row);
    }
}

async function fetchJSON() {
    try {
        const response = await fetch('../public/json/bakery.json');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }
        const data = await response.json();
        localStorage.setItem('bakery', JSON.stringify(data));
        getProducts();
    } catch (error) {
        console.error('Er is een probleem opgetreden bij het ophalen van de bakkerijgegevens:', error);
    }
}

function resetJSON() {
    const resetButton = document.getElementById('reset');

    resetButton.addEventListener('click', async () => {
        localStorage.removeItem('cart');
        localStorage.removeItem('bakery');
        await fetchJSON();
        getProducts();
        getOrders();
    });
}

resetJSON();
