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
    // const content = data.content.
    return (
            <div className="tweetbox" ref={ref}>
                <PillBox className="">
                <a className="tweet" href={data.link} target="_blank" rel="no-follow">
                        <img src={`${assetsPath}/avatar.png`} />
                        <div>
                            <p>{data.label}</p>
                            <p className="handle">{data.handle}</p>
                            <p dangerouslySetInnerHTML={setHtml(data.content.replace(/(#\w+)/ig,`<span class="handle">$1</span>`))}></p>
                        </div>
                    </a>
                </PillBox>
            </div>
    )
}

export class TweetList extends Component {
    ref = useRef();
    timer = 0;
    autoPlayTimeout = 4000;

    componentWillUnmount() {
        this.stopAutoPlay();
    }
    
    componentWillReceiveProps (newProps) {       
        const dk = newProps.data.map((v, i) => {
            v.key = `tweet${i}`;
            return v;
        });        
        this.setState({
            curList: [...dk.slice(0,4)],
            reserve: [...dk.slice(4)]
        });
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    startAutoPlay = () => {
        this.timer = setTimeout(this.autoPlayTick, this.autoPlayTimeout);
    }

    autoPlayTick = () => {
        this.gotoNextSlide();
        this.timer = setTimeout(this.autoPlayTick, this.autoPlayTimeout);
    }

    stopAutoPlay = () => {
        clearTimeout(this.timer);
    }

    handleNext = () => {
        this.stopAutoPlay();
        this.gotoNextSlide();
    }

    gotoNextSlide = () => {
        // e.preventDefault();
        const cl = [...this.state.curList.slice(1), this.state.reserve[0]];
        const rl = [...this.state.reserve.slice(1), this.state.curList[0]];
        this.setState({curList: cl});
        this.setState({reserve: rl});
    }
    handlePrev = (e) => {
        e.preventDefault();
        this.stopAutoPlay();
        const cl = [...this.state.reserve.slice(-1), ...this.state.curList.slice(0, -1)];
        const rl = [...this.state.curList.slice(-1), ...this.state.reserve.slice(0, -1)];

        this.setState({curList: cl});
        this.setState({reserve: rl});        
    }

    render(props, {curList}) {
        if (!curList) return null;
        return (
        <div className="tweet-list">
            <button className="btn primary btn-prev" onClick={this.handlePrev}><IconPrev /></button>
            <div className="clear-float"></div>
            <TransitionGroup>
            {curList.map((v) => {
                return (
                <Transition key={v.key}
                timeout={1000}
                onEnter={(n, appear) => {
                    if (!appear) {
                        gsap.to(n,{alpha: 1, duration: 0.5})
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
            <button className="btn primary btn-next" onClick={this.handleNext}><IconPrev /></button>
        </div>
    )
        }
}