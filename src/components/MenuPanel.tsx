import { observer } from "mobx-react-lite";
import { mineStore } from "../store/mineStore.ts";
import type { ChangeEvent } from "react";
import { parseWindows1251Xml } from "../utils/parseXML.ts";

const MenuPanel = observer(() => {
    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const json = await parseWindows1251Xml(file);
            mineStore.setGraph(json.Graph);
            console.log("Распарсенный XML:", json);
        } catch (error) {
            console.error("Ошибка парсинга файла:", error);
        }
    };

    return (
        <div
            style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                padding: "8px 12px",
                backgroundColor: "#f9fafb",
                borderRadius: "6px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                fontFamily: "'Inter', sans-serif",
                color: "#374151",
                maxWidth: "360px",
            }}
        >
            <label
                htmlFor="upload-xml"
                style={{
                    cursor: "pointer",
                    padding: "6px 12px",
                    border: "1.5px solid #9ca3af",
                    borderRadius: "4px",
                    fontSize: "14px",
                    color: "#4b5563",
                    userSelect: "none",
                    transition: "background-color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                    e.currentTarget.style.borderColor = "#6b7280";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.borderColor = "#9ca3af";
                }}
            >
                Загрузить XML
            </label>
            <input
                type="file"
                accept=".xml"
                id="upload-xml"
                onChange={handleFileUpload}
                style={{ display: "none" }}
            />
            <button
                style={{
                    padding: "6px 14px",
                    fontSize: "14px",
                    cursor: "pointer",
                    backgroundColor: mineStore.isPathMode ? "#d1d5db" : "#f3f4f6",
                    color: "#374151",
                    border: "1.5px solid #9ca3af",
                    borderRadius: "4px",
                    userSelect: "none",
                    transition: "background-color 0.2s, border-color 0.2s",
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#e5e7eb";
                    e.currentTarget.style.borderColor = "#6b7280";
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = mineStore.isPathMode ? "#d1d5db" : "#f3f4f6";
                    e.currentTarget.style.borderColor = "#9ca3af";
                }}
                onClick={() => mineStore.setPathMode(!mineStore.isPathMode)}
            >
                {mineStore.isPathMode ? "Выключить режим расстояния" : "Включить режим расстояния"}
            </button>
        </div>
    );
});

export default MenuPanel;
