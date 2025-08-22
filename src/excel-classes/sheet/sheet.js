
import './sheet.css'

import {picture_object} from '../../picture-object/picture-object'

import {diagram_object} from '../../diagram-object/diagram-object'

import {multicell} from '../multicell/multicell'

import {cell} from '../cell/cell'




export class row {

  
  add_cell (cell) {


    this.cells.push(cell);


  }  

  
  constructor (app, sheet, num, title, height) {

    this.num = num;

    this.height = height;

    this.app = app;

    this.sheet = sheet;

    this.title = title;

    this.automatic_resize = true;

    this.cells = [];

  }

}


export class column {

  
  render () {

    
     let frame = document.createElement('div');

     frame.style.minWidth= this.width + 'px'

     frame.style.maxWidth= this.width + 'px'

     frame.style.display='flex'

     frame.style.flexDirection='column'
     
     let insertion_point =  this.sheet.frame.querySelector('.sheet');

     if (!document.documentElement.contains(this.frame)) this.frame = null;


     if (this.frame) {
      
      insertion_point.replaceChild(frame, this.frame); 
   
      this.frame.remove(); 
   
      this.frame = frame;
     
     }
     else {this.frame = frame; insertion_point.appendChild(this.frame)}

    

     for (let i =0; i<this.sheet.rows.length-1;i++) {

       

         this.sheet.rows[i].cells[this.num].render();


     }


      

  }  

  constructor (app, sheet, num, title, width) {

    this.num = num;

    this.width = width;

    this.frame = null;

    this.app = app;

    this.sheet = sheet;

    this.title = title;

    for (let i =0; i<this.sheet.rows.length-1;i++) {

      let cll = new cell(this.app, this.sheet, this, i);

      this.app.subscribe(cll);

      this.sheet.rows[i].add_cell(cll);
      
    }

  

  }

}

export class sheet {


   capture(e, action) {

     e.target.setPointerCapture(e.pointerId);

     if (this.app.selected_object) {
        
        this.app.selected_object.deselect();  

        this.selected_multiple =[];

     }
     this.action = action; 

     this.action.start_size = (action.type==='col')?this.columns[action.num].width:this.rows[action.num].height;

     this.action_start.x0 = e.x;

     this.action_start.y0 = e.y;

   }

   perform(e){

    const resizeRCEvent =  {
      evt:'resizeRCEvent', 
      detail: {
      what: this.action.type,
      num: this.action.num,
      sze:''
     },
    };

   //const pizzaEvent = new CustomEvent("pizzaDelivery", {
   //detail: {
    //name: "supreme",
   //},
   //});

   
   //window.dispatchEvent(pizzaEvent); 



    if (this.action.type==='col'){

       let new_size =  this.action.start_size + e.x - this.action_start.x0;

       this.columns[this.action.num].width = new_size;

       let col_handle = e.target.parentNode;

       col_handle.style.minWidth = (new_size-1) + 'px'

       col_handle.style.maxWidth = (new_size-1) + 'px'

       this.columns[this.action.num].frame.style.minWidth = new_size + 'px'

       this.columns[this.action.num].frame.style.maxWidth = new_size + 'px'

       resizeRCEvent.detail.sze = new_size;

       this.app.notify(resizeRCEvent);

       //window.dispatchEvent(new_size); 


    } else if (this.action.type==='row') {

       let new_size =  this.action.start_size + e.y - this.action_start.y0;

       this.rows[this.action.num].height = new_size;

       let row_handle = e.target.parentNode;

       row_handle.style.minHeight = (new_size) + 'px'

       row_handle.style.maxHeight = (new_size) + 'px'

       for (let i =0; i<this.rows[this.action.num].cells.length;i++) {

          this.rows[this.action.num].cells[i].height = new_size;
        
          this.rows[this.action.num].cells[i].frame.style.minHeight = new_size + 1 + 'px'

          this.rows[this.action.num].cells[i].frame.style.maxHeight = new_size + 1 + 'px'

       }

       resizeRCEvent.detail.sze = new_size;

       this.app.notify(resizeRCEvent);
       //window.dispatchEvent(new_size); 

    }

   }
   
