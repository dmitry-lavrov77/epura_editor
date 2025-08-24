import './cell.css'

import {efont} from '../efont/efont'




export class cell {

    render() {

     if (!this.frame||!document.documentElement.contains(this.frame)) {

      this.frame = document.createElement('div');

      let insertion_point = this.column.frame;

      insertion_point.appendChild(this.frame);

      this.frame.onmousedown = (e) => {
        
      if ((e.which && e.which == 3) || (e.button && e.button == 2)) return false; 
    
        if (e.x>this.column.frame.getBoundingClientRect().right) {

          this.sheet.rows[this.num].cells[this.column.num+1].frame.onmousedown(e);

          return;

        }

        this.sheet.select(this);
      
      
      }

      this.frame.onmouseover = (e) => {if ((e.which && e.which == 3) || (e.button && e.button == 2)) return false; this.sheet.select_multiple(this);}

      this.frame.classList.add('cell')

      this.frame.setAttribute('data-col', this.column.num);
 
      this.frame.setAttribute('data-row', this.num);



      
     
     }

     if (this.value.trim()!==''||this.table_value.trim()!=='') this.frame.style.zIndex = 1;
     else this.frame.style.zIndex = '';

     if (this.selected) this.frame.style.zIndex = 100;

     let prefix = '';

     if (this.font.font_style.includes('bold')) prefix +='bold ';

     if (this.font.font_style.includes('italic')) prefix +='italic ';

     this.frame.style.font = prefix+this.font.font_size+'pt '+this.font.font_name;

     this.frame.style.color = this.font_color;

     this.frame.style.backgroundColor = this.bcolor.toString() + 'FF';

     this.frame.style.minHeight= parseFloat(this.height*this.app.cscale)+1 + 'px'

     this.frame.style.maxHeight= parseFloat(this.height*this.app.cscale)+1 + 'px'

      
     this.frame.style.borderRight='';

     this.frame.style.borderBottom='';
      
     this.frame.style.borderTop='';

     this.frame.style.borderLeft='';

     this.frame.style.overflowX = 'visible';
     
     this.frame.style.display = 'flex';

     

     if (this.cell_horz==='left')  this.frame.style.justifyContent = 'start';

     if (this.cell_horz==='center')  this.frame.style.justifyContent = 'center';

     if (this.cell_horz==='right')  this.frame.style.justifyContent = 'end';



     if (this.cell_vert==='top')  this.frame.style.alignItems = 'start';

     if (this.cell_vert==='center')  this.frame.style.alignItems = 'center';

     if (this.cell_vert==='bottom')  this.frame.style.alignItems = 'end';




     //this.frame.style.textAlign = this.cell_horz;

     //this.frame.style.minWidth = 'max-content'; 
     

     if (!this.selected) {

      
       if (this.value.trim()!==''||this.table_value.trim()) {

    

       this.sheet.measure_text.style.font = prefix+this.font.font_size+'pt '+this.font.font_name;  

       this.frame.style.overflowX = 'visible'; 
        //this.frame.style.minWidth = 'max-content'; 

        
        this.sheet.measure_text.innerText = (this.table_value.trim()==='')?this.value:this.table_value;

        let ll = this.sheet.measure_text.clientWidth;

        
        for (let i = this.column.num; i< this.sheet.columns.length-1; i++) {

           ll = ll -  this.sheet.columns[i].width;

           if (ll<0) break;




           if (this.sheet.rows[this.num].cells[i+1].value.trim()!==''||this.sheet.rows[this.num].cells[i+1].table_value.trim()!=='') {

          

            this.frame.style.overflowX = 'hidden'; 
             //this.frame.style.minWidth = ''; 

            break;


           }

         } 
  

       } 
      
      if (this.sheet.grid_visibility) this.frame.style.borderRight='0.5px solid lightgray'

      if (this.sheet.grid_visibility) this.frame.style.borderBottom='0.5px solid lightgray'

     // this.frame.style.overflow = 'visible'

      this.frame.innerText = (this.table_value.trim()==='')?this.value:this.table_value;
      
      }
      else if (this.selected) {

       this.input_wrapper.style.height = this.height+'px'

       this.input_wrapper.style.borderTop='2px solid darkgreen'

       this.input_wrapper.style.borderRight='2px solid darkgreen'

       this.input_wrapper.style.borderBottom='2px solid darkgreen'

       this.input_wrapper.style.borderLeft='2px solid darkgreen'

       //this.input_wrapper.style.position='relative'

       //this.input_wrapper.style.zIndex='10'
       

       

       this.input.style.height = '100%'

       this.input.style.width = '100%'

       this.input.style.textAlign = this.cell_horz;

       //this.input.style.justifyContent = 'start'

        let prefix = '';

       if (this.font.font_style.includes('bold')) prefix +='bold ';

       if (this.font.font_style.includes('italic')) prefix +='italic ';

       this.sheet.measure_text.style.font = prefix + this.font.font_size+'pt ' + this.font.font_name;

       this.sheet.measure_text.style.color = this.font_color;

       this.sheet.measure_text.style.backgroundColor = this.bcolor;


       this.sheet.measure_text.innerText = (this.table_value.trim()==='')?this.value:this.table_value;

       if (this.sheet.measure_text.clientWidth>this.column.width - 2) this.input_wrapper.style.width = this.sheet.measure_text.clientWidth +'px'
       else this.input_wrapper.style.width = this.column.width - 2  +'px'



     

       this.frame.innerText = '';

       this.input.readOnly = false;
       
       this.input.value=this.value;

       if (this.table_value.trim()!=='') {this.input.value=this.table_value; this.input.readOnly = true;}

       //let prefix = '';

       //if (this.font.font_style.includes('bold')) prefix +='bold ';

       //if (this.font.font_style.includes('italic')) prefix +='italic ';
       


       this.input.style.font = prefix + this.font.font_size+'pt ' + this.font.font_name;

       this.input.style.color = this.font_color;

       this.input.style.backgroundColor= this.bcolor;

       if (this.input_wrapper.parentNode!==this.frame) { 
        
         this.frame.appendChild(this.input_wrapper);
    
       }

       
         
         this.input.onkeyup = () =>{

           if (this.table_value.trim()!=='') return; 

           //this.sheet.measure_text.style.height = this.height-8 + 'px';

           this.sheet.measure_text.innerText = this.input.value;

           if (this.sheet.measure_text.clientWidth>this.column.width) this.input_wrapper.style.width = this.sheet.measure_text.clientWidth +'px'
           else this.input_wrapper.style.width = this.column.width +'px'
        
           this.value = this.input.value;

       }

       this.input.onchange = () =>{
        
       
       

       

       
    
    
    
       } 

       this.input_wrapper.style.display = '';
       this.input.style.display = '';


      } 


      
     

      if (this.in_multiple&&!this.selected) {
        
        this.frame.style.backgroundColor = 'rgba(211, 211, 211, 0.3)'

        this.frame.style.borderRight='0.5px solid gray'

        this.frame.style.borderBottom='0.5px solid gray' 
        
      }
      else {
        
        this.frame.style.backgroundColor = this.bcolor.toString()//'rgba(255, 255, 255, 0)';

      } 

       //if (!this.in_multiple&&!this.selected) this.frame.style.backgroundColor = this.bcolor.toString()+'FF'

      if (this.extra_border) {

          this.frame.style.borderRight='2px solid black'
          this.frame.style.borderLeft='2px solid black'
          this.frame.style.borderTop='2px solid black'
          this.frame.style.borderBottom='2px solid black'
          

      }

      if (this.in_multiple) this.frame.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); this.app.popup_menu.toggle_active(e, 'merge');}
      else this.frame.oncontextmenu = (e) =>{ console.log('in cell'); e.preventDefault(); e.stopPropagation();this.app.popup_menu.toggle_active(e, 'add');}
      
    }

    select() {

        this.selected = true;

        this.render();

        this.app.object_properties.render('cell');

    }


    update(data) {

      if (data.evt==='propertyChanged') {


        if (data.what==='cell_size') {

          this.font.font_size = data.value;

          this.render();


        }

        if (data.what==='cell_horz') {

           this.cell_horz = data.value;

           this.render();

        }

        if (data.what==='cell_vert') {

           this.cell_vert = data.value;

           this.render();

        }

        if (data.what==='cell_font') {

          this.font.font_name = data.value;

          this.render();

        }

        if (data.what==='cell_style') {

          this.font.font_style = data.value;
     
          this.render();

        }

         if (data.what==='cell_color') {

       

          this.font_color = data.value;
     
          this.render();

        }

         if (data.what==='cell_bcolor') {

     

          this.bcolor = data.value;
     
          this.render();

        }

         if (data.what==='cell_border') {

       

          this.extra_border = data.value;
     
          this.render();

        }


 


        //if (data.what==='')
        
       


      } 

      if (this.value!==''&&data.evt==='stopResizeRCEvent'&&data.detail.what==='col'&&data.detail.num>=this.column.num){

        this.render();

      }

    }


    deselect() {
       
       this.selected = false;

       for (let i =0;i<this.sheet.selected_multiple.length;i++) {

        this.sheet.selected_multiple[i].in_multiple = false;

        this.sheet.selected_multiple[i].render();

       } 
       this.sheet.selected_multiple = [];

       this.in_multiple = false;

       this.value = this.value.trim();

       this.input_wrapper.style.display = 'none';

        
       this.sheet.frame.appendChild(this.input_wrapper);

       for (let i = 0; i<=this.column.num; i++) {

        this.sheet.rows[this.num].cells[i].render();

       } 

       this.render();

    }

  
    constructor (app, sheet, column, num){

      this.label = 'cell'

      this.font = new efont('Calibri', 11, 'plain');

      this.font_color = '#000000'

      this.bcolor = '#FFFFFF'

      this.extra_border = false;

      this.value = '';

      this.table_value = '';

      this.input_wrapper = sheet.text_input_wrapper;

      this.input = sheet.text_input;

      this.in_multiple = false;
      
      this.num=num;

      this.app = app;

      this.sheet = sheet;

      this.column = column;

      this.frame = null;

      this.height = this.sheet.rows[num].height;

      this.selected = false;

      this.cell_horz='left';

      this.cell_vert='bottom';

    }


}

