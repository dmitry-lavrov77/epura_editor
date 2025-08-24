import {window_object} from '../window-object/window-object'

import './diagram-object.css'

import '@fortawesome/fontawesome-free/js/all.js';


//const template = `

//`


var isNumber = function isNumber(str) 
{
   return !isNaN(str) && !isNaN(parseFloat(str));
}

var DecimalPrecision3 = (function() {
    if (Math.trunc === undefined) {
        Math.trunc = function(v) {
            return v < 0 ? Math.ceil(v) : Math.floor(v);
        };
    }
    var powers = [
        1e0,  1e1,  1e2,  1e3,  1e4,  1e5,  1e6,  1e7,
        1e8,  1e9,  1e10, 1e11, 1e12, 1e13, 1e14, 1e15,
        1e16, 1e17, 1e18, 1e19, 1e20, 1e21, 1e22
    ];
    var intpow10 = function(power) {
        /* Not in lookup table */
        if (power < 0 || power > 22) {
            return Math.pow(10, power);
        }
        return powers[power];
    };
    // Eliminate binary floating-point inaccuracies.
    var stripError = function(num) {
        if (Number.isInteger(num))
            return num;
        return parseFloat(num.toPrecision(15));
    };
    var decimalAdjust = function myself(type, num, decimalPlaces) {
        if (type === 'round' && num < 0)
            return -myself(type, -num, decimalPlaces);
        var p = intpow10(decimalPlaces || 0);
        var n = stripError(num * p);
        return Math[type](n) / p;
    };
    return {
        // Decimal round (half away from zero)
        round: function(num, decimalPlaces) {
            return decimalAdjust('round', num, decimalPlaces);
        },
        // Decimal ceil
        ceil: function(num, decimalPlaces) {
            return decimalAdjust('ceil', num, decimalPlaces);
        },
        // Decimal floor
        floor: function(num, decimalPlaces) {
            return decimalAdjust('floor', num, decimalPlaces);
        },
        // Decimal trunc
        trunc: function(num, decimalPlaces) {
            return decimalAdjust('trunc', num, decimalPlaces);
        },
        // Format using fixed-point notation
        toFixed: function(num, decimalPlaces) {
            return decimalAdjust('round', num, decimalPlaces).toFixed(decimalPlaces);
        }
    };
})();


class niceScale {


  niceNum( localRange,  round) {

    let exponent;
    
    let fraction; 
    
    let niceFraction; 

    exponent = Math.floor(Math.log10(localRange));
    
    fraction = localRange / Math.pow(10, exponent);

    if (round) {
        if (fraction < 1.5)
            niceFraction = 1;
        else if (fraction < 3)
            niceFraction = 2;
        else if (fraction < 7)
            niceFraction = 5;
        else
            niceFraction = 10;
    } else {
        if (fraction <= 1)
            niceFraction = 1;
        else if (fraction <= 2)
            niceFraction = 2;
        else if (fraction <= 5)
            niceFraction = 5;
        else
            niceFraction = 10;
    }

    return niceFraction * Math.pow(10, exponent);
 }



  constructor(min, max){

   this.minPoint = min;
  
   this.maxPoint = max;
  
   this.maxTicks = 6;
  
   

   this.range = this.niceNum(this.maxPoint - this.minPoint, false);
  
   this.tickSpacing = this.niceNum(this.range / (this.maxTicks - 1), true);
  
   this.niceMin = Math.floor(this.minPoint / this.tickSpacing) * this.tickSpacing;
  
   this.niceMax = Math.ceil(this.maxPoint / this.tickSpacing) * this.tickSpacing;


  }


}



export class diagram_object{


  allElementsFromPoint(x, y) {
   const elements = [];
   const originalVisibilities = [];

   while (true) {
     const element = document.elementFromPoint(x, y);

    if (!element || element === document.documentElement) {
      break; // No more elements or reached the document root
    }

     elements.push(element);
     originalVisibilities.push(element.style.visibility);
     element.style.visibility = 'hidden'; // Temporarily hide
   }

   for (let i = 0; i < elements.length; i++) {
     elements[i].style.visibility = originalVisibilities[i];
   }

   return elements;
 }



   capture (e, action) {


       e.target.setPointerCapture(e.pointerId);

       this.action = action;

       this.action_start.left0 = this.cleft;

       this.action_start.top0 = this.ctop;

       this.action_start.right0 = this.cright;

       this.action_start.bottom0 = this.cbottom;

       this.action_start.x0 = e.x;

       this.action_start.y0 = e.y;

       e.stopPropagation()


    }

    release (e) {

      let frame = e.target.parentNode;

      this.cleft = parseFloat(frame.style.left);

      this.ctop = parseFloat(frame.style.top);
        
      this.cright =  parseFloat(frame.style.right);

      this.cbottom =  parseFloat(frame.style.bottom);

      this.action = null;  

      this.action_start = {};

      e.target.releasePointerCapture(e.pointerId); 

    }


    perform (e) {

       
        let frame = e.target.parentNode;

        if (this.action === 'resize-east') {

             let new_right = this.action_start.right0 - e.x + this.action_start.x0;

             frame.style.right = new_right + 'px'
      
             
        }

        else if (this.action === 'resize-south') {

             let new_bottom = this.action_start.bottom0 - e.y + this.action_start.y0;
          

             frame.style.bottom = new_bottom + 'px'

             //frame.style.minHeight =  new_height + 'px';

             //frame.style.maxHeight =  new_height + 'px';

            
             
        }



        else if (this.action === 'resize-west') {

             let new_left = this.action_start.left0 + e.x - this.action_start.x0;

             //let new_right = this.action_start.right0 - e.x + this.action_start.x0;
            
            
             
            // if (new_left < 0 ) {
                
            //    new_left = 0;

            //    new_width = this.action_start.width0 - this.action_start.x0 + this.action_start.left0 + this.action_start.x0;
             
            // }

             frame.style.left = new_left + 'px';
             
             //frame.style.minWidth =  new_width + 'px';

             //frame.style.maxWidth =  new_width + 'px';

            
             
             
        }


        else if (this.action === 'resize-north') {

             let new_top = this.action_start.top0 + e.y - this.action_start.y0;

             //let new_height = this.action_start.height0 - e.y + this.action_start.y0;


             
            
             
             //if (new_top < 0 ) {
                
               // new_top = 0;

                //new_height = this.action_start.height0 - this.action_start.y0 + this.action_start.top0 + this.action_start.y0;
             
            // }

            

             frame.style.top = new_top + 'px';
             
             //frame.style.minHeight =  new_height + 'px';

             //frame.style.maxHeight =  new_height + 'px';

             
             
             
        }

        

    }


    set_action (frame, action) {

        frame.onpointerdown=(e)=>this.capture(e, action);
        
        frame.onpointermove=(e)=>this.perform(e);

        frame.onpointerup=(e)=>this.release(e);
    }
     


  measureText(font, size, text) {


    let dv = document.createElement('div');

    dv.style.position = 'absolute'

    dv.style.font = size.toString()+'pt '+font;

    dv.style.visibility = 'hidden';

    dv.innerText = text;

    this.app.frame.appendChild(dv);

    

 

    let w = dv.getBoundingClientRect();

    dv.remove();

    return w;



  }

  /*fixTextScaling(svg) {
  // We assume the SVG has a viewBox attribute
  // Getting the natural width of the SVG from the viewBox attribute
  const height = svg.getAttribute('viewBox').split(' ')[3];

  // Set the initial value for the scaling factor and mark it as loaded
  svg.style.setProperty('--text-factor', height / svg.clientHeight);
  svg.classList.add('loaded');

  // Update the scaling factor when SVG is resized
  const resizeObserver = new ResizeObserver(() => {

     //const width = svg.getAttribute('viewBox').split(' ')[2];

    svg.style.setProperty('--text-factor', height / svg.clientHeight);
  });

  resizeObserver.observe(svg);

  // In a real app, you'll want to disconnect the observer
  // on unmount by calling resizeObserver.disconnect();
};*/