   release(e){
     
     e.target.releasePointerCapture(e.pointerId); 

     const stopResizeRCEvent =  {
      evt:'stopResizeRCEvent', 
      detail: {
      what: this.action.type,
      num: this.action.num,
     },
    };

    this.app.notify(stopResizeRCEvent);

   /*  if (this.action.type==='col'){

        for  (let i=0;i<this.rows.length-1;i++) {
         
          for (let j=0;j<=this.action.num;j++)  
         
            this.rows[i].cells[j].render();

        }    

     }*/

     this.action = {};

     this.action_start = {x0:0, y0:0}


   }

   update(data){

      //console.log('update', data)

      if (data.evt==='propertyChanged') {

        if (data.what==='sheet_name') {

        

          this.title = data.value;

          this.app.selected_sheet_title.innerHTML = data.value;
          

        } 

        if (data.what==='grid_visibility') {




             this.grid_visibility = data.value;

             /*for (let i =0; i<this.rows.length-1;i++) {
                
                for (let j =0; j<this.columns.length-1;j++) {

                  
                  this.rows[i].cells[j].render();
                }

             }*/

        

             this.render();
  
        }


      }

      if (data.evt==='menuEvent') {


         if (data.detail.what==='add') {

         
          if (!this.frame) return;

          let menu = this.app.popup_menu.frame.querySelector('.menu-popup-context-menu');

      


          

          this.diags.push(new diagram_object(this.app, this));


          this.pictures.push(new picture_object(this.app, this));


   

           let doo = this.diags[this.diags.length-1];

           
           

           doo.first_render = true;

         

           let po = this.pictures[this.pictures.length-1];

           
           
           doo.render();

           
           let rr = doo.wo.frame.parentNode.getBoundingClientRect();
           




           po.add_link(doo);
         
           po.render();


           po.wo.left = parseFloat(menu.style.left) - rr.left;
         
           po.wo.frame.style.left = parseFloat(menu.style.left) - rr.left +'px'

           po.wo.top = parseFloat(menu.style.top) - rr.top
         
           po.wo.frame.style.top = parseFloat(menu.style.top) -rr.top +'px'



          

           doo.wo.left = parseFloat(menu.style.left) - rr.left+300;
         
           doo.wo.frame.style.left = parseFloat(menu.style.left) -rr.left +300+'px'

           doo.wo.top = parseFloat(menu.style.top) - rr.top +200
         
           doo.wo.frame.style.top = parseFloat(menu.style.top) -rr.top +200+'px'


           po.draw_link_curve();




         }


         if (data.detail.what==='merge'&&this.selected_multiple&&this.selected_multiple.length) {

            let row_start = this.selected_multiple[0].num;

            let row_end = this.selected_multiple[0].num;

            let column_start = this.selected_multiple[0].column.num;

            let column_end = this.selected_multiple[0].column.num;

            let value = '';
            
            for (let i=0;i<this.selected_multiple.length;i++) {

               if (this.selected_multiple[i].value.trim()!=='') {

                  if (value!=='') {

                     alert('В объединяемом диапазоне не может быть более одного значения!');

                     return;

                  }

                  value = this.selected_multiple[i].value.trim();

               }

            }
            
            for (let i=0;i<this.selected_multiple.length;i++) {

               if (this.selected_multiple[i].num<row_start) row_start = this.selected_multiple[i].num;

               if (this.selected_multiple[i].num>row_end) row_end = this.selected_multiple[i].num;

               if (this.selected_multiple[i].column.num<column_start) column_start = this.selected_multiple[i].column.num;

               if (this.selected_multiple[i].num>column_end) column_end = this.selected_multiple[i].column.num;

               this.selected_multiple[i].in_multiple = false;

               this.selected_multiple[i].render();

            }

            this.selected_multiple = [];
               
            this.multicells.push(new multicell(this.app, this, row_start,row_end ,column_start,column_end));

            this.multicells[this.multicells.length-1].value = value;
            
            this.multicells[this.multicells.length-1].render();

            this.multicells[this.multicells.length-1].select();



         }
        


      }


   }

   deselect () {}

