import { Button, Layout } from "antd";
import { GithubOutlined } from "@ant-design/icons";

export default function Header() {
	return (
		<Layout.Header className="flex bg-white items-center">
			<Button
				iconPosition="end"
				icon={<GithubOutlined />}
				href="https://github.com/sentisso/investment-plan"
				target="_blank"
				className="ml-auto"
			>
				See this on GitHub
			</Button>
		</Layout.Header>
	);
}
