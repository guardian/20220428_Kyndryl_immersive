import gsap from "gsap";
import {h, Component, options, Fragment} from "preact";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { assetsPath } from "./store";
import { IconPrev } from "./Icons";
import Carousel from 'react-elastic-carousel';
import {Transition, TransitionGroup} from "react-transition-group";



const setHtml = (html) => ({__html: html});

export const PillBox = (props) => {

    return (
        <div className={`pillbox ${props.className}`}>
            {props.children}
        </div>
    )
}

const Tweet = ({data}) => {
    const ref = useRef();
    // const ref2 = useRef();
    useLayoutEffect(()=>{
        gsap.set(ref.current, {height: 0})
        // gsap.to(ref.current, {margin: 0, duration: 1})
        gsap.delayedCall(.2,()=>{
            gsap.to(ref.current, {height:ref.current.querySelector('.pillbox').clientHeight, duration: 0.5})
            gsap.set(ref.current, {height: 'auto', delay: 0.8});
        });
    },[])
    return (
            <div className="tweetbox" ref={ref}>
                <PillBox className="">
                <a className="tweet" href={data.link} target="_blank" rel="no-follow">
                        <img src={`${assetsPath}/avatar.png`} />
                        <div>
                            <p>{data.label}</p>
                            <p className="handle">{data.handle}</p>
                            <p dangerouslySetInnerHTML={setHtml(data.content)}></p>
                        </div>
                    </a>
                </PillBox>
            </div>
    )
}

export const TweetList = ({data}) => {

    const ref = useRef();
    const dk = data.map((v, i) => {
        v.key = `tweet${i}`;
        return v;
    });
    // const dk = [...items];
    const [curList, setCurList] = useState([]);
    // const [curList, setCurList] = useState([...data]);
    const [reserve, setReserve] = useState([]);

    // console.log('>>tweets', curList, data)
    const tweets = () => {
        return curList.map((v,i)=><Tweet data={v} key={i} />);
    }

    useEffect(()=>{
        setCurList([...dk.slice(0,4)]);
        setReserve([...dk.slice(4)]);
    },data)
    //move to top of list when new data is loaded


    const settings = {
        verticalMode: true,
        itemsToShow: 4,
        enableAutoPlay: false,
        showArrows: false,
        pagination: false

    }

    const handleNext = () => {
        // e.preventDefault();
        const cl = [...curList.slice(1), reserve[0]];
        const rl = [...reserve.slice(1), curList[0]];
        console.log(cl, rl);
        setCurList([...cl]);
        setReserve([...rl])
    }
    const handlePrev = (e) => {
        e.preventDefault();
        const cl = [...reserve.slice(-1), ...curList.slice(0, -1)];
        const rl = [...curList.slice(-1), ...reserve.slice(0, -1)];
        
        setCurList((s) => [...cl]);
        setReserve(s=>[...rl])
    }


    return (
        <div className="tweet-list">
            <button className="btn primary btn-prev" onClick={handlePrev}><IconPrev /></button>
            <div className="clear-float"></div>
            <TransitionGroup>
            {curList.map((v) => {
                return (
                <Transition key={v.key}
                timeout={1000}
                onEnter={(n, appear) => {
                    if (!appear) {
                        gsap.to(n,{alpha: 1, duration: 0.5})
                        // gsap.delayedCall(0,()=>gsap.from(n,{height: 0, duration:0.5}))
                        // gsap.delayedCall(0, ()=>gsap.fromTo(n,{height: 0},{height: n.clientHeight, duration:0.5}))
                        // gsap.to(n,{height: 'auto', duration: 0.5, delay: 0.5})
                        // gsap.set(n,{className:'pillbox tweetbox', delay: 0.5})
                    }
                }}
                onExit={n=>gsap.to(n,{height: 0, alpha:0, duration: 0.5,padding: 0, margin: 0})}
                mountOnEnter
                unmountOnExit
                // appear={true}
                >
                    <Tweet data={v} />
                </Transition>
                );
            })}
            </TransitionGroup>
            <button className="btn primary btn-next" onClick={handleNext}><IconPrev /></button>
        </div>
    )
}