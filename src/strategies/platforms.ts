import type { PlanConfig, PlatformsConfig } from "./types";

const USD_TO_CZK = 22.52;

const platforms: PlatformsConfig = {
	edward: {
		name: "Edward (Kos)",
		color: "#ffcb13",
		fixedFee: 0,
		percentageFee: 0,
		annualPercentageFee: 1.99,
	},
	portu: {
		name: "Portu",
		color: "#00a03c",
		fixedFee: 0,
		percentageFee: 0,
		annualPercentageFee: (plan: PlanConfig, portfolioValue: number) => {
			// see https://www.portu.cz/kolik-to-stoji

			let sale = 0;
			if (plan.years >= 15) sale = 0.4;
			else if (plan.years >= 10) sale = 0.3;
			else if (plan.years >= 7) sale = 0.25;
			else if (plan.years >= 5) sale = 0.2;

			let fee = 1;
			if (portfolioValue > 5000000) fee = 0.4;
			else if (portfolioValue > 1000000) fee = 0.6;
			else if (portfolioValue > 500000) fee = 0.8;

			return fee * (1 - sale);
		},
	},
	// partners: {
	// 	name: "Partners",
	//  color: "#5fc3d1",
	// 	fixedFee: (plan: PlanConfig, portfolioValue: number) => {
	// 		// this total fixed fee is being gradually paid-off by the monthly investments
	// 		// where 40% of the investment is used to pay off the "debt" and the remaining 60% is invested
	// 		// after the debt is paid off, the 100% of the investment is invested with 0% fees
	// 		const totalInvestedAmount = plan.baseInvestment + plan.monthlyInvestment * plan.years * 12;
	// 		const totalFixedFee = totalInvestedAmount * 0.045;

	// 		// TODO: monthly investment needs to be dynamically calculated too
	// 		return 0;
	// 	},
	// 	percentageFee: 0,
	// 	annualPercentageFee: 1.99,
	// },
	patria: {
		name: "Patria",
		color: "#f59100",
		fixedFee: 0,
		percentageFee: 0.8,
		annualPercentageFee: 0,
	},
	t212: {
		name: "T212",
		color: "#00a7e1",
		fixedFee: 0,
		percentageFee: 0.15, // currency conversion
		annualPercentageFee: 0,
	},
	ibkr: {
		name: "IBKR",
		color: "#d91222",
		fixedFee: (plan: PlanConfig) => {
			return plan.numberOfProducts * USD_TO_CZK;
		},
		percentageFee: 0.03, // non-manual currency conversion
		annualPercentageFee: 0,
	},
	nofees: {
		name: "0% fees",
		color: "#d0d0d0",
		fixedFee: 0,
		percentageFee: 0,
		annualPercentageFee: 0,
	},
};

export default platforms;
