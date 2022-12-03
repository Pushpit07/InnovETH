import styles from "../../../styles/ToggleButton/ToggleButton.module.css";

export default function ToggleButtonReducer({ toggleState, setToggleState, toggleType, setCurrentFilterType }) {
	return (
		<label className={styles.switch}>
			<input
				type="checkbox"
				checked={toggleState}
				onChange={(e) => {
					setCurrentFilterType(0);
					if (toggleType) {
						setToggleState({ type: toggleType, selectedChoice: e.target.checked });
						return;
					}
					setToggleState(e.target.checked);
				}}
			/>
			<span className={`${styles.round} ${styles.slider}`}></span>
		</label>
	);
}
