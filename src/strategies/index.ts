import type { CalculatedPlatformPlan, PlanConfig, PlatformConfig, DynamicFee } from "./types.ts";

export const calculatePlatformPlan = (plan: PlanConfig, platform: PlatformConfig): CalculatedPlatformPlan => {
	// defining the functions here for ease of parameter passing
	/**
	 * Get the dynamic fee.
	 */
	const getFee = (func: number | DynamicFee, portfolioValue: number, totalInvested: number): number => {
		if (typeof func === "function") {
			return func(plan, portfolioValue, totalInvested);
		}

		return func;
	};

	/**
	 * Calculate the actual investment after fees.
	 */
	const getInvestmentAfterFees = (investment: number, portfolioValue: number, totalInvested: number) => {
		const fixedFee = getFee(platform.fees.fixedFee, portfolioValue, totalInvested);
		const percentageFee = getFee(platform.fees.percentageFee, portfolioValue, totalInvested) / 100;

		return investment * (1 - percentageFee) - fixedFee;
	};

	/**
	 * Calculate the portfolio value after fees.
	 */
	const getPortfolioValueAfterFees = (portfolioValue: number, totalInvested: number) => {
		const annualPercentageFee = getFee(platform.fees.annualPercentageFee, portfolioValue, totalInvested) / 100;
		const monthlyPercentageFee = annualPercentageFee / 12;

		return portfolioValue * (1 - monthlyPercentageFee);
	};

	// begin calculation...

	const averageMonthlyReturn = (1 + plan.averageAnnualReturn / 100) ** (1 / 12);

	// month "0" is the base investment
	const totalInvested = [getFee(plan.baseInvestment, 0, 0)];
	const portfolioValues = [getInvestmentAfterFees(plan.baseInvestment, 0, 0)];

	for (let i = 0; i < plan.years * 12; i++) {
		const investment = getInvestmentAfterFees(plan.monthlyInvestment, portfolioValues[i], totalInvested[i]);

		const portfolioValue =
			getPortfolioValueAfterFees(portfolioValues[i] * averageMonthlyReturn, totalInvested[i]) + investment;

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
