# Lemon Squeezy Payment Gateway Setup Guide

This guide will help you integrate Lemon Squeezy as your payment gateway for the VPS hosting platform.

## 📋 Prerequisites

- Lemon Squeezy account (sign up at https://lemonsqueezy.com)
- Your store must be activated and verified
- Node.js and npm installed

## 🔧 Installation

### 1. Install Lemon Squeezy SDK

```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

### 2. Configure Environment Variables

Add the following to your `.env` or `.env.local` file:

```env
# Lemon Squeezy Configuration
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_STORE_ID=your_store_id_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com

# Optional: Default product ID for one-time purchases
LEMONSQUEEZY_DEFAULT_PRODUCT_ID=your_product_id
```

## 🔑 Getting Your API Credentials

### Step 1: Get API Key

1. Log in to your Lemon Squeezy dashboard
2. Go to **Settings** → **API**
3. Click **Create API Key**
4. Give it a name (e.g., "Production API")
5. Copy the API key and add it to your `.env` file as `LEMONSQUEEZY_API_KEY`

### Step 2: Get Store ID

1. In your Lemon Squeezy dashboard, go to **Settings** → **Stores**
2. Your Store ID is displayed at the top (format: `12345`)
3. Add it to your `.env` file as `LEMONSQUEEZY_STORE_ID`

### Step 3: Create Products

You need to create products in Lemon Squeezy for each VPS plan:

1. Go to **Products** → **New Product**
2. Create products for each plan:
   - **Dev Sandbox** - LKR 500/month
   - **Production Entry** - LKR 850/month
   - **Scale Up** - LKR 1,170/month
   - **Powerhouse** - LKR 2,170/month
   - **Data Center Pro** - LKR 2,170/month

3. For each product:
   - Set the name and description
   - Set the price in your currency (LKR)
   - Choose billing interval (monthly/yearly)
   - Save and note the **Product ID** or **Variant ID**

### Step 4: Setup Webhook

Webhooks are crucial for automatically provisioning VPS after payment:

1. Go to **Settings** → **Webhooks**
2. Click **Add Endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/lemonsqueezy/webhook`
4. Select the following events:
   - ✅ `order_created` - Triggers VPS provisioning
   - ✅ `order_refunded` - Suspends/terminates VPS
   - ✅ `subscription_created`
   - ✅ `subscription_payment_success`
   - ✅ `subscription_payment_failed`
   - ✅ `subscription_cancelled`
   - ✅ `subscription_expired`
5. Click **Create Endpoint**
6. Copy the **Signing Secret** and add it to `.env` as `LEMONSQUEEZY_WEBHOOK_SECRET`

## 🎨 Customizing Checkout

### Basic Checkout Options

The checkout can be customized in `/app/api/lemonsqueezy/checkout/route.ts`:

```typescript
checkoutOptions: {
  embed: false,           // Set to true for embedded checkout
  media: true,            // Show product images
  logo: true,             // Show your store logo
  desc: true,             // Show product description
  discount: true,         // Allow discount codes
  dark: false,            // Dark mode
  subscriptionPreview: true // Show subscription preview
}
```

### Custom Pricing

For custom VPS configurations, you can pass `customPrice` (in cents):

```typescript
customPrice: 50000  // LKR 500.00
```

### Passing Custom Data

Cart items and configuration are passed as custom data:

```typescript
custom: {
  cartItems: JSON.stringify(cartItems),
  timestamp: new Date().toISOString(),
}
```

This data is available in the webhook for VPS provisioning.

## 🚀 Testing

### Test Mode

1. In development, set `testMode: true` in checkout creation
2. Use test payment methods from Lemon Squeezy:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits

### Testing Webhooks Locally

Use a tool like **ngrok** to expose your local server:

```bash
ngrok http 3000
```

Then use the ngrok URL in your Lemon Squeezy webhook settings:
```
https://your-ngrok-id.ngrok.io/api/lemonsqueezy/webhook
```

## 📊 Checkout Flow

1. **User fills cart** → Selects VPS plans and configurations
2. **Goes to checkout** → Enters email and name
3. **Clicks "Pay"** → Creates Lemon Squeezy checkout session
4. **Redirects to LS** → User completes payment on Lemon Squeezy
5. **Payment success** → User redirected to `/payment/success`
6. **Webhook fires** → `order_created` webhook received
7. **VPS provisioned** → System automatically provisions VPS
8. **Email sent** → User receives VPS credentials

## 🔒 Security Best Practices

1. **Never expose API keys** in client-side code
2. **Always verify webhook signatures** before processing
3. **Use HTTPS** in production
4. **Store webhook secret securely** in environment variables
5. **Validate all webhook payloads** before taking action

## 🛠️ Webhook Handler

The webhook handler at `/app/api/lemonsqueezy/webhook/route.ts` automatically:

- ✅ Verifies webhook signature
- ✅ Processes order creation → Provisions VPS
- ✅ Handles subscription payments
- ✅ Handles refunds → Suspends VPS
- ✅ Logs all events

### Customizing VPS Provisioning

Edit the `handleOrderCreated` function in the webhook handler to:

- Add database storage for VPS records
- Send custom email notifications
- Integrate with your user management system
- Add custom provisioning logic

## 📧 Email Notifications

You should implement email sending in the webhook handler:

```typescript
// After VPS is created
await sendVPSCredentialsEmail(customerEmail, {
  vpsId: vpsResult.vserverid,
  ipAddress: vpsResult.mainipaddress,
  password: vpsResult.rootpassword,
  hostname: item.config.hostname,
});
```

## 🗄️ Database Integration

Store VPS records in your database:

```typescript
await db.vps.create({
  orderId: payload.data.id,
  customerId: orderAttributes.user_email,
  vpsId: vpsResult.vserverid,
  ipAddress: vpsResult.mainipaddress,
  rootPassword: vpsResult.rootpassword,
  status: 'active',
  createdAt: new Date(),
});
```

## 📱 Payment Success Redirect

Configure redirect URL in Lemon Squeezy:

1. Go to **Settings** → **Checkout**
2. Set **Redirect URL**: `https://yourdomain.com/payment/success?order_id={order_id}`
3. Enable custom redirect

## 🐛 Debugging

### Check Webhook Logs

1. Go to Lemon Squeezy Dashboard → **Settings** → **Webhooks**
2. Click on your webhook
3. View recent deliveries and responses

### Common Issues

**Issue:** Webhook not receiving events
- ✅ Check webhook URL is accessible
- ✅ Verify HTTPS is working
- ✅ Check webhook secret matches

**Issue:** VPS not provisioning
- ✅ Check webhook handler logs
- ✅ Verify SolusVM credentials
- ✅ Check custom data is passed correctly

**Issue:** Invalid signature error
- ✅ Verify webhook secret is correct
- ✅ Check raw body is being used (not parsed)

## 🎯 Next Steps

1. ✅ Install SDK: `npm install @lemonsqueezy/lemonsqueezy.js`
2. ✅ Add environment variables to `.env`
3. ✅ Create products in Lemon Squeezy dashboard
4. ✅ Set up webhook endpoint
5. ✅ Test with test mode
6. ✅ Configure email notifications
7. ✅ Add database integration
8. ✅ Go live!

## 📚 Resources

- [Lemon Squeezy Documentation](https://docs.lemonsqueezy.com)
- [Lemon Squeezy API Reference](https://docs.lemonsqueezy.com/api)
- [Lemon Squeezy.js SDK](https://github.com/lmsqueezy/lemonsqueezy.js)
- [Webhook Events Reference](https://docs.lemonsqueezy.com/help/webhooks)

## 💬 Support

For issues with:
- **Lemon Squeezy**: support@lemonsqueezy.com
- **Integration**: Check the webhook logs and error messages
- **VPS Provisioning**: Check SolusVM logs

---

**Ready to accept payments!** 💰

Once configured, your VPS hosting platform will automatically:
1. Accept payments through Lemon Squeezy
2. Provision VPS instances automatically
3. Send credentials to customers
4. Handle subscriptions and renewals
5. Process refunds and cancellations
