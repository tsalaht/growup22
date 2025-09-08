import React, { useEffect, useState } from 'react';
import { RewardedAd, AdEventType, RewardedAdEventType, TestIds } from 'react-native-google-mobile-ads';
import { getRewardedAdUnitId, IS_DEVELOPMENT } from '@/config/ads';

interface RewardedAdManagerProps {
  onRewardEarned?: (reward: { type: string; amount: number }) => void;
  onAdClosed?: () => void;
  onAdFailedToLoad?: (error: any) => void;
}

class RewardedAdManager {
  private static instance: RewardedAdManager;
  private rewardedAd: RewardedAd | null = null;
  private lastShownTime: number = 0;
  private readonly AD_FREQUENCY = 60000; // 60 seconds
  private callbacks: RewardedAdManagerProps = {};

  static getInstance(): RewardedAdManager {
    if (!RewardedAdManager.instance) {
      RewardedAdManager.instance = new RewardedAdManager();
    }
    return RewardedAdManager.instance;
  }

  setCallbacks(callbacks: RewardedAdManagerProps): void {
    this.callbacks = callbacks;
  }

  async loadAd(): Promise<void> {
    try {
      this.rewardedAd = RewardedAd.createForAdRequest(getRewardedAdUnitId(), {
        requestNonPersonalizedAdsOnly: true,
      });

      this.rewardedAd.addAdEventListener(AdEventType.LOADED, () => {
        if (IS_DEVELOPMENT) {
          console.log('✅ Rewarded Ad loaded successfully');
        }
      });

      this.rewardedAd.addAdEventListener(AdEventType.ERROR, (error) => {
        if (IS_DEVELOPMENT) {
          console.log('❌ Rewarded Ad error:', error);
        }
        // Don't crash the app, just disable the ad
        this.rewardedAd = null;
        this.callbacks.onAdFailedToLoad?.(error);
      });

      this.rewardedAd.addAdEventListener(RewardedAdEventType.EARNED_REWARD, (reward) => {
        if (IS_DEVELOPMENT) {
          console.log('🎁 Rewarded Ad reward earned:', reward);
        }
        this.callbacks.onRewardEarned?.(reward);
      });

      this.rewardedAd.addAdEventListener(AdEventType.OPENED, () => {
        if (IS_DEVELOPMENT) {
          console.log('📱 Rewarded Ad opened');
        }
      });

      this.rewardedAd.addAdEventListener(AdEventType.CLOSED, () => {
        if (IS_DEVELOPMENT) {
          console.log('❌ Rewarded Ad closed');
        }
        this.callbacks.onAdClosed?.();
        // Load next ad after current one is closed
        this.loadAd();
      });

      await this.rewardedAd.load();
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.log('❌ Error loading Rewarded Ad:', error);
      }
      this.callbacks.onAdFailedToLoad?.(error);
    }
  }

  async showAd(): Promise<boolean> {
    const now = Date.now();
    
    // Check if enough time has passed since last ad
    if (now - this.lastShownTime < this.AD_FREQUENCY) {
      if (IS_DEVELOPMENT) {
        console.log('⏰ Rewarded Ad frequency limit not reached');
      }
      return false;
    }

    if (!this.rewardedAd) {
      if (IS_DEVELOPMENT) {
        console.log('❌ No Rewarded Ad loaded');
      }
      return false;
    }

    try {
      await this.rewardedAd.show();
      this.lastShownTime = now;
      return true;
    } catch (error) {
      if (IS_DEVELOPMENT) {
        console.log('❌ Error showing Rewarded Ad:', error);
      }
      return false;
    }
  }

  isAdLoaded(): boolean {
    return this.rewardedAd !== null;
  }
}

export default RewardedAdManager;