    /* measureSvgText(text, font, fontSize) {
        // Create a temporary SVG element (can be hidden)
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.style.position = "absolute";
        svg.style.visibility = "hidden";
        document.body.appendChild(svg);

        // Create the text element
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = text;
        textElement.style.fontFamily = font;
        textElement.style.fontSize = fontSize + "px"; // Assuming fontSize is in pixels

        svg.appendChild(textElement);

        // Get the bounding box
        const bbox = textElement.getBBox();

        // Clean up the temporary elements
        document.body.removeChild(svg);

        return { width: bbox.width, height: bbox.height };



    } */



     update(data) {

      if (data.evt==='propertyChanged') {

        if (data.what==='legend_visibility') {

          this.legend.show = data.value;

         

          this.render();

        } 


         
       

        if (data.what==='diagram_id') {

          this.diagram_id = data.value;

          this.render();

        } 


        if (data.what==='table_visibility') {

       

          this.table.show = data.value;

          this.render();

        }
        
         if (data.what==='table_pos') {

          this.table.pos = data.value;

          this.render();

        } 


        if (data.what==='table_pres') {

          this.table.pres = data.value;

          this.render();

        } 



         if (data.what==='legend_position') {

          this.legend.pos = data.value;

          this.render();

        } 

       




        if (data.what==='axis_x_min') {

         

          this.axis_x_min = data.value;

          this.render();

        } 

        if (data.what==='axis_x_max') {

         

          this.axis_x_max = data.value;

          this.render();

        } 

         if (data.what==='axis_y_min') {

         

          this.axis_y_min = data.value;

          this.render();

        } 

        if (data.what==='axis_y_max') {

         

          this.axis_y_max = data.value;

          this.render();

        } 

         if (data.what==='axis_y_step') {

          this.axis_y_step = data.value;

          this.render();

        } 

         if (data.what==='axis_x_mark1') {


          this.axis_x_mark1 = data.value;

          this.render();

        } 

         if (data.what==='axis_x_mark2') {


          this.axis_x_mark2 = data.value;

          this.render();

        } 

        if (data.what==='axis_y_mark1') {


          this.axis_y_mark1 = data.value;

          this.render();

        } 

         if (data.what==='axis_y_mark2') {


          this.axis_y_mark2 = data.value;

          this.render();

        } 

         if (data.what==='axis_x_step') {


          this.axis_x_step = data.value;

          this.render();

        } 



        if (data.what==='axis_x_visibility') {

          this.axis_x_visible = data.value;

          this.render();


        } 

         if (data.what==='axis_y_visibility') {

          this.axis_y_visible = data.value;

          this.render();


        } 


        if (data.what==='grid_x_visibility') {

          this.grid_x_visible = data.value;

          this.render();


        } 

         if (data.what==='grid_y_visibility') {

          this.grid_y_visible = data.value;

          this.render();


        } 




        
      }  
    } 
    

    change_lock_state(e, what) {

     

      if (what === 'axis_y_mark2_lock') {

        this.axis_y_mark2_lock_opened = !this.axis_y_mark2_lock_opened;

        this.axis_y_mark2_lock.innerHTML = this.axis_y_mark2_lock_opened?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

      }


       if (what === 'axis_y_mark1_lock') {

        this.axis_y_mark1_lock_opened = !this.axis_y_mark1_lock_opened;

        this.axis_y_mark1_lock.innerHTML = this.axis_y_mark1_lock_opened?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

      }

         if (what === 'axis_x_mark1_lock') {

        this.axis_x_mark1_lock_opened = !this.axis_x_mark1_lock_opened;

        this.axis_x_mark1_lock.innerHTML = this.axis_x_mark1_lock_opened?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

      }


            if (what === 'axis_x_mark2_lock') {

        this.axis_x_mark2_lock_opened = !this.axis_x_mark2_lock_opened;

        this.axis_x_mark2_lock.innerHTML = this.axis_x_mark2_lock_opened?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

      }



    }



