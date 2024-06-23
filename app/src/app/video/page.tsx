"use client";
import Webcam from "react-webcam";
import styles from "./page.module.scss";

import Chip from '@mui/material/Chip';
import React, { createRef, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const speech = `I am happy to join with you today in what will go down in history as the greatest demonstration for freedom in the history of our nation.
Five score years ago a great American in whose symbolic shadow we stand today signed the Emancipation Proclamation. This momentous decree came as a great beckoning light of hope to millions of Negro slaves who had been seared in the flames of withering injustice. It came as a joyous daybreak to end the long night of their captivity.
But one hundred years later the Negro is still not free. One hundred years later the life of the Negro is still sadly crippled by the manacles of segregation and the chains of discrimination.
One hundred years later the Negro lives on a lonely island of poverty in the midst of a vast ocean of material prosperity.
One hundred years later the Negro is still languishing in the comers of American society and finds himself in exile in his own land.
We all have come to this hallowed spot to remind America of the fierce urgency of now. Now is the time to rise from the dark and desolate valley of segregation to the sunlit path of racial justice. Now is the time to change racial injustice to the solid rock of brotherhood. Now is the time to make justice ring out for all of God’s children.
There will be neither rest nor tranquility in America until the Negro is granted citizenship rights.
We must forever conduct our struggle on the high plane of dignity and discipline. We must not allow our creative protest to degenerate into physical violence. Again and again we must rise to the majestic heights of meeting physical force with soul force.
And the marvelous new militarism which has engulfed the Negro community must not lead us to a distrust of all white people, for many of our white brothers have evidenced by their presence here today that they have come to realize that their destiny is part of our destiny.
So even though we face the difficulties of today and tomorrow I still have a dream. It is a dream deeply rooted in the American dream.
I have a dream that one day this nation will rise up and live out the true meaning of its creed: ‘We hold these truths to be self-evident; that all men are created equal.”
I have a dream that one day on the red hills of Georgia the sons of former slaves and the sons of former slave owners will be able to sit together at the table of brotherhood.
I have a dream that one day even the state of Mississippi, a state sweltering with the heat of injustice, sweltering with the heat of oppression, will be transformed into an oasis of freedom and justice.
I have a dream that little children will one day live in a nation where they will not be judged by the color of their skin but by the content of their character.
I have a dream today.
I have a dream that one day down in Alabama, with its vicious racists, with its Governor having his lips dripping with the words of interposition and nullification, one day right there in Alabama little black boys and black girls will be able to join hands with little white boys and white girls as sisters and brothers.
I have a dream today.
I have a dream that one day every valley shall be exalted, every hill and mountain shall be made low, the rough places plains, and the crooked places will be made straight, and before the Lord will be revealed, and all flesh shall see it together.
This is our hope. This is the faith that I go back to the mount with. With this faith we will be able to hew out of the mountain of despair a stone of hope. With this faith we will be able to transform the genuine discords of our nation into a beautiful symphony of brotherhood. With this faith we will be able to work together, pray together; to struggle together, to go to jail together, to stand up for freedom forever, )mowing that we will be free one day.
And I say to you today my friends, let freedom ring. From the prodigious hilltops of New Hampshire, let freedom ring. From the mighty mountains of New York, let freedom ring. From the mighty Alleghenies of Pennsylvania!
Let freedom ring from the snow capped Rockies of Colorado!
Let freedom ring from the curvaceous slopes of California!
But not only there; let freedom ring from the Stone Mountain of Georgia!
Let freedom ring from Lookout Mountain in Tennessee!
Let freedom ring from every hill and molehill in Mississippi. From every mountainside, let freedom ring.
And when this happens, when we allow freedom to ring, when we let it ring from every village and hamlet, from every state and every city, we will be able to speed up that day when all of God’s children, black men and white men, Jews and Gentiles, Protestants and Catholics, will be able to join hands and sing in the words of the old Negro spiritual, “Free at last! Free at last! Thank God almighty, we’re free at last!”
`;

const Emotion = ({
    key_,
    name,
    value,
}: {
    key_: number;
    name: string;
    value: number;
}) => {
    return <Chip key={key_} label={`${name} ${value}`} variant="outlined" 
    sx={{
        marginRight: 1, marginTop: 1
    }}
/>;
};

const Emotion2 = ({
    key_,
    name,
    value,
}: {
    key_: number;
    name: string;
    value: number;
}) => {
    const colors = [
        "hsl(24.6 95% 53.1%)",
        "hsl(142.1 76.2% 36.3%)",
        "hsl(262.1 83.3% 57.8%)"
    ];

    return (
        <div className={styles.emotion}>
            <h5>{name}</h5>
            <div style={{ width: 350 * Math.min(value, 1), backgroundColor: colors[key_] }} className={styles.bar}/>
            {
                value > 0.4 ?
                <p><strong>{value}</strong></p> :
                <p>{value}</p>
            }
        </div>
    );
};

export default function VideoPage() {

    const title = "I Have a Dream";
    const author = "Martin Luther King Jr.";

    const expressionData = {
        calmness: 0.75,
        concentration: 0.62,
        boredom: 0.35,
    } as Record<string, number>;

    // Convert the object to an array of [key, value] pairs
    const sortedEntries = Object.entries(expressionData).sort(([, a], [, b]) => b - a);
    console.log(sortedEntries);

    console.log({speech});

    const [displayVideo, setDisplayVideo] = useState(false);

    const speechLines = speech.split("\n");

    const parentRef = useRef<any>(null);
    const parentRef2 = useRef<any>(null);
    const paraRef = useRef<any[]>(speechLines.map(() => createRef()));
    const paraRef2 = useRef<any[]>(speechLines.map(() => createRef()));

    useEffect(() => {
        console.log({paraRef});

        const onScroll = () => {
            // let prev = -parentRef?.current?.scrollTop;
            let prev = 0;
            paraRef.current.map((ref, i) => {
                if (paraRef2.current[i] && paraRef2.current[i].current) {
                    // paraRef2.current[i].current.style.marginTop = `${prev}px`;
                    paraRef2.current[i].current.style.marginTop = 0;
                    paraRef2.current[i].current.style.marginBottom = '20px';
                    paraRef2.current[i].current.style.height = `${ref.current.getBoundingClientRect().height}px`;
                }
                prev += ref.current.getBoundingClientRect().height + 20;
            });
            parentRef2.current.scrollTop = parentRef.current.scrollTop;
            console.log('scroll', parentRef?.current?.scrollTop, parentRef2.current.scrollTop);
        }

        // clean up code
        onScroll();
        parentRef?.current?.removeEventListener('scroll', onScroll);
        parentRef?.current?.addEventListener('scroll', onScroll);
        return () => parentRef?.current?.removeEventListener('scroll', onScroll);
    }, [parentRef]);

    const lines = 26;
    const emotionContext = [
        "",
        "calmness",
        "concentration",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ];

    return (
        <div className={styles.container}>
            <div className={styles.left}>
                <div className={styles.heading}>
                    <h2>{title}</h2>
                    <h6>by <span>{author}</span></h6>
                </div>
                <div className={styles.videoUI} onClick={() => setDisplayVideo((obj) => !obj)}>
                    {displayVideo && <Webcam
                        audio={true}
                        height={720}
                        // screenshotFormat="image/jpeg"
                        width={1280}
                        videoConstraints={{
                            width: 1280,
                            height: 720,
                            facingMode: 'user',
                        }}
                        style={{ borderRadius: '7px' }}
                        mirrored
                    />}
                </div>
                <div className={styles.express}>
                    <h2>Facial Expressions</h2>
                    {sortedEntries.map((obj, i) =>
                        <Emotion2 key_={i} name={obj[0]} value={obj[1]}/>)}
                </div>
            </div>
            <div className={styles.right}>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Button asChild style={{padding: '0 20px', marginTop: 3, height: 38}}>
                        <Link href="/form">Back</Link>
                    </Button>
                    <Button asChild style={{marginLeft: 'auto', padding: '0 20px', marginTop: 3, height: 38}}>
                        <Link href="/stats">Next</Link>
                    </Button>
                </div>

                <div className={styles.script}>
                    <div ref={parentRef} className={styles.scriptSection}>
                        {speech.split('\n').map((item, index) => (
                            <span ref={paraRef.current[index]} key={index}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
                <div className={styles.scriptFooter}>
                    <Chip label="Words: 650/1320" variant="outlined"/>
                </div>
            </div>
            <div className={styles.context}>
                <div ref={parentRef2} className={styles.scriptSection2}>
                    {emotionContext.map((item, index) => (
                        <div ref={paraRef2.current[index]} key={index} style={{marginTop: 2000}}>
                            {item}
                        </div>
                    ))}
                    <div style={{height: 2000}}/>
                </div>
            </div>

        </div>
    )
}
