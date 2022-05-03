import {h, Component} from "preact";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "preact/hooks";
import { setTheme } from "./store";
import { useDispatch } from "react-redux";
// import data from "./chartData";


const BubbleChart = ({data, onSelect, showChildren = false}) => {

    useLayoutEffect(()=>{
        const root = am5.Root.new("chart");
        console.log('bubble chart')
        
        // const dispatch = useDispatch();

        root.setThemes([
            am5animated.new(root)
        ]);

        const container = root.container.children.push(am5.Container.new(root, {
            width: am5.percent(100),
            height: am5.percent(100),
            layout: root.verticalLayout
        }));        

        const series = container.children.push(am5hierarchy.ForceDirected.new(root, {
            singleBranchOnly: false,
            downDepth:  showChildren ? 1 : 0,
            topDepth: 1,
            initialDepth: 0,
            valueField: "value",
            categoryField: "name",
            childDataField: "children",
            idField: "name",
            linkWithField: "linkWith",
            manyBodyStrength: -10,
            centerStrength: 0.8,
            // toggleKey: "none",
            minRadius: am5.percent(8),
            maxRadius: am5.percent(16),
            showOnFrame: 1,
            velocityDecay: 0.6,
          }));
          series.nodes.template.events.on("click", function(e) {
            console.log(e.target._dataItem.dataContext.key)
            if (e.target._dataItem.dataContext.isChild) return;
            // dispatch( setTheme(e.target._dataItem.dataContext.key));
            onSelect( (e.target._dataItem.dataContext.key));
          })
        //   https://www.amcharts.com/docs/v5/charts/hierarchy/hierarchy-node-colors/
          series.get("colors").setAll({
            step: 2
          });
          series.hideTooltip(true)
        // series.get("colors").set("colors", [
        //     am5.color(0x095256),
        //     am5.color(0x087f8c),
        //     am5.color(0x5aaa95),
        //     am5.color(0x86a873),
        //     am5.color(0xbb9f06)
        //   ]);
        //   series.nodes.template.set('tooltipText', "{name}")
        //   series.labels.template.setAll({
        //       text: '{name}'
        //   })

        // series.circles.template.adapters.add("fill", function(fill, target) {
        //     // console.log('>>>', target._dataItem.dataContext)
        //     if (target._dataItem.dataContext.name == "Flora") {
        //     return am5.color(0xff0000);
              
        //     }
        //   });          
          series.links.template.set("strength", 0.2);
          
          series.data.setAll([data]);
          
          series.set("selectedDataItem", series.dataItems[0]);
          
          
          
          // Make stuff animate on load
          series.appear(1000, 100);
          return () => {
              root.dispose();
          }
    },[]);

    return (
        <div id="chart"></div>
    )

}

export default BubbleChart;