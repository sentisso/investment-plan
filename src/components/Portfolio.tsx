import { InputNumber, Row, Col, Form, Tooltip, Checkbox, Input, Button } from "antd";
import { PlanConfigPortfolio } from "../strategies/types.ts";
import { MinusOutlined, PlusOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";

export interface PortfolioProps {
	portfolio: PlanConfigPortfolio[];
	setPortfolio: (portfolio: PlanConfigPortfolio[]) => void;
	numberOfInstruments: number;
	setNumberOfInstruments: (numberOfInstruments: number) => void;
}

export default function Portfolio({
	portfolio,
	setPortfolio,
	numberOfInstruments,
	setNumberOfInstruments,
}: PortfolioProps) {
	const noPortfolio = numberOfInstruments > 0;

	const handleAllocationChange = (index: number, allocation: number) => {
		const prevPortfolio = [...portfolio];
		prevPortfolio[index].allocation = allocation;

		setPortfolio(prevPortfolio);
	};

	const handleNameChange = (index: number, name: string) => {
		const prevPortfolio = [...portfolio];
		prevPortfolio[index].name = name;

		setPortfolio(prevPortfolio);
	};

	const handleAddInstrument = () => {
		const prevPortfolio = [...portfolio];
		prevPortfolio.splice(prevPortfolio.length - 1, 0, { name: "", allocation: 0 });

		setPortfolio(prevPortfolio);
	};

	const handleRemoveInstrument = (index: number) => {
		const prevPortfolio = [...portfolio];
		prevPortfolio.splice(index, 1);

		setPortfolio(prevPortfolio);
	};

	const handleEqualize = () => {
		const prevPortfolio = [...portfolio];
		const equalAllocation = Math.round((100 / (prevPortfolio.length - 1)) * 100) / 100;

		prevPortfolio.forEach((item) => (item.allocation = equalAllocation));
		prevPortfolio[prevPortfolio.length - 1].allocation = 100 - equalAllocation * (prevPortfolio.length - 1);

		setPortfolio(prevPortfolio);
	};

	const handleNoPortfolioChange = () => {
		const num = portfolio.length - 1 > 0 ? portfolio.length - 1 : 8;

		setNumberOfInstruments(noPortfolio ? 0 : num);
	};

	const totalAllocation = portfolio.reduce((acc, item) => acc + item.allocation, 0);

	return (
		<div>
			<h2 className="text-2xl mb-4 font-bold">Portfolio Allocation</h2>
			<p className="mb-4">
				TIP: Defining the instruments and their allocation in your portfolio helps to calculate more accurate
				projections.{" "}
				<Tooltip
					title={
						<>
							Some brokers charge a minimum fee for each trade (each instrument requires a separate trade), e.g.{" "}
							<a href="https://www.interactivebrokers.com/en/trading/ib-api.php" target="_blank">
								IBKR
							</a>
							,{" "}
							<a href="https://www.home.saxo/rates-and-conditions/etf/commissions" target="_blank">
								SAXO
							</a>
							,{" "}
							<a href="https://www.degiro.com/uk/data/pdf/uk/UK_Feeschedule.pdf" target="_blank">
								Degiro
							</a>
							... This makes a difference with larger monthly investment.
						</>
					}
				>
					<QuestionCircleOutlined />
				</Tooltip>
			</p>

			<Form layout="vertical" className="max-w-96">
				<Checkbox checked={noPortfolio} onChange={handleNoPortfolioChange} className="mb-4">
					Don't care right now, just use the minimum fees
				</Checkbox>

				{noPortfolio && (
					<Form.Item
						label={
							<span>
								Number of financial instruments in your portfolio{" "}
								<Tooltip title="The number of financial instruments you plan to have in your portfolio (e.g. number of ETFs). This affects the minimum fees.">
									<QuestionCircleOutlined />
								</Tooltip>
							</span>
						}
					>
						<InputNumber
							min={1}
							step={1}
							value={numberOfInstruments}
							onChange={(value) => value != null && value > 0 && setNumberOfInstruments(value)}
						/>
					</Form.Item>
				)}

				<Row gutter={4} className="font-bold">
					<Col xs={2} />
					<Col xs={16}>
						<span>Instrument</span>{" "}
						<Tooltip title="Just a name. Makes no difference in the calculations.">
							<QuestionCircleOutlined />
						</Tooltip>
					</Col>
					<Col xs={6}>
						<span>Allocation</span>{" "}
						<Tooltip title="How many percent of your monthly investment goes into this instrument.">
							<QuestionCircleOutlined />
						</Tooltip>
						<Button
							type="text"
							disabled={noPortfolio}
							className="mb-1"
							title="Set all allocations to be equal"
							onClick={handleEqualize}
						>
							Equalize
						</Button>
					</Col>
				</Row>

				{portfolio.map((item, index) => (
					<Row gutter={4} key={index} className="mb-2">
						<Col xs={2}>
							{!item.isCash && (
								<Button danger type="text" icon={<MinusOutlined />} onClick={() => handleRemoveInstrument(index)} />
							)}
						</Col>
						<Col xs={16}>
							<Input
								value={item.name}
								disabled={item.isCash || noPortfolio}
								onChange={(e) => handleNameChange(index, e.target.value)}
							/>
						</Col>
						<Col xs={6}>
							<InputNumber
								value={item.allocation}
								disabled={noPortfolio}
								onChange={(value) => value != null && handleAllocationChange(index, value)}
								min={0}
								max={100}
								step={1}
								addonAfter="%"
							/>
						</Col>
					</Row>
				))}
				<Row gutter={4}>
					<Col xs={2}></Col>
					<Col xs={16}></Col>
					<Col
						xs={6}
						className={classNames("border-t", {
							"text-green-500": totalAllocation === 100,
							"text-red-500": totalAllocation !== 100,
						})}
					>
						<span className="pl-2 font-bold">{totalAllocation}%</span>
					</Col>
				</Row>
			</Form>
			<Button icon={<PlusOutlined />} type="text" disabled={noPortfolio} onClick={handleAddInstrument}>
				Add instrument
			</Button>
		</div>
	);
}