    resizeEvent (th, entries) {
        
      
         for (let i =0; i< entries.length;i++) {

          

             if (entries[i].target.classList.contains('main-svg')) {


                let niceMin =  parseFloat(entries[i].target.dataset.niceMin);

                let niceMax =  parseFloat(entries[i].target.dataset.niceMax);

                let niceMinx =  parseFloat(entries[i].target.dataset.niceMinx);

                let niceMaxx =  parseFloat(entries[i].target.dataset.niceMaxx);





                if (this.axis_y_mark1.toString().trim()!=='') {



                    

             
             
                     this.axis_y_mark1_lock.style.position='absolute';

                     this.axis_y_mark1_lock.style.fontSize = '9pt';

                     this.axis_y_mark1_lock.style.color = 'red';

            
                     const svgPoint = entries[i].target.createSVGPoint(); // For SVGPoint
              
                     svgPoint.x = niceMaxx; // Your SVG x-coordinate

                     svgPoint.y =niceMin+niceMax-parseFloat(this.axis_y_mark1); // Your SVG y-coordinate

                     const ctm2 = entries[i].target.getScreenCTM();

                     let bb  = entries[i].target.getBoundingClientRect();

                     const clientPoint = svgPoint.matrixTransform(ctm2);

                     if (parseFloat(this.axis_y_mark1)>=parseFloat(niceMin)&&parseFloat(this.axis_y_mark1)<=parseFloat(niceMax))

                      this.axis_y_mark1_lock.style.display='';
            
                     let delta = (entries[i].target.parentNode.previousSibling)?entries[i].target.parentNode.previousSibling.clientWidth:0

                     this.axis_y_mark1_lock.style.left = clientPoint.x - bb.x + delta + 'px';

                     this.axis_y_mark1_lock.style.top = clientPoint.y - bb.y - this.axis_y_mark1_lock.clientHeight/2 +'px';
           

              } else this.axis_y_mark1_lock.style.display='none'



              if (this.axis_x_mark1.toString().trim()!=='') {




             
                     this.axis_x_mark1_lock.style.position='absolute';

                     this.axis_x_mark1_lock.style.fontSize = '9pt';

                     this.axis_x_mark1_lock.style.color = 'red';

            
                     const svgPoint = entries[i].target.createSVGPoint(); // For SVGPoint
              
                     svgPoint.x = parseFloat(this.axis_x_mark1) // Your SVG x-coordinate

                     svgPoint.y =  parseFloat(niceMin);// Your SVG y-coordinate

                     const ctm2 = entries[i].target.getScreenCTM();

                     let bb  = entries[i].target.getBoundingClientRect();

                     const clientPoint = svgPoint.matrixTransform(ctm2);


                     if (parseFloat(this.axis_x_mark1)>=parseFloat(niceMinx)&&parseFloat(this.axis_x_mark1)<=parseFloat(niceMaxx))

                         this.axis_x_mark1_lock.style.display='';
            
                     let delta = (entries[i].target.parentNode.previousSibling)?entries[i].target.parentNode.previousSibling.clientWidth:0

                     this.axis_x_mark1_lock.style.left = clientPoint.x - this.axis_x_mark1_lock.clientWidth/2-bb.x + delta + 'px';

                     this.axis_x_mark1_lock.style.top = clientPoint.y - bb.y - this.axis_x_mark1_lock.clientHeight/2 +'px';

                     

                     

           

              } else this.axis_x_mark1_lock.style.display='none'




              if (this.axis_x_mark2.toString().trim()!=='') {


             
                     this.axis_x_mark2_lock.style.position='absolute';

                     this.axis_x_mark2_lock.style.fontSize = '9pt';

                     this.axis_x_mark2_lock.style.color = 'blue';

            
                     const svgPoint = entries[i].target.createSVGPoint(); // For SVGPoint
              
                     svgPoint.x = parseFloat(this.axis_x_mark2) // Your SVG x-coordinate

                     svgPoint.y =  parseFloat(niceMin);// Your SVG y-coordinate

                     const ctm2 = entries[i].target.getScreenCTM();

                     let bb  = entries[i].target.getBoundingClientRect();

                     const clientPoint = svgPoint.matrixTransform(ctm2);

                    if (parseFloat(this.axis_x_mark2)>=parseFloat(niceMinx)&&parseFloat(this.axis_x_mark2)<=parseFloat(niceMaxx))

                        this.axis_x_mark2_lock.style.display='';
            
                     let delta = (entries[i].target.parentNode.previousSibling)?entries[i].target.parentNode.previousSibling.clientWidth:0

                     this.axis_x_mark2_lock.style.left = clientPoint.x - this.axis_x_mark2_lock.clientWidth/2-bb.x + delta + 'px';

                     this.axis_x_mark2_lock.style.top = clientPoint.y - bb.y - this.axis_x_mark2_lock.clientHeight/2 +'px';

                     

                     

           

              } else this.axis_x_mark2_lock.style.display='none'










              if (this.axis_y_mark2.toString().trim()!=='') {

             
                     this.axis_y_mark2_lock.style.position='absolute';

                     this.axis_y_mark2_lock.style.fontSize = '9pt';

                     this.axis_y_mark2_lock.style.color = 'blue';

            
                     const svgPoint = entries[i].target.createSVGPoint(); // For SVGPoint
              
                     svgPoint.x = niceMaxx; // Your SVG x-coordinate

                     svgPoint.y =niceMin+niceMax-parseFloat(this.axis_y_mark2); // Your SVG y-coordinate

                     const ctm2 = entries[i].target.getScreenCTM();

                      let bb  = entries[i].target.getBoundingClientRect();

                      const clientPoint = svgPoint.matrixTransform(ctm2);

                      if (parseFloat(this.axis_y_mark2)>=parseFloat(niceMin)&&parseFloat(this.axis_y_mark2)<=parseFloat(niceMax))

                       this.axis_y_mark2_lock.style.display=''
            
                      let delta = (entries[i].target.parentNode.previousSibling)?entries[i].target.parentNode.previousSibling.clientWidth:0

                      this.axis_y_mark2_lock.style.left = clientPoint.x - bb.x + delta + 'px';

                      this.axis_y_mark2_lock.style.top = clientPoint.y - bb.y - this.axis_y_mark2_lock.clientHeight/2 +'px';

              
              } else this.axis_y_mark2_lock.style.display='none'


              continue;


             }


             let axisY = (entries[i].target.querySelector('.svg-scale'))?true:false;

          


             let niceMin =  parseFloat(entries[i].target.dataset.niceMin);

             let niceMax =  parseFloat(entries[i].target.dataset.niceMax);

             let tickSpacing =  parseFloat(entries[i].target.dataset.tickSpacing);

             let text_length =  parseFloat(entries[i].target.dataset.text_length);     
         
         
             let svg1 = (axisY)?entries[i].target.querySelector('.svg-scale'):entries[i].target.querySelector('.svgx-scale');

             svg1.querySelectorAll('line').forEach(element => {
               element.remove();
             });

             entries[i].target.querySelectorAll('div').forEach(element => {
                element.remove();
            });

             if (!axisY&&!this.axis_x_visible) continue;

             if (axisY&&!this.axis_y_visible) continue;

             let v = niceMin; 

              let xmlns = "http://www.w3.org/2000/svg";

              let l = document.createElementNS(xmlns, 'line');


            if (axisY) {

             
              l.setAttribute('x1', text_length+20);

              l.setAttribute('x2', text_length+20);

              l.setAttribute('y1', niceMin);

              l.setAttribute('y2', niceMax);

            
             

            } else {

              l.setAttribute('x1', niceMin);

              l.setAttribute('x2', niceMax);

              l.setAttribute('y1', 0);

              l.setAttribute('y2', 0);


            }

            l.setAttribute('stroke-width', '0.1');

            l.setAttribute('stroke', 'black');

            l.setAttribute('vector-effect', 'non-scaling-stroke');

            svg1.appendChild(l)

            while (v<=niceMax){


            let xmlns = "http://www.w3.org/2000/svg";

            let l = document.createElementNS(xmlns, 'line');

            let txt = document.createElement('div');

            txt.style.font = '9pt Calibri';

            txt.innerText = (v).toString();

            txt.style.position = 'absolute';

            if (axisY) txt.style.right = '10px';
            else txt.style.top = '7px';

            if (axisY) txt.style.textAlign = 'right';
            else txt.style.textAlign = 'center';


            let bb = entries[i].target.getBoundingClientRect();

            const point = svg1.createSVGPoint();
          
            if (axisY) {
            
             point.x = 0; 
          
             point.y = niceMin+niceMax-v;
            
            } else {

             point.y = 0; 
          
             point.x = v;

            } 

            const matrix = svg1.getScreenCTM();
          
            const clientPoint = point.matrixTransform(matrix);

          

            if (axisY) txt.style.top = clientPoint.y-bb.y - th.measureText('Calibri', '9', (v).toString()).height/2 +'px';
            else  txt.style.left = clientPoint.x - bb.x - th.measureText('Calibri', '9', (v).toString()).width/2 +'px';

            entries[i].target.appendChild(txt);

 
            if (axisY) {

             l.setAttribute('x1', text_length+13);

             l.setAttribute('x2', text_length+20);

             l.setAttribute('y1', (niceMin+niceMax-v).toString());

             l.setAttribute('y2', (niceMin+niceMax-v).toString());

            } else {

             l.setAttribute('x1', v);

             l.setAttribute('x2', v);

             l.setAttribute('y1', (0).toString());

             l.setAttribute('y2', (5).toString());

            }
            
            l.setAttribute('stroke-width', '0.1');

            l.setAttribute('stroke', 'black');

            l.setAttribute('vector-effect', 'non-scaling-stroke');

         
            svg1.appendChild(l)

            v+= tickSpacing;
         
          }


           //}




         }


         


    }

