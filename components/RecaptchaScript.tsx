"use client";

import { useEffect } from "react";

export function RecaptchaScript() {
  useEffect(() => {
    // Load reCAPTCHA script dynamically with event handlers
    if (typeof window !== 'undefined' && !window.grecaptcha) {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        // reCAPTCHA script loaded successfully
      };
      
      script.onerror = () => {
        console.error('reCAPTCHA script failed to load');
      };
      
      document.head.appendChild(script);
      
      return () => {
        // Cleanup if component unmounts before script loads
        if (script.parentNode === document.head) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);

  return null;
}