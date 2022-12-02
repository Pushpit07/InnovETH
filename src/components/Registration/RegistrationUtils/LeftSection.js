import styles from "../../../../styles/Registration/Artist.module.css";

export default function LeftSection(props) {
    return <div className={styles["register__container--left-section"]}>{props.children}</div>;
}
