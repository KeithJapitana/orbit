import { PLANS, type PlanTier } from "./stripe";

export interface SubscriptionLimit {
  workspaces: number;
  boards: number;
  members: number;
}

export function getPlanLimits(tier: PlanTier): SubscriptionLimit {
  const plan = PLANS[tier];
  return {
    workspaces: plan.workspaces,
    boards: plan.boards,
    members: plan.members,
  };
}

export function canCreateWorkspace(
  tier: PlanTier,
  currentCount: number
): boolean {
  return currentCount < PLANS[tier].workspaces;
}

export function canCreateBoard(
  tier: PlanTier,
  currentCount: number
): boolean {
  return currentCount < PLANS[tier].boards;
}

export function canInviteMember(
  tier: PlanTier,
  currentCount: number
): boolean {
  return currentCount < PLANS[tier].members;
}

export function getUpgradeMessage(
  tier: PlanTier,
  resource: string
): string {
  if (tier === "free") {
    return `You've reached the Free plan limit for ${resource}. Upgrade to Lite for more.`;
  }
  if (tier === "lite") {
    return `You've reached the Lite plan limit for ${resource}. Upgrade to Pro for unlimited.`;
  }
  return `Limit reached for ${resource}.`;
}
