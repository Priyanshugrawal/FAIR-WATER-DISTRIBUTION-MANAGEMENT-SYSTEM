import { useState } from 'react';
import { Star, Gift, TrendingUp, AlertCircle, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Reward {
  id: string;
  type: string;
  points: number;
  description: string;
  earned_date: string;
}

export function RewardStatus() {
  const [redemptionType, setRedemptionType] = useState<string>('');

  // Mock citizen reward data
  const citizenRewards = {
    total_points: 225,
    current_tier: 'Silver',
    tier_benefits: [
      '5% water tax discount',
      'Priority complaint handling',
      'Free leak inspection',
    ],
    discount_percentage: 5,
    recent_rewards: [
      {
        id: 'RWD-ABC123',
        type: 'On-Time Payment',
        points: 50,
        description: 'November 2025 bill paid on time',
        earned_date: '2025-11-12',
      },
      {
        id: 'RWD-DEF456',
        type: 'Leak Report',
        points: 100,
        description: 'Reported pipe leak at Street 12',
        earned_date: '2025-11-09',
      },
      {
        id: 'RWD-GHI789',
        type: 'Water Savings',
        points: 75,
        description: 'Achieved 15% water savings this month',
        earned_date: '2025-11-07',
      },
    ],
  };

  const redemptions = [
    { points: 200, type: '₹100 Water Tax Discount', value: 100 },
    { points: 500, type: '₹250 Water Tax Discount', value: 250 },
    { points: 1000, type: '₹500 Water Tax Discount', value: 500 },
    { points: 300, type: 'RMC Coupon ₹500', value: 500 },
    { points: 150, type: 'Priority Service (1 month)', value: 0 },
  ];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'from-purple-400 via-pink-400 to-purple-500';
      case 'Gold':
        return 'from-yellow-300 via-yellow-400 to-amber-400';
      case 'Silver':
        return 'from-slate-300 via-slate-300 to-slate-400';
      case 'Bronze':
        return 'from-orange-300 to-orange-500';
      default:
        return 'from-slate-300 to-slate-400';
    }
  };

  const getTierNextThreshold = (tier: string) => {
    switch (tier) {
      case 'Bronze':
        return { next: 'Silver', points_needed: 500 - citizenRewards.total_points };
      case 'Silver':
        return { next: 'Gold', points_needed: 1000 - citizenRewards.total_points };
      case 'Gold':
        return { next: 'Platinum', points_needed: 2500 - citizenRewards.total_points };
      case 'Platinum':
        return { next: 'Platinum Max', points_needed: 0 };
      default:
        return { next: 'Unknown', points_needed: 0 };
    }
  };

  const nextTier = getTierNextThreshold(citizenRewards.current_tier);
  const progressPercentage = Math.min(
    (citizenRewards.total_points / (citizenRewards.current_tier === 'Bronze' ? 500 : citizenRewards.current_tier === 'Silver' ? 1000 : 2500)) * 100,
    100
  );

  return (
    <div className="space-y-6">
      {/* Tier Card */}
      <Card className={`border-0 shadow-lg`}>
        <CardContent className={`bg-gradient-to-r ${getTierColor(citizenRewards.current_tier)} p-8 text-white`}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm opacity-90 mb-1">Your Current Tier</p>
              <h2 className="text-4xl font-bold">{citizenRewards.current_tier}</h2>
            </div>
            <Star className="h-16 w-16 opacity-80" />
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <p className="text-sm opacity-90 mb-2">Total Points</p>
              <p className="text-3xl font-bold">{citizenRewards.total_points}</p>
            </div>
            <div>
              <p className="text-sm opacity-90 mb-2">Water Tax Discount</p>
              <p className="text-3xl font-bold">{citizenRewards.discount_percentage}%</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs opacity-90">
                {nextTier.points_needed > 0
                  ? `${nextTier.points_needed} points to ${nextTier.next}`
                  : 'Maximum tier reached!'}
              </p>
              <p className="text-xs opacity-90">{Math.round(progressPercentage)}%</p>
            </div>
            <div className="h-2 rounded-full bg-white bg-opacity-20">
              <div
                className="h-full rounded-full bg-white transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Redemptions */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-500" />
            Redeem Your Points
          </CardTitle>
          <CardDescription>Convert points to discounts and coupons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {redemptions.map((redemption, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow dark:border-slate-700"
              >
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">{redemption.type}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Costs {redemption.points} points</p>
                </div>
                <Button
                  disabled={citizenRewards.total_points < redemption.points}
                  size="sm"
                  className="gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  onClick={() => setRedemptionType(redemption.type)}
                >
                  Redeem
                </Button>
              </div>
            ))}
          </div>

          {redemptionType && (
            <div className="mt-6 rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">✓ Redemption Successful!</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                You have redeemed <strong>{redemptionType}</strong>. A coupon code has been sent to your email.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={() => setRedemptionType('')}
              >
                Close
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Emergency Contact Widget */}
      <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50 dark:border-red-800 dark:from-red-950 dark:to-orange-950">
        <CardHeader>
          <CardTitle className="text-red-900 dark:text-red-100 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Emergency Access
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-800 dark:text-red-200 mb-4">
            Need urgent plumbing assistance? Call our verified emergency contacts immediately.
          </p>
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
            <Button size="lg" className="gap-2 bg-red-600 hover:bg-red-700 w-full">
              <Phone className="h-5 w-5" />
              RMC Emergency: +91-7554-436-611
            </Button>
            <Button size="lg" variant="outline" className="gap-2 w-full">
              <TrendingUp className="h-5 w-5" />
              View All Contacts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
