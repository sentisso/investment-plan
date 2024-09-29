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

			<Row gutter={16} className="mb-2">
				{Object.values(platforms).map((platform) => (
					<Col xs={24} sm={12} lg={8} xl={6} key={platform.name}>
						<Card
							className="mb-4"
							title={
								platform.logo ? (
									<img
										src={`${import.meta.env.BASE_URL}${platform.logo}`}
										draggable="false"
										className="max-w-40 max-h-8"
									/>
								) : (
									<h3 className="text-lg font-bold">{platform.name}</h3>
								)
							}
							extra={
								platform.url && (
									<a href={platform.url} target="_blank" className="text-blue-500">
										source
									</a>
								)
							}
						>
							<p>
								<strong>Fixed fee:</strong> {getFeeValue(platform.fees.fixedFee, currency)}
							</p>
							<p>
								<strong>Percentage fee:</strong> {getFeeValue(platform.fees.percentageFee, "%")}
							</p>
							<p>
								<strong>Annual percentage fee:</strong> {getFeeValue(platform.fees.annualPercentageFee, "% p.a.")}
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
