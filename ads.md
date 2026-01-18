# Ad Network Integration Guide

> **Site:** passive.hardikkanajariya.in  
> **Category:** Online Tools / Web Utilities

---

## Table of Contents

- [Popunder Smart Links (NEW)](#popunder-smart-links-new)
  - [Smartlink 1](#smartlink-1-primary)
  - [Smartlink 2](#smartlink-2-secondary)
  - [Anti-Adblock Script](#anti-adblock-script)
- [Adsterra](#adsterra)
  - [Social Bar (Pop-under)](#1-social-bar--pop-under)
  - [Banner 468x60](#2-banner-468x60-leaderboard-small)
  - [Banner 160x300](#3-banner-160x300-wide-skyscraper)
  - [Native Banner](#4-native-banner)
  - [Interstitial](#5-interstitial)
  - [Mobile Banner 320x50](#6-mobile-banner-320x50)
  - [Banner 300x250](#7-banner-300x250-medium-rectangle)
  - [Direct Link](#8-direct-link)
- [JuicyAds](#juicyads)
  - [Site Verification](#site-verification)
  - [PopUnders v3](#1-popunders-v3)
  - [Click-under v3.2P](#2-click-under-v32p-tag-based)
  - [Display Banner 632x190](#3-display-banner-632x190)
- [PopAds.net](#popadsnet) ⏳
- [A-ADS (Crypto)](#a-ads-crypto) ⏳
- [Rotate4All](#rotate4all)
- [Placement Guide](#placement-guide)
- [Network Status](#network-status-overview)
- [Recommended Ad Stack](#recommended-ad-stack)

---

## Popunder Smart Links (NEW)

### Smartlink 1 (Primary)

**Type:** Popunder Direct URL  
**Network:** BiographyGridTelegram  
**Best For:** First user click, timed auto-trigger

```
https://biographygridetelegram.com/d70ejjns?key=ba588c7082379404e4ff4358b3eb9355
```

**Usage:** Use as direct URL for popunder on user click or timed trigger.

---

### Smartlink 2 (Secondary)

**Type:** Popunder Direct URL  
**Network:** BiographyGridTelegram  
**Best For:** Rotation with Smartlink 1

```
https://biographygridetelegram.com/gzfm2zz1b?key=c54407e930a6fcd009f2749f33eb3aa5
```

**Usage:** Rotate randomly with Smartlink 1 for better coverage.

---

### Anti-Adblock Script

**Type:** Anti-Adblock JS SYNC  
**Best For:** Bypass ad blockers, ensure ad delivery

```html
<script src="https://biographygridetelegram.com/06/6f/ef/066fefb2005b66dd6bb910cac5faa9ff.js"></script>
```

**Placement:** Add before `</body>` tag on all pages. Loaded automatically via `ads.js`.

---

## Adsterra

### 1. Social Bar / Pop-under

**Type:** Social Bar (floating notification style)  
**Best For:** All pages, non-intrusive  
**Frequency:** 1x per session recommended

```html
<script src="https://pl28503838.effectivegatecpm.com/06/6f/ef/066fefb2005b66dd6bb910cac5faa9ff.js"></script>
```

**Placement:** Add before `</body>` tag on all pages.

---

### 2. Banner 468x60 (Leaderboard Small)

**Dimensions:** 468 × 60 px  
**Best For:** Header, above content, between sections  
**Device:** Desktop

```html
<script>
  atOptions = {
    'key' : '2fd5ef6df9cb74880bb92917f2d93d06',
    'format' : 'iframe',
    'height' : 60,
    'width' : 468,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/2fd5ef6df9cb74880bb92917f2d93d06/invoke.js"></script>
```

---

### 3. Banner 160x300 (Wide Skyscraper)

**Dimensions:** 160 × 300 px  
**Best For:** Sidebar (left or right)  
**Device:** Desktop

```html
<script>
  atOptions = {
    'key' : '820015608f3c05c78d776d295a0323a9',
    'format' : 'iframe',
    'height' : 300,
    'width' : 160,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/820015608f3c05c78d776d295a0323a9/invoke.js"></script>
```

---

### 4. Native Banner

**Type:** Native/In-feed ad  
**Best For:** Within content, between tool sections  
**Device:** All devices

```html
<script async="async" data-cfasync="false" src="https://pl28503854.effectivegatecpm.com/3fecabf66e493c7e25b0b3150e5b5adb/invoke.js"></script>
<div id="container-3fecabf66e493c7e25b0b3150e5b5adb"></div>
```

> ⚠️ **Note:** The `<div>` container must be placed where you want the ad to appear.

---

### 5. Interstitial

**Type:** Full-screen interstitial  
**Best For:** Processing pages, between tool steps  
**Frequency:** Limit to 1x per user session

```html
<script src="https://pl28503859.effectivegatecpm.com/88/b4/ec/88b4ecec127d7745b7a8d8a4ea4017f6.js"></script>
```

**Placement:** Add on processing/waiting pages.

---

### 6. Mobile Banner 320x50

**Dimensions:** 320 × 50 px  
**Best For:** Mobile header/footer (sticky)  
**Device:** Mobile only

```html
<script>
  atOptions = {
    'key' : '9009f28e9a070214cd6bbd79b4b7308d',
    'format' : 'iframe',
    'height' : 50,
    'width' : 320,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/9009f28e9a070214cd6bbd79b4b7308d/invoke.js"></script>
```

**CSS for sticky mobile banner:**

```css
.mobile-ad-sticky {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
}
```

---

### 7. Banner 300x250 (Medium Rectangle)

**Dimensions:** 300 × 250 px  
**Best For:** Sidebar, in-content, result pages  
**Device:** All devices (most popular format)

```html
<script>
  atOptions = {
    'key' : 'c44a710d9fa8c03495f7861c0d3c84ac',
    'format' : 'iframe',
    'height' : 250,
    'width' : 300,
    'params' : {}
  };
</script>
<script src="https://www.highperformanceformat.com/c44a710d9fa8c03495f7861c0d3c84ac/invoke.js"></script>
```

---

### 8. Direct Link

**Type:** Monetized URL  
**Best For:** Buttons, text links, "Download" buttons  
**Usage:** Wrap around any link or button

```
https://www.effectivegatecpm.com/d70ejjns?key=ba588c7082379404e4ff4358b3eb9355
```

**Example usage:**

```html
<a href="https://www.effectivegatecpm.com/d70ejjns?key=ba588c7082379404e4ff4358b3eb9355" 
   target="_blank" 
   rel="noopener">
  Click here for more tools
</a>
```

---

## Placement Guide

### Desktop Layout

```
┌─────────────────────────────────────────────────────────┐
│                   [468x60 Banner]                       │  ← Header
├───────────────────────────────────┬─────────────────────┤
│                                   │                     │
│         TOOL CONTENT              │  [160x300 Banner]   │  ← Sidebar
│                                   │                     │
│     ─────────────────────         │  [300x250 Banner]   │
│         [Native Banner]           │                     │
│     ─────────────────────         │                     │
│                                   │                     │
├───────────────────────────────────┴─────────────────────┤
│                   [468x60 Banner]                       │  ← Footer
└─────────────────────────────────────────────────────────┘
```

### Mobile Layout

```
┌─────────────────────┐
│   [320x50 Banner]   │  ← Header
├─────────────────────┤
│                     │
│    TOOL CONTENT     │
│                     │
│   [300x250 Banner]  │  ← In-content
│                     │
│   [Native Banner]   │  ← Below tool
│                     │
├─────────────────────┤
│   [320x50 Sticky]   │  ← Fixed bottom
└─────────────────────┘
```

### Recommended Per Page

| Page Type | Recommended Ads |
|-----------|-----------------|
| Homepage | 468x60 (top), 300x250 (sidebar), Social Bar |
| Tool Page | 468x60 (top), 300x250 (2x), Native, Social Bar |
| Processing Page | Interstitial, 300x250, Social Bar |
| Result Page | 300x250, Native, Direct Link on download button |

---

## Quick Copy Reference

| Ad Type | Size | Key |
|---------|------|-----|
| Leaderboard Small | 468×60 | `2fd5ef6df9cb74880bb92917f2d93d06` |
| Wide Skyscraper | 160×300 | `820015608f3c05c78d776d295a0323a9` |
| Mobile Banner | 320×50 | `9009f28e9a070214cd6bbd79b4b7308d` |
| Medium Rectangle | 300×250 | `c44a710d9fa8c03495f7861c0d3c84ac` |
| Native Banner | Auto | `3fecabf66e493c7e25b0b3150e5b5adb` |
| Social Bar | Auto | `066fefb2005b66dd6bb910cac5faa9ff` |
| Interstitial | Fullscreen | `88b4ecec127d7745b7a8d8a4ea4017f6` |
| Direct Link | URL | `ba588c7082379404e4ff4358b3eb9355` |
| JuicyAds Banner | 632×190 | Zone: `1109381` |
| JuicyAds PopUnder | Auto | `44640333y244u4r2p28403d494` |

---

## JuicyAds

> ✅ **Status:** Active on ALL Pages  
> **Special Page:** `/special-offers/` (dedicated adult content page)  
> **Note:** JuicyAds now loads on ALL pages alongside Adsterra for maximum revenue.

### Site Verification

**Required:** Add to `<head>` section of all pages for verification.

```html
<meta name="juicyads-site-verification" content="3a5fa98502cb745e835ee3a14e7f0858">
```

---

### Ad Units Loading on All Pages

| Ad Type | Container ID | Size |
|---------|--------------|------|
| PopUnder | Auto | Auto |
| Banner | `ad-juicy-banner` | 632×190 |
| Banner | `ad-juicy-content` | 632×190 |

---

### 1. PopUnders v3

**Type:** Pop-under ad  
**Best For:** All pages  
**Frequency:** 1x per session recommended

```html
<!-- JuicyAds PopUnders v3 -->
<script type="text/javascript" src="https://js.juicyads.com/jp.php?c=44640333y244u4r2p28403d494&u=https%3A%2F%2Fwww.juicyads.rocks"></script>
```

**Placement:** Add before `</body>` tag.

---

### 2. Click-under v3.2P (Tag-based)

**Type:** Click-under (triggers on `<a>` and `<img>` clicks)  
**Best For:** Pages with many clickable elements  
**Behavior:** Opens ad on user interaction

```html
<!-- JuicyAds v3.2P Click-under -->
<script type="text/javascript">
var juicy_tags = ['a', 'img'];
</script>
<script type="text/javascript" src="https://js.juicyads.com/jp.php?c=44640333y244u4r2p28403d494&u=https%3A%2F%2Fwww.juicyads.rocks"></script>
```

> ⚠️ **Note:** Use EITHER PopUnders v3 OR Click-under v3.2P, not both on the same page.

---

### 3. Display Banner 632x190

**Dimensions:** 632 × 190 px  
**Ad Zone ID:** `1109381`  
**Best For:** Header, in-content, above fold  
**Device:** Desktop

```html
<!-- JuicyAds Display Banner 632x190 -->
<script type="text/javascript" data-cfasync="false" async src="https://poweredby.jads.co/js/jads.js"></script>
<ins id="1109381" data-width="632" data-height="190"></ins>
<script type="text/javascript" data-cfasync="false" async>
  (adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1109381});
</script>
```

---

## PopAds.net

> ⏳ **Status:** Pending Approval

*Ad codes will be added once approved.*

---

## A-ADS (Crypto)

> ✅ **Status:** Active

**Ad Unit ID:** `2424578`  
**Type:** Adaptive Banner  
**Best For:** Crypto calculator tools, Bitcoin-related content, general pages

```html
<div id="ad-aads" style="width: 100%; margin: auto; position: relative; z-index: 99998;">
    <iframe data-aa='2424578' src='//acceptable.a-ads.com/2424578/?size=Adaptive'
        style='border:0; padding:0; width:70%; height:auto; overflow:hidden; display: block; margin: auto;'></iframe>
</div>
```

**Placement:** Landing page (below hero), tool pages with crypto/calculator content.

---

## Rotate4All

> ⚠️ **IMPORTANT:** Rotate4All is now available ONLY on the dedicated partner offers page.
> **Page:** `/partner-offers/`

### PTP (Paid to Promote) Link

**Type:** Traffic exchange / PTP link  
**Dedicated Page:** [/partner-offers/](/partner-offers/)  
**DO NOT USE:** In footer, sidebar, or other general placements

```
https://www.rotate4all.com/ptp/promote-299080
```

> 💡 **Note:** All Rotate4All traffic should be directed through the dedicated `/partner-offers/` page for better tracking and user experience.

---

## Network Status Overview

| Network | Status | Ad Types Available |
|---------|--------|-------------------|
| ✅ Adsterra | Active | Banners, Native, Social Bar, Interstitial, Direct Link |
| ✅ JuicyAds | Active | PopUnders, Click-under, Display Banners |
| ⏳ PopAds.net | Pending | - |
| ✅ A-ADS | Active | Adaptive Banner (Crypto) |
| ✅ Rotate4All | Active (Dedicated Page Only) | PTP Links |

---

## Recommended Ad Stack

### Per Page (Optimal Revenue)

| Position | Network | Ad Type |
|----------|---------|---------|
| `<head>` | JuicyAds | Site verification meta |
| Header | Adsterra | 468x60 Banner |
| Sidebar | Adsterra | 160x300 + 300x250 |
| In-content | Adsterra | Native Banner |
| In-content | JuicyAds | 632x190 Banner |
| Footer | Adsterra | 468x60 Banner |
| Before `</body>` | Adsterra | Social Bar |
| Before `</body>` | JuicyAds | PopUnder (OR Click-under) |

### Mobile Specific

| Position | Network | Ad Type |
|----------|---------|---------|
| Header | Adsterra | 320x50 Mobile Banner |
| In-content | Adsterra | 300x250 Banner |
| Sticky bottom | Adsterra | 320x50 Mobile Banner |
| Before `</body>` | Adsterra | Social Bar |

---

## Quick Implementation Checklist

- [ ] Add JuicyAds verification meta to all pages
- [ ] Add Adsterra Social Bar to all pages
- [ ] Add JuicyAds PopUnder OR Click-under (not both)
- [ ] Place 300x250 banners on tool pages
- [ ] Add Native ads between content sections
- [ ] Use Direct Link on download buttons
- [ ] Add Rotate4All PTP link in footer
- [ ] Setup mobile-specific banners (320x50)
- [ ] Add Interstitial on processing pages only