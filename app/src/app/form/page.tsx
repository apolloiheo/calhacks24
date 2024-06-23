"use client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "./FormPage.module.scss";

import { Input } from "@/components/ui/input"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Checkbox, FormControlLabel, FormGroup, TextareaAutosize, Typography } from "@mui/material";
import { emotions, prefilledSpeeches } from "../jank/Vars";
import { Label } from "@/components/ui/label";

import { styled } from '@mui/system';
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function MinHeightTextarea({
    disabled = false,
    text,
    setText,
}: {
    disabled?: boolean;
    text: string;
    setText: Dispatch<SetStateAction<string>>;
}) {
  const blue = {
    100: '#DAECFF',
    200: '#b6daff',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
    900: '#003A75',
  };

  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };

  const Textarea = styled(TextareaAutosize)(
    ({ theme }) => `
    box-sizing: border-box;
    width: 400px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    font-family: system-ui, -apple-system;

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `,
  );

  return (
    <Textarea aria-label="minimum height" minRows={23} maxRows={23} placeholder="Minimum 3 rows" disabled={disabled}
        value={text} onChange={(e) => setText(e.target.value)}/>
  );
}

export default function FormPage() {
    const [label, setLabel] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [text, setText] = useState("");
    const [expressions, setExpressions] = useState<boolean[]>(emotions.map((obj) => false));

    useEffect(() => {
        if (["", "custom"].includes(label)) {
            setTitle("");
            setAuthor("");
            setText("");
            return;
        }
        const obj: any = prefilledSpeeches.find((obj) => obj.title === label);
        setTitle(obj.title);
        setAuthor(obj.author);
        setText(obj.speech.replace(/\n/g, '\n\n'));
    }, [label]);

    useEffect(() => {
        localStorage.setItem('title', title);
        localStorage.setItem('author', author);
        localStorage.setItem('text', text);
        localStorage.setItem('expressions', JSON.stringify(expressions));
    }, [title, author, text, expressions]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                Select Speech
            </div>
            <div className={styles.col}>
                {/* <div className="text-lg font-semibold mb-1">Select a Speech</div> */}
                <Select onValueChange={(value: string) => setLabel(value)}>
                    <SelectTrigger className="w-[220px]">
                        <SelectValue placeholder="Select a Speech" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="custom">Custom Speech</SelectItem>
                        <SelectGroup>
                        <SelectLabel>Titular</SelectLabel>
                        {prefilledSpeeches.map((obj, i) =>
                            <SelectItem key={i} value={obj.title}>{obj.title}</SelectItem>)}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="font-semibold mt-6 mb-1">Title</div>
                <Input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                <div className="font-semibold mt-6 mb-1">Author</div>
                <Input placeholder="author" value={author} onChange={(e) => setAuthor(e.target.value)}/>
                <div className="font-semibold mt-6 mb-1">Select Emotions (select 3)</div>
                {/* <Input placeholder="title" value={title} /> */}
                <FormGroup style={{marginTop: 10}}>
                    {emotions.map((obj, i) =>
                        <FormControlLabel key={i} control={<Checkbox value={obj} color="primary" 
                            checked={expressions[i]}
                            onChange={(e) => setExpressions([...expressions.slice(0, i), e.target.checked, ...expressions.slice(i+1)])}
                        />}
                            label={<span className={styles.checkbox}>{obj}</span>}
                            style={{ marginTop: -10 }}
                        />
                    )}
                </FormGroup>
            </div>
            <div className={styles.col}>
                <Button style={{ width: 80, display: 'fixed', position: 'fixed',
                    marginTop: -35, marginLeft: 320 }} asChild><Link href="/video">Next</Link></Button>
                <Label style={{marginBottom: 10}} htmlFor="message">Script</Label>
                <MinHeightTextarea text={text} setText={setText}/>
            </div>
        </div>
    )
}