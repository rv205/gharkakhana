/*
GHAR KA KHANA frontend script - integrated with backend API.
CHANGE `API_BASE` to your backend URL (e.g., https://gharkakhana-backend.onrender.com/api)
*/
const API_BASE = 'https://REPLACE_WITH_BACKEND_URL/api'; // <-- update this after deploying backend

async function fetchDishes() {
  try {
    const res = await fetch(`${API_BASE}/dishes`);
    const data = await res.json();
    console.log('dishes', data);
    const grid = document.getElementById('popular') || document.getElementById('menu-grid');
    if (!grid) return;
    grid.innerHTML = '';
    (data || []).forEach(d => {
      const div = document.createElement('div');
      div.className = 'dish';
      div.innerHTML = `<h4>${d.title}</h4><p class="muted">${d.description || ''}</p><div style="display:flex;justify-content:space-between;align-items:center;"><div>₹${d.price}</div><button class="order-btn" data-id="${d._id || ''}">Order</button></div>`;
      grid.appendChild(div);
    });
    document.querySelectorAll('.order-btn').forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        const dishId = btn.dataset.id;
        if (!dishId) return alert('Dish id missing - backend not connected or data format different.');
        await startCheckout(dishId, 1);
      });
    });
  } catch (err) {
    console.error('fetchDishes error', err);
  }
}

async function startCheckout(dishId, quantity=1) {
  try {
    const payload = { user_id: null, dish_id: dishId, quantity, delivery_address: 'Demo Address' };
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (data.error) return alert('Order failed: ' + data.error);
    alert('Order created. Implement Razorpay checkout using data. Order id: ' + (data.order_id || data.order_id));
  } catch (err) {
    console.error('startCheckout error', err);
    alert('Order failed');
  }
}

document.addEventListener('DOMContentLoaded', ()=>{
  fetchDishes();
  const chefForm = document.getElementById('chef-form');
  if (chefForm) chefForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.name.value,
      phone: form.phone.value,
      city: form.city.value,
      kitchen_name: form.kitchen_name.value,
      cuisine: form.cuisine.value,
      about: form.about.value
    };
    try {
      const res = await fetch(`${API_BASE}/chefs/apply`, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.error) return alert('Application failed: ' + data.error);
      alert('Application received. Thank you!');
      form.reset();
    } catch (err) {
      console.error(err); alert('Application failed');
    }
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    alert('Thanks for reaching out! (Demo submission)');
    contactForm.reset();
  });
});
