document.addEventListener('DOMContentLoaded', () => {

    // --- Sticky Header ---
    const header = document.getElementById('header');
    const heroSection = document.getElementById('hero');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for header
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Fade-in Animation ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });

    // --- Order Logic ---
    const PRICE_PER_UNIT = 4500;
    const SHIPPING_FEE = 250;
    const FREE_SHIPPING_THRESHOLD = 5000;

    const qtyInput = document.getElementById('quantity');
    const summaryQty = document.getElementById('summary-qty');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryShipping = document.getElementById('summary-shipping');
    const summaryTotal = document.getElementById('summary-total');

    function updateSummary() {
        const qty = parseInt(qtyInput.value) || 1;
        const subtotal = qty * PRICE_PER_UNIT;
        let shipping = SHIPPING_FEE;

        if (subtotal >= FREE_SHIPPING_THRESHOLD) {
            shipping = 0;
        }

        const total = subtotal + shipping;

        summaryQty.textContent = qty;
        summarySubtotal.textContent = `Rs ${subtotal.toLocaleString()}`;
        summaryShipping.textContent = shipping === 0 ? 'Free' : `Rs ${shipping}`;
        summaryTotal.textContent = `Rs ${total.toLocaleString()}`;
    }

    qtyInput.addEventListener('input', updateSummary);
    qtyInput.addEventListener('change', updateSummary);

    // --- Form Submission ---
    const form = document.getElementById('cod-order-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic Validation
        const phone = document.getElementById('phone').value;
        const phoneRegex = /^03\d{9}$/; // Starts with 03, followed by 9 digits

        // Simple check for now, can be more robust
        if (!phone.match(/^\d{11}$/) && !phone.match(/^03\d{9}$/)) {
            alert('Please enter a valid 11-digit Pakistani phone number (e.g., 03001234567).');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        // Gather form data
        const formData = {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
            quantity: document.getElementById('quantity').value,
            variant: document.getElementById('variant').value,
            notes: document.getElementById('notes').value
        };

        // Calculate totals again for the message
        const qty = parseInt(formData.quantity) || 1;
        const subtotal = qty * PRICE_PER_UNIT;
        let shipping = SHIPPING_FEE;
        if (subtotal >= FREE_SHIPPING_THRESHOLD) shipping = 0;
        const total = subtotal + shipping;

        // Construct WhatsApp Message
        const message = `*New Order for Vincent Perfume*
---------------------------
*Name:* ${formData.fullName}
*Phone:* ${formData.phone}
*City:* ${formData.city}
*Address:* ${formData.address}
---------------------------
*Order Details:*
Item: Vincent - Eau de Parfum (${formData.variant})
Quantity: ${qty}
Subtotal: Rs ${subtotal.toLocaleString()}
Shipping: ${shipping === 0 ? 'Free' : 'Rs ' + shipping}
*Total: Rs ${total.toLocaleString()}*
---------------------------
*Notes:* ${formData.notes || 'None'}`;

        // WhatsApp API URL
        // REPLACE '923000000000' with the actual business phone number
        const businessPhoneNumber = '923000000000';
        const whatsappUrl = `https://wa.me/${03369853028}?text=${encodeURIComponent(message)}`;

        // Simulate processing delay then redirect
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');

            // Optional: Reset form after sending
            // form.reset();
            // updateSummary();

            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }, 1000);
    });

    // Initial calculation
    updateSummary();
});
