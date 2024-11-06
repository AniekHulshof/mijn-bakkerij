const cart = document.getElementById('cart');
const cartCheck = document.getElementById('cartCheck');

function updateCart() {
    if (localStorage.getItem('cart') && localStorage.getItem('cart') !== '{}') {
        cart.classList.add('hidden');
        cartCheck.classList.remove('hidden');
    } else {
        cart.classList.remove('hidden');
        cartCheck.classList.add('hidden');
    }
}

if (!localStorage.getItem('bakery')) {
    (async () => {
        try {
            const response = await fetch('json/bakery.json');
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.json();
            localStorage.setItem('bakery', JSON.stringify(data));
            createCards();
        } catch (error) {
            console.error('Er is een probleem opgetreden bij het ophalen van de bakkerijgegevens:', error);
        }
    })();
} else {
    createCards();
}

function createCards() {
    const containerDiv = document.getElementById('containerDiv');
    const bakery = JSON.parse(localStorage.getItem('bakery'));

    containerDiv.innerHTML = '';

    for (let baking of bakery) {
        const item = document.createElement('div');
        item.classList.add('relative', 'w-full', 'sm:w-1/2', 'lg:w-1/3', 'px-2', 'mb-4');

        const style = document.createElement('div');
        style.classList.add('relative', 'border', 'm-5', 'shadow', 'rounded-xl', 'flex', 'flex-col', 'items-center');

        const image = document.createElement('img');
        image.classList.add('w-full', 'rounded-md');
        image.src = baking.image;
        image.alt = baking.title;

        const tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('absolute', 'z-10', 'bottom-16');

        const tooltip = document.createElement('div');
        tooltip.classList.add('bg-white', 'shadow-md', 'rounded-lg', 'p-4', 'hidden');
        tooltip.innerHTML = `
        <h2 class="text-lg font-semibold mb-2">${baking.title}</h2>
        <p class="mb-2">${baking.info}</p>
        <p class="mb-2">${baking.ingredients}</p>
        <p class="mb-2 font-semibold">€${baking.price.toFixed(2)} per stuk</p>`;

        const title = document.createElement('h1');
        title.classList.add('mt-2', 'text-lg', 'text-center', 'font-semibold', 'italic');
        title.innerText = baking.title;

        const price = document.createElement('p');
        price.classList.add('price');
        price.innerText = `€${baking.price.toFixed(2)} per stuk`;

        const buttons = document.createElement('div');
        buttons.classList.add('flex', 'justify-center', 'mt-3');

        const moreInfoButton = document.createElement('button');
        moreInfoButton.classList.add('text-black', 'mr-2', 'mb-3', 'p-2');
        moreInfoButton.classList.add('rounded', 'bg-orange-200', 'hover:bg-yellow-500');
        moreInfoButton.innerText = 'Meer informatie';

        const addToCartButton = document.createElement('button');
        const addToCartImg = document.createElement('img');
        addToCartButton.classList.add('text-black', 'p-2', 'rounded', 'bg-orange-200', 'hover:bg-yellow-500', 'mb-3');
        addToCartImg.src = 'icons/cart.svg';
        addToCartImg.alt = 'Add to cart';

        moreInfoButton.addEventListener('mouseenter', () => {
            tooltip.classList.remove('hidden');
        });

        moreInfoButton.addEventListener('mouseleave', () => {
            tooltip.classList.add('hidden');
        });

        addToCartButton.addEventListener('click', () => {
            addToCart(baking);
            updateCart();
        });

        addToCartButton.append(addToCartImg);
        buttons.append(moreInfoButton, addToCartButton);
        style.append(image, tooltipContainer, title, price, buttons);
        tooltipContainer.append(tooltip);
        item.append(style);
        containerDiv.append(item);
    }
}

function addToCart(baking) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    const maxAmount = 100;

    const confirmContainer = document.createElement('div');
    confirmContainer.classList.add("fixed", "top-0", "w-full", "h-full", "justify-center");
    confirmContainer.classList.add("items-center", "bg-gray-800", "bg-opacity-50", "z-50");

    const confirmPopup = document.createElement('div');
    confirmPopup.classList.add("relative", "z-50", "bg-orange-200", "p-4");
    confirmPopup.classList.add("rounded-md", "justify-center", "text-center");

    if (cart[baking.id] && cart[baking.id].amount >= maxAmount) {
        confirmPopup.innerText = "Maximale hoeveelheid bereikt (100)";
    } else {
        if (cart[baking.id]) {
            cart[baking.id].amount++;
        } else {
            baking.amount = 1;
            cart[baking.id] = baking;
        }
        confirmPopup.innerText = "Succesvol aan winkelwagen toegevoegd!";
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    document.body.append(confirmContainer);
    confirmContainer.append(confirmPopup);

    setTimeout(() => {
        confirmContainer.remove();
    }, 3000);

    let youCanClick = false;

    setTimeout(() => {
        youCanClick = true;
    }, 1);

    document.addEventListener('click', () => {
        if (youCanClick) {
            confirmContainer.remove();
        }
    });
}

updateCart();