    render () {

        if (this.first_render) {

         this.first_render = false;

         this.legend_div = document.createElement('div');

         //if (!this.table_div) {

         //  this.table_div = document.createElement('div');

         //  this.sheet.frame.appendChild(this.table_div);

         // }


        




         //this.legend_div.style.width = '200px';

         //this.legend_div.style.height = '300px';

         //this.legend_div.style.backgroundColor ='red';


         
         this.wo.render();   

         this.wo.frame.onmousedown = () => this.sheet.select(this);

         let head = this.wo.frame.querySelector('.window-head');

         let body = this.wo.frame.querySelector('.window-body');

         body.style.backgroundColor = 'transparent';

         this.wo.frame.style.backgroundColor = 'transparent';
         

        // let cog = document.createElement('div');

         let toolbar = document.createElement('div');

         toolbar.style.position = 'absolute';

         toolbar.style.right = '3px';

         toolbar.style.top = '2px';

         toolbar.style.display = 'flex';

         toolbar.style.flexDirection = 'row';



         /*let wo_margin = document.createElement('div');

         wo_margin.style.cursor = 'pointer'

         wo_margin.title = 'Изменять размер диаграммы в целом'

         wo_margin.style.width = '20px';

         wo_margin.style.border = 'solid black 2px';*/



         this.whole_resize = document.createElement('div');

         this.whole_resize.style.cursor = 'pointer'

         this.whole_resize.style.color = 'red'

         this.whole_resize.innerHTML = '<i class="fa-solid fa-border-none"></i>'

         this.whole_resize.title = 'Изменять размер диаграммы в целом'

         this.whole_resize.style.paddingRight='5px'

         this.whole_resize.onclick = () => {

           this.whole_resize.style.color = 'red';

           this.margin_resize.style.color = 'black';

           this.resizeing_mode = 'whole'
           

         }


         this.margin_resize = document.createElement('div');

         this.margin_resize.style.cursor = 'pointer'

         this.margin_resize.innerHTML = '<i class="fa-solid fa-border-all"></i>'

         this.margin_resize.title = 'Изменять размер полей диграммы'

         this.margin_resize.style.paddingRight='10px'

         this.margin_resize.onclick = () => {

           this.whole_resize.style.color = 'black';

           this.margin_resize.style.color = 'red';

           this.resizeing_mode = 'margin'
           

         }


         //margin_left.style.width = '12px';

         //margin_left.style.height = '12px';
         

         //margin_left.style.borderLeft = 'solid blue 2px';

         //margin_left.style.borderTop = 'solid gray 2px';
         
         //margin_left.style.borderBottom = 'solid gray 2px';

         //margin_left.style.borderRight = 'solid gray 2px';

         //margin_left.style.marginLeft='12px';



         //let wo_margin = document.createElement('div');

         //wo_margin.style.cursor = 'pointer'

         //wo_margin.title = 'Изменять размер диаграммы в целом'

         //wo_margin.style.width = '12px';

         //wo_margin.style.height = '12px';
         
         //wo_margin.style.border = 'solid blue 2px';

         //wo_margin.style.paddingLeft='5px';







        // cog.innerHTML = `<i class="fa fa-cog"></i>`

        // cog.style.cursor = 'pointer'

        //  cog.title = 'Привязать данные'

         toolbar.appendChild(this.margin_resize);

         toolbar.appendChild(this.whole_resize);

         //toolbar.appendChild(wo_margin);
     
         head.appendChild(toolbar);
 
        }  

       let body = this.wo.frame.querySelector('.window-body');


       if (body.firstChild) {
        
         body.firstChild.remove();

         this.resizer.disconnect();

       } 

       

        this.container = document.createElement('div');

        this.container.classList.add('container')  
      

        this.container.style.position = 'absolute';

        this.container.style.left = this.app.cscale*this.cleft + this.app.cscale*4 - 4 + 'px';
      
        this.container.style.top = this.app.cscale*this.ctop + 'px';

        this.container.style.border = '1px solid gray'
      
        this.container.style.bottom = this.app.cscale*this.cbottom + 'px';
      
        this.container.style.right = this.app.cscale*this.cright - this.app.cscale*4 + 4 +'px';

        this.container.style.display='flex';
       
        this.container.style.flexDirection='row';


       /* let container_top = document.createElement('div');

        this.set_action (container_top, 'resize-north')

        container_top.style.position = 'absolute';

        container_top.style.left = '0px';

        container_top.style.right = '0px';

        container_top.style.top = '0px';

        container_top.style.height = '2px';

        container_top.style.cursor = 'row-resize';

        container_top.style.zIndex='10000';


        let container_bottom = document.createElement('div');

        this.set_action (container_bottom, 'resize-south')

        container_bottom.style.position = 'absolute';

        container_bottom.style.left = '0px';

        container_bottom.style.right = '0px';

        container_bottom.style.bottom = '0px';

        container_bottom.style.height = '2px';

        container_bottom.style.cursor = 'row-resize';

         container_bottom.style.zIndex='10000';



        let container_left = document.createElement('div');


        this.set_action (container_left, 'resize-west')

        container_left.style.position = 'absolute';

        container_left.style.top = '0px';

        container_left.style.bottom = '0px';

        container_left.style.left = '0px';

        container_left.style.width = '2px';

        container_left.style.cursor = 'col-resize';
         container_left.style.zIndex='10000';



        let container_right = document.createElement('div');

        this.set_action (container_right, 'resize-east')

        container_right.style.position = 'absolute';

        container_right.style.top = '0px';

        container_right.style.bottom = '0px';

        container_right.style.right = '0px';

        container_right.style.width = '2px';

        container_right.style.cursor = 'col-resize';

        container_right.style.zIndex='10000';



         container.appendChild(container_top)

        container.appendChild(container_bottom)

         container.appendChild(container_left)

         container.appendChild(container_right)
        
        */





       let main = document.createElement('div');

       let scale = document.createElement('div');

       let scalex = document.createElement('div');

       body.style.display='flex';
       
       body.style.flexDirection='row';


       main.style.flex='1';

       main.style.display='flex';

       main.style.flexDirection='column';


       scale.style.flex='1';

       scalex.style.flex='1';




         for  (let i =0; i< this.table.table_cells.length;i++) {

            let cell = this.sheet.rows[this.table.table_cells[i].row].cells[this.table.table_cells[i].col] 

            cell.table_value = '';

            cell.render();


         }

 
         this.table.table_cells = [];

      


         if (this.table.show&&this.current_table&&parseFloat(this.diagram_id)!==-1) {



      

           let pos = this.table.pos.split('$');

           if (pos.length===2&&pos[1].toString().trim()!=='') {

             let col = this.app.col_names.indexOf(pos[0]);

             let row = parseFloat(pos[1])

             if (row!==NaN&&row>0&&col!==-1&&this.current_table.length) {

                let min_x = parseFloat(this.current_table[0].x);
                
                let min_y = parseFloat(this.current_table[0].y);


                for (let i = 0;i<this.current_table.length;i++) {

                   if ( parseFloat(this.current_table[i].x) < min_x) min_x = parseFloat(this.current_table[i].x);

                   if ( parseFloat(this.current_table[i].y) < min_y) min_y = parseFloat(this.current_table[i].y);

                }
                


                for (let i = 0;i<this.current_table.length;i++) {

                  let cell = this.sheet.rows[row-1 + parseFloat(this.current_table[i].y)-min_y].cells[col + parseFloat(this.current_table[i].x)-min_x] 


                  this.table.table_cells.push({row:row-1 + parseFloat(this.current_table[i].y)-min_y, col:col + parseFloat(this.current_table[i].x)-min_x})

                 
                  if (this.table.pres.toString().trim()!==''&&isNumber(this.current_table[i].value))  cell.table_value =  DecimalPrecision3.round(parseFloat(this.current_table[i].value), Math.floor(parseFloat(this.table.pres))).toString() 
                 
                  else cell.table_value = this.current_table[i].value;

                  cell.render()
                  
                  
                  //this.sheet.rows[row-1 + parseFloat(this.current_table[i].y)].cells[col - parseFloat(this.current_table[i].x)].value = this.current_table[i].value;
                  
                  //this.sheet.rows[row-1 + parseFloat(this.current_table[i].y)].cells[col - parseFloat(this.current_table[i].x)].render();
                  
              

                }


             }
            
           } 

          
          

         }  

       if (this.diagram_id===-1) {


          //this.current_data = 0;

         //this.current_table = 0;


         //this.auto_x_min = 0;

         //this.auto_x_max = 0;
         
         //this.auto_y_min = 0;

        // this.auto_y_max = 0;

         //this.auto_y_step = 0;

        // this.auto_x_step = 0;


       }  



       if (this.current_data) {

        



         let cd = this.current_data.find(o=>o.diag_no === parseFloat(this.diagram_id))


         if (!cd) cd = {
             "diag_no": -1,"points": [],"colors": [], "colors0": [], "linestyles": [],"legends": []}


         let xmlns = "http://www.w3.org/2000/svg";

         let svg = document.createElementNS(xmlns, 'svg');

         svg.classList.add("svg-main");

         svg.setAttribute('preserveAspectRatio', 'none');

         svg.setAttribute('width',  '100%');

         svg.setAttribute('height', '100%');



          //let xmlns = "http://www.w3.org/2000/svg";

         let svg1 = document.createElementNS(xmlns, 'svg');

         svg1.setAttribute('preserveAspectRatio', 'none');

         svg1.setAttribute('width',  '100%');

         svg1.setAttribute('height', '100%');

         svg1.classList.add("svg-scale");



         let svg1x = document.createElementNS(xmlns, 'svg');

         svg1x.setAttribute('preserveAspectRatio', 'none');

         svg1x.setAttribute('width',  '100%');

         svg1x.setAttribute('height', '100%');

         svg1x.classList.add("svgx-scale");





         let min_x = (cd.points.length)?parseFloat(cd.points[0][0].x):0
         
         let min_y = (cd.points.length)?parseFloat(cd.points[0][0].y):0 
         
         let max_x = (cd.points.length)?parseFloat(cd.points[0][0].x):0
         
         let max_y = (cd.points.length)?parseFloat(cd.points[0][0].y):0

         for (let i=0;i<cd.points.length;i++) {

             for (let j=0; j<cd.points[i].length;j++) {

               if (parseFloat(cd.points[i][j].x)<min_x) min_x = parseFloat(cd.points[i][j].x)

               if (parseFloat(cd.points[i][j].x)>max_x) max_x = parseFloat(cd.points[i][j].x)

               if (parseFloat(cd.points[i][j].y)<min_y) min_y = parseFloat(cd.points[i][j].y)

               if (parseFloat(cd.points[i][j].y)>max_y) max_y = parseFloat(cd.points[i][j].y)   

             }
         
         }

         

         let rr = new niceScale(min_y, max_y);

         let rrx = new niceScale(min_x, max_x);


         min_y = rr.niceMin;

         max_y = rr.niceMax;

         min_x = rrx.niceMin;

         max_x = rrx.niceMax;

         


         this.auto_x_min = rrx.niceMin;

         this.auto_x_max = rrx.niceMax;
         
         this.auto_y_min = rr.niceMin;

         this.auto_y_max = rr.niceMax;

         this.auto_y_step = rr.tickSpacing;

         this.auto_x_step = rrx.tickSpacing;


         if  (this.axis_x_min.toString().trim()!=='') rrx.niceMin = parseFloat(this.axis_x_min);

         if  (this.axis_x_max.toString().trim()!=='') rrx.niceMax = parseFloat(this.axis_x_max);


         if  (this.axis_y_min.toString().trim()!=='') rr.niceMin = parseFloat(this.axis_y_min);

         if  (this.axis_y_max.toString().trim()!=='') rr.niceMax = parseFloat(this.axis_y_max);

         if  (this.axis_x_step.toString().trim()!=='') rrx.tickSpacing = parseFloat(this.axis_x_step);

         if  (this.axis_y_step.toString().trim()!=='') rr.tickSpacing = parseFloat(this.axis_y_step);



         //let tmax_x = (this.axis_x_max.toString().trim()==='')?max_x:parseFloat(this.axis_x_max);

         //let tmin_y = (this.axis_y_min.toString().trim()==='')?min_y:parseFloat(this.axis_y_min);
         //let tmax_y = (this.axis_y_max.toString().trim()==='')?max_y:parseFloat(this.axis_y_max);
         
         //rr = new niceScale(tmin_y, tmax_y);

         //rrx = new niceScale(tmin_x, tmax_x);


         min_y = rr.niceMin;

         max_y = rr.niceMax;

         min_x = rrx.niceMin;

         max_x = rrx.niceMax;
         




         let prc = 1.1*(max_y-min_y);

         let prcx = 1.1*(max_x-min_x);

         let vby0 = (!this.axis_x_visible)?(min_y - 0.05*(max_y-min_y)).toString():(min_y - 0.1*(max_y-min_y)).toString();

         let vbx0= (this.axis_y_visible)?min_x.toString():(min_x - 0.05*(max_x-min_x)).toString();

         svg.setAttribute('viewBox', vbx0 +' '+ vby0 + ' '+(prcx).toString()+' '+(prc).toString());


         let tt = min_y+rr.tickSpacing;;

         while (tt<=max_y){

          if (!this.grid_y_visible) break; 

          let l = document.createElementNS(xmlns, 'line');

          l.setAttribute('y1', (rr.niceMin+rr.niceMax-tt).toString());

          l.setAttribute('y2', (rr.niceMin+rr.niceMax-tt).toString());

          l.setAttribute('x1', (min_x).toString());

          l.setAttribute('x2', (max_x).toString());

          l.setAttribute('stroke-width', '0.1');

          l.setAttribute('stroke', 'black');

          l.setAttribute('vector-effect', 'non-scaling-stroke');

          svg.appendChild(l);

          tt+=rr.tickSpacing;


         }

         tt = min_x;

         while (tt<=max_x){

           if (!this.grid_x_visible) break; 

          let l = document.createElementNS(xmlns, 'line');

          l.setAttribute('y1', (min_y).toString());

          l.setAttribute('y2', (max_y).toString());

          l.setAttribute('x1', (tt).toString());

          l.setAttribute('x2', (tt).toString());

          l.setAttribute('stroke-width', '0.1');

          l.setAttribute('stroke', 'black');

          l.setAttribute('vector-effect', 'non-scaling-stroke');

          svg.appendChild(l);

          tt+=rrx.tickSpacing;


         }


         if (this.axis_x_mark1.toString().trim()!=='') {

             console.log('hurra!!!!!!')

             let l = document.createElementNS(xmlns, 'line');

             l.setAttribute('stroke-width', '1');

             l.setAttribute('stroke', 'red');

             l.setAttribute('vector-effect', 'non-scaling-stroke');

             l.setAttribute('x1', this.axis_x_mark1.toString());

             l.setAttribute('x2', this.axis_x_mark1.toString());

             l.setAttribute('y1', (max_y).toString());

             l.setAttribute('y2', (min_y).toString());

             svg.appendChild(l);

         }


          if (this.axis_x_mark2.toString().trim()!=='') {

             let l = document.createElementNS(xmlns, 'line');

             l.setAttribute('stroke-width', '1');

             l.setAttribute('stroke', 'blue');

             l.setAttribute('vector-effect', 'non-scaling-stroke');

             l.setAttribute('x1', this.axis_x_mark2.toString());

             l.setAttribute('x2', this.axis_x_mark2.toString());

             l.setAttribute('y1', (max_y).toString());

             l.setAttribute('y2', (min_y).toString());

             svg.appendChild(l);

         }
  
   
   
   
   
        
  
   
   
   
   
   
   
   
   
   
   
   
         for (let i=0;i<cd.points.length;i++) {

           let darray ="";
  
           if (cd.linestyles[i]==='dash') darray = '5,5'
  
           if (cd.linestyles[i]==='dashdot') darray = '6,2,2'

           let g = document.createElementNS(xmlns, 'g');

           g.setAttribute('stroke-width', '1.5');

           g.setAttribute('stroke-dasharray', darray);

           g.setAttribute('stroke',cd.colors[i]);

           let p = document.createElementNS(xmlns, 'polyline');

           p.setAttribute('fill', 'none');

           p.setAttribute('vector-effect', 'non-scaling-stroke');

        
        
           let pp =  cd.points[i];
            
            pp.sort((a,b)=>{
       
            return parseFloat(a.x) - parseFloat(b.x)
    
    
            })
    

            
            let ppp = '';

           

            for (let l =0; l<pp.length; l++) {
            
             ppp+=pp[l].x.toString()+','+ (min_y+max_y-pp[l].y).toString() + ' ';
             
            } 

            

            p.setAttribute('points', ppp);

            g.appendChild(p);

            svg.appendChild(g);

           
         

         

         }


         svg.classList.add('main-svg')


         main.appendChild(svg);

         main.appendChild(scalex);

         

         this.axis_y_mark1_lock = document.createElement('div');

         this.axis_y_mark1_lock.innerHTML =  (this.axis_y_mark1_lock_opened)?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

         
         //if ()
         
         this.axis_y_mark1_lock.style.display='none'

         
         
         this.axis_y_mark1_lock.style.cursor='pointer'

         main.appendChild(this.axis_y_mark1_lock);


         this.axis_y_mark1_lock.onclick = (e)=>this.change_lock_state(e,'axis_y_mark1_lock')


         
         
         this.axis_x_mark1_lock = document.createElement('div');

         this.axis_x_mark1_lock.innerHTML =  (this.axis_x_mark1_lock_opened)?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

         this.axis_x_mark1_lock.style.display='none'

         this.axis_x_mark1_lock.style.cursor='pointer'

         main.appendChild(this.axis_x_mark1_lock);

         this.axis_x_mark1_lock.onclick = (e)=> this.change_lock_state(e,'axis_x_mark1_lock')


        

         this.axis_x_mark2_lock = document.createElement('div');

         this.axis_x_mark2_lock.innerHTML =  (this.axis_x_mark2_lock_opened)?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

         this.axis_x_mark2_lock.style.display='none'

         this.axis_x_mark2_lock.style.cursor='pointer'

         main.appendChild(this.axis_x_mark2_lock);

         this.axis_x_mark2_lock.onclick = (e)=>this.change_lock_state(e,'axis_x_mark2_lock')




        

         this.axis_y_mark2_lock = document.createElement('div');

         this.axis_y_mark2_lock.innerHTML = (this.axis_y_mark2_lock_opened)?'<i class="fa-solid fa-lock-open"></i>':'<i class="fa-solid fa-lock"></i>'

         this.axis_y_mark2_lock.style.display='none'

         this.axis_y_mark2_lock.style.cursor='pointer'

         main.appendChild(this.axis_y_mark2_lock);

         this.axis_y_mark2_lock.onclick = (e)=>this.change_lock_state(e,'axis_y_mark2_lock')




         scale.appendChild(svg1);

         scalex.appendChild(svg1x);

         this.container.appendChild(scale);

         this.container.appendChild(main);

         body.appendChild(this.container);

         body.appendChild(this.legend_div);

        


          if (this.axis_y_mark1.toString().trim()!=='') {

             let l = document.createElementNS(xmlns, 'line');

             l.setAttribute('stroke-width', '1');

             l.setAttribute('stroke', 'red');

             l.setAttribute('vector-effect', 'non-scaling-stroke');

             l.setAttribute('x1', (max_x).toString());

             l.setAttribute('x2', (min_x).toString());

             l.setAttribute('y1', (min_y+max_y-parseFloat(this.axis_y_mark1)).toString());

             l.setAttribute('y2', (min_y+max_y-parseFloat(this.axis_y_mark1)).toString());

             svg.appendChild(l);

             

         }


           if (this.axis_y_mark2.toString().trim()!=='') {

             let l = document.createElementNS(xmlns, 'line');

             l.setAttribute('stroke-width', '1');

             l.setAttribute('stroke', 'blue');

             l.setAttribute('vector-effect', 'non-scaling-stroke');

             l.setAttribute('x1', (max_x).toString());

             l.setAttribute('x2', (min_x).toString());

             l.setAttribute('y1', (min_y+max_y-parseFloat(this.axis_y_mark2)).toString());

             l.setAttribute('y2', (min_y+max_y-parseFloat(this.axis_y_mark2)).toString());

             svg.appendChild(l);

         }

        




         let text_length = 0;

         for (let i = 0; i<rr.maxTicks;i++) {

          let t = this.measureText('Calibri', '9', (rr.niceMin + i*rr.tickSpacing).toString()).width; 

          if (t>text_length) text_length = t;
   
         }


         let text_height = 0;

         for (let i = 0; i<rrx.maxTicks;i++) {

          let t = this.measureText('Calibri', '9', (rrx.niceMin + i*rrx.tickSpacing).toString()).height; 

          if (t>text_height) text_height = t;
   
         }


        if (!this.axis_x_visible) svg1.setAttribute('viewBox', '0' +' '+ (min_y - 0.05*(max_y-min_y)).toString() + ' '+(text_length+20).toString()+' '+(prc).toString());

        else  svg1.setAttribute('viewBox', '0' +' '+ (min_y - 0.1*(max_y-min_y)).toString() + ' '+(text_length+20).toString()+' '+(prc).toString());




        svg.dataset.niceMin = rr.niceMin; 

        svg.dataset.niceMax = rr.niceMax; 


        svg.dataset.niceMinx = rrx.niceMin; 

        svg.dataset.niceMaxx = rrx.niceMax; 


         scale.dataset.niceMin = rr.niceMin;

         scale.dataset.niceMax = rr.niceMax;

         scale.dataset.tickSpacing = rr.tickSpacing;

         scale.dataset.maxTicks = rr.maxTicks;

         scale.dataset.text_length = text_length;
         
         

         scale.style.minWidth = (this.axis_y_visible)?(this.app.cscale*(text_length+20)).toString() + 'px':'0px';

         scale.style.maxWidth = (this.axis_y_visible)?(this.app.cscale*(text_length+20)).toString() + 'px':'0px';

         scale.style.maxHeight = (this.axis_x_visible)?`calc(100% - ${text_height + 10}px)`:'';

         scale.style.position='relative';
         

         if (!this.axis_y_visible)
            svg1x.setAttribute('viewBox', (min_x - 0.05*(max_x-min_x)).toString() +' '+ '0' + ' '+(prcx).toString()+' '+(text_height + 10).toString());

         else svg1x.setAttribute('viewBox', (min_x).toString() +' '+ '0' + ' '+(prcx).toString()+' '+(text_height + 10).toString());

         scalex.dataset.niceMin = rrx.niceMin;

         scalex.dataset.niceMax = rrx.niceMax;

         scalex.dataset.tickSpacing = rrx.tickSpacing;

         scalex.dataset.maxTicks = rrx.maxTicks;

         scalex.dataset.text_length = text_height;
         
         

         scalex.style.minHeight = (this.axis_x_visible)?(text_height+10).toString() + 'px':'0px';

         scalex.style.maxHeight = (this.axis_x_visible)?(text_height+10).toString() + 'px':'0px';

         scalex.style.position='relative';


         this.render_legend(cd);


         this.resizer.observe(scale);

         this.resizer.observe(scalex);

         this.resizer.observe(svg);


       }

       if (this.selected) {

        //this.app.object_properties.
        
        let ii = this.app.object_properties.frame.querySelector('.axis_x_max');

      

        ii.value = (this.axis_x_max.toString().trim()!=='')?this.axis_x_max:this.auto_x_max;

        ii = this.app.object_properties.frame.querySelector('.axis_x_min');

        ii.value =  (this.axis_x_min.toString().trim()!=='')?this.axis_x_min:this.auto_x_min

        ii = this.app.object_properties.frame.querySelector('.axis_y_min');

        ii.value = (this.axis_y_min.toString().trim()!=='')?this.axis_y_min:this.auto_y_min

        ii = this.app.object_properties.frame.querySelector('.axis_y_max');

        ii.value = (this.axis_y_max.toString().trim()!=='')?this.axis_y_max:this.auto_y_max

        ii = this.app.object_properties.frame.querySelector('.axis_y_step');

        ii.value = (this.axis_y_step.toString().trim()!=='')?this.axis_y_step:this.auto_y_step

        ii = this.app.object_properties.frame.querySelector('.axis_x_step');

        ii.value = (this.axis_x_step.toString().trim()!=='')?this.axis_x_step:this.auto_x_step

        
        
        
  


       } 
        
        //this.app.object_properties.render('diagram')

    }




