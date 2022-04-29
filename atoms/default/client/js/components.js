import gsap from "gsap/gsap-core";
import {h, Component, options, Fragment} from "preact";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";
import { assetsPath } from "./store";


const setHtml = (html) => ({__html: html});

export const PillBox = (props) => {

    return (
        <div className={`pillbox ${props.className}`}>
            {props.children}
        </div>
    )
}

const Tweet = ({data}) => {
    return (
        <PillBox>
            <a className="tweet" href={data.link} target="_blank" rel="no-follow">
                <img src={`${assetsPath}/avatar.png`} />
                <div>
                    <p>{data.label}</p>
                    <p className="handle">{data.handle}</p>
                    <p dangerouslySetInnerHTML={setHtml(data.content)}></p>
                </div>
            </a>
        </PillBox>
    )
}

export const TweetList = ({data}) => {
    
    const tweets = () => {
        return data.map((v,i)=><Tweet data={v} />);
    }

    return (
        <div className="tweet-list">
            {tweets()}
        </div>
    )
}