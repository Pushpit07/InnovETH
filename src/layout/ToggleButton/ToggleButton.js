import styles from "../../../styles/ToggleButton/ToggleButton.module.css";

export default function ToggleButton({ toggleState, setToggleState }) {
	return (
		<label className={styles.switch}>
			<input type="checkbox" checked={toggleState} onChange={(e) => setToggleState(e.target.checked)} />
			<span className={`${styles.round} ${styles.slider}`}></span>
		</label>
	);
}
