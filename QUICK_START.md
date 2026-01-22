# Quick Start: Lemon Squeezy Integration

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install @lemonsqueezy/lemonsqueezy.js
```

### Step 2: Add Environment Variables

Create/update your `.env` or `.env.local` file:

```env
# Lemon Squeezy (Get these from dashboard)
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

### Step 3: Get Your API Key

1. Go to https://app.lemonsqueezy.com/settings/api
2. Create a new API key
3. Copy and paste into `.env`

### Step 4: Get Your Store ID

1. Go to https://app.lemonsqueezy.com/settings/stores
2. Your Store ID is shown at the top
3. Copy and paste into `.env`

### Step 5: Set Up Webhook

1. Go to https://app.lemonsqueezy.com/settings/webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/lemonsqueezy/webhook`
4. Select these events:
   - order_created
   - order_refunded
   - subscription_created
   - subscription_payment_success
5. Copy the signing secret into `.env`

### Step 6: Create Products

1. Go to https://app.lemonsqueezy.com/products
2. Create products for your VPS plans:
   - Dev Sandbox: LKR 500/mo
   - Production Entry: LKR 850/mo
   - Scale Up: LKR 1,170/mo
   - Powerhouse: LKR 2,170/mo
   - Data Center Pro: LKR 2,170/mo

### Step 7: Test!

1. Start your dev server: `npm run dev`
2. Add items to cart
3. Go to checkout
4. Complete payment (use test mode)
5. VPS will be auto-provisioned! 🎉

## 📝 Files Created

- ✅ `lib/lemonsqueezy.ts` - Payment gateway client
- ✅ `app/api/lemonsqueezy/checkout/route.ts` - Create checkout
- ✅ `app/api/lemonsqueezy/webhook/route.ts` - Handle webhooks
- ✅ `app/payment/success/page.tsx` - Success page
- ✅ `app/checkout/page.tsx` - Updated checkout page
- ✅ `.env.example` - Environment template

## 🧪 Testing Locally

Use ngrok to test webhooks:

```bash
ngrok http 3000
```

Then use the ngrok URL in Lemon Squeezy webhook settings.

## 📚 Full Documentation

See `LEMONSQUEEZY_SETUP.md` for complete setup guide with:
- Detailed configuration
- Security best practices
- Customization options
- Troubleshooting
- Email integration
- Database setup

## 💡 What Happens After Payment?

1. ✅ Customer completes payment on Lemon Squeezy
2. ✅ Webhook fires to your server
3. ✅ VPS automatically provisioned via SolusVM
4. ✅ Customer receives email with credentials
5. ✅ VPS appears in dashboard

## ⚡ Current Status

**Payment Integration:** ✅ Complete
**Webhook Handler:** ✅ Complete  
**VPS Auto-Provisioning:** ✅ Ready
**Success Page:** ✅ Complete

**Next Steps:**
- Add your Lemon Squeezy API key
- Create products in dashboard
- Set up webhook endpoint
- Test and go live!

---

Need help? Check `LEMONSQUEEZY_SETUP.md` for detailed instructions.