   render() {

     let insertion_point = this.app.frame.querySelector('.excel-main-space')




     let frame = document.createElement('div');


     this.measure_text.style.position = 'absolute';

     this.measure_text.style.visibility = 'hidden';

     this.measure_text.style.height = 'auto'

     this.measure_text.style.width = 'auto'

     this.measure_text.style.whiteSpace = 'nowrap'

     frame.appendChild(this.measure_text);

     frame.classList.add('sheet-wrapper');

     let wrapper2 = document.createElement('div');

     wrapper2.classList.add('sheet-wrapper2');


    let wrapper3 = document.createElement('div');

     wrapper3.classList.add('sheet-wrapper3');


     let sh = document.createElement('div');

     sh.classList.add('sheet');

     let col_header = document.createElement('div');

     col_header.classList.add('col-header');


     col_header.onclick = () =>{

      if (this.app.selected_object) this.app.selected_object.deselect();

      this.app.selected_object = this;

      this.app.object_properties.render('sheet');

     }

     

     for (let i=0; i<this.columns.length-1;i++){

        let handle = document.createElement('div');

        handle.style.position = 'absolute';

        handle.style.width='3px';

        handle.style.right = '0px';

        handle.style.top = '0px';

        handle.style.bottom = '0px';

        handle.style.cursor = 'col-resize';

        handle.dataset['colnum'] = i.toString();

        let action ={type:'col', num:i}

        handle.onpointerdown=(e)=>this.capture(e, action);
        
        handle.onpointermove=(e)=>this.perform(e);

        handle.onpointerup=(e)=>this.release(e);

        let hh = document.createElement('div');

        hh.style.position = 'relative';

        hh.style.minWidth = (this.columns[i].width - 1) + 'px';

        hh.style.maxWidth = (this.columns[i].width - 1) + 'px';

        hh.style.display = 'flex';

        hh.style.justifyContent = 'center';
        
        hh.innerText = this.columns[i].title;
        
        col_header.appendChild(hh);

        hh.style.borderRight = '0.5px solid';

        hh.appendChild(handle);


     }


     let row_header_wrapper = document.createElement('div');

     row_header_wrapper.classList.add('row-header-wrapper');




     let row_header = document.createElement('div');

      row_header.classList.add('row-header');

      row_header.onclick = () =>{


         
      if (this.app.selected_object) this.app.selected_object.deselect();

      this.app.selected_object = this;



      this.app.object_properties.render('sheet');



      }


      for (let i=0; i<this.rows.length;i++){

        let hh = document.createElement('div');
        
        let handle = document.createElement('div');

        handle.style.position = 'absolute';

        handle.style.height='3px';

        handle.style.bottom = '0px';

        handle.style.left = '0px';

        handle.style.right = '0px';

        handle.style.cursor = 'row-resize';

        handle.dataset['rownum'] = i.toString();

        let action ={type:'row', num:i}

        handle.onpointerdown=(e)=>this.capture(e, action);
        
        handle.onpointermove=(e)=>this.perform(e);

        handle.onpointerup=(e)=>this.release(e);

        hh.style.minHeight = this.rows[i].height + 'px';

        hh.style.maxHeight = this.rows[i].height + 'px';

        hh.style.position = 'relative';

        hh.innerText = this.rows[i].title;
        
        row_header.appendChild(hh);

        hh.style.display = 'flex';

        hh.style.justifyContent = 'center';

        hh.style.alignItems = 'center';

        hh.style.borderBottom = '0.5px solid';

        hh.appendChild(handle);
        

     }



     wrapper2.appendChild(col_header);

     wrapper2.appendChild(wrapper3);

     wrapper3.appendChild(sh);



     let hh = document.createElement('div');

     hh.style.minHeight = '20px';

     hh.style.maxHeight = '20px';

      // col_header.appendChild(hh);



     row_header_wrapper.appendChild(hh);

     row_header_wrapper.appendChild(row_header);

     frame.appendChild(row_header_wrapper);

     frame.appendChild(wrapper2);

     //row_header.scrollTop = -50;

     wrapper3.onscroll = ()=>{

        row_header.scrollTop = wrapper3.scrollTop

        //if (row_header.scrollTop!==wrapper3.scrollTop) wrapper3.scrollTop = row_header.scrollTop

        col_header.scrollLeft = wrapper3.scrollLeft;

    
    
     }

     
      
     if (this.frame) {insertion_point.replaceChild(frame, this.frame);  this.frame.remove(); this.frame = frame;}
     else {this.frame = frame; insertion_point.appendChild(this.frame)}






     let xmlns = "http://www.w3.org/2000/svg";

     this.connections_layer = document.createElementNS(xmlns, 'svg');

     this.connections_layer.style.width='100%';

     this.connections_layer.style.height='100%';

     this.connections_layer.style.position = 'absolute';

     this.connections_layer.style.pointerEvents = 'none'

     this.connections_layer.style.zIndex = '1000'
  
     sh.appendChild(this.connections_layer);

     for (let i=0; i<this.columns.length-1;i++) this.columns[i].render();  
     


     
    

    
   }

