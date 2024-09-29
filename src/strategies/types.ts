export type DynamicFee = (plan: PlanConfig, portfolioValue: number, totalInvested: number) => number;

export interface PlanConfigPortfolio {
	name: string;
	allocation: number;
	isCash?: boolean;
}

export interface PlanConfig {
	years: number;
	baseInvestment: number;
	monthlyInvestment: number;
	averageAnnualReturn: number;
	numberOfInstruments: number;
	portfolio: PlanConfigPortfolio[];
}

export interface PlatformConfig {
	name: string;
	color: string;
	logo?: string;
	url?: string;
	fees: {
		fixedFee: number | DynamicFee;
		// usually currency conversion fees
		percentageFee: number | DynamicFee;
		annualPercentageFee: number | DynamicFee;
	};
}

export interface CalculatedPlatformPlan {
	plan: PlanConfig;
	platform: PlatformConfig;
	portfolioValues: number[];
	investedValues: number[];
}

export type PlatformsConfig = Record<string, PlatformConfig>;
