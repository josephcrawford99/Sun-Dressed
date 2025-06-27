# Rolling Tasks - Sun Dressed App (MVP Launch Document)
*Updated: June 27, 2025* by Joey

Note from Joey: flip card button in @packing-list screen does not press normall, it is finicky Need to fix. Also pulling from async is weird, background weather pulling does not always occur, and sometimes current day gets empty outfit. Need to simplify tanstack implementation to pull old and new outfits and ensure caching of weather. Also read @code-review27jun.md for a code review from an outside dev. you should implement fixes if t=you find any of the soncerns to be valid but do not assume it is correct. Trust but verify!

## Executive Summary for Courtney
This document defines what we need for MVP launch vs. future updates. The app is **85% ready** - we have a working product that generates AI outfits based on weather. The remaining 15% is critical bugs and monetization.

## 🚀 MVP Definition (What We're Launching With)
**Core Value Prop**: AI-powered outfit suggestions based on real-time weather
- ✅ **Working Features**: Weather-based outfit generation, trip planning, packing lists
- 🔄 **Revenue Model**: 7-day free trial → $0.99/month subscription
- 📊 **Unit Economics**: ~$0.40 cost per user/month = 60% profit margin
- 🎯 **Break-even**: ~2,000 subscribers

## 💰 Monetization & Pricing Strategy

### **Pricing Model**: $0.99/month after 7-day free trial
- **Why this price**: Low enough for impulse purchase, high enough to be profitable
- **Annual option**: $9.99/year (2 months free)
- **Implementation**: RevenueCat (already in dependencies)

### **API Cost Analysis Per User/Month**:
1. **OpenWeather API**: ~$0.10-0.15 (weather checks)
2. **Google Gemini Flash 2.0**: ~$0.20-0.30 (outfit generation)
3. **Google Places API**: ~$0.05-0.10 (location searches)
- **Total Cost**: ~$0.35-0.55 per active user
- **Profit Margin**: 45-65% at $0.99/month

### **Required for Launch**:
- [ ] Configure products in App Store Connect
- [ ] Set up RevenueCat dashboard
- [ ] Add paywall after 7-day trial
- [ ] Implement subscription status checks

---

## 🔴 MUST HAVE for MVP Launch (Week 1 Sprint)

### 1. **Critical Bug Fixes** (2-3 days)
- [ ] Fix outfit regeneration on app restart (costing money!)
- [ ] Fix "?" icons on initial location load
- [ ] Fix tomorrow's outfit not generating on location change
- [ ] Restore weather card on packing list screen

### 2. **Monetization** (2 days)
- [ ] Implement RevenueCat subscription flow
- [ ] Add paywall screen after trial
- [ ] Test purchase flow end-to-end
- [ ] Add restore purchases functionality

### 3. **Authentication** (1-2 days)
- [ ] Complete Apple Sign In integration
- [ ] Add name collection during signup
- [ ] Test full auth flow (signup → subscription → usage)

### 4. **Onboarding** (1 day)
- [ ] Simple 3-screen tutorial explaining core features
- [ ] Collect user name and preferences
- [ ] Explain free trial clearly

### 5. **Basic User Feedback** (1 day)
- [ ] "Don't have this item" button on outfit items
- [ ] Store preferences for future generations

---

## 🟡 NICE TO HAVE for MVP (But Can Ship Without)

### Quick Wins If Time Allows:
1. **Haptic feedback** on buttons (15 min)
2. **Toast notifications** instead of alerts (45 min)
3. **Pull-to-refresh** on trips list (30 min)
4. **Network offline banner** (1 hour)
5. **Skeleton loaders** for better perceived performance (2 hours)

---

## 🟢 POST-LAUNCH Updates (Version 1.1+)

### Month 1 Updates:
1. **Google OAuth** (increase conversions)
2. **Outfit feedback system** (too cold/warm/formal)
3. **Weather visualizations** (charts/graphs)
4. **Bottom sheets** instead of modals
5. **Performance optimizations**

### Month 2-3 Roadmap:
1. **Social features** (share outfits)
2. **Closet inventory** management
3. **Style learning** from user feedback
4. **Push notifications** for weather changes
5. **Apple Watch app**

---

## What We're Shipping (MVP Feature Set)

### ✅ Core Features (DONE)
- **AI Outfit Generation**: Gemini-powered suggestions based on weather
- **Trip Planning**: Create trips, get packing lists
- **Weather Integration**: Real-time and forecast data
- **Location Services**: Google Places autocomplete
- **Outfit Caching**: Smart persistence to minimize API costs
- **Settings**: Temperature units, style preferences
- **Basic Account**: Email/password authentication

### 🚧 In Progress (Must Complete)
- **Apple Sign In**: 80% done, needs testing
- **Subscription Paywall**: RevenueCat integration
- **Onboarding Flow**: Name collection, feature tour
- **Critical Bug Fixes**: Listed above

### ❌ NOT in MVP (Future)
- Google Sign In
- Advanced outfit feedback
- Social sharing
- Closet inventory
- Push notifications
- Offline mode
- Android-specific optimizations

---

## Go/No-Go Checklist for Launch

### Technical Requirements ✅
- [x] Core app functionality works
- [x] Weather API integration stable
- [x] AI outfit generation reliable
- [ ] Subscription flow implemented
- [ ] Critical bugs fixed

### Business Requirements
- [ ] Terms of Service written
- [ ] Privacy Policy updated
- [ ] App Store assets ready
- [ ] Support email configured
- [x] Cost model validated (<$0.55/user)

### Quality Bar
- [ ] No crashes in critical paths
- [ ] Outfit generation < 3 seconds
- [ ] All text fields work properly
- [ ] Auth flow is smooth
- [ ] Payment flow tested

---

## Timeline to Launch

### Week 1 (June 19-26)
- **Mon-Wed**: Critical bug fixes
- **Thu-Fri**: Monetization implementation
- **Weekend**: Testing & polish

### Week 2 (June 27-July 3)
- **Mon-Tue**: Onboarding & final auth
- **Wed-Thu**: App Store submission prep
- **Fri**: Submit to App Store

### Launch: July 2025 🚀

---

## Why We Can Ship This MVP

1. **Core Value Works**: Users can get AI outfit suggestions - that's the whole app
2. **Revenue Ready**: With RevenueCat, we can start charging immediately
3. **Sustainable Costs**: API costs are manageable and predictable
4. **Quick Iteration**: Post-launch updates can add polish
5. **Market Validation**: Get real user feedback faster

The app delivers on its promise: "AI outfit suggestions based on weather." Everything else is enhancement.

---

## Summary for Stakeholders

**Current State**: The app is functionally complete - users can get weather-based outfit suggestions, plan trips, and generate packing lists. We need 1-2 weeks to add monetization and fix critical bugs.

**Revenue Model**: $0.99/month subscription covers costs and generates ~60% profit margin. Break-even at 2,000 subscribers.

**Launch Strategy**: Ship MVP with core features, then iterate based on user feedback. This gets us to market faster and validates demand.

**Risk Assessment**:
- Technical risk: LOW (core features working)
- Financial risk: LOW (positive unit economics)
- Market risk: MEDIUM (needs validation)

**Recommendation**: Complete the "Must Have" items and ship. Perfect is the enemy of good - we have a working product that solves a real problem.
