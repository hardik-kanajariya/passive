# Ad Network Integration Guide

> **Site:** passive.hardikkanajariya.in  
> **Category:** Online Tools / Web Utilities

---

## Table of Contents

- [Adsterra](#adsterra)
  - [Social Bar (Pop-under)](#1-social-bar--pop-under)
  - [Banner 468x60](#2-banner-468x60-leaderboard-small)
  - [Banner 160x300](#3-banner-160x300-wide-skyscraper)
  - [Native Banner](#4-native-banner)
  - [Interstitial](#5-interstitial)
  - [Mobile Banner 320x50](#6-mobile-banner-320x50)
  - [Banner 300x250](#7-banner-300x250-medium-rectangle)
  - [Direct Link](#8-direct-link)
- [Placement Guide](#placement-guide)

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

---

------------ Juicy Ads ------------
verification header: 
<meta name="juicyads-site-verification" content="3a5fa98502cb745e835ee3a14e7f0858">

<!-- JuicyAds PopUnders v3 Start -->
<script type="text/javascript" src="https://js.juicyads.com/jp.php?c=44640333y244u4r2p28403d494&u=https%3A%2F%2Fwww.juicyads.rocks"></script>
<!-- JuicyAds PopUnders v3 End -->

<!-- JuicyAds v3.2P Start -->
<script type="text/javascript">
var juicy_tags = ['a', 'img'];
</script>
<script type="text/javascript" src="https://js.juicyads.com/jp.php?c=44640333y244u4r2p28403d494&u=https%3A%2F%2Fwww.juicyads.rocks"></script>
<!-- JuicyAds v3.2P End -->

<!-- JuicyAds v3.0 -->
<script type="text/javascript" data-cfasync="false" async src="https://poweredby.jads.co/js/jads.js"></script>
<ins id="1109381" data-width="632" data-height="190"></ins>
<script type="text/javascript" data-cfasync="false" async>(adsbyjuicy = window.adsbyjuicy || []).push({'adzone':1109381});</script>
<!--JuicyAds END-->
------------ TrafficStars ------------
--- pending approval ---
------------ PopAds.net ------------
--- pending approval ---
------------ A-ADS (Crypto) ------------
--- pending approval ---
------------ Rotate4All ------------
https://www.rotate4all.com/ptp/promote-299080