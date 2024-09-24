import platforms from "../strategies/platforms.ts";
import { Card, Col, Row } from "antd";
import { DynamicFee } from "../strategies/types.ts";

export interface PlatformFeesProps {
	currency: string;
}

export default function PlatformFees({ currency }: PlatformFeesProps) {
	const getFeeValue = (fee: number | DynamicFee, unit: string) => {
		if (typeof fee === "function") return "Dynamic";

		return `${fee}${unit}`;
	};

	return (
		<div className="mt-14">
			<h2 className="text-2xl font-bold mb-4">Platform Fees</h2>

			<Row gutter={16}>
				{Object.keys(platforms).map((platform) => (
					<Col span={6}>
						<Card className="mb-4">
							<h3 className="text-lg font-bold">{platforms[platform].name}</h3>
							<p>
								<strong>Fixed fee:</strong> {getFeeValue(platforms[platform].fixedFee, currency)}
							</p>
							<p>
								<strong>Percentage fee:</strong> {getFeeValue(platforms[platform].percentageFee, "%")}
							</p>
							<p>
								<strong>Annual percentage fee:</strong> {getFeeValue(platforms[platform].annualPercentageFee, "% p.a.")}
							</p>
						</Card>
					</Col>
				))}
			</Row>
			<Row>
				<p>
					<strong>Fixed fee:</strong> Fee that is charged as a fixed amount for each investment, regardless of the
					amount invested.
				</p>
				<p>
					<strong>Percentage fee:</strong> Fee that is calculated as a percentage of the investment amount. Usually a
					currency conversion fee.
					<br />
					Example: investing $100 with a 0.75% fee will result in an actual investment of $99.25 after the fee is
					deducted.
				</p>
				<p>
					<strong>Annual percentage fee:</strong> Fee that is calculated as a percentage of the total portfolio value.
					Fee is paid monthly as 1/12 of the annual fee.
					<br />
					Example: 1.5% p.a. fee will be charged as 0.125% (1.5/12) of the total portfolio value each month.
				</p>
			</Row>
		</div>
	);
}
