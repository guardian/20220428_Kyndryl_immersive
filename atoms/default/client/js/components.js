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
                <a className="tweet-item" href={data.link} target="_blank" rel="no-follow">
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



export const AnimatedBg = () => {

    return (
    <div className="animated-bg">
	<svg viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice">
	<defs>
	<radialGradient id="Gradient1" cx="50%" cy="50%" fx="0.441602%" fy="50%" r=".5"><animate attributeName="fx" dur="34s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="#FF462D88"></stop><stop offset="100%" stop-color="#FF462D00"></stop></radialGradient>
	<radialGradient id="Gradient2" cx="50%" cy="50%" fx="2.68147%" fy="50%" r=".5"><animate attributeName="fx" dur="23.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="#A053FF88"></stop><stop offset="100%" stop-color="#A053FF00"></stop></radialGradient>
	<radialGradient id="Gradient3" cx="50%" cy="50%" fx="0.836536%" fy="50%" r=".5"><animate attributeName="fx" dur="21.5s" values="0%;3%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="#4CDD8488"></stop><stop offset="100%" stop-color="#4CDD8400"></stop></radialGradient>
	<radialGradient id="Gradient4" cx="50%" cy="50%" fx="4.56417%" fy="50%" r=".5"><animate attributeName="fx" dur="23s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="#63BFFF88"></stop><stop offset="100%" stop-color="#63BFFF00"></stop></radialGradient>
	<radialGradient id="Gradient5" cx="50%" cy="50%" fx="2.65405%" fy="50%" r=".5"><animate attributeName="fx" dur="24.5s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="#EB872E88"></stop><stop offset="100%" stop-color="#EB872E00"></stop></radialGradient>
	<radialGradient id="Gradient6" cx="50%" cy="50%" fx="0.981338%" fy="50%" r=".5"><animate attributeName="fx" dur="25.5s" values="0%;5%;0%" repeatCount="indefinite"></animate><stop offset="0%" stop-color="rgba(255,0,0, 1)"></stop><stop offset="100%" stop-color="rgba(255,0,0, 0)"></stop></radialGradient>
	</defs>
	
	<rect x="13.744%" y="1.18473%" width="100%" height="100%" fill="url(#Gradient1)" transform="rotate(334.41 50 50)"><animate attributeName="x" dur="20s" values="25%;0%;25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="21s" values="0%;25%;0%" repeatCount="indefinite"></animate>
    {/* <animate attributeName="width" dur="11s" from="20%" to="100%" repeatCount="indefinite"></animate> */}
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="7s" repeatCount="indefinite"></animateTransform></rect>
	<rect x="-2.17916%" y="35.4267%" width="100%" height="100%" fill="url(#Gradient2)" transform="rotate(255.072 50 50)"><animate attributeName="x" dur="23s" values="-25%;0%;-25%" repeatCount="indefinite"></animate><animate attributeName="y" dur="24s" values="0%;50%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="12s" repeatCount="indefinite"></animateTransform>
	</rect>
	<rect x="9.00483%" y="14.5733%" width="100%" height="100%" fill="url(#Gradient3)" transform="rotate(139.903 50 50)"><animate attributeName="x" dur="25s" values="0%;25%;0%" repeatCount="indefinite"></animate><animate attributeName="y" dur="12s" values="0%;25%;0%" repeatCount="indefinite"></animate><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="9s" repeatCount="indefinite"></animateTransform>
	</rect>
	</svg>
    </div>
    )
}
