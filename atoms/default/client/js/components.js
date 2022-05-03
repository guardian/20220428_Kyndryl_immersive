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

    const [curSlide, setCurSlide] = useState(0);
    const [slideTot, setSlideTot] = useState(0);

    const tweets = () => {
        return data.map((v,i)=><Tweet data={v} />);
    }

    //move to top of list when new data is loaded

    useEffect(()=>{      
        setSlideTot(data.length);
        const tot = data.length - 3;
        let tid = 0;
        let cur = 1;
        const tickFn = () => {
            if (cur >= tot - 1) {
                cur = 0
                ref.current.goTo(1);
            } else {
                ref.current.slideNext();            
                cur++;
            }
            tid = setTimeout(tickFn, 4000);
        }
        ref.current.goTo(0);
        // tickFn();
        return ()=>{
            clearTimeout(tid);
        }
    },[data])

    const settings = {
        verticalMode: true,
        itemsToShow: 4,
        enableAutoPlay: false,
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