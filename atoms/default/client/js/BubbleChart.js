import {h, Component} from "preact";
import * as am5 from "@amcharts/amcharts5/index";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import am5animated from "@amcharts/amcharts5/themes/Animated";
import { useLayoutEffect } from "preact/hooks";
import data from "./chartData";


const BubbleChart = () => {

    useLayoutEffect(()=>{
        const root = am5.Root.new("chart");
        console.log('bubble chart')
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
            downDepth: 1,
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
          }));
          series.nodes.template.events.on("click", function(e) {
            console.log(e.target._dataItem.dataContext.name)
          })
          series.get("colors").setAll({
            step: 2
          });
          
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