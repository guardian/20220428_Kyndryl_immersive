import gsap from "gsap/gsap-core";
import {h, Component, options, Fragment} from "preact";
import { useEffect, useLayoutEffect, useState } from "preact/hooks";


export const PillBox = (props) => {

    return (
        <div className="pillbox">
            {props.children}
        </div>
    )
}
