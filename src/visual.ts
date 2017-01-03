

module powerbi.extensibility.visual {



interface BarChartSettings {

    enableAxis:{
        show:boolean;
    }
}

    interface BarChartViewModel {
    dataPoints: BarChartDataPoint[];
    dataMax: number;
    settings: BarChartSettings;
};

interface BarChartDataPoint {

value: number;
category: string;
markA:number;
markB:number;
markC:number;
markD:number;
markE:number;
SelectionId: ISelectionId;

};

function visualTransform(options: VisualUpdateOptions, host: IVisualHost): BarChartViewModel {
        let dataViews = options.dataViews;
         let viewModel: BarChartViewModel = {
             dataPoints: [],
             dataMax: 0,
             settings: {enableAxis: {show: false}}
         };
 
         if (!dataViews
             || !dataViews[0]
             || !dataViews[0].categorical
             || !dataViews[0].categorical.categories
             || !dataViews[0].categorical.categories[0].source
             || !dataViews[0].categorical.values)
             return viewModel;
 
    let categorical = dataViews[0].categorical;
    let category = categorical.categories[0];
    let dataValue = categorical.values[0];
    let dataA = categorical.values[1];
    let dataB = categorical.values[2];
    let dataC = categorical.values[3];
    let dataD = categorical.values[4];
    let dataE = categorical.values[5];
 
         let barChartDataPoints: BarChartDataPoint[] = [];
         let dataMax: number;
 
     for (let i = 0, len = Math.max(category.values.length, dataValue.values.length); i < len; i++) {
        barChartDataPoints.push(
            {
                category: category.values[i],
                value: dataValue.values[i],
                markA: dataA.values[i],
                markB: dataB.values[i],
                markC: dataC.values[i],
                markD: dataD.values[i],
                markE: dataE.values[i],
                SelectionId: host.createSelectionIdBuilder().withCategory(category, i).createSelectionId()
            });
    }
         dataMax = <number>dataValue.maxLocal;
 
         return {
             dataPoints: barChartDataPoints,
             dataMax: dataMax,
                    settings: {

            enableAxis:{show:getValue<boolean>(dataViews[0].metadata.objects, 'enableAxis', 'show', false),
            }
        }
         };
     }

     
    export class Visual implements IVisual {
         private svg: d3.Selection<SVGElement>;
         private host: IVisualHost;
         private barChartContainer: d3.Selection<SVGElement>;
         private barContainer: d3.Selection<SVGElement>;
         private bars: d3.Selection<SVGElement>;
         private textContainer: d3.Selection<SVGElement>;
         private text: d3.Selection<SVGElement>;
         private textContainer2: d3.Selection<SVGElement>;
         private text2: d3.Selection<SVGElement>;
         private textContainer3: d3.Selection<SVGElement>;
         private text3: d3.Selection<SVGElement>;
         private tooltipContainer: d3.Selection<SVGElement>;
         private tooltip: d3.Selection<SVGElement>;
         private legendContainer: d3.Selection<SVGElement>;
         private legend: d3.Selection<SVGElement>;
         private vm: BarChartViewModel;
         private selectionManager: ISelectionManager;
         private checkBoxContainer: d3.Selection<SVGElement>;
        private tooltiptext: d3.Selection<SVGElement>;
        private tooltiptextContainer: d3.Selection<SVGElement>;
        private xAxis: d3.Selection<SVGElement>;
        private lineA: d3.Selection<SVGElement>;
        private lineB: d3.Selection<SVGElement>;
        private lineC: d3.Selection<SVGElement>;
        private lineD: d3.Selection<SVGElement>;
        private lineE: d3.Selection<SVGElement>;
        private lineContainer: d3.Selection<SVGElement>;
        private textA: d3.Selection<SVGElement>;
        private textB: d3.Selection<SVGElement>;
        private textC: d3.Selection<SVGElement>;
        private textD: d3.Selection<SVGElement>;
        private textE: d3.Selection<SVGElement>;

         static Config = {
             xScalePadding: 0.1,
         };

