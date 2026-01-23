# 🚀 Demo Mode - Quick Start Guide

## ✅ READY TO USE NOW!

Your RealCo platform is **fully functional** with demo mode. No configuration needed!

---

## 🎯 What You Can Do Right Now

### **1. Test Locally (Recommended First)**

```bash
cd apps/web
npm run dev
```

Open: http://localhost:3000

### **2. Or Use Production**

Visit your Vercel URL: https://your-app.vercel.app

---

## 🎮 Quick Demo Walkthroughs

### **Investor Demo (5 minutes)**

1. **Go to:** http://localhost:3000/login
2. **Login with:** Any email/password (e.g., `investor@demo.com` / `password`)
3. **Select:** Investor role
4. **Click:** "Fund Investment" in Quick Actions
5. **Select:** Marina Bay Apartments
6. **Enter:** $100,000
7. **Choose:** ACH Transfer
8. **Review & Confirm:** Watch transaction create!
9. **Go to:** Transaction History
10. **Watch:** Status change from PROCESSING → COMPLETED (3 seconds)

**Result:** You just made a $100K investment with full transaction tracking!

### **Sponsor Demo (5 minutes)**

1. **Login as:** `sponsor@demo.com` / `password`
2. **Select:** Sponsor role
3. **Click:** "Request Draw"
4. **View:** Project budget ($12M total, $7.5M available)
5. **Select Category:** Foundation
6. **Enter Amount:** $500,000
7. **Add Description:** "Foundation work for Building C"
8. **Submit:** Watch it process!
9. **Wait 2 seconds:** Status auto-updates to APPROVED
10. **Check:** Recent Draw Requests - see your new draw at top!

**Result:** You just requested and got approved for a $500K construction draw!

### **Provider Demo (5 minutes)**

1. **Login as:** `provider@demo.com` / `password`
2. **Select:** Provider role
3. **Click:** "Submit Invoice"
4. **Enter:**
   - Invoice #: INV-2026-004
   - Project: Sunset Apartments
   - Amount: $40,000
   - Description: "Electrical work completed"
5. **Check:** Lien waiver agreement
6. **Submit:** Watch it process!
7. **Wait 2 seconds:** Status changes to UNDER_REVIEW
8. **View:** Payment Summary updates with new invoice!

**Result:** You just submitted an invoice with automatic lien waiver!

---

## 💡 Key Features to Test

### **Bank Account Management**
- Add a new bank account (instant or manual)
- Set a different default payment method
- Remove an account
- **All changes persist!** Refresh page to verify

### **Transaction Tracking**
- View all transactions
- Filter by type (DEPOSIT, DISTRIBUTION, etc.)
- Export to CSV (placeholder)
- Watch real-time status updates

### **Investment Wizard**
- 4-step guided flow
- Amount validation (enforces minimums)
- Multiple payment methods
- Creates transaction automatically

### **Budget Tracking**
- Real-time budget calculations
- Visual progress bars
- Prevents over-budget requests
- Shows available funds

### **Invoice Management**
- Full invoice creation
- Automatic lien waivers
- Payment tracking
- Status workflows

---

## 🔄 Interactive Features

### **Status Updates Happen Automatically:**

**Transactions:**
- INITIATED → (instant)
- PROCESSING → (you see this)
- COMPLETED → (3 seconds later)

**Draw Requests:**
- PENDING → (you see this)
- APPROVED → (2 seconds later)

**Invoices:**
- SUBMITTED → (you see this)
- UNDER_REVIEW → (2 seconds later)

### **Data Persists:**
- Close browser, reopen → All data still there!
- Logout and login → Everything saved!
- Refresh page → No data loss!

---

## 📊 Pre-Loaded Mock Data

You start with:
- ✅ 2 verified bank accounts
- ✅ 5 historical transactions
- ✅ 3 investment opportunities ($45M total!)
- ✅ 2 existing investments (yours)
- ✅ 3 recent draw requests
- ✅ 3 submitted invoices
- ✅ 3 active construction projects

**Add your own data on top of this!**

---

## 🎨 Test Different Roles

**Switch roles to see different views:**

1. **Investor View:**
   - Investment opportunities
   - Portfolio tracking
   - Distribution history
   - Fund new investments

