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
import { Checkbox, FormControlLabel, FormGroup, Step, StepLabel, Stepper, TextareaAutosize } from "@mui/material";
import { emotions, prefilledSpeeches, steps } from "../jank/Vars";
import { Label } from "@/components/ui/label";

import { styled } from '@mui/system';
import { Button } from "@/components/ui/button";
import Link from "next/link";

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


export default function FormPage() {
    const [label, setLabel] = useState("");

    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [context, setContext] = useState("");
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
        localStorage.setItem('context', context);
        localStorage.setItem('text', text);
        if (text.trim().split("\n").length !== 1) {
          localStorage.setItem('text', text);
        } else {
          localStorage.setItem('text', text.replace(/\. /g, ". \n\n"));
        }
        localStorage.setItem('expressions', JSON.stringify(expressions));
    }, [title, author, text, expressions]);


  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

    return (
      <>
      
      <div className={styles.stepper}>
          <Stepper activeStep={0} alternativeLabel
          >
          {steps.map((label) => (
              <Step key={label}>
              <StepLabel
              sx={{
                "& .MuiStepLabel-labelContainer span": {
                  fontSize: 13
                }
              }}
              >{label}</StepLabel>
              </Step>
          ))}
          </Stepper>
          </div>
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
                {/* <MinHeightTextarea text={text} setText={setText}/> */}
                <TextareaAutosize aria-label="minimum height" minRows={23} maxRows={23} placeholder="Type your texts here"
        value={text} onChange={(e) => setText(e.target.value)}
        style={{
            boxSizing: 'border-box',
            width: '400px',
            fontSize: '0.875rem',
            fontWeight: 400,
            lineHeight: 1.5,
            padding: '8px 12px',
            borderRadius: '8px',
            color: 'grey[900]',
            background: '#fff',
            border: `1px solid ${grey[200]}`,
            boxShadow: `0px 2px 2px ${grey[50]}`,
            fontFamily: 'system-ui, -apple-system',
            ...(isHovered ? {
                borderColor: blue[400],
                boxShadow: `0 0 0 3px ${blue[200]}`,
              } : {}),
            ...(isFocused ? {
                borderColor: blue[400],
                boxShadow: `0 0 0 3px ${blue[200]}`,
                outline: 0,
              } : {}),
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
            </div>
        </div>
        </>
    )
}