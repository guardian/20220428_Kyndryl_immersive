import gsap from "gsap/gsap-core";
import {h, Component, options, Fragment} from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { assetsPath } from "./store";
import { IconPrev } from "./Icons";
import Carousel from 'react-elastic-carousel';


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
    
    const ref = useRef();

    const tweets = () => {
        return data.map((v,i)=><Tweet data={v} />);
    }

    const settings = {
        verticalMode: true,
        itemsToShow: 4,
        enableAutoPlay: true,
        showArrows: false,
        pagination: false

    }

    const handleNext = (e) => {
        e.preventDefault();
        ref.current.slideNext();
    }
    const handlePrev = (e) => {
        e.preventDefault();
        ref.current.slidePrev();
    }
    return (
        <div className="tweet-list">
            <button className="btn primary btn-prev" onClick={handlePrev}><IconPrev /></button>
            <Carousel ref={ref} {...settings}>
            {tweets()}
            </Carousel>
            <button className="btn primary btn-next" onClick={handleNext}><IconPrev /></button>
        </div>
    )
}