import { AntDesignOutlined, JavaScriptOutlined } from "@ant-design/icons";
import { Layout } from "antd";

export default function Footer() {
	return (
		<Layout.Footer className="bg-white">
			<p className="text-center text-sm text-gray-500 mb-3">
				Disclaimer: This tool is for illustrative purposes only. The actual returns may vary. The tool does not take
				into account taxes, inflation, or other factors that may affect the investment. The tool is not investment
				advice.
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