    load_data (epura_no, epura_data_all, epura_data_table, slist, dlist, settings, dg_no = 'dummy') {
   
       let res_data = [];

       let res_table = [];
    
       let diags = dlist.filter(o=>o.pdiag_plot_no===epura_no);
  
       let start = 0;
  
       let end = diags.length-1;
  
       if (dg_no!=='dummy') {
  
       let idx = diags.findIndex(o=>o.pdiag_no===dg_no)
  
        if (idx!==-1){
  
           start = idx;
  
           end = idx;
  
         }
  
  
         }
          
       for (let v= start; v<=end;v++) {
    
         let res = {} 
    
          let fields = [];

    
          let edata = epura_data_all.filter(o=>o.pdiag_no===diags[v].pdiag_no)


    
         res_data.push({diag_no:diags[v].pdiag_no, points:[]})
    
         for (let i =0; i<edata.length;i++) {
       
          let item = edata[i];
        
          if (item.x===null||item.x===undefined||item.x.toString==='') continue;
       
          if (fields.indexOf(item.x)===-1) fields.push(item.x)
    
        }

     
    
        fields.sort((a,b)=>{return parseFloat(a) - parseFloat(b)}) 

    
    
        let points = [];
    
    
        let colors = [];
    
      
        let colors0 = [];
    
        let linestyles = [];
    
      
        let legends = [];
     
    
        let used = [];  
    
     
         
        for (let i =0; i<edata.length;i++) {
    
          let item = edata[i];
    
          if (item.x===null||item.x===undefined||item.x.toString==='') continue; 
            
    
          let tt = Object.keys(res).indexOf(item.calc_date.toString()+'_'+item.pline_no.toString()); 
    
          let jjj =slist.findIndex(o=>o.pline_no===item.pline_no)
          
          if (slist[jjj].pline_datescount===2||slist[jjj].pline_datescount==='2') {
    
              if (used.find(o=>o.no===item.pline_no.toString()&&o.legend!==item.calc_date.toString())) continue;
           
              used.push({legend:item.calc_date.toString(), no:item.pline_no.toString()})  
    
          }   
    
    
    
    
          
    
         
    
        
    
          if (tt===-1) {
    
              if (jjj!==-1&&(slist[jjj].pline_flags===1))  legends.push("hidden")  
    
              else {
              
                 let tt =   item.calc_date.toString().split(' ');
    
                 let pp =tt[0].split('-')
    
                  legends.push(pp[2]+'-'+pp[1]+'-'+pp[0]+' '+tt[1])  
              
              }    
    
            
              points.push([]);
    
          
              let iii = settings.findIndex(o=>o.pset_no===item.pset_no);
            
              let clr = settings[iii].pset_color.toString(16);
    
           
    
            if (settings[iii].pset_linetype===2||settings[iii].pset_linetype==='2') linestyles.push('dash')
  
            else if (settings[iii].pset_linetype===3 || settings[iii].pset_linetype==='3') linestyles.push('dashdot')
  
            else linestyles.push('')
    
    
            let clrr = ''
            
    
    
            let tt = clr.length
    
    
            for  (let i=0;i<6-tt;i++) clr = '0'+clr; 
    
            clrr = clr[4]+clr[5]+clr[2]+clr[3]+clr[0]+clr[1]
             
          
            colors.push('#'+clrr)
    
            colors0.push(clrr.toUpperCase())
            
          
          
            res[item.calc_date.toString()+'_'+item.pline_no.toString()] = {};
    
            let tt1 = Object.keys(res).indexOf(item.calc_date.toString()+'_'+item.pline_no.toString()); 
         
            for (let j=0;j<fields.length; j++) {

           

              let f = (fields[j]!==null&&fields[j]!==undefined&&fields[j].toString()!=='')?fields[j].toString():''

      

              
              res[item.calc_date.toString()+'_'+item.pline_no.toString()][f] = '';
            
            }
            
            
            res[item.calc_date.toString()+'_'+item.pline_no.toString()][item.x.toString()] = (item.y!==null&&item.y!==undefined&&item.y.toString()!=='')?item.y.toString():''
    
            if (item.y!==null&&item.y!==undefined&&item.y.toString()!=='') {

    
              points[tt1].push({x:(parseFloat(item.x)).toString(), y:(parseFloat(item.y)).toString()}) 
    
    
            }
    
    
    
          } else {
  
            res[item.calc_date.toString()+'_'+item.pline_no.toString()][item.x.toString()] = (item.y!==null&&item.y!==undefined&&item.y.toString()!=='')?item.y.toString():''
    
            if (item.y!==null&&item.y!==undefined&&item.y.toString()!=='') {
    
              points[tt].push({x:(parseFloat(item.x)).toString(), y:parseFloat(item.y).toString()}) 
    
    
    
            }
    
          }  
    
        } 
    
    
    
            
    
        res_data[res_data.length-1].points = points
    
        res_data[res_data.length-1].colors = colors
    
        res_data[res_data.length-1].colors0 = colors0
    
        res_data[res_data.length-1].linestyles = linestyles

        res_data[res_data.length-1].legends = legends;
        
        
        
      }
    
    

      
      this.current_table =  epura_data_table; 
  
      this.current_data = res_data;

  

      this.render();
         

    }