        constructor(options: VisualConstructorOptions) {

            
            options.element.style.overflow = 'auto';
             this.host = options.host;
             let svg = this.svg = d3.select(options.element)
                 .append('svg')
                 .classed('barChart', true);

             this.barContainer = svg.append('g').classed('barContainer', true);
             this.textContainer = svg.append('g').classed('textContainer', true);
             this.textContainer2 = svg.append('g').classed('textContainer2', true);
             this.textContainer3 = svg.append('g').classed('textContainer3', true);
             this.tooltipContainer = svg.append('g').classed('tooltipContainer', true);
             this.tooltiptextContainer = svg.append('g').classed('tooltiptextContainer', true);
             this.legendContainer = svg.append('g').classed('legendContainer', true);
             this.selectionManager = options.host.createSelectionManager();
             this.xAxis = svg.append('g').classed('xAxis', true);
             this.lineA = svg.append('g').classed('lineA', true);
             this.lineB = svg.append('g').classed('lineB', true);
             this.lineC = svg.append('g').classed('lineC', true);
             this.lineD = svg.append('g').classed('lineD', true);
             this.lineE = svg.append('g').classed('lineE', true);
             this.lineContainer = svg.append('g').classed('lineContainer', true);
             this.textA = svg.append('g').classed('textA', true);
             this.textB = svg.append('g').classed('textB', true);
             this.textC = svg.append('g').classed('textC', true);
             this.textD = svg.append('g').classed('textD', true);
             this.textE = svg.append('g').classed('textE', true);

         }

