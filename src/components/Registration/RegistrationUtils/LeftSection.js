import styles from "../../../../styles/Registration/Company.module.css";

export default function LeftSection(props) {
    return <div className={styles["register__container--left-section"]}>{props.children}</div>;
}
