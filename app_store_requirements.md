# Sun Dressed - MVP App Store Submission Checklist

**Streamlined checklist for Apple App Store compliance - Role-specific responsibilities**

---

## ESSENTIAL REQUIREMENTS OVERVIEW

### Cost Summary
- **Apple Developer Program**: $99/year (Required)
- **API Costs**: Variable, estimated $0.40 per user (Currently free during trial)

### Timeline Expectations
- **Developer enrollment**: 1-5 days
- **Asset creation**: 1-2 weeks
- **Initial review**: 12-24 hours (Apple's current average)
- **Total MVP timeline**: 2-3 weeks after development completion

---

## ROLE DIVISION: WHO DOES WHAT

### 🎨 NON-TECHNICAL COFOUNDER RESPONSIBILITIES

#### 1. APP STORE ASSETS CREATION
**PRIORITY: HIGH - Required for submission**

**App Icon**
- [ ] Design 1024×1024px app icon in PNG format
- [ ] Ensure solid, opaque background (no transparency)
- [ ] Test design visibility at smallest size (16×16px)

**Screenshots (MANDATORY)**
- [ ] Capture 6-10 iPhone screenshots (1290×2796px OR 1320×2868px)
- [ ] Format: JPEG or PNG, RGB color space, 72 DPI
- [ ] Show actual app functionality: weather display, outfit recommendations, settings
- [ ] No device frames or promotional graphics allowed

**App Metadata (Character limits strictly enforced)**
- [ ] App Name: Maximum 30 characters
- [ ] Subtitle: Maximum 30 characters
- [ ] Description: Maximum 4,000 characters (make first sentence compelling)
- [ ] Keywords: Maximum 100 characters total (comma-separated, no spaces)
- [ ] Promotional Text: Maximum 170 characters (updatable without new version)

#### 2. CLOTHING LOGOS COLLECTION
**PRIORITY: HIGH - Required for app functionality**
- [ ] Collect clothing logos in PNG or SVG format (SVG preferred)
- [ ] Use naming convention: `clothing_type.extension`
  - Examples: `maxi_dress.svg`, `blue_jeans.png`, `winter_coat.svg`
- [ ] Ensure high quality and consistent sizing
- [ ] Organize by clothing categories

#### 3. LEGAL DOCUMENTATION
**PRIORITY: CRITICAL - App will be rejected without these**

**Privacy Policy (MANDATORY)**
- [ ] Create comprehensive privacy policy covering:
  - Location data collection for weather
  - User preferences for outfit recommendations
  - AI/LLM service data processing
  - Data retention and deletion policies
  - Third-party service disclosures
- [ ] Host privacy policy at public URL
- [ ] Include GDPR compliance for EU users

**App Store Privacy Labels**
- [ ] Complete Privacy Nutrition Labels in App Store Connect
- [ ] Disclose ALL data collected: location, preferences, analytics
- [ ] Explain AI content generation clearly

#### 4. MARKETING PREPARATION
**PRIORITY: MEDIUM - For post-launch optimization**
- [ ] Research and select app category (Primary: Weather, Secondary: Lifestyle)
- [ ] Plan keyword strategy using all 100 characters
- [ ] Prepare seasonal screenshot variations
- [ ] Create promotional text updates

### 🔧 TECHNICAL COFOUNDER RESPONSIBILITIES

#### 1. DEVELOPMENT REQUIREMENTS
**PRIORITY: CRITICAL - Already completed per document**
- [x] Build with Xcode 16 or later (Required since April 24, 2025)
- [x] Target iOS 18 SDK minimum
- [x] Support 64-bit architecture only
- [x] Implement IPv6 network compatibility
- [x] Use HTTPS for all network communications

#### 2. APPLE DEVELOPER PROGRAM SETUP
**PRIORITY: CRITICAL - Start once both parties agree to pay for the dev program ($50)**
- [ ] Create Apple ID with two-factor authentication
- [ ] Enroll in Apple Developer Program ($99/year)
- [ ] Complete identity verification process
- [ ] Accept Developer Program License Agreement

#### 3. TECHNICAL COMPLIANCE
**PRIORITY: HIGH - Required for approval**

**App Performance** (must be done after dev program is purchased)
- [ ] Test app thoroughly on latest iOS version
- [ ] Implement proper error handling for network issues
- [ ] Handle offline functionality gracefully
- [ ] Optimize battery usage and performance
- [ ] Test on multiple device sizes

**Location Services Implementation**
- [ ] Add clear location permission purpose strings
- [ ] Implement proper location permission request flows
- [ ] Ensure location services only used when necessary
- [ ] Handle location permission denial gracefully

**AI/LLM Compliance**
- [ ] Add clear AI content disclosure in app
- [ ] Implement safety filters for inappropriate requests
- [ ] Ensure AI responses avoid bias and stereotypes
- [ ] Provide user controls for AI features

#### 4. ACCESSIBILITY IMPLEMENTATION
**PRIORITY: HIGH - Required for approval**
- [ ] Implement VoiceOver support for all UI elements
- [ ] Add descriptive labels for weather conditions and outfit recommendations
- [ ] Support Dynamic Type scaling
- [ ] Ensure 44×44pt minimum touch targets
- [ ] Implement Dark Mode support
- [ ] Test with Switch Control and assistive technologies

#### 5. SUBMISSION PROCESS
**PRIORITY: CRITICAL - Final step**
- [ ] Upload build via Xcode to App Store Connect
- [ ] Create demo account for reviewers (if applicable)
- [ ] Fill out all App Store Connect metadata fields
- [ ] Submit for review with detailed review notes
- [ ] Monitor review status and respond to questions quickly

---

## SHARED RESPONSIBILITIES

### APP STORE CONNECT SETUP
**Both team members should have access**
- [ ] Set up App Store Connect account
- [ ] Configure app listing in App Store Connect
- [ ] Upload all assets and metadata
- [ ] Review and verify all information before submission

### CONTENT REVIEW
**Joint responsibility for content appropriateness**
- [ ] Review all content for cultural sensitivity
- [ ] Ensure diverse representation in outfit recommendations
- [ ] Avoid content promoting unrealistic beauty standards
- [ ] Test AI responses for appropriateness and bias

---

## CRITICAL SUCCESS FACTORS

### MUST-HAVE FOR APPROVAL
1. **Valid Apple Developer Program membership** ($99/year)
2. **Compliant app icon** (1024×1024px PNG)
3. **Required screenshots** (minimum 1, maximum 10)
4. **Privacy policy** hosted at public URL
5. **Complete Privacy Nutrition Labels**
6. **Proper location permission handling**
7. **AI content disclosure**
8. **Full accessibility support**
9. **Built with Xcode 16+ and iOS 18 SDK**

### COMMON REJECTION REASONS TO AVOID
1. Missing or inadequate privacy policy
2. Poor app performance or crashes
3. Accessibility issues with VoiceOver
4. Unclear location permission purpose
5. Insufficient app functionality
6. Missing AI content disclosures

---

## POST-SUBMISSION CHECKLIST

### IMMEDIATE ACTIONS (First 48 hours)
- [ ] Monitor App Store Connect for review status
- [ ] Respond quickly to any reviewer questions
- [ ] Prepare for potential rejection with quick fixes

### POST-APPROVAL ACTIONS
- [ ] Monitor user reviews and ratings
- [ ] Update promotional text regularly (no approval needed)
- [ ] Plan first app update with user feedback
- [ ] Track App Store Optimization performance

---

## EMERGENCY CONTACTS & RESOURCES

**Apple Developer Support**: https://developer.apple.com/support/
**App Review Guidelines**: https://developer.apple.com/app-store/review/guidelines/
**Privacy Policy Generator**: Multiple options available online
**Asset Creation Tools**: Figma, Sketch, Adobe Creative Suite

---

**FINAL NOTE**: This checklist covers MVP requirements only. Additional features and optimizations can be added in future updates after initial approval.
