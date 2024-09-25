import type { PlanConfig, PlatformsConfig } from "./types";

const USD_TO_CZK = 22.52;
const EUR_TO_CZK = 25.16;

const platforms: PlatformsConfig = {
	edward: {
		name: "Edward (Kos)",
		color: "#ffcb13",
		fees: {
			fixedFee: 0,
			percentageFee: 0,
			annualPercentageFee: 1.99,
		},
	},
	portu: {
		name: "Portu",
		color: "#00a03c",
		logo: "/platforms/portu.svg",
		fees: {
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
	},
	partners: {
		name: "Partners",
		color: "#5fc3d1",
		logo: "/platforms/partners.png",
		fees: {
			fixedFee: (plan: PlanConfig, _: number, totalInvested: number) => {
				// the "total fixed fee" is being gradually paid-off by monthly investments
				// where 40% of the investment is used to pay off the "debt" and the remaining 60% is actually invested
				// after the debt is paid off, all the remaining investments are invested with 0% fees

				const plannedInvestments = plan.baseInvestment + plan.monthlyInvestment * plan.years * 12;
				const totalFixedFee = plannedInvestments * 0.045;
				const paidOff = totalInvested * 0.4;
				const remaining = totalFixedFee - paidOff;

				if (remaining <= 0) return 0;

				if (totalInvested > 0) return Math.min(remaining, plan.monthlyInvestment * 0.4);

				return Math.min(remaining, plan.baseInvestment * 0.4);
			},
			percentageFee: 0,
			annualPercentageFee: 0,
		},
	},
	patria: {
		name: "Patria",
		color: "#f59100",
		logo: "/platforms/patria.png",
		fees: {
			fixedFee: 0,
			percentageFee: 0.8,
			annualPercentageFee: 0,
		},
	},
	xtb: {
		name: "xtb",
		color: "#f73e4a",
		logo: "/platforms/xtb.svg",
		fees: {
			fixedFee: 0,
			percentageFee: 0.5,
			annualPercentageFee: 0,
		},
	},
	t212: {
		name: "T212",
		color: "#00a7e1",
		logo: "/platforms/t212.png",
		fees: {
			fixedFee: 0,
			percentageFee: 0.15, // currency conversion
			annualPercentageFee: 0,
		},
	},
	ibkr: {
		name: "IBKR",
		color: "#d91222",
		logo: "/platforms/ibkr.svg",
		fees: {
			fixedFee: (plan: PlanConfig) => {
				return plan.numberOfProducts * USD_TO_CZK;
			},
			percentageFee: 0.03, // non-manual currency conversion
			annualPercentageFee: 0,
		},
	},
	etoro: {
		name: "eToro",
		color: "#13c636",
		logo: "/platforms/etoro.svg",
		fees: {
			fixedFee: 0,
			percentageFee: 0.75,
			annualPercentageFee: 0,
		},
	},
	degiro: {
		name: "Degiro",
		color: "#009fdf",
		logo: "/platforms/degiro.svg",
		fees: {
			fixedFee: (plan: PlanConfig) => {
				return plan.numberOfProducts * EUR_TO_CZK;
			},
			percentageFee: 0.25,
			annualPercentageFee: 0,
		},
	},
	nofees: {
		name: "0% fees",
		color: "#d0d0d0",
		fees: {
			fixedFee: 0,
			percentageFee: 0,
			annualPercentageFee: 0,
		},
	},
};

export default platforms;
