// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
// if you want to import a module from shared/js then you can
// just do e.g. import Scatter from "shared/js/scatter.js"
import { render, h, Fragment, createContext } from "preact";
import SocialBar from 'shared/js/SocialShare';
import {$, $$} from 'shared/js/util';
import RelatedContent from "shared/js/RelatedContent";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import store, { ACTION_SET_SECTIONS, fetchData, assetsPath, ACTION_SET_VIEW, ACTION_SET_SCORE, setView, setTheme } from "./store";
import {IconNext, Logo, IconHand} from "./Icons";
import {SwitchTransition, Transition, TransitionGroup} from "react-transition-group";
import {Provider, useSelector, useDispatch} from "react-redux";
import { useEffect, useLayoutEffect, useRef, useState } from "preact/hooks";
import { fireDb } from "./firebase";
import BubbleChart from "./BubbleChart";
import Polls from "./Poll";
import AudioPlayer from 'shared/js/AudioPlayer';
import { PillBox, TweetList } from "./components";
import {CircleBg} from "./Icons";
import { iOS } from "@amcharts/amcharts5/.internal/core/util/Utils";

let dispatch;

gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
    duration: 0.8,
    ease: 'sine.inOut'
});

const setHtml = (html) => ({__html: html});

const scrollToTop = () => {
    const t = document.getElementById('feature-top');
    // if (Math.abs(t - window.scrollY) < 200) {
    //     return false;
    // } 
    t.scrollIntoView({
        behavior: 'smooth'
    });
    return false;
}

const Container = ({children, className}) => {
    return (
        // <div className="md:container  md:mx-auto">
        <div className={`GlabsContainer ${className}`}>
            <div className="boxed-container">
                {children}

            </div>
        </div>
    )
}

const FlexContainer = ({children, className}) => {
    return (
        <div className={`flex-container ${className}`} >
            {children}
        </div>
    )
}


const Loading = () => 
    <FlexContainer className="loading">
        <div style={{width: 300}}>
            <img src={`${assetsPath}/glab_logo.svg`} />
        </div>
    </FlexContainer>

const Attribution = ({content}) => {
    return (
        <div className="attribution">
            <p>Paid for by 
                <a className="mt-4 block" href={content.logoLink} target="_blank">
                    <Logo />
                </a>
            </p>
            <div className="about-content" dangerouslySetInnerHTML={setHtml(content.aboutLink)} />
        </div>
    )
}


const Header = () => {
    const content = useSelector(s=>s.content);

    return (
        <div className="header" >
          
            <Container className="title-block">
                <div>
                    <div className="main-title ">
                        <h1>{content.headline}<br/><span className="light">{content.standfirst}</span></h1>
                    </div>

                </div>

            </Container>

        </div>        
    )
}

const Footer = ({content, related, shareUrl}) => {

    return (
        <Fragment>

            <section className="footer dark-text">
                <div className="content">
                    <div className="cta-wrap">
                        <div className="cta" dangerouslySetInnerHTML={setHtml(content.cta)} />
                        <div className="share">
                            <SocialBar title={content.shareTitle} url={shareUrl} />
                        </div>
                    </div>
                    
                </div>
            </section>

            <section className="related">
                    <div className="mx-auto" >
                        <h3>Related content</h3>
                        <RelatedContent cards={related} />
                    </div>
            </section>
        </Fragment>
    )
}

const Standfirst = ({content}) => {

    return (
        <div className="standfirst">
                <div className="content">
                    <h1>{content.headline}<br/><span className="light">{content.standfirst}</span></h1>
                </div>
        </div>
    )
}
const Intro = ({content}) => {
    const dispatch = useDispatch();

    const handleStart = e => {
        e.preventDefault();
        dispatch(setView('chart'));
    }
    return (
        <div className="intro">
                <div className="content" dangerouslySetInnerHTML={setHtml(content.intro)}></div>
                <a href="#" onClick={handleStart} className="btn btn-start">{content.startButtonlabel} <span className="icon">›</span></a>

        </div>
    )
}

const TopBar = () => {

    const UI = useSelector(s=>s.UI);
    const dispatch = useDispatch();

    const handleBack = e => {
        e.preventDefault();
        switch (UI.view) {
            case 'dash':
                dispatch({type:ACTION_SET_VIEW, payload: 'chart'});
                break;
            default:
                dispatch({type:ACTION_SET_VIEW, payload: 'home'});
        }
    }
    return (
        <Container>

            <div className="top-bar">
                <nav>
                    {UI.view == 'dash1' && <a href="#" onClick={handleBack} className="btn btn-back"><span className="icon">‹</span> Back</a>}
                </nav>
                <div className="icon-bubbles"><img src={`${assetsPath}/topicon.svg`} /></div>
                <div className="line"></div> 
            </div>
        </Container>
    )
}

const Break = () => <div className="break"><span></span><span></span><span></span></div>;