    select_multiple (cc) {


       if ( this.select_cells_multiple&&this.app.selected_object) {

        for (let i=0;i<this.selected_multiple.length;i++) {
            this.selected_multiple[i].in_multiple = false;
            this.selected_multiple[i].render();
        }   
        
        this.selected_multiple =[];

         let min_x = Math.min(parseFloat(this.app.selected_object.column.num), parseFloat(cc.column.num));
         
         let max_x = Math.max(parseFloat(this.app.selected_object.column.num), parseFloat(cc.column.num));
         
         let min_y = Math.min(parseFloat(this.app.selected_object.num), parseFloat(cc.num));
         
         let max_y = Math.max(parseFloat(this.app.selected_object.num), parseFloat(cc.num));
   
   

         for (let i=min_x;i<=max_x;i++) {

            for (let j=min_y;j<=max_y;j++) {

                let c = this.rows[j].cells[i];

       
                
                this.selected_multiple.push(c);

                c.in_multiple = true;

                c.render();


            }



         }



       } 

       //this.selected_multiple.push(cc);


    }
    
    stop_cells_multiple () {  

     // for (let i=0;i<this.selected_multiple.length-1;i++) {
     //       this.selected_multiple[i].in_multiple = false;
     //       this.selected_multiple[i].render();
     //   }     

      this.select_cells_multiple = false;

    }

    select (obj) {

      
      if (obj === this.app.selected_object) return;
      
      
      for (let i=0;i<this.selected_multiple.length;i++) {
    
           this.selected_multiple[i].in_multiple = false;
      
           this.selected_multiple[i].render();
      
       }     
 


       if (this.app.selected_object) this.app.selected_object.deselect();  
       
       this.selected_multiple =[];

       this.app.selected_object = obj;


       this.app.selected_object.select();
       
       if (obj.label&&obj.label==='cell') {

        this.select_cells_multiple = true;
        
        window.addEventListener("mouseup", (e)=>this.stop_cells_multiple(), { once: true });

       } else  this.select_cells_multiple = false;

       if (obj.label&&obj.label==='diagram') {

       

       }

    }

    
    constructor (title, excel_app, visible = true) {    

  

        

        this.measure_text = document.createElement('div');

        this.pictures = [];

        this.diags = [];

        this.multicells = [];

        this.grid_visibility = true;


        ///////////////////////////////////////

       


         //let po = new picture_object(this.app, this);


        ///////////////////////////////////////



        this.texts = [];


        this.text_input_wrapper = document.createElement('div');

        this.text_input = document.createElement('input');

        this.text_input_wrapper.appendChild(this.text_input); 

        this.text_input.classList.add('tinput');

        this.title = title;

        this.app = excel_app;

        this.visible = true;

        this.frame = null;

        this.columns = [];

        

        this.rows = [];

        this.action = {}; 

        this.action_start = {x0:0, y0:0}

        this.app.selected_object = null;

        this.select_cells_multiple = false;

        this.selected_multiple =[];

        this.cscale = 1;

        for (let i=0; i<this.app.row_names.length;i++){


            this.rows.push (new row(this.app, this, i, (i+1).toString(), 20));

       
         }

         

        for (let i=0; i<this.app.col_names.length-1;i++){

            this.columns.push(new column(this.app, this, i, this.app.col_names[i], 64));

        }


        //console.log('subscribing')

        //excel_app.subscribe(this);

         
         //this.diags.push(new diagram_object(this.app, this));


         //this.pictures.push(new picture_object(this.app, this));

          
         
        // this.multicells.push(new multicell(this.app, this, 1,5,2,7));

        
       // this.memoized_frame = frame.outerHTML;   


        
    }

} 