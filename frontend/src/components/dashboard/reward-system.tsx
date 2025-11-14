import { useState } from 'react';
import { Trophy, Star, Gift, TrendingUp, Users, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Reward {
  id: string;
  citizen_email: string;
  type: string;
  points: number;
  description: string;
  earned_date: string;
}

interface CitizenRewardStatus {
  citizen_email: string;
  total_points: number;
  current_tier: string;
  discount_percentage: number;
  rewards_count: number;
  recent_rewards: Reward[];
}

export function RewardSystemManagement() {
  const [selectedCitizen, setSelectedCitizen] = useState<string>('user@example.com');

  // Mock reward system data
  const rewardStats = {
    total_points_issued: 5200,
    total_points_redeemed: 1850,
    unique_participants: 42,
    reward_breakdown: {
      on_time_payment: 28,
      leak_report: 8,
      water_savings: 12,
      referral: 3,
    },
  };

  const citizenRewards: Record<string, CitizenRewardStatus> = {
    'user@example.com': {
      citizen_email: 'user@example.com',
      total_points: 225,
      current_tier: 'Silver',
      discount_percentage: 5,
      rewards_count: 3,
      recent_rewards: [
        {
          id: 'RWD-ABC123',
          citizen_email: 'user@example.com',
          type: 'On-Time Payment',
          points: 50,
          description: 'November 2025 bill paid on time',
          earned_date: '2025-11-12',
        },
        {
          id: 'RWD-DEF456',
          citizen_email: 'user@example.com',
          type: 'Leak Report',
          points: 100,
          description: 'Reported pipe leak at Street 12',
          earned_date: '2025-11-09',
        },
        {
          id: 'RWD-GHI789',
          citizen_email: 'user@example.com',
          type: 'Water Savings',
          points: 75,
          description: 'Achieved 15% water savings this month',
          earned_date: '2025-11-07',
        },
      ],
    },
    'citizen1@raipur.gov.in': {
      citizen_email: 'citizen1@raipur.gov.in',
      total_points: 125,
      current_tier: 'Bronze',
      discount_percentage: 2,
      rewards_count: 1,
      recent_rewards: [
        {
          id: 'RWD-XYZ999',
          citizen_email: 'citizen1@raipur.gov.in',
          type: 'On-Time Payment',
          points: 50,
          description: 'October 2025 bill paid on time',
          earned_date: '2025-10-30',
        },
      ],
    },
  };

  const currentRewards = citizenRewards[selectedCitizen];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Platinum':
        return 'from-purple-400 to-pink-400';
      case 'Gold':
        return 'from-yellow-400 to-amber-400';
      case 'Silver':
        return 'from-slate-300 to-slate-400';
      case 'Bronze':
        return 'from-orange-400 to-orange-500';
      default:
        return 'from-slate-300 to-slate-400';
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'On-Time Payment':
        return '💳';
      case 'Leak Report':
        return '🚨';
      case 'Water Savings':
        return '💧';
      case 'Referral':
        return '👥';
      default:
        return '🎁';
    }
  };

  return (
    <div className="space-y-6">
      {/* Reward System Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Points Issued</p>
                <p className="text-3xl font-bold text-blue-600">{rewardStats.total_points_issued.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Points Redeemed</p>
                <p className="text-3xl font-bold text-green-600">{rewardStats.total_points_redeemed.toLocaleString()}</p>
              </div>
              <Gift className="h-8 w-8 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Active Participants</p>
                <p className="text-3xl font-bold text-purple-600">{rewardStats.unique_participants}</p>
              </div>
              <Users className="h-8 w-8 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Redemption Rate</p>
                <p className="text-3xl font-bold text-amber-600">
                  {((rewardStats.total_points_redeemed / rewardStats.total_points_issued) * 100).toFixed(1)}%
                </p>
              </div>
              <Award className="h-8 w-8 text-amber-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reward Distribution */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Reward Distribution</CardTitle>
          <CardDescription>Breakdown of earned rewards by type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <p className="text-2xl font-bold text-blue-600">{rewardStats.reward_breakdown.on_time_payment}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">On-Time Payments</p>
            </div>
            <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
              <p className="text-2xl font-bold text-red-600">{rewardStats.reward_breakdown.leak_report}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Leak Reports</p>
            </div>
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
              <p className="text-2xl font-bold text-green-600">{rewardStats.reward_breakdown.water_savings}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Water Savings</p>
            </div>
            <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
              <p className="text-2xl font-bold text-purple-600">{rewardStats.reward_breakdown.referral}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400">Referrals</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reward Tiers */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Reward Tiers & Benefits</CardTitle>
          <CardDescription>Citizen tier levels and associated benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'Bronze',
                points: '0-499',
                discount: '2%',
                benefits: ['Basic discount', 'Newsletter'],
                color: 'from-orange-400 to-orange-500',
              },
              {
                name: 'Silver',
                points: '500-999',
                discount: '5%',
                benefits: ['5% discount', 'Priority support', 'Free inspection'],
                color: 'from-slate-300 to-slate-400',
              },
              {
                name: 'Gold',
                points: '1000-2499',
                discount: '10%',
                benefits: ['10% discount', 'VIP support', 'Free maintenance', 'Coupons'],
                color: 'from-yellow-400 to-amber-400',
              },
              {
                name: 'Platinum',
                points: '2500+',
                discount: '15%',
                benefits: ['15% discount', 'Concierge', 'Free visits', 'Bonus rewards'],
                color: 'from-purple-400 to-pink-400',
              },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl bg-gradient-to-br ${tier.color} p-4 text-white shadow-lg`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-bold">{tier.name}</h3>
                  <Trophy className="h-5 w-5" />
                </div>
                <p className="text-xs mb-2 opacity-90">{tier.points} points</p>
                <p className="text-sm font-semibold mb-3">{tier.discount} discount</p>
                <ul className="text-xs space-y-1">
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-1">
                      <span>✓</span> {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Individual Citizen Rewards */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader>
          <CardTitle>Citizen Reward Status</CardTitle>
          <CardDescription>View and manage individual citizen rewards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Select Citizen
            </label>
            <select
              value={selectedCitizen}
              onChange={(e) => setSelectedCitizen(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
            >
              {Object.keys(citizenRewards).map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
          </div>

          {currentRewards && (
            <>
              {/* Tier and Points */}
              <div className={`rounded-xl bg-gradient-to-r ${getTierColor(currentRewards.current_tier)} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm opacity-90">Current Tier</p>
                    <p className="text-3xl font-bold">{currentRewards.current_tier}</p>
                  </div>
                  <Star className="h-12 w-12 opacity-80" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm opacity-90">Total Points</p>
                    <p className="text-2xl font-bold">{currentRewards.total_points}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Tax Discount</p>
                    <p className="text-2xl font-bold">{currentRewards.discount_percentage}%</p>
                  </div>
                </div>
              </div>

              {/* Recent Rewards */}
              <div>
                <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">Recent Rewards ({currentRewards.rewards_count})</h3>
                <div className="space-y-2">
                  {currentRewards.recent_rewards.map((reward) => (
                    <div
                      key={reward.id}
                      className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700"
                    >
                      <span className="text-xl flex-shrink-0">{getRewardIcon(reward.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-slate-900 dark:text-white truncate">{reward.type}</p>
                          <Badge className="bg-blue-600 flex-shrink-0">+{reward.points} pts</Badge>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{reward.description}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{reward.earned_date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-slate-200 dark:border-slate-700">
                <Button className="flex-1 gap-2 bg-green-600 hover:bg-green-700">
                  <Gift className="h-4 w-4" />
                  Add Reward
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <TrendingUp className="h-4 w-4" />
                  View History
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
