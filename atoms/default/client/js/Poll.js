import gsap from "gsap/gsap-core";
import {h, Component, options, Fragment} from "preact";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";
import { PillBox } from "./components";
import { checkPollState, updateVote, watchPoll } from "./firebase";
import useAuth from "./useAuth";

const getOptionKey = (option) => option.toLowerCase().trim().replace(/\W/ig,'');

const PollBar = ({id, size, label, total}) => {

    useLayoutEffect(()=>{
        gsap.set(`#${id}`, {width: (size?.[id]/size?.total)* 100+'%'});
    },[size]);

    return <div className="bar-container">
        <div className="bar">
            <div className="option-bar" id={id}></div>
            <div className="value">{size?.[id] || 0}</div>
        </div>
        <p>{label}</p>

    </div>
}

const PollResult = ({docid, options}) => {

    const [votes, setVotes] = useState({})
    const [total, setTotal] = useState(0);
    const [results, setResults] = useState(null);

    const ops = (res) => {
        
        return options.map((v, i)=>{
            const id = getOptionKey(v);
            setVotes((s)=>{
                s[id] = 0;
                return s;
            })
            return <PollBar id={id} size={results} label={v} total={total}/>
        })
    };

    useEffect(()=>{
        return watchPoll(docid, (results)=>{
            // console.log('results', results);
            // setTotal(results.total);
            let tot = 0;
            for (let v in results) {
                tot = v != 'total' && results[v] > tot ? results[v] : tot;
            //     // gsap.set(`#${v}`, {scaleX: (results[v]/results.total)});
                
            //     setVotes(s=>{
            //         s[getOptionKey(v)] = (results[v]/results.total);
            //         return s;
            //     });
            //     console.log(votes);
            }
            
            setResults({...results, total: tot});
        });
    },[]);

    return (
        <div className="poll-result">
            {ops()}
        </div>
    )
}


const Poll = ({id,docid,options,question, visible, active}) => {

    const userId = useAuth();
    
    const [pollDone, setPollDone] = useState(active ? null : true);
    
    useEffect(async ()=>{
        // fireDoc.then(data=>console.log(data))
        // checkPollState(userId)
        if (!pollDone && userId) {
            const fn = await checkPollState(userId);
            // console.log('>>> ', fn(docid));
            setPollDone(fn(docid));
        }
        // setPollDone(isPollDone(docid))
    },[userId]);


    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleSelect = (e) => {
        console.log('choice:', e.target.value, userId);
        updateVote(docid, e.target.value, userId);
        setPollDone(true);
    }

    const ops = options.split('|').map((v,i)=> {
        const key = getOptionKey(v)
        // console.log(key);
        return (
        <Fragment>
            <input onChange={handleSelect} type="radio" id={`pop${id}${i}`} name={`poll${id}`} value={key}></input>
            <label for={`pop${id}${i}`}>{v}</label>
        </Fragment>
        );
    });

    return (
        <PillBox>
            <form onSubmit={handleSubmit}>
                <h3>{question}</h3>
                {/* <h3>User: {userId}</h3> */}
                { pollDone === null && <p>loading...</p>}
                { pollDone == false && ops}
                {/* {ops} */}
                { pollDone == true && <PollResult docid={docid} options={options.split('|')} />}
            </form>
        </PillBox>
    )
}


const Polls = ({data}) => {

    // console.log(data);

    const polls = data
        .filter(v=>v.visible ? v : null).map(v=><Poll {...v} />);


    return (
        <div>
            {polls}
        </div>
    )

}

export default Polls;