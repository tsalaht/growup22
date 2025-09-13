import React, { useEffect, useState, useRef } from 'react';
import { 
  InterstitialAd, 
  AdEventType, 
  TestIds 
} from 'react-native-google-mobile-ads';
import { getInterstitialAdUnitId, AD_CONFIG } from '@/config/ads';

class InterstitialAdManager {
  private static instance: InterstitialAdManager;
  private interstitialAd: InterstitialAd | null = null;
  private isLoaded = false;
  private isShowing = false;
  private loadAttempts = 0;
  private maxLoadAttempts = 3;

  private constructor() {
    this.loadAd();
  }

  public static getInstance(): InterstitialAdManager {
    if (!InterstitialAdManager.instance) {
      InterstitialAdManager.instance = new InterstitialAdManager();
    }
    return InterstitialAdManager.instance;
  }

  private loadAd() {
    try {
      const adUnitId = getInterstitialAdUnitId();
      this.interstitialAd = InterstitialAd.createForAdRequest(adUnitId, {
        requestNonPersonalizedAdsOnly: false,
      });

      this.interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
        console.log('Interstitial ad loaded successfully');
        this.isLoaded = true;
        this.loadAttempts = 0;
      });

      this.interstitialAd.addAdEventListener(AdEventType.ERROR, (error) => {
        console.log('Interstitial ad error:', error);
        this.isLoaded = false;
        this.loadAttempts++;
        
        // Retry loading after a delay if we haven't exceeded max attempts
        if (this.loadAttempts < this.maxLoadAttempts) {
          setTimeout(() => {
            this.loadAd();
          }, 5000);
        }
      });

      this.interstitialAd.addAdEventListener(AdEventType.OPENED, () => {
        console.log('Interstitial ad opened');
        this.isShowing = true;
      });

      this.interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
        console.log('Interstitial ad closed');
        this.isShowing = false;
        this.isLoaded = false;
        // Load a new ad for next time
        setTimeout(() => {
          this.loadAd();
        }, 1000);
      });

    } catch (error) {
      console.log('Error creating interstitial ad:', error);
    }
  }

  public showAd(): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.isLoaded || this.isShowing || !this.interstitialAd) {
        console.log('Interstitial ad not ready to show');
        resolve(false);
        return;
      }

      try {
        this.interstitialAd.show();
        resolve(true);
      } catch (error) {
        console.log('Error showing interstitial ad:', error);
        resolve(false);
      }
    });
  }

  public isAdLoaded(): boolean {
    return this.isLoaded && !this.isShowing;
  }

  public preloadAd() {
    if (!this.isLoaded && !this.isShowing) {
      this.loadAd();
    }
  }
}

// Hook for using interstitial ads
export const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const adManager = useRef(InterstitialAdManager.getInstance());

  useEffect(() => {
    const checkAdStatus = () => {
      setIsLoaded(adManager.current.isAdLoaded());
    };

    // Check ad status periodically
    const interval = setInterval(checkAdStatus, 2000);
    
    // Initial check
    checkAdStatus();

    return () => clearInterval(interval);
  }, []);

  const showAd = async (): Promise<boolean> => {
    const result = await adManager.current.showAd();
    setIsLoaded(adManager.current.isAdLoaded());
    return result;
  };

  const preloadAd = () => {
    adManager.current.preloadAd();
  };

  return {
    isLoaded,
    showAd,
    preloadAd,
  };
};

// Function to show ad after 3 seconds as requested
export const showInterstitialAdAfterDelay = (delay: number = 3000): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const adManager = InterstitialAdManager.getInstance();
      const result = await adManager.showAd();
      resolve(result);
    }, delay);
  });
};

export default InterstitialAdManager;
