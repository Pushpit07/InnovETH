import { useTheme } from "next-themes";
import CompanyOrInnovator from "./RegistrationUtils/CompanyOrInnovator";
import styles from "../../../styles/Registration/Register.module.css";
import Image from "next/image";
import illustrationLight from "../../../public/assets/registration/white_MXV.svg";
import illustrationDark from "../../../public/assets/registration/dark_MXV.svg";

export default function Register() {
	const { theme } = useTheme();

	return (
		<div className={styles["register"]}>
			<div className={"dark:bg-dark-800 " + styles["register__container"]}>
				{/* Left section */}
				<div className={styles["register__container--left-section"]}>
					<p className={styles["container__left-section--intro-text"]}>LET&apos;S REVOLUTIONIZE THE INDUSTRY TOGETHER!</p>
					{/* <div className={styles["container__left-section--asset-image"]}>
						<Image
							src={theme === "dark" ? illustrationLight : illustrationDark}
							// objectFit="contain"
							layout="responsive"
							alt="music illustration"
							priority
						/>
					</div> */}
				</div>

				{/* Right section */}
				<div className={styles["register__container--right-section_W"]}>
					<CompanyOrInnovator />
				</div>
			</div>
		</div>
	);
}
