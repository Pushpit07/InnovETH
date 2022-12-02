import styles from "../../../styles/PageNotFound/PageNotFound.module.css";

function PageNotFound() {
	return (
		<div className={styles["page_not_found_container"]}>
			<div className={styles["wrapper"]}>
				<div className={styles["page-wrapper"]}>
					<div className={styles["needle-wrapper"]}>
						<div className={styles["base"]}></div>
						<div className={styles["lines"]}>
							<div className={styles["vertical"]}></div>
							<div className={styles["horizontal"]}></div>
						</div>
					</div>
					<div className={styles["disk-wrapper"]}>
						<div className={styles["light-left"]}></div>
						<div className={styles["light-right"]}></div>
						<div className={styles["disk"]}>
							<div className={styles["half-circle-top"]}></div>
							<div className={styles["half-circle-bottom"]}></div>
							<div className={styles["separator"]}></div>
							<div className={styles["inner-circle"]}>
								<span>4</span>
								<div className={styles["dot"]}></div>
								<span>4</span>
							</div>
						</div>
					</div>
				</div>
				<div className={styles["error"]}>Uh oh! Looks like we&apos;ve skipped a beat </div>
			</div>
		</div>
	);
}

export default PageNotFound;
