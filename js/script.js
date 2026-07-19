// ======================================================
// BODY & BUTTER SCRIPT.JS
// PART 1
// Navbar • Search • Product Image • Quantity
// ======================================================

// ================= NAVBAR SCROLL =================

window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".navbar");

    if (!navbar) return;

    if (window.scrollY > 80) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});

// ================= SEARCH =================

function toggleSearch() {

    const box = document.getElementById("searchBox");

    if (!box) return;

    box.style.display =
        box.style.display === "block" ? "none" : "block";

}

function searchProducts() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    const filter = input.value.toLowerCase();

    const cards = document.querySelectorAll(".shop-card");

    cards.forEach(card => {

        const title = card.querySelector("h3");

        if (!title) return;

        card.style.display =
            title.innerText.toLowerCase().includes(filter)
            ? ""
            : "none";

    });

}

// ================= PRODUCT IMAGE =================

function changeImage(img) {

    const main = document.getElementById("mainProduct");

    if (main) {

        main.src = img.src;

    }

}

// ================= PRODUCT QUANTITY =================

let qty = 1;

function increaseQty() {

    qty++;

    const q = document.getElementById("qty");

    if (q) q.innerHTML = qty;

}

function decreaseQty() {

    if (qty > 1) {

        qty--;

        const q = document.getElementById("qty");

        if (q) q.innerHTML = qty;

    }

}

// ======================================================
// PART 2
// CART BADGE • ADD TO CART • BUY NOW
// ======================================================

// ================= CART COUNT =================

function updateCartCount() {

    const badge = document.getElementById("cartCount");

    if (!badge) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    let count = 0;

    cart.forEach(item => {

        count += item.quantity;

    });

    badge.innerHTML = count;

}

// ================= ADD TO CART =================

function addToCart(name, price, image) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item => item.name === name);

    if (existing) {

        existing.quantity += qty;

    } else {

        cart.push({

            name: name,

            price: price,

            image: image,

            quantity: qty

        });

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    qty = 1;

    const q = document.getElementById("qty");

    if (q) {

        q.innerHTML = "1";

    }

    updateCartCount();

    showToast(name + " added to cart!");

}

// ================= BUY NOW =================

function buyNow(name, price, image) {

    const product = {

        name: name,

        price: price,

        image: image,

        quantity: qty

    };

    localStorage.setItem("buyNowProduct", JSON.stringify(product));

    qty = 1;

    const q = document.getElementById("qty");

    if (q) {

        q.innerHTML = "1";

    }

    window.location.href = "checkout.html";

}

// ======================================================
// PART 3
// CART FUNCTIONS
// ======================================================

// ================= RENDER CART =================

function renderCart() {

    const body = document.getElementById("cartBody");

    if (!body) return;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    body.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        body.innerHTML = `
        <tr>
            <td colspan="4" style="text-align:center;padding:40px;">
                Your cart is empty.
            </td>
        </tr>`;

        const subtotal = document.getElementById("subtotal");
        const grandTotal = document.getElementById("grandTotal");

        if (subtotal) subtotal.innerHTML = "₹0";
        if (grandTotal) grandTotal.innerHTML = "₹0";

        updateCartCount();

        return;

    }

    cart.forEach(product => {

        total += product.price * product.quantity;

        body.innerHTML += `
        <tr>

            <td>

                <img src="${product.image}"
                style="width:70px;height:70px;object-fit:contain;vertical-align:middle;margin-right:10px;">

                ${product.name}

            </td>

            <td>₹${product.price}</td>

            <td>

                <button class="qty-btn"
                onclick="decreaseCartQty('${product.name}')">−</button>

                <span class="cart-qty">${product.quantity}</span>

                <button class="qty-btn"
                onclick="increaseCartQty('${product.name}')">+</button>

            </td>

            <td>

                ₹${product.price * product.quantity}

                <br><br>

                <button class="remove-btn"
                onclick="removeItem('${product.name}')">

                    Remove

                </button>

            </td>

        </tr>`;
    });

    const subtotal = document.getElementById("subtotal");
    const grandTotal = document.getElementById("grandTotal");

    if (subtotal) subtotal.innerHTML = "₹" + total;
    if (grandTotal) grandTotal.innerHTML = "₹" + total;

    updateCartCount();

}

// ================= INCREASE QUANTITY =================

function increaseCartQty(name) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(product => product.name === name);

    if (item) {

        item.quantity++;

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();

}

// ================= DECREASE QUANTITY =================

function decreaseCartQty(name) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = cart.find(product => product.name === name);

    if (item) {

        item.quantity--;

        if (item.quantity <= 0) {

            cart = cart.filter(product => product.name !== name);

        }

    }

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();

}

// ================= REMOVE PRODUCT =================

function removeItem(name) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart = cart.filter(product => product.name !== name);

    localStorage.setItem("cart", JSON.stringify(cart));

    renderCart();

}

// ================= CLEAR CART =================

function clearCart() {

    if (confirm("Are you sure you want to clear the cart?")) {

        localStorage.removeItem("cart");

        updateCartCount();

        renderCart();

    }

}