         public update(options: VisualUpdateOptions) {

             let viewModel: BarChartViewModel = this.vm = visualTransform(options, this.host);
             let width = options.viewport.width;
             let height = options.viewport.height;
             let margin = { top: 250, bottom: 25, left: 0, right: 0 };
             let barHeight = 18;
             let smallBar = 3;
            

             let green = "#01B8AA";
             let coral = "#FD625E";
             let yellow = "#F2C80F";
             let purple = "#7D4F73";
             let blue = "#689FB0";
             let orangeBrown = "#BF714D";
             let grey = "#888889";

            this.svg.attr({
                width: width,
                height: height
            });

            let index = d3.range(viewModel.dataPoints.length);
            let data = index.map(d => d.valueOf);

            let x = d3.scale.linear()
                .domain([0, viewModel.dataMax - 100])
                .range([0, width]);
            
            let selectionManager = this.selectionManager;
            let bars = this.barContainer.selectAll('.bar').data(viewModel.dataPoints).sort( function(a,b) { return d3.descending(a.value, b.value);});
            bars.enter()
                .append('rect')
                .classed('bar', true);
           // bars.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            bars.attr("transform", function (d, i) { return "translate(400," + i*barHeight + ")" }).attr("y", barHeight);

            //bars.append('rect')
            bars.attr({
                width: d => x(d.value / smallBar),
                height: d => barHeight - 1
            }).style({
                'fill': function (d) {

                        if (d.value >= d.markA) {
                            return yellow;
                           
                        }
                        else if (d.value < d.markA && d.value >= d.markB) {
                            return green;
                            
                        }
                        else if (d.value < d.markB && d.value >= d.markC) {
                            return coral;
                        }
                        else if (d.value < d.markC && d.value >= d.markD) {
                            return purple;
                        }
                        else if (d.value < d.markD && d.value >= d.markE) {
                            return blue;
                        }
                        else {
                            return orangeBrown;
                        };
                    },
                'stroke': '#ffffff',
                'stroke-width': '1'

                });
               
            bars.on('click', function (d) {
                selectionManager.select(d.SelectionId).then((ids: ISelectionId[]) => {
                    bars.attr({
                        'fill-opacity': ids.length > 0 ? 0.5 : 1
                    });


                    d3.select(this).attr({
                        'fill-opacity': 1
                    })


                });

                (<Event>d3.event).stopPropagation();
            });

            bars.exit()
                .remove();

            let lineA = this.lineA.selectAll('line').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            lineA.enter().append('line').classed('line', true);
            lineA.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineA.attr("x1", function (d) { return x(d.markA / smallBar); })
                .attr("x2", function (d) { return x(d.markA / smallBar); })
                .attr("y1", 0).attr("y2", function(d,i){ return i*17}).attr("stroke-width", 2)
                .attr("stroke", "grey")
                .style("stroke-dasharray", ("3, 3"));
            lineA.exit().remove();

            let lineB = this.lineB.selectAll('line').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            lineB.enter().append('line').classed('line', true);
            lineB.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineB.attr("x1", function (d) { return x(d.markB / smallBar); })
                .attr("x2", function (d) { return x(d.markB / smallBar); })
                .attr("y1", 0).attr("y2", function(d,i){ return i*17}).attr("stroke-width", 2)
                .attr("stroke", "grey")
                .style("stroke-dasharray", ("3, 3"));
            lineB.exit().remove();

            let lineC = this.lineC.selectAll('line').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            lineC.enter().append('line').classed('line', true);
            lineC.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineC.attr("x1", function (d) { return x(d.markC / smallBar); })
                .attr("x2", function (d) { return x(d.markC / smallBar); })
                .attr("y1", 0).attr("y2", function(d,i){ return i*17}).attr("stroke-width", 2)
                .attr("stroke", "grey")
                .style("stroke-dasharray", ("3, 3"));
            lineC.exit().remove();

            let lineD = this.lineD.selectAll('line').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            lineD.enter().append('line').classed('line', true);
            lineD.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineD.attr("x1", function (d) { return x(d.markD / smallBar); })
                .attr("x2", function (d) { return x(d.markD / smallBar); })
                .attr("y1", 0).attr("y2", function(d,i){ return i*17}).attr("stroke-width", 2)
                .attr("stroke", "grey")
                .style("stroke-dasharray", ("3, 3"));
            lineD.exit().remove();

            let lineE = this.lineE.selectAll('line').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            lineE.enter().append('line').classed('line', true);
            lineE.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineE.attr("x1", function (d) { return x(d.markE / smallBar); })
                .attr("x2", function (d) { return x(d.markE / smallBar); })
                .attr("y1", 0).attr("y2", function(d,i){ return i*17}).attr("stroke-width", 2)
                .attr("stroke", "grey")
                .style("stroke-dasharray", ("3, 3"));
            lineE.exit().remove();

            let lineContainer = this.lineContainer.selectAll('line').data(viewModel.dataPoints);
                        lineContainer.enter().append('line').classed('line', true);
            lineContainer.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });
            lineContainer.attr("x1", function (d) { return x(viewModel.dataMax - 100); })
                .attr("x2", function (d) { return x(viewModel.dataMax - 100); })
                .attr("y1", 0).attr("y2", height).attr("stroke-width", 2)
                .attr("stroke", "#FFFFFF")
                .style("stroke-dasharray", ("3, 3"));
            lineContainer.exit().remove();

