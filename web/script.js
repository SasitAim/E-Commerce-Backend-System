// 1 Product Page
//  สำหรับ filter brand and sort by price (จากโปรเจด frontend)

// Contact page
let contactList = JSON.parse(localStorage.getItem("contacts")) || [];

function GetContactInf() {
  // ดึงข้อความจากช่องกรอกข้อมูล
  const FirstN_ContP = document.getElementById("firstName_ContP").value;
  const LastN_ContP = document.getElementById("lastName_ContP").value;
  const Email_ContP = document.getElementById("email_ContP").value;
  const Phone_ContP = document.getElementById("Phone_Cont").value;
  const Mass_P = document.getElementById("massage_Cont").value;

  // เตือนให้ใส่ข้อมูลให้ครบ (ห้ามปล่อยว่าง)
  if (!FirstN_ContP || !LastN_ContP || !Email_ContP || !Phone_ContP || !Mass_P) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

  // ดึงค่าที่กรอกข้อมูลมา (ไม่ได้ส่งไป backend)
  const contactData = {
    firstName: FirstN_ContP,
    lastName: LastN_ContP,
    email: Email_ContP,
    phone: Phone_ContP,
    message: Mass_P,
    date: new Date().toLocaleString()
  };

  // Array object >> เพิ่ม Object ลง Array
  contactList.push(contactData);
  localStorage.setItem("contacts", JSON.stringify(contactList));

  // Check
  console.log("Contact List", contactList);

  // เคลียร์ฟอร์มหลังบันทึกแล้ว
  document.getElementById("firstName_ContP").value = "";
  document.getElementById("lastName_ContP").value = "";
  document.getElementById("email_ContP").value = "";
  document.getElementById("Phone_Cont").value = "";
  document.getElementById("massage_Cont").value = "";

  alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
}

// ---------------------------------------------------------------------------------------------------------------
// 2 Product and Cart 
// ---------------------------------------------------------------------------------------------------------------

// โหลดตะกร้าจาก localStorage (ถ้ามี)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// บันทึกตะกร้าไปที่ localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


// แก้ไข addToCart ให้เก็บ product_id และใช้ product_id เป็นตัวหา item ซ้ำ
function addToCart(product_id, name, price) {
  const existingItem = cart.find(item => item.product_id === product_id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ product_id, name, price, quantity: 1 }); // มี product_id
  }

  saveCart();
  renderCart();
  alert(`${name} added to cart!`);
}



// ฟังก์ชั่นสำหรับลบสินค้าออกจากตะกร้า
function removeFromCart(name) {
  cart = cart.filter(item => item.name !== name);
  saveCart();
  renderCart();
}

// ฟังก์ชันแสดงผลตะกร้า
function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  if (!cartItemsContainer || !cartTotal) return; // ป้องกัน error ถ้าไม่ใช่หน้า cart.html

  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `<li class="list-group-item text-center">Your cart is empty</li>`;
    cartTotal.innerText = "0.00 Baht";
    return;
  }
  // loop แสดงผลสินค้าทุกชิ้น 
  cart.forEach((item) => {
    let itemTotal = item.price * item.quantity;
    total += itemTotal;

    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

    li.innerHTML = `
      <div>
        <h6 class="my-0">${item.name}</h6>
        <small class="text-body-secondary">Qty: ${item.quantity} × ${item.price.toLocaleString()}</small>
      </div>
      <span class="text-body-secondary">${itemTotal.toLocaleString()} Baht</span>
    `;

    // ปุ่มลบ
    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className = 'btn btn-sm btn-danger ms-2';
    removeBtn.addEventListener('click', () => removeFromCart(item.name));
    li.appendChild(removeBtn);

    cartItemsContainer.appendChild(li);
  });

  cartTotal.innerText = total.toLocaleString() + " Baht"; // ราคารวม
}


// แก้ไขใหม่ เพิ่มดึง id 
document.addEventListener('click', function (event) {
  if (event.target.classList.contains('add-to-cart')) {
    const productCol = event.target.closest('.col');

    const product_id = Number(productCol.dataset.id);           // เพิ่ม
    const productName = productCol.dataset.name;
    const productPrice = Number.parseFloat(productCol.dataset.price);

    addToCart(product_id, productName, productPrice);           // เปลี่ยน signature
  }
});


// โหลด cart เวลาเปิดหน้า cart.html
document.addEventListener("DOMContentLoaded", renderCart);


// ---------------------------------------------------------------------------------------------------------------
// 3 Cart เก็บข้อมูลที่อยู่, ข้อมูลการจ่ายเงิน และสินค้า

// ดึงข้อมูลจากช่องกรอกข้อมูล
function GetBillAddInf() {
  // address
  const FirstN_Bill = document.getElementById("firstName_Cart").value;
  const LastN_Bill = document.getElementById("lastName_Cart").value;
  const Email_Bill = document.getElementById("email_Cart").value;
  const Address_Bill = document.getElementById("address_Cart").value;
  const Address2_Bill = document.getElementById("address2_Cart").value;
  const Country_Bill = document.getElementById("country_Cart").value;
  const State_Bill = document.getElementById("state_Cart").value;
  const Zip_Bill = document.getElementById("zip_Cart").value;


  // กับช่องว่าง ต้องกรอกให้ครบ
  // if (!FirstN_Bill || !LastN_Bill || !Address_Bill || !Country_Bill || !State_Bill || !Zip_Bill || !CartN_Bill || !CardNo_Bill || !Exp_Bill || !CCV_Bill) {
  if (!FirstN_Bill || !LastN_Bill || !Address_Bill || !Country_Bill || !State_Bill || !Zip_Bill) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง สำหรับการจ่ายเงิน");
    return;

  }

  // ดึงค่าข้อมูลที่กรอกมา
  const billAddressData = {
    first_name: FirstN_Bill,
    last_name: LastN_Bill,
    email: Email_Bill,
    address1: Address_Bill,
    address2: Address2_Bill,
    country: Country_Bill,
    state: State_Bill,
    zip: Zip_Bill,

    date: new Date().toLocaleString()

  };

  // *****
  console.log(billAddressData);
  console.log(cart);

  // รวมราคาสินค้า
  const total_price = cart.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  );

  // list card and total_price
  const detailCart = {
    listcart: cart,
    total_price: total_price
  }

  console.log(total_price)

  // สำหรับส่งไป backend
  const cartData = {
    billing_address: billAddressData,
    cart_checkout: detailCart
  }

  console.log(cartData);

  // ส่งไป api
  Checkout(cartData);


  alert("บันทึกข้อมูลการชำระเงินเรียบร้อยแล้ว!");

};


function Checkout(cartData) {

  console.log(cartData);


  let token = localStorage.getItem("token") || "";
  
  $.ajax({
    url: '/api/cart',          // เปลี่ยนจาก /api/products/order
    type: 'POST',              // เปลี่ยนจาก PUT
    headers: {
      Authorization: 'Bearer ' + token
    },
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(cartData),

    
    success: function (res) {
      console.log(res);
      $('#statusModal').modal('show');

      // เคลียร์ตะกร้า + billing
      localStorage.setItem("cart", JSON.stringify([]));
      localStorage.setItem("billAddress", JSON.stringify([]));

    },
    error: function (err) {
      console.error(err);
      alert("Checkout failed");
    }
  });
}