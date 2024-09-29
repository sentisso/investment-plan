import type { CalculatedPlatformPlan, PlanConfig, PlatformConfig, DynamicFee } from "./types.ts";

export const USD_TO_CZK = 22.52;
export const EUR_TO_CZK = 25.16;

export const calculatePercentageFeeWithFixedMinimum = (
	plan: PlanConfig,
	percentageFee: number,
	minimumFee: number,
	investment?: number,
) => {
	if (plan.numberOfInstruments) return plan.numberOfInstruments * minimumFee;

	// plan percentage fee is subtracted first, we need to simulate it here (usually a currency conversion)
	const investedAmount = investment ?? plan.monthlyInvestment;

	let totalFees = 0;
	for (const instrument of plan.portfolio) {
		// no fees for cash reserve
		if (instrument.isCash) continue;

		const amount = investedAmount * (instrument.allocation / 100);
		const fee = amount * (percentageFee / 100);

		totalFees += Math.max(minimumFee, fee);
	}

	return totalFees;
};

/**
 * Calculate the investment after percentage and fixed fees.
 * @note Percentage fee is subtracted first.
 */
export const getInvestmentAfterFees = (investment: number, percentageFee: number, fixedFee: number) => {
	return investment * (1 - percentageFee / 100) - fixedFee;
};

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
	const getPlanInvestmentAfterFees = (investment: number, portfolioValue: number, totalInvested: number) => {
		const fixedFee = getFee(platform.fees.fixedFee, portfolioValue, totalInvested);
		const percentageFee = getFee(platform.fees.percentageFee, portfolioValue, totalInvested);

		return getInvestmentAfterFees(investment, percentageFee, fixedFee);
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
	const portfolioValues = [getPlanInvestmentAfterFees(plan.baseInvestment, 0, 0)];

	for (let i = 0; i < plan.years * 12; i++) {
		const investment = getPlanInvestmentAfterFees(plan.monthlyInvestment, portfolioValues[i], totalInvested[i]);

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
