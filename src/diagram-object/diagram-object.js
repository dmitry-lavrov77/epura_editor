import {window_object} from '../window-object/window-object'

import '@fortawesome/fontawesome-free/js/all.js';


//const ds = useRef(data.dlist.filter(o=>o.pdiag_plot_no===data.plot_no).map((item)=>{item.name = item.pdiag_objectname+':'+item.pdiag_title; return item;}))

export class diagram_object{

    render () {

        if (this.first_render) {

         this.first_render = false;
         
         this.wo.render();   

         let head = this.wo.frame.querySelector('.window-head');

         let body = this.wo.frame.querySelector('.window-body');

         body.style.backgroundColor = 'transparent';

          this.wo.frame.style.backgroundColor = 'transparent';
         

         let cog = document.createElement('div');

         let toolbar = document.createElement('div');

         toolbar.style.position = 'absolute';

         toolbar.style.right = '3px';

         toolbar.style.top = '2px';

         toolbar.style.display = 'flex';

         toolbar.style.flexDirection = 'row';

         cog.innerHTML = `<i class="fa fa-cog"></i>`

         cog.style.cursor = 'pointer'

         cog.title = 'Привязать данные'

         toolbar.appendChild(cog);
     
         head.appendChild(toolbar);
 
        }  

       let body = this.wo.frame.querySelector('.window-body');


       //body.innerHTMl = '';


       if (body.firstChild) body.firstChild.remove();


       if (this.current_data) {

         let xmlns = "http://www.w3.org/2000/svg";

         let svg = document.createElementNS(xmlns, 'svg');

         svg.setAttribute('preserveAspectRatio', 'none');

         svg.setAttribute('width',  '100%');

         svg.setAttribute('height', '100%');

         let min_x = parseFloat(this.current_data[0].points[0][0].x)
         
         let min_y = parseFloat(this.current_data[0].points[0][0].y) 
         
         let max_x = parseFloat(this.current_data[0].points[0][0].x)
         
         let max_y = parseFloat(this.current_data[0].points[0][0].y) 

          console.log(min_x, min_y, max_x, max_y);

         for (let i=0;i<this.current_data[0].points.length;i++) {

             for (let j=0; j<this.current_data[0].points[i].length;j++) {

               if (parseFloat(this.current_data[0].points[i][j].x)<min_x) min_x = parseFloat(this.current_data[0].points[i][j].x)

               if (parseFloat(this.current_data[0].points[i][j].x)>max_x) max_x = parseFloat(this.current_data[0].points[i][j].x)

               if (parseFloat(this.current_data[0].points[i][j].y)<min_y) min_y = parseFloat(this.current_data[0].points[i][j].y)

               if (parseFloat(this.current_data[0].points[i][j].y)>max_y) max_y = parseFloat(this.current_data[0].points[i][j].y)   

             }
         
         }
         
         let prc = 1.1*(max_y-min_y);

         console.log(min_x, min_y, max_x, max_y);

         svg.setAttribute('viewBox', min_x +' '+ (min_y - 0.05*(max_y-min_y)).toString() + ' '+(max_x-min_x).toString()+' '+(prc).toString());

         for (let i=0;i<this.current_data[0].points.length;i++) {

            

           let darray ="";
  
           if (this.current_data[0].linestyles[i]==='dash') darray = '5,5'
  
           if (this.current_data[0].linestyles[i]==='dashdot') darray = '6,2,2'

           let g = document.createElementNS(xmlns, 'g');

           g.setAttribute('stroke-width', '1.5');

           g.setAttribute('stroke-dasharray', darray);

           g.setAttribute('stroke', this.current_data[0].colors[i]);

           let p = document.createElementNS(xmlns, 'polyline');

           p.setAttribute('fill', 'none');

           p.setAttribute('vector-effect', 'non-scaling-stroke');

        
        
           let pp =  this.current_data[0].points[i];
            
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

           
         



         //   <g strokeWidth='1.5' strokeDasharray ={darray} stroke={colors[index]}>

         

         }


         body.appendChild(svg);

         


         //console.log(body.firstChild)


       }

    }

    load_data (epura_no, epura_data_all, slist, dlist, settings, dg_no = 'dummy') {
   
       let res_data = [];
    
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
        
        //console.log('res', res_data)
        
      }
    
    

      
        
  
      this.current_data = res_data;

      this.render();
         

    }

    constructor(app, sheet) {

       this.app = app;
       
       this.sheet = sheet;

       this.wo = new window_object (this.app, this.sheet);

       this.first_render = true;

       this.current_data = null;


     }


}
