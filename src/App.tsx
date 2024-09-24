import { InputNumber, Row, Col, Slider, Form, Tooltip, Layout } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import Chart from "./components/Chart.tsx";
import { useMemo, useState } from "react";
import type { PlanConfig, CalculatedPlatformPlan } from "./strategies/types.ts";
import { calculatePlatformPlan } from "./strategies/index.ts";
import platforms from "./strategies/platforms.ts";
import Footer from "./components/Footer.tsx";
import Header from "./components/Header.tsx";

function App() {
	const [plan, setPlan] = useState<PlanConfig>({
		years: 14,
		baseInvestment: 30000,
		monthlyInvestment: 8000,
		averageAnnualReturn: 9.5,
		numberOfProducts: 8,
	});
	const [currency] = useState<string>("Kč");

	const calculatedPlatformPlans = useMemo(() => {
		const plans: CalculatedPlatformPlan[] = [];
		for (const platform in platforms) {
			const calculated = calculatePlatformPlan(plan, platforms[platform]);

			plans.push(calculated);
		}

		return plans;
	}, [plan]);

	const handleInputChange = (key: keyof PlanConfig, value: number) => {
		setPlan((prevPlan) => ({ ...prevPlan, [key]: value }));
	};

	return (
		<Layout className="max-w-screen-xl mx-auto bg-white">
			<Header />

			<Layout.Content>
				<h1 className="text-3xl mb-10 font-bold text-center">Investment Growth Over {plan.years} Years</h1>

				<Chart data={calculatedPlatformPlans} currency={currency} />

				<Form layout="vertical">
					<Form.Item
						label={
							<span>
								Base Investment{" "}
								<Tooltip title="The one-time investment you plan to make.">
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
								<Tooltip title="The expected average annual return rate.">
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
							addonAfter="%"
						/>
					</Form.Item>
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
							<Col span={8}>
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
					{/* <Form.Item label={<span>Currency <Tooltip title="Currency used for the visualization (does not affect calculations)."><QuestionCircleOutlined /></Tooltip></span>}>
					<Col span={2}>
					<Input
						value={currency}
						onChange={event => setCurrency(event.target.value)}
					/>
					</Col>
				</Form.Item> */}
					<Form.Item
						label={
							<span>
								Number of investment products{" "}
								<Tooltip title="The number of investment products you plan to have in your portfolio (e.g. number of ETFs). This affects the IBKR fee.">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
					>
						<InputNumber
							min={1}
							step={1}
							value={plan.numberOfProducts}
							onChange={(value) => value != null && handleInputChange("numberOfProducts", value)}
						/>
					</Form.Item>
				</Form>
			</Layout.Content>

			<Footer />
		</Layout>
	);
}

export default App;
