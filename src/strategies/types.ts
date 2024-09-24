export type DynamicFee = (plan: PlanConfig, portfolioValue: number) => number;

export interface PlanConfig {
	years: number;
	baseInvestment: number;
	monthlyInvestment: number;
	averageAnnualReturn: number;
	numberOfProducts: number;
}

export interface PlatformConfig {
	name: string;
	color: string;
	fixedFee: number | DynamicFee;
	// usually currency conversion fees
	percentageFee: number | DynamicFee;
	annualPercentageFee: number | DynamicFee;
}

export interface CalculatedPlatformPlan {
	plan: PlanConfig;
	platform: PlatformConfig;
	portfolioValues: number[];
	investedValues: number[];
}

export type PlatformsConfig = Record<string, PlatformConfig>;
