/**
 * GA4 + Consent Mode v2.
 *
 * Set GA4 to the measurement ID (G-XXXXXXXXXX) to turn the tag on. While it is
 * null this file loads and does nothing: no consent calls, no gtag.js request.
 *
 * Deliberately an external file rather than an inline <script>: it keeps the
 * page working under a strict `script-src 'self'` policy, so no site needs
 * 'unsafe-inline' to carry analytics.
 *
 * Consent defaults are declared before gtag.js is requested, which is what lets
 * the tag start in the right state rather than retrofitting one:
 *   - EEA + UK + CH: every storage type denied, wait_for_update 500ms so a
 *     consent banner can upgrade the signal before the first hit.
 *   - Everywhere else: granted.
 * The region-scoped default takes precedence over the global one.
 */
(function () {
  var GA4 = null;

  if (!GA4) return;

  // EU-27 + EEA (IS, LI, NO) + UK + CH.
  var CONSENT_REGIONS = [
    'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT',
    'LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE',
    'IS','LI','NO','GB','CH'
  ];

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    region: CONSENT_REGIONS,
    wait_for_update: 500
  });
  gtag('consent', 'default', {
    ad_storage: 'granted',
    ad_user_data: 'granted',
    ad_personalization: 'granted',
    analytics_storage: 'granted'
  });

  gtag('js', new Date());
  gtag('config', GA4);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4);
  document.head.appendChild(s);
})();
