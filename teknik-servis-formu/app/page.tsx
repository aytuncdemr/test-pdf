import Buttons from "@/components/Buttons";
import Login from "@/components/LoginForm";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Home() {
	return (
		<main className="min-h-screen">
			<section className="main-section py-12 px-4">
				<Login></Login>
			</section>
		</main>
	);
}
