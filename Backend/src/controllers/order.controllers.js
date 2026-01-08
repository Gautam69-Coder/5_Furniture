import Order from "../models/order.models.js";
import { User } from "../models/user.model.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/AsyncHandler.js'
import nodemailer from "nodemailer"


const MyOrder = asyncHandler(async (req, res) => {
    try {

        const userId = req.user._id;

        const orders = await Order.find({ userId });

        if (!orders) {
            throw new ApiError(404, "No orders found for this user");
        }

        return res.status(200).json(
            new ApiResponse(200, orders, "Orders fetched successfully")
        );

    } catch (error) {
        throw new ApiError(500, error.message);
    }
});

//Get all orders for admin
const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });

        if (!orders) {
            throw new ApiError(404, "No orders found");
        }

        return res.status(200).json(
            new ApiResponse(200, orders, "Orders fetched successfully")
        );
    } catch (error) {
        throw new ApiError(500, error.message);
    }
});


let otpStore = {}; // { email: otp }


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "gautamdoliya69@gmail.com", //  Gmail
        pass: "kphj kzgc tuoa hqto" // Gmail App Password
    }
});

//  Send OTP
const OrderMessage = asyncHandler(async (req, res) => {

    let otpStore = {}; // { email: otp }
    const userId = req.user._id;
    console.log(userId)

    const user = await User.findOne({ _id: userId });
    console.log(user)
    const email = user.email

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gautamdoliya69@gmail.com", //  Gmail
            pass: "kphj kzgc tuoa hqto" // Gmail App Password
        }
    });
    const { findOrder } = req.body;
    console.log(findOrder)
    try {
       await transporter.sendMail({
    from: `"Freedom Tree" <YOUR_EMAIL@gmail.com>`,
    to: email,
    subject: "Order Confirmed - Thank You for Shopping with Freedom Tree",
    text: `Your order has been confirmed. Order ID: ${findOrder.status[0].cashfreeOrderId}`,
    html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="color-scheme" content="light dark">
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Order Confirmation - Freedom Tree</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #f6f7fb;
      font-family: Inter, Segoe UI, Roboto, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 650px;
      margin: 24px auto;
      padding: 0 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 6px 24px rgba(16,24,40,.06);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #059669, #10b981);
      padding: 40px 24px 32px;
      color: #fff;
      text-align: center;
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 24px;
    }
    .brand-name {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: 1px;
    }
    .status-badge {
      font-size: 16px;
      color: #fff;
      opacity: 0.95;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .header-title {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 32px 28px;
    }
    .success-message {
      margin: 0 0 28px;
      color: #374151;
      line-height: 1.6;
      font-size: 15px;
    }
    .success-message strong {
      color: #111827;
      font-weight: 600;
    }
    .order-summary {
      background: #f9fafb;
      border-radius: 12px;
      padding: 20px;
      margin: 24px 0;
    }
    .summary-title {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6b7280;
      font-weight: 500;
    }
    .detail-value {
      color: #111827;
      font-weight: 600;
      text-align: right;
    }
    .amount-highlight {
      font-size: 24px;
      font-weight: 800;
      color: #059669;
      text-align: center;
      padding: 20px;
      background: #ecfdf5;
      border-radius: 12px;
      margin: 24px 0;
      border: 2px solid #d1fae5;
    }
    .product-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      margin-bottom: 16px;
    }
    .product-image {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .product-details {
      flex: 1;
    }
    .product-name {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 6px;
    }
    .product-description {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 8px;
      line-height: 1.5;
    }
    .product-meta {
      font-size: 12px;
      color: #9ca3af;
      margin: 4px 0;
    }
    .product-price {
      font-size: 16px;
      font-weight: 700;
      color: #059669;
      margin-top: 8px;
    }
    .section-divider {
      margin: 32px 0;
      border-top: 2px solid #e5e7eb;
    }
    .address-section, .payment-section {
      margin-top: 24px;
    }
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin-bottom: 12px;
    }
    .address-info, .customer-info {
      font-size: 14px;
      color: #374151;
      line-height: 1.8;
      padding: 16px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .customer-info a {
      color: #0ea5e9;
      text-decoration: none;
    }
    .status-badge-inline {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-paid {
      background: #d1fae5;
      color: #065f46;
    }
    .status-processing {
      background: #fef3c7;
      color: #92400e;
    }
    .footer {
      padding: 20px;
      text-align: center;
      color: #9ca3af;
      font-size: 13px;
      background: #f9fafb;
      line-height: 1.6;
    }
    .help-text {
      margin-top: 24px;
      padding: 16px;
      background: #eff6ff;
      border-left: 4px solid #3b82f6;
      border-radius: 8px;
      font-size: 14px;
      color: #1e40af;
    }
    @media (prefers-color-scheme: dark) {
      body { background: #0b1020; }
      .card { background: #0f172a; border: 1px solid #1f2a44; }
      .success-message, .customer-info, .address-info { color: #cbd5e1; }
      .success-message strong, .detail-value, .section-title, .product-name { color: #e5e7eb; }
      .order-summary, .address-info { background: #1e293b; }
      .detail-row { border-bottom-color: #334155; }
      .detail-label, .product-description { color: #94a3b8; }
      .product-item { background: #1e293b; border-color: #334155; }
      .amount-highlight { background: #064e3b; border-color: #065f46; color: #6ee7b7; }
      .footer { background: #111827; }
      .help-text { background: #1e3a5f; border-left-color: #3b82f6; color: #93c5fd; }
      .section-divider { border-top-color: #334155; }
    }
    @media (max-width: 600px) {
      .detail-row { flex-direction: column; gap: 4px; }
      .detail-value { text-align: left; }
      .product-item { flex-direction: column; }
      .product-image { width: 100%; height: 200px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo-container">
          <span class="brand-name">🌳 Freedom Tree</span>
        </div>
        <div class="status-badge">Order Confirmed</div>
        <h1 class="header-title">Thank You for Your Order!</h1>
      </div>

      <div class="content">
        <p class="success-message">
          Hi <strong>${findOrder.user_address[0].firstName} ${findOrder.user_address[0].lastName}</strong>, your order has been successfully placed and payment has been confirmed. We're preparing your items for shipment.
        </p>

        <!-- Order Amount -->
        <div class="amount-highlight">
          ₹ ${findOrder.status[0].totalAmount}
        </div>

        <!-- Order Summary -->
        <div class="order-summary">
          <h2 class="summary-title">Order Details</h2>
          <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${findOrder.status[0].cashfreeOrderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Date:</span>
            <span class="detail-value">${new Date(findOrder.timestamps).toLocaleDateString('en-IN', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Status:</span>
            <span class="detail-value">
              <span class="status-badge-inline status-paid">${findOrder.status[0].paymentStatus}</span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Status:</span>
            <span class="detail-value">
              <span class="status-badge-inline status-processing">${findOrder.status[0].orderStatus}</span>
            </span>
          </div>
        </div>

        <div class="section-divider"></div>

        <!-- Product Items -->
        <h2 class="section-title">Order Items</h2>
        ${findOrder.items.map(item => `
          <div class="product-item">
            <img src="${item.item_image_url}" alt="${item.item_name}" class="product-image" />
            <div class="product-details">
              <h3 class="product-name">${item.item_name}</h3>
              <p class="product-description">${item.item_description}</p>
              <div class="product-meta">Size: ${item.item_size}</div>
              <div class="product-meta">Quantity: ${item.item_quantity}</div>
              <div class="product-price">₹ ${item.item_discounted_unit_price} ${item.item_original_unit_price !== item.item_discounted_unit_price ? `<span style="text-decoration: line-through; color: #9ca3af; font-size: 14px;">₹ ${item.item_original_unit_price}</span>` : ''}</div>
            </div>
          </div>
        `).join('')}

        <div class="section-divider"></div>

        <!-- Shipping Address -->
        <div class="address-section">
          <h2 class="section-title">Shipping Address</h2>
          <div class="address-info">
            <strong>${findOrder.user_address[0].firstName} ${findOrder.user_address[0].lastName}</strong><br>
            ${findOrder.user_address[0].company ? `${findOrder.user_address[0].company}<br>` : ''}
            ${findOrder.user_address[0].address}<br>
            ${findOrder.user_address[0].city}, ${findOrder.user_address[0].state} - ${findOrder.user_address[0].pin}<br>
            ${findOrder.user_address[0].country}<br>
            <strong>Phone:</strong> ${findOrder.user_address[0].phone}
          </div>
        </div>

        <!-- Payment Information -->
        <div class="payment-section">
          <h2 class="section-title">Payment Information</h2>
          <div class="customer-info">
            <strong>Transaction ID:</strong> ${findOrder.status[0]._id}<br>
            <strong>Payment Gateway:</strong> Cashfree Payments<br>
            <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
          </div>
        </div>

        <div class="help-text">
          <strong>Need any help?</strong> Please reply to this email or contact our support team. We're here to assist you!
        </div>
      </div>

      <div class="footer">
        Thank you for shopping with Freedom Tree 🌳<br>
        This is an automated order confirmation email. Please keep it for your records.
      </div>
    </div>
  </div>
</body>
</html>
`
});


        res.json({ success: true, message: "OTP sent to email" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Failed to send OTP" });
    }
});



export { MyOrder, getAllOrders, OrderMessage };