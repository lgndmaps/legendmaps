import React, { useEffect } from "react";
import * as ReactDOM from "react-dom";
import MarkdownIt from "markdown-it";
// import style manually
import "react-markdown-editor-lite/lib/index.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import Button from "../ui/Button";
import { updateAdventurerDescription } from "../../../util/api/endpoints";
import { css } from "@emotion/react";
import Turndown from "turndown";

const turndown = new Turndown();
const mdParser = new MarkdownIt(/* Markdown-it options */);
const MdEditor = dynamic(() => import("react-markdown-editor-lite"), {
    ssr: false,
});

export type DescriptionEditorProps = {
    tokenId: number;
    description: string;
};

export const DescriptionEditor = ({ tokenId, description }: DescriptionEditorProps) => {
    const [value, setValue] = useState(turndown.turndown(description));
    const [text, setText] = useState(description);
    const [saving, setSaving] = useState(false);
    const [previewing, setPreviewing] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean | null>(null);

    const handleEditorChange = ({ html, text }) => {
        setText(html);
        setValue(text);
    };
    const onSubmit = async () => {
        setSaving(true);
        const response = await updateAdventurerDescription(tokenId, text);
        if (response.tokenId) {
            setSuccess(true);
        } else {
            setSuccess(false);
        }
        setTimeout(() => {
            setSuccess(null);
        }, 1500);
        setSaving(false);
    };
    return (
        <div>
            {previewing ? (
                <div
                    css={css`
                        margin: 15px;
                    `}
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            ) : (
                <MdEditor
                    plugins={[
                        "header",
                        "full-screen",
                        "font-bold",
                        "font-italic",
                        "font-strikethrough",
                        "font-underline",
                        "block-quote",
                        "block-wrap",
                        "divider-index",
                        "list-ordered",
                        "list-unordered",
                        "mode-toggle",
                    ]}
                    value={value}
                    style={{ height: "500px" }}
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            )}

            <div
                css={css`
                    padding: 25px;
                    display: flex;
                `}
            >
                <Button disabled={saving} onClick={onSubmit}>
                    {saving ? "Saving Lore..." : "Save"}
                </Button>
                <Button
                    css={css`
                        margin-left: 15px;
                    `}
                    onClick={() => setPreviewing(!previewing)}
                >
                    {previewing ? "Edit" : "Preview"}
                </Button>
            </div>
            <div
                css={css`
                    padding: 0 15px 15px;
                    height: 50px;
                `}
            >
                {success === true ? (
                    <span
                        css={css`
                            color: green;
                        `}
                    >
                        Lore Saved
                    </span>
                ) : (
                    success === false && (
                        <span
                            css={css`
                                color: red;
                            `}
                        >
                            Something went wrong
                        </span>
                    )
                )}
            </div>
        </div>
    );
};
