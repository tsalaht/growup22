import React, { useEffect, useState } from 'react';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';
import { getInterstitialAdUnitId, IS_DEVELOPMENT } from '@/config/ads';

class InterstitialAdManager {
  private static instance: InterstitialAdManager;
  private interstitialAd: InterstitialAd | null = null;
  private lastShownTime: number = 0;
  private readonly AD_FREQUENCY = 30000; // 30 seconds

  static getInstance(): InterstitialAdManager {
    if (!InterstitialAdManager.instance) {
      InterstitialAdManager.instance = new InterstitialAdManager();
    }
    return InterstitialAdManager.instance;
  }

  async loadAd(): Promise<void> {
    try {
      this.interstitialAd = InterstitialAd.createForAdRequest(getInterstitialAdUnitId(), {
        requestNonPersonalizedAdsOnly: true,
      });

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        if (IS_DEVELOPMENT) {
          console.log('✅ Interstitial Ad loaded successfully');
        }
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        if (IS_DEVELOPMENT) {
          console.log('❌ Interstitial Ad error:', error);
        }
        // Don't crash the app, just disable the ad
        this.interstitialAd = null;
      });

      this.interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        if (IS_DEVELOPMENT) {
          console.log('📱 Interstitial Ad opened');
        }
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        if (IS_DEVELOPMENT) {
          console.log('❌ Interstitial Ad closed');
        }
        // Load next ad after current one is closed
        this.loadAd();
      });

      await this.interstitialAd.load();
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.log('❌ Error loading Interstitial Ad:', error);
      }
    }
  }

  async showAd(): Promise<boolean> {
    const now = Date.now();
    
    // Check if enough time has passed since last ad
    if (now - this.lastShownTime < this.AD_FREQUENCY) {
      if (IS_DEVELOPMENT) {
        console.log('⏰ Interstitial Ad frequency limit not reached');
      }
      return false;
    }

    if (!this.interstitialAd) {
      if (IS_DEVELOPMENT) {
        console.log('❌ No Interstitial Ad loaded');
      }
      return false;
    }

    try {
      await this.interstitialAd.show();
      this.lastShownTime = now;
      return true;
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.log('❌ Error showing Interstitial Ad:', error);
      }
      return false;
    }
  }

  isAdLoaded(): boolean {
    return this.interstitialAd !== null;
  }
}

export default InterstitialAdManager;