const Landing = ({content}) => {


    return (
        <div className="intro-body">
            <Standfirst content={content}></Standfirst>
            <Attribution content={content}/>
            <Intro content={content}></Intro>

        </div>
    )
}

const Chart = ({data, content}) => {

    const dispatch = useDispatch();

    const handleThemeSelect = key => {
        dispatch( setTheme(key));
        dispatch( setView('dash'));

    }

    return (
        <div className="chart-container">
            <div className="intro-body">
                <Standfirst content={content}></Standfirst>
                <Attribution content={content}/>
                <div className="prompt">
                    <IconHand /> Tap a topic to join the conversation
                </div>
            </div>
            <BubbleChart data={data} onSelect={handleThemeSelect} />
        </div>
    )
}


const Dash = ({content, UI}) => {
    console.log('mgrid', UI)
    const data = content.themes?.[UI.theme];
    
    if (!data) return;

    const ref = useRef();

    const dispatch = useDispatch();

    useLayoutEffect(()=>{
        if (!ref.current) return;
        ref.current.style.setProperty('--bgHilight', data.color);
        gsap.set('#Glabs', {backgroundImage: `linear-gradient(${data.background})`});
    },[UI.theme]);

    const handleThemeSelect = key => {
        dispatch( setTheme(key));

    }
    return (
    <section className="content-main dash" ref={ref}>
        <BubbleChart data={content.themes.chartData} onSelect={handleThemeSelect}  showChildren={true} />
        <div className="mgrid">
            <div className="col">
                <div className="title">
                    <CircleBg className="bg" />
                    <div className="abs">
                        <h2>{data.label}</h2>
                    </div>
                </div>
                <div className="heading">
                    <h3 dangerouslySetInnerHTML={setHtml(data.heading)} />
                </div>
                <div className="body" dangerouslySetInnerHTML={setHtml(data.body)}></div>
            </div>
            <div className="col">
                <h3>{content.themePollTitle}</h3>
                <Polls data={content.polls}/>
                <div className="audio-desc">
                    <div className="col">
                        <h4>{content.themeAudioTitle}</h4>
                        <p dangerouslySetInnerHTML={setHtml(data.audioInfo)} />
                    </div>
                    <img src={`${assetsPath}/${data.audioImage}`} alt="" />
                </div>
                <PillBox>
                    <AudioPlayer src={`${assetsPath}/${data.audio}.m4a`} />
                </PillBox>
            </div>
            <div className="col">
                <h3>{content.themeTwitterTitle}</h3>
                <TweetList data={data.tweets} />
            </div>
        </div>
    </section>
    );
}



const Home = ({store, content, UI}) => {
    console.log(UI.view);
    return (
        <div>
            <TopBar />
            
                <Container>
                    <SwitchTransition>
                        <Transition
                            key={UI.view}
                            timeout={1000}
                            onEnter={n=>gsap.from(n,{alpha: 0})}
                            onExit={n=>gsap.to(n,{alpha:0})}
                            mountOnEnter
                            unmountOnExit
                            appear={true}
                        >
                            {UI.view === 'home' && <Landing content={content} />}
                            {UI.view === 'chart' && <Chart data={content.themes.chartData} content={content}/>}
                            {UI.view === 'dash' && <Dash content={content} UI={UI} />}
                        </Transition>            
                    </SwitchTransition>             
                </Container>
                <Container>
                    <div className="source">{content.footer}</div>
                    <Break />
                    <Footer content={content} related={store.sheets.related} shareUrl={store.sheets.global[0].shareUrl} />
                </Container>
        </div>
    )
}


const Main = () => {
    const loaded = useSelector(s=>s.dataLoaded);
    
    // const dispatch = useDispatch();

    dispatch = useDispatch();

    useEffect(()=>{
        dispatch( fetchData('https://interactive.guim.co.uk/docsdata/14zLIFkepHejjYOhltZdBrorbfvzz6ChdRK99q2-osyw.json') );
    },[]);


    

    const content = useSelector(s=>s.content);

    const store = useSelector(s=>s);    
    const UI = useSelector(s=>s.UI);

   
    // if (!loaded) return <Loading />;
 
    fireDb.then( data => console.log(data))


   
    return (
        <div>

            
            <SwitchTransition>
                <Transition
                    key={loaded}
                    timeout={1000}
                    onEnter={n=>gsap.from(n,{alpha: 0})}
                    onExit={n=>gsap.to(n,{alpha:0})}
                    mountOnEnter
                    unmountOnExit
                    appear={true}
                >
                    {!loaded && <Loading />}
                    {loaded && <Home UI={UI} content={content} store={store} />}
                    {/* {loaded && chart()} */}
                    
                    {/* {loaded && <Chart data={content.themes.chartData} />} */}
                    {/* {loaded && <Polls data={content.polls}/>} */}
                </Transition>            
            </SwitchTransition> 
        </div>
    )
}


const App = () => {
    return (
        <Provider store={store}>
            <Main/>
        </Provider>

    )
}

render( <App/>, document.getElementById('Glabs'));