    render_legend(cd) {


      this.legend_div.innerHTML = '';

      this.legend_div.style.overflow = 'hidden';

      this.legend_div.style.justifyContent='center';

      if (this.legend.show) {

          this.legend_div.style.display = '';

          this.legend_div.style.position = 'absolute';

          this.legend_div.style.bottom = '';

          this.legend_div.style.top = '';

          this.legend_div.style.right = '';

          this.legend_div.style.left = '';

          


        if (this.legend.pos === 'right') {

          this.legend_div.style.top = '5px';

          this.legend_div.style.bottom = '5px';

          this.legend_div.style.right = '5px';

          this.legend_div.style.display='flex';

          this.legend_div.style.flexFlow='column wrap';
        } 
        else if (this.legend.pos === 'left'){

          this.legend_div.style.top = '5px';

          this.legend_div.style.bottom = '5px';

          this.legend_div.style.left = '5px';

          this.legend_div.style.display='flex';

          this.legend_div.style.flexFlow='column wrap';

        }
         else if (this.legend.pos === 'top'){

     

          this.legend_div.style.top = '5px';

          this.legend_div.style.left = '5px';

          this.legend_div.style.right = '5px';
          
          this.legend_div.style.display='flex';

          this.legend_div.style.flexFlow='row wrap';

        } 
        else if (this.legend.pos === 'bottom'){

          this.legend_div.style.bottom = '5px';

          this.legend_div.style.left = '5px';

          this.legend_div.style.right = '5px';
          

          this.legend_div.style.display='flex';

          this.legend_div.style.flexFlow='row wrap';

        } 




        /*
        
        let kk=false;

              for (let i = 0; i<diag1.ser_names.length;i++ ) {

                if (diag1.ser_names[i]==='hidden'&&!kk) {diag1.ser_names[i]='K1'; kk= true;}

                if (diag1.ser_names[i]==='hidden'&&kk) {diag1.ser_names[i]='K2'; kk= true;}
                



              }
        
        */


        let kk = false; 

        for (let i =0;i<cd.legends.length;i++) {

        
          let el = document.createElement('div');

          el.style.fontSize = '9pt'

          el.style.whiteSpace = 'nowrap'

          el.style.color = cd.colors[i];

          el.style.display = 'flex';

          el.style.paddingLeft = '5px';

          el.style.flexDirection = 'row';

          this.legend_div.appendChild(el);


          let el0 = document.createElement('div');

          el0.style.minWidth = '20px';
          
          el0.style.maxWidth = '20px';

          let el1 = document.createElement('div');

          el.appendChild(el0);

          el.appendChild(el1);

          let legend = cd.legends[i];

          if (legend ==='hidden') {
           
            if (!kk) {legend = 'K1'; kk = true;}
            else legend = 'K2'

          } 
           el1.innerHTML = legend;

           let xmlns = "http://www.w3.org/2000/svg";

          let svg = document.createElementNS(xmlns, 'svg');

          svg.setAttribute('viewBox', '0 0 20 15');

          svg.style.width='20px';

          svg.style.height='15px'
          

          let l = document.createElementNS(xmlns, 'line');



          let darray ="";
  
          if (cd.linestyles[i]==='dash') darray = '5,5'
  
          if (cd.linestyles[i]==='dashdot') darray = '6,2,2'

           //let g = document.createElementNS(xmlns, 'g');

           //g.setAttribute('stroke-width', '1.5');

           l.setAttribute('stroke-dasharray', darray);

           l.setAttribute('stroke-width', '1.5');

           l.setAttribute('stroke', cd.colors[i]);

           l.setAttribute('vector-effect', 'non-scaling-stroke');

           l.setAttribute('x1', 0);

           l.setAttribute('x2', 20);

           l.setAttribute('y1', 6);

           l.setAttribute('y2', 6);

           svg.appendChild(l);

           el0.appendChild(svg);

          
        
        }

       

      } else  this.legend_div.style.display = 'none';

    
    
    }