// ======================================================
// PART 4
// CHECKOUT • PLACE ORDER • PAGE LOAD
// ======================================================

// ================= RENDER CHECKOUT =================

function renderCheckout() {

    const container = document.getElementById("checkoutProducts");

    if (!container) return;

    let buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

let products = [];

if (buyNowProduct) {

    products = [buyNowProduct];

} else {

    products = JSON.parse(localStorage.getItem("cart")) || [];

}

    container.innerHTML = "";

    let total = 0;

    if (products.length === 0) {

        container.innerHTML = "<p>Your cart is empty.</p>";

        const totalBox = document.getElementById("checkoutTotal");

        if (totalBox) {

            totalBox.innerHTML = "₹0";

        }

        return;

    }

    products.forEach(product => {

        total += product.price * product.quantity;

        container.innerHTML += `

<div class="checkout-product">

<img
src="${product.image}"
style="width:70px;height:70px;object-fit:contain;">

<div>

<h4>${product.name}</h4>

<p>Quantity : ${product.quantity}</p>

<p>₹${product.price * product.quantity}</p>

</div>

</div>

`;

    });

    const totalBox = document.getElementById("checkoutTotal");

    if (totalBox) {

        totalBox.innerHTML = "₹" + total;

    }

}

// ================= PLACE ORDER =================

function placeOrder() {

    const fullName = document.querySelector('input[type="text"]').value.trim();

    const email = document.querySelector('input[type="email"]').value.trim();

    const phone = document.querySelector('input[type="tel"]').value.trim();

    const address = document.querySelector("textarea").value.trim();

    const payment = document.querySelector("select").value;

    let buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

let products = [];

if (buyNowProduct) {

    products = [buyNowProduct];

} else {

    products = JSON.parse(localStorage.getItem("cart")) || [];

}

    if (products.length === 0) {

      showToast("Your cart is empty!");

        return;

    }

    if (fullName === "" || email === "" || phone === "" || address === "") {

        showToast("Please fill all billing details.");

        return;

    }

    const order = {

        orderId: "BB" + Math.floor(100000 + Math.random() * 900000),

        customer: fullName,

        email: email,

        phone: phone,

        address: address,

        payment: payment,

        products: products,

        date: new Date().toLocaleString()

    };

    localStorage.setItem("lastOrder", JSON.stringify(order));

if (buyNowProduct) {

    localStorage.removeItem("buyNowProduct");

} else {

    localStorage.removeItem("cart");

}

    updateCartCount();

    window.location.href = "order-success.html";

}

// ================= PAGE LOAD =================

document.addEventListener("DOMContentLoaded", function () {

    updateCartCount();

    if (document.getElementById("cartBody")) {

        renderCart();

    }

    if (document.getElementById("checkoutProducts")) {

        renderCheckout();

    }

});
function goToCheckout() {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {

        showToast("Your cart is empty! Add products before checkout.");

        return;

    }

    localStorage.removeItem("buyNowProduct");

    window.location.href = "checkout.html";

}
// ================= WISHLIST =================

function addToWishlist(name, price, image){

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const exists = wishlist.find(item => item.name === name);

    if(exists){

        showToast("Already in wishlist!");

        return;

    }

    wishlist.push({

        name:name,

        price:price,

        image:image

    });

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    showToast(name + " added to wishlist ❤️");

}

function renderWishlist(){

    const body = document.getElementById("wishlistBody");

    if(!body) return;

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    body.innerHTML="";

    if(wishlist.length===0){

        body.innerHTML=`

<tr>

<td colspan="4" style="padding:50px;text-align:center;">

Your wishlist is empty ❤️

</td>

</tr>

`;

        return;

    }

    wishlist.forEach(product=>{

        body.innerHTML += `

<tr>

<td>

<img src="${product.image}"

style="width:70px;height:70px;object-fit:contain;vertical-align:middle;margin-right:15px;">

${product.name}

</td>

<td>₹${product.price}</td>

<td>

<button class="btn"

onclick="moveToCart('${product.name}')">

Move To Cart

</button>

</td>

<td>

<button class="remove-btn"

onclick="removeWishlist('${product.name}')">

Remove

</button>

</td>

</tr>

`;

    });

}

function removeWishlist(name){

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    wishlist = wishlist.filter(item=>item.name!==name);

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    renderWishlist();

}

function moveToCart(name){

    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const product = wishlist.find(item=>item.name===name);

    if(product){

        const exists = cart.find(item=>item.name===name);

        if(exists){

            exists.quantity++;

        }else{

            cart.push({

                name:product.name,

                price:product.price,

                image:product.image,

                quantity:1

            });

        }

        localStorage.setItem("cart",JSON.stringify(cart));

        updateCartCount();

        removeWishlist(name);

    }

}

function clearWishlist(){

    if(confirm("Clear wishlist?")){

        localStorage.removeItem("wishlist");

        renderWishlist();

    }

}
// ================= SEARCH =================