2. **Sponsor View:**
   - Project dashboards
   - Draw request management
   - Capital tracking
   - Investor management

3. **Provider View:**
   - Invoice submission
   - Payment tracking
   - Project assignments
   - Payment summaries

**You can test all three without logging out!** Just use different browser tabs.

---

## ⚡ Pro Tips

### **Tip 1: Test Validation**
Try these to see error messages:
- Investment below minimum → "Amount must be at least..."
- Draw exceeding budget → "Amount exceeds available budget..."
- Empty required fields → Fields highlight in red

### **Tip 2: Watch Status Changes**
After submitting anything, don't navigate away immediately! Watch the status badge change color in real-time.

### **Tip 3: Check Persistence**
1. Make a change (add account, create investment, etc.)
2. Close the browser tab completely
3. Reopen and login
4. Your changes are still there!

### **Tip 4: Use Multiple Tabs**
- Tab 1: Investor portal
- Tab 2: Sponsor portal
- Tab 3: Provider portal
See how data appears across roles!

### **Tip 5: Mobile Testing**
Open on your phone - everything works!
- Responsive design
- Touch-friendly
- Full functionality

---

## 🧪 Test Scenarios

### **Scenario 1: Full Investment Flow**
1. Login as investor
2. Browse offerings
3. Select one and invest
4. Check transaction history
5. Watch status update
6. Verify in portfolio
7. Check distribution history

**Time:** 2 minutes  
**Result:** Complete investment tracking

### **Scenario 2: Construction Payment**
1. Login as sponsor
2. View project budget
3. Submit draw request
4. Wait for approval
5. Check transaction created
6. View draw history
7. Budget updates automatically

**Time:** 2 minutes  
**Result:** Full draw request workflow

### **Scenario 3: Contractor Payment**
1. Login as provider
2. Submit invoice
3. Attach documents (mock)
4. Sign lien waiver
5. Track status changes
6. View payment summary
7. See totals update

**Time:** 2 minutes  
**Result:** Complete invoice lifecycle

---

## 🎯 Success Checklist

Test these to verify demo mode:

- [ ] Login with any email/password works
- [ ] Role selection appears after login
- [ ] Dashboard loads with mock data
- [ ] Bank accounts show (2 accounts)
- [ ] Transactions show (5 transactions)
- [ ] Can add new bank account
- [ ] Can create new transaction
- [ ] Status updates happen automatically
- [ ] Data persists after page refresh
- [ ] All forms validate properly
- [ ] Dark mode toggle works
- [ ] Mobile view works
- [ ] All portals accessible

---

## 🚀 Deploy to Production

**Already done!** Your demo mode works on:
- ✅ Local (http://localhost:3000)
- ✅ Vercel (auto-deployed on push)
- ✅ Any platform (no config needed)

**No environment variables needed!**

---

## 📱 Share Demo

**Ready to share with:**
- ✅ Investors (show portfolio features)
- ✅ Sponsors (show project management)
- ✅ Contractors (show payment tracking)
- ✅ Stakeholders (full platform demo)
- ✅ Sales prospects (no backend needed!)

**Just send them the URL - it works immediately!**

---

## 🆘 Troubleshooting

### **Issue: Page is blank**
**Fix:** Set Vercel Root Directory to `apps/web` (see VERCEL_CONFIGURATION.md)

### **Issue: Login not working**
**Fix:** Use ANY email/password - it's demo mode!

### **Issue: Data disappeared**
**Fix:** Check browser console (F12) for errors, or reset demo:
- Open browser console
- Type: `localStorage.clear()`
- Refresh page

### **Issue: Status not updating**
**Fix:** Wait 2-3 seconds - updates are automatic!

---

## 🎉 You're Ready!

**Demo mode is fully functional and ready for:**
- Sales presentations
- Investor demos
- Testing
- Development
- Stakeholder reviews
- Product validation

**No backend required. No API keys needed. Just works!** ✅

---

**Start exploring:** http://localhost:3000  
**Documentation:** See DEMO_MODE_COMPLETE.md for technical details  
**Support:** All features documented in main README

**Happy demoing!** 🚀