    select() {

      this.selected = true;

      this.wo.frame.classList.add('active-animation');

    

      this.app.object_properties.render('diagram');

      this.render();

    }

    deselect() {

      this.selected = false;

      this.wo.frame.classList.remove('active-animation');

      this.render();

    }


    resizeing(dir, new_size) {


      if (this.resizeing_mode === 'margin') {


        if (dir === 'resize-north') {

           let start = this.container.clientHeight;

           this.wo.frame.style.top = new_size.top + 'px';
             
           this.wo.frame.style.minHeight =  new_size.height + 'px';

           this.wo.frame.style.maxHeight =  new_size.height + 'px';

           let end = this.container.clientHeight;

           this.ctop = parseFloat(this.container.style.top) - start + end

           this.container.style.top =  this.ctop +'px'

        }


         if (dir === 'resize-south') {

           let start = this.container.clientHeight;

           this.wo.frame.style.top = new_size.top + 'px';
             
           this.wo.frame.style.minHeight =  new_size.height + 'px';

           this.wo.frame.style.maxHeight =  new_size.height + 'px';

           let end = this.container.clientHeight;

           this.cbottom =  parseFloat(this.container.style.bottom) - start + end

           this.container.style.bottom = this.cbottom +'px'

        }


        if (dir === 'resize-east') {

           let start = this.container.clientWidth;

           this.wo.frame.style.minWidth =  new_size.width + 'px';

           this.wo.frame.style.maxWidth =  new_size.width + 'px';

           let end = this.container.clientWidth;

           this.cright = parseFloat(this.container.style.right) - start + end

           this.container.style.right = this.cright +'px'

        }

        if (dir === 'resize-west') {

           let start = this.container.clientWidth;

           this.wo.frame.style.left = new_size.left + 'px';
             
           this.wo.frame.style.minWidth =  new_size.width + 'px';

           this.wo.frame.style.maxWidth =  new_size.width + 'px';

           let end = this.container.clientWidth;

           this.cleft =  parseFloat(this.container.style.left) - start + end

           this.container.style.left = this.cleft + 'px'

        }


        

        return false;


      }

      
      if (dir === 'resize-north'||dir === 'resize-south') {

          if (this.axis_y_mark1.toString().trim()!==''&&this.axis_y_mark2.toString().trim()!=='')
          if (!this.axis_y_mark1_lock_opened&&!this.axis_y_mark2_lock_opened) return false;

           if ((this.axis_y_mark1.toString().trim()!==''&&!this.axis_y_mark1_lock_opened)||
             (this.axis_y_mark2.toString().trim()!==''&&!this.axis_y_mark2_lock_opened)){

              let mark = 0;

              if ((this.axis_y_mark1.toString().trim()!==''&&!this.axis_y_mark1_lock_opened)) {mark = parseFloat(this.axis_y_mark1)}
              else mark = parseFloat(this.axis_y_mark2)


               let nmin = (this.axis_y_min.toString().trim()==='')?parseFloat(this.auto_y_min):parseFloat(this.axis_y_min);

               let nmax = (this.axis_y_max.toString().trim()==='')?parseFloat(this.auto_y_max):parseFloat(this.axis_y_max);

               let svg = this.wo.frame.querySelector('.svg-main');
            
               const svgPoint = svg.createSVGPoint(); // For SVGPoint
              
               svgPoint.x = parseFloat(0); 

               svgPoint.y = nmin+nmax-parseFloat(mark); 

               const ctm = svg.getScreenCTM();

               const clientPoint1 = svgPoint.matrixTransform(ctm);

               if (dir === 'resize-south'){

                 this.wo.frame.style.minHeight =  new_size.height + 'px';

                 this.wo.frame.style.maxHeight =  new_size.height + 'px';


               } else {

                   
                    this.wo.frame.style.top = new_size.top + 'px';
             
                    this.wo.frame.style.minHeight =  new_size.height + 'px';

                    this.wo.frame.style.maxHeight =  new_size.height + 'px';


               }



               const svgPoint2 = svg.createSVGPoint(); // For SVGPoint
              
               svgPoint2.x = 0 

               svgPoint2.y = nmin+nmax-parseFloat(mark); 

               const ctm2 = svg.getScreenCTM();

               const clientPoint2 = svgPoint2.matrixTransform(ctm2);


              






               this.wo.frame.style.top = parseFloat(this.wo.frame.style.top) + clientPoint1.y-clientPoint2.y + 'px';//:

               return false;


             }   


      }
      
      if (dir === 'resize-east'||dir === 'resize-west') {

        if (this.axis_x_mark1.toString().trim()!==''&&this.axis_x_mark2.toString().trim()!=='')
          if (!this.axis_x_mark1_lock_opened&&!this.axis_x_mark2_lock_opened) return false;


        if ((this.axis_x_mark1.toString().trim()!==''&&!this.axis_x_mark1_lock_opened)||
             (this.axis_x_mark2.toString().trim()!==''&&!this.axis_x_mark2_lock_opened)){

              let mark = 0;
           
              if ((this.axis_x_mark1.toString().trim()!==''&&!this.axis_x_mark1_lock_opened)) {mark = parseFloat(this.axis_x_mark1)}
              else mark = parseFloat(this.axis_x_mark2)




               let svg = this.wo.frame.querySelector('.svg-main');
            
               const svgPoint = svg.createSVGPoint(); // For SVGPoint
              
               svgPoint.x = parseFloat(mark); 

               svgPoint.y = 0; 

               const ctm = svg.getScreenCTM();

               const clientPoint1 = svgPoint.matrixTransform(ctm);


              if (dir === 'resize-east'){
              
               this.wo.frame.style.minWidth =  new_size.width + 'px';

               this.wo.frame.style.maxWidth =  new_size.width + 'px';

              } else {

                  this.wo.frame.style.left = new_size.left + 'px';
             
                  this.wo.frame.style.minWidth =  new_size.width + 'px';

                  this.wo.frame.style.maxWidth =  new_size.width + 'px';
              }



               const svgPoint2 = svg.createSVGPoint(); // For SVGPoint
              
               svgPoint2.x = parseFloat(mark); 

               svgPoint2.y = 0; 

               const ctm2 = svg.getScreenCTM();

               const clientPoint2 = svgPoint2.matrixTransform(ctm2);


              


               this.wo.frame.style.left = parseFloat(this.wo.frame.style.left) - clientPoint2.x+clientPoint1.x + 'px';//:
              

               return false;


        }
      
        //return false;



      }

      

      return true;


    }