const products = [

{
name:"Face Wash",
price:599,
image:"images/products/facewash.png",
page:"facewash.html"
},

{
name:"Body Wash",
price:699,
image:"images/products/bodywash.png",
page:"bodywash.html"
},

{
name:"Serum",
price:799,
image:"images/products/serum.png",
page:"serum.html"
},

{
name:"Kesar Soap",
price:399,
image:"images/collections/kesar.png",
page:"kesar.html"
},

{
name:"Activated Charcoal Soap",
price:399,
image:"images/collections/charcoal.png",
page:"charcoal.html"
},

{
name:"Rose Soap",
price:399,
image:"images/collections/rose.png",
page:"rose-soap.html"
},

{
name:"Ubtan Soap",
price:399,
image:"images/collections/ubtan.png",
page:"ubtan.html"
},

{
name:"Multani Mitti Soap",
price:399,
image:"images/collections/multani-mitti.png",
page:"multani.html"
},

{
name:"Body Lotion",
price:649,
image:"images/products/lotion.png",
page:"lotion.html"
},

{
name:"Sunscreen",
price:699,
image:"images/products/sunscreen.png",
page:"sunscreen.html"
}

];

function toggleSearch(){

const box=document.getElementById("searchBox");

if(!box) return;

box.style.display=
box.style.display==="block"
?
"none"
:
"block";

}

function searchProducts(){

const input=document.getElementById("searchInput").value.toLowerCase();

const results=document.getElementById("searchResults");

results.innerHTML="";

if(input==="") return;

const filtered=products.filter(product=>

product.name.toLowerCase().includes(input)

);

filtered.forEach(product=>{

results.innerHTML+=`

<div class="search-item"

onclick="window.location.href='${product.page}'">

<img src="${product.image}">

<div>

<h4>${product.name}</h4>

<p>₹${product.price}</p>

</div>

</div>

`;

});

}
// ================= CONTACT FORM =================

document.addEventListener("DOMContentLoaded",function(){

const form=document.getElementById("contactForm");

if(!form) return;

form.addEventListener("submit",function(e){

e.preventDefault();

const name=document.getElementById("contactName").value.trim();
const email=document.getElementById("contactEmail").value.trim();
const phone=document.getElementById("contactPhone").value.trim();
const subject=document.getElementById("contactSubject").value.trim();
const message=document.getElementById("contactMessage").value.trim();

if(name===""||email===""||phone===""||message===""){

showToast("Please fill all required fields.");

return;

}

const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if(!emailRegex.test(email)){

showToast("Please enter a valid email.");

return;

}

if(phone.length!=10||isNaN(phone)){

showToast("Please enter a valid 10-digit phone number.");

return;

}

let messages=JSON.parse(localStorage.getItem("contactMessages"))||[];

messages.push({

name:name,

email:email,

phone:phone,

subject:subject,

message:message,

date:new Date().toLocaleString()

});

localStorage.setItem("contactMessages",JSON.stringify(messages));

showToast("✅ Thank you! Your message has been sent successfully.");

form.reset();

});

});
// ================= NEWSLETTER =================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("newsletterForm");

    if (!form) return;

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document
            .getElementById("newsletterEmail")
            .value
            .trim();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {

            showToast("Please enter a valid email.");

            return;

        }

        let subscribers =
            JSON.parse(localStorage.getItem("subscribers")) || [];

        if (subscribers.includes(email)) {

            showToast("You are already subscribed!");

            return;

        }

        subscribers.push(email);

        localStorage.setItem(
            "subscribers",
            JSON.stringify(subscribers)
        );

        showToast("🎉 Thank you for subscribing!");

        form.reset();

    });

});
function showToast(message) {

    const toast = document.createElement("div");

    toast.className = "toast";

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);

    }, 3000);

}
function filterProducts(category){

    const cards=document.querySelectorAll(".shop-card");

    const buttons=document.querySelectorAll(".filter-btn");

    buttons.forEach(btn=>btn.classList.remove("active"));

    event.target.classList.add("active");

    cards.forEach(card=>{

        if(category==="all" || card.dataset.category===category){

            card.style.display="block";

        }

        else{

            card.style.display="none";

        }

    });

}
function quickView(name, price, image, desc){

    document.getElementById("quickTitle").innerHTML = name;
    document.getElementById("quickPrice").innerHTML = price;
    document.getElementById("quickImg").src = image;
    document.getElementById("quickDesc").innerHTML = desc;

    document.getElementById("quickModal").style.display = "block";
}

function closeQuickView(){

    document.getElementById("quickModal").style.display = "none";
}
if (window.location.pathname.includes("checkout.html")) {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const buyNowProduct = JSON.parse(localStorage.getItem("buyNowProduct"));

    if (cart.length === 0 && !buyNowProduct) {

        showToast("Your cart is empty! Add products first.");

        setTimeout(() => {
            window.location.href = "shop.html";
        }, 1500);

    }

}
function toggleMenu() {

    const nav = document.querySelector(".nav-links");

    if(nav){
        nav.classList.toggle("active");
    }

}
