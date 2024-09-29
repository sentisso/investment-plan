import { AntDesignOutlined, JavaScriptOutlined } from "@ant-design/icons";
import { Layout } from "antd";

export default function Footer() {
	return (
		<Layout.Footer className="bg-white">
			<p className="text-center text-sm text-gray-500 mb-3">
				Disclaimer: This tool is for illustrative purposes only. The actual returns may vary, as the calculated fees are
				simplified due to their complexity across different platforms. I did my best to account for this (e.g., European
				markets generally have higher fees, with minimum fixed fees being up to three times higher in some cases (see
				Degiro, SAXO...)). This tool primarily focuses on US markets due to better comparability of the platforms. The
				tool does not take into account taxes, inflation, or other factors that may affect the investment. The tool is
				not investment advice.
			</p>

			<p className="text-center text-sm text-gray-500">
				Built with{" "}
				<a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
					React <JavaScriptOutlined />
				</a>{" "}
				and{" "}
				<a href="https://ant.design/" target="_blank" rel="noopener noreferrer">
					Ant Design <AntDesignOutlined />
				</a>
				.
			</p>
		</Layout.Footer>
	);
}