    constructor(app, sheet) {

       
       this.app = app;

       this.label = 'diagram';

       this.legend_div = null;

       this.table_div = null;

       this.container = null;


       this.legend = {

       show:false,

       pos:'right',

       upos:false,

       left:'0px',

       top:'0px',

       width:'0px',

       height:'0px'




       }

       this.table = {

        show:false,

        pos:'',

        pres:'',

        table_cells:[]


       }

       this.margin_resize = null;

       this.whole_resize = null;

       this.resizeing_mode = 'whole';
       

       this.cleft = 20;

       this.ctop = 20;

       this.cright = 20;

       this.cbottom = 20;

       this.action = null;  

       this.action_start = {};

       
       this.axis_x_min ='';

       this.axis_x_max ='';

       this.axis_y_min='';

       this.axis_y_max='';

       this.axis_x_step='';

       this.axis_y_step='';

       


       this.axis_x_mark1 ='';

       this.axis_x_mark2 ='';

       this.axis_y_mark1='';

       this.axis_y_mark2='';

       this.axis_y_mark1_lock = null;

       this.axis_y_mark1_lock_opened = true;

       this.axis_y_mark2_lock = null;

       this.axis_y_mark2_lock_opened = true;


       this.axis_x_mark1_lock = null;

       this.axis_x_mark1_lock_opened = true;

       this.axis_x_mark2_lock = null;

       this.axis_x_mark2_lock_opened = true;



       this.axis_x_visible = true;

       this.axis_y_visible = true;

       this.grid_x_visible = true;

       this.grid_y_visible = true;

       this.auto_x_min = 0;

       this.auto_x_max = 0;

      
       this.auto_y_min = 0;

       this.auto_y_max = 0;

       this.diagram_id = -1;


       this.selected = false;

       this.resizer = new ResizeObserver((entries)=>this.resizeEvent(this, entries));
       
       this.sheet = sheet;

       this.wo = new window_object (this.app, this.sheet);

       this.first_render = true;

       this.current_data = null;

       this.current_table = null;

       this.wo.resizeing = (dir, new_size) => this.resizeing(dir, new_size);


     }


}
