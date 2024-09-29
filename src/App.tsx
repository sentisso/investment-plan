import { InputNumber, Row, Col, Slider, Form, Tooltip, Layout } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Chart from "./components/Chart.tsx";
import { useMemo, useRef, useState } from "react";
import type { PlanConfig, CalculatedPlatformPlan } from "./strategies/types.ts";
import { calculatePlatformPlan } from "./strategies/index.ts";
import platforms from "./strategies/platforms.ts";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";
import PlatformFees from "./components/PlatformFees.tsx";

function App() {
	const calculatedPlans = useRef<CalculatedPlatformPlan[]>([]);
	const [plan, setPlan] = useState<PlanConfig>({
		years: 14,
		baseInvestment: 30000,
		monthlyInvestment: 8000,
		averageAnnualReturn: 9.5,
		numberOfInstruments: 11,
		portfolio: [
			{
				name: "S&P 500",
				allocation: 21,
			},
			{
				name: "Nasdaq 100",
				allocation: 10,
			},
			{
				name: "Wide Moat",
				allocation: 9,
			},
			{
				name: "USA Small Cap",
				allocation: 4,
			},
			{
				name: "iShares Europe",
				allocation: 15,
			},
			{
				name: "Pacific ex-Japan",
				allocation: 3,
			},
			{
				name: "Xtrackers Japan",
				allocation: 6,
			},
			{
				name: "Amundi Asia",
				allocation: 5,
			},
			{
				name: "World Small Cap",
				allocation: 10,
			},
			{
				name: "Vanguard All-World",
				allocation: 5,
			},
			{
				name: "iShares EM IMI",
				allocation: 10,
			},
			{
				name: "Cash reserve",
				allocation: 2,
				isCash: true,
			},
		],
	});
	const [currency] = useState<string>("Kč");

	const noPortfolio = plan.numberOfInstruments === 0;
	const totalAllocation = plan.portfolio.reduce((acc, item) => acc + item.allocation, 0);

	const calculatedPlatformPlans = useMemo(() => {
		if (noPortfolio && totalAllocation !== 100) return calculatedPlans.current;

		const plans: CalculatedPlatformPlan[] = [];
		for (const platform in platforms) {
			const calculated = calculatePlatformPlan(plan, platforms[platform]);

			plans.push(calculated);
		}

		return plans;
	}, [plan, totalAllocation, noPortfolio]);

	// const setPortfolio = (portfolio: PlanConfigPortfolio[]) => {
	// 	setPlan((prevPlan) => ({ ...prevPlan, portfolio }));
	// };
	//
	// const setNumberOfInstruments = (numberOfInstruments: number) => {
	// 	setPlan((prevPlan) => ({ ...prevPlan, numberOfInstruments }));
	// };

	const handleInputChange = (key: keyof PlanConfig, value: number) => {
		setPlan((prevPlan) => ({ ...prevPlan, [key]: value }));
	};

	return (
		<Layout className="max-w-screen-xl mx-auto bg-white px-3">
			<Header />

			<Layout.Content>
				<h1 className="text-3xl mb-10 font-bold text-center">Investment Growth Over {plan.years} Years</h1>

				<Chart data={calculatedPlatformPlans} currency={currency} />

				<Form layout="vertical" className="mt-8">
					<Row>
						<Col xs={24} md={12}>
							<Form.Item
								label={
									<span>
										Base Investment{" "}
										<Tooltip title="The one-time investment of your already saved money.">
											<QuestionCircleOutlined />
										</Tooltip>
									</span>
								}
							>
								<InputNumber
									min={0}
									step={1000}
									value={plan.baseInvestment}
									onChange={(value) => value != null && handleInputChange("baseInvestment", value)}
									addonAfter={currency}
								/>
							</Form.Item>
							<Form.Item
								label={
									<span>
										Monthly Investment{" "}
										<Tooltip title="The amount of money you plan to invest each month.">
											<QuestionCircleOutlined />
										</Tooltip>
									</span>
								}
							>
								<InputNumber
									min={0}
									step={100}
									value={plan.monthlyInvestment}
									onChange={(value) => value != null && handleInputChange("monthlyInvestment", value)}
									addonAfter={currency}
								/>
							</Form.Item>
							<Form.Item
								label={
									<span>
										Average Annual Return{" "}
										<Tooltip title="Portfolio value is calculated each month based on the annual return.">
											<QuestionCircleOutlined />
										</Tooltip>
									</span>
								}
							>
								<InputNumber
									min={0}
									max={100}
									step={0.1}
									value={plan.averageAnnualReturn}
									onChange={(value) => value != null && handleInputChange("averageAnnualReturn", value)}
									addonAfter="% p.a."
								/>
							</Form.Item>
						</Col>
						<Col xs={24} lg={12}>
							<Form.Item
								label={
									<span>
										Years investing{" "}
										<Tooltip title="The number of years you plan to invest. This also affects Portu fees.">
											<QuestionCircleOutlined />
										</Tooltip>
									</span>
								}
							>
								<Row>
									<Col span={12}>
										<Slider
											min={1}
											max={50}
											onChange={(value) => value != null && handleInputChange("years", value)}
											value={plan.years}
										/>
									</Col>
									<Col span={4}>
										<InputNumber
											min={1}
											max={50}
											value={plan.years}
											onChange={(value) => value != null && handleInputChange("years", value)}
										/>
									</Col>
								</Row>
							</Form.Item>
							{/*<Form.Item*/}
							{/*	label={*/}
							{/*		<span>*/}
							{/*			Currency{" "}*/}
							{/*			<Tooltip title="Currency used for the visualization (does not affect calculations).">*/}
							{/*				<QuestionCircleOutlined />*/}
							{/*			</Tooltip>*/}
							{/*		</span>*/}
							{/*	}*/}
							{/*>*/}
							{/*	<Col span={2}>*/}
							{/*		<Input value={currency} onChange={(event) => setCurrency(event.target.value)} />*/}
							{/*	</Col>*/}
							{/*</Form.Item>*/}
							<Form.Item
								label={
									<span>
										Number of financial instruments in your portfolio{" "}
										<Tooltip title="The number of financial instruments you plan to have in your portfolio (e.g., number of ETFs) can impact your costs. Some brokers, such as IBKR, SAXO, and Degiro, charge a fixed minimum fee for each trade (as each instrument requires a separate trade). This affects the overall fixed fees.">
											<QuestionCircleOutlined />
										</Tooltip>
									</span>
								}
							>
								<InputNumber
									min={1}
									step={1}
									value={plan.numberOfInstruments}
									onChange={(value) => value != null && handleInputChange("numberOfInstruments", value)}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>

				{/*<Portfolio*/}
				{/*	portfolio={plan.portfolio}*/}
				{/*	setPortfolio={setPortfolio}*/}
				{/*	numberOfInstruments={plan.numberOfInstruments}*/}
				{/*	setNumberOfInstruments={setNumberOfInstruments}*/}
				{/*/>*/}

				<PlatformFees currency={currency} />
			</Layout.Content>
			<Footer />
		</Layout>
	);
}

export default App;
