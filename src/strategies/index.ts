import type { CalculatedPlatformPlan, PlanConfig, PlatformConfig, DynamicFee } from "./types.ts";

const getFee = (plan: PlanConfig, portfolioValue: number, func: number | DynamicFee): number => {
	if (typeof func === "function") {
		return func(plan, portfolioValue);
	}

	return func;
};

const getInvestmentAfterFees = (
	investment: number,
	portfolioValue: number,
	plan: PlanConfig,
	platform: PlatformConfig,
) => {
	const fixedFee = getFee(plan, portfolioValue, platform.fees.fixedFee);
	const percentageFee = getFee(plan, portfolioValue, platform.fees.percentageFee) / 100;

	return investment * (1 - percentageFee) - fixedFee;
};

const getPortfolioValueAfterFees = (portfolioValue: number, plan: PlanConfig, platform: PlatformConfig) => {
	const annualPercentageFee = getFee(plan, portfolioValue, platform.fees.annualPercentageFee) / 100;
	const monthlyPercentageFee = annualPercentageFee / 12;

	return portfolioValue * (1 - monthlyPercentageFee);
};

export const calculatePlatformPlan = (plan: PlanConfig, platform: PlatformConfig): CalculatedPlatformPlan => {
	const averageMonthlyReturn = (1 + plan.averageAnnualReturn / 100) ** (1 / 12);

	// month "0" is the base investment
	const totalInvested = [getFee(plan, 0, plan.baseInvestment)];
	const portfolioValues = [getInvestmentAfterFees(plan.baseInvestment, 0, plan, platform)];

	for (let i = 0; i < plan.years * 12; i++) {
		const investment = getInvestmentAfterFees(plan.monthlyInvestment, portfolioValues[i], plan, platform);

		const portfolioValue =
			getPortfolioValueAfterFees(portfolioValues[i] * averageMonthlyReturn, plan, platform) + investment;

		totalInvested.push(Math.round(totalInvested[i] + plan.monthlyInvestment));
		portfolioValues.push(Math.round(portfolioValue));
	}

	return {
		plan,
		platform,
		portfolioValues,
		investedValues: totalInvested,
	};
};
