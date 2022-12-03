import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useMoralisCloudFunction } from "react-moralis";
import Dropdown from "./ProfileUtils/Dropdown";
import styles from "../../../styles/Profile/Filter.module.css";

export default function Filter() {
	return (
		<div className={styles["filter-card"]}>
			<div className={styles["filter-card__left-section"]}>
				<Image src={"/assets/record_b.svg"} alt="vinyl disc" height={30} width={30}></Image>
				<div className="flex-grow ml-4">
					<h4 className={styles["filter-card__left-section--heading"]}>PROPOSALS</h4>
					{/* Horizontal separator */}
					<div className="my-1 flex-grow border-t-[2px] border-[#818181]"></div>
				</div>
			</div>
		</div>
	);
}
