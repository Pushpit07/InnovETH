import styles from "../../../../styles/Registration/Company.module.css";

export default function RightSection(props) {
    return <div className={styles["register__container--right-section_W"]}>{props.children}</div>;
}
