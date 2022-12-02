import { useTheme } from "next-themes";
import styles from "../../../../styles/Registration/Artist.module.css";

export default function RightSection(props) {
    const { theme } = useTheme();

    return <div className={styles[theme === "dark" ? "register__container--right-section_B" : "register__container--right-section_W"]}>{props.children}</div>;
}