            let text = this.textContainer.selectAll('.text').data(viewModel.dataPoints).sort(function (a, b) { return d3.descending(a.value, b.value) });
            text.enter().append('text').classed('text', true);
            text.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });

            text.style('fill', '#000')
                    .attr('x', 0)
                    .attr('y', barHeight+(barHeight/2))
                    .attr('text-anchor', 'end')
                    .attr('font-size', '10px')
                    .text(function (d) { return d.category; });
                text.exit().remove();


                // add text2 stuff - this is the uniform mark display on the bar itself
                let text2 = this.textContainer2.selectAll('.text').data(viewModel.dataPoints).sort(function(a,b){ return d3.descending(a.value, b.value)});
                text2.enter().append("text").classed('text', true);
                text2.attr("transform", function (d, i) { return "translate(400," + i * barHeight + ")" });

                text2.style("fill", "#ffffff")
                    .attr("x", 20)
                    .attr("y", barHeight+(barHeight/2))
                    .attr("dy", ".35em")
                    .attr("font-size", "12px")
                    .text(function (d) { return d.value; });
                text2.exit().remove();

                let textA = this.textA.selectAll(".text").data(viewModel.dataPoints)
                textA.enter().append('text').classed('text', true);
                textA.attr("transform", function (d) { return "translate(400, 0)" });
                textA.style("fill", "grey")
                    .attr("x", function (d) { return x(d.markA / smallBar); })
                    .attr("y", barHeight/2)
                    .attr("dy", ".35em")
                    .attr("font-size", "18px")
                    .style("text-anchor", "start")
                    .text(function (d) { return "A "; });
                textA.exit().remove();

                let textB = this.textB.selectAll(".text").data(viewModel.dataPoints)
                textB.enter().append('text').classed('text', true);
                textB.attr("transform", function (d) { return "translate(400, 0)" });
                textB.style("fill", "grey")
                    .attr("x", function (d) { return x(d.markB / smallBar); })
                    .attr("y", barHeight/2)
                    .attr("dy", ".35em")
                    .attr("font-size", "18px")
                    .style("text-anchor", "start")
                    .text(function (d) { return "B "; });
                textB.exit().remove();

                let textC = this.textC.selectAll(".text").data(viewModel.dataPoints)
                textC.enter().append('text').classed('text', true);
                textC.attr("transform", function (d) { return "translate(400, 0)" });
                textC.style("fill", "grey")
                    .attr("x", function (d) { return x(d.markC / smallBar); })
                    .attr("y", barHeight/2)
                    .attr("dy", ".35em")
                    .attr("font-size", "18px")
                    .style("text-anchor", "start")
                    .text(function (d) { return "C "; });
                textC.exit().remove();

                let textD = this.textD.selectAll(".text").data(viewModel.dataPoints)
                textD.enter().append('text').classed('text', true);
                textD.attr("transform", function (d) { return "translate(400, 0)" });
                textD.style("fill", "grey")
                    .attr("x", function (d) { return x(d.markD / smallBar); })
                    .attr("y", barHeight/2)
                    .attr("dy", ".35em")
                    .attr("font-size", "18px")
                    .style("text-anchor", "start")
                    .text(function (d) { return "D "; });
                textD.exit().remove();

                let textE = this.textE.selectAll(".text").data(viewModel.dataPoints)
                textE.enter().append('text').classed('text', true);
                textE.attr("transform", function (d) { return "translate(400, 0)" });
                textE.style("fill", "grey")
                    .attr("x", function (d) { return x(d.markE / smallBar); })
                    .attr("y", barHeight/2)
                    .attr("dy", ".35em")
                    .attr("font-size", "18px")
                    .style("text-anchor", "start")
                    .text(function (d) { return "E "; });
                textE.exit().remove();

               
                var legend = this.legendContainer.selectAll("g")
                    .data(["A", "B", "C", "D", "E"]).enter()
                    .append("g")
                    .classed('legend', true)
                    .attr("transform", function (d, i) { return "translate(0," + i * 25 + ")" });

                legend.append("circle")
                    .attr("class", "dot")
                    .attr("r", 10)
                .attr("cx", 10)
                .attr("cy", 10)
                .style("fill", function (d) { 
                    if (d == "A") { return yellow; } 
                    else if (d == "B") { return green; } 
                    else if (d == "C") { return coral;} 
                    else if (d == "D") { return purple; } 
                    else return blue; });
                
                legend.append("text")
                .attr("x", 35)
                .attr("y", 15)
                .attr("font-size", "14px")
                .text(function (d) { return "Actual grade: " +d});    

        }

public enumerateObjectInstances(options: EnumerateVisualObjectInstancesOptions): VisualObjectInstanceEnumeration {
        let objectName = options.objectName;
        let objectEnumeration: VisualObjectInstance[] = [];

        switch (objectName) {
            case 'enableAxis':
                objectEnumeration.push({
                    objectName: objectName,
                    properties: {
                        show: this.vm.settings.enableAxis.show,
                    },
                    selector: null
                });
        };
        return objectEnumeration;
    }


        public destroy(): void {
            //TODO: Perform any cleanup tasks here
        }
}
}