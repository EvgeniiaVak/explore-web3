export const REWARD_DESCRIPTION =
  "To estimate how much we would earn from a pool, if we had a position of $100 during a year and every day was like the selected day, let's look at the ratio of fees paid to the pool's total value locked (TVL). This is a very rough estimate, as it doesn't take into account the fees paid by the liquidity providers or the active range.";

export const REWARD_HEADER = "fees / tvl * 100 * 365";

export function calculateReward(fees: number, tvl: number): number {
  return (fees / tvl) * 100 * 365;
}
