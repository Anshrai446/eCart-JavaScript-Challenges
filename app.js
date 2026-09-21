const productContainer = document.getElementById("product-container");

const seen = new Set();
const history = [];



function renderRecentlyViewed() {

    const recentContainer = document.getElementById("recently-viewed");
    const emptyHistory = document.getElementById("empty-history");

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

                        const card = document.createElement("div");

                        card.className = "product-card";

                        card.innerHTML = `
                            <h3>${product.name}</h3>
                            <p>Brand: ${product.brand}</p>
                            <p>Price: ₹${product.price}</p>
                            <p>Rating: ⭐ ${product.rating}</p>
                        `;

                        recentContainer.appendChild(card);
                    }

                });

            });

        });

    });
}



storeData.categories.forEach(category => {

    category.subcategories.forEach(subcategory => {

        subcategory.products.forEach(product => {

            const card = document.createElement("div");

            card.className = "product-card";

            card.innerHTML = `
                <h3>${product.name}</h3>
                <p>Brand: ${product.brand}</p>
                <p>Price: ₹${product.price}</p>
                <p>Rating: ⭐ ${product.rating}</p>

                <button data-id="${product.id}">
                    View Product
                </button>
            `;

            productContainer.appendChild(card);


            

            const button = card.querySelector("button");

            button.addEventListener("click", () => {

                const productId = button.dataset.id;


               
                if (seen.has(productId)) {

                    const index = history.indexOf(productId);

                    history.splice(index, 1);

                }

                
                else {

                    seen.add(productId);

                }


                history.unshift(productId);

                if (history.length > 5) {

                    const removeId = history.pop();

                    seen.delete(removeId);

                }


                console.log("Viewed Product ID:", productId);
                console.log("History:", history);


                
                renderRecentlyViewed();

            });

        });

    });

});



document.getElementById("clear-history").addEventListener("click", () => {

    history.length = 0;

    seen.clear();

    renderRecentlyViewed();

});