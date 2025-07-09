import './cell.css'




export class cell {

    render() {

     if (!this.frame) {

      this.frame = document.createElement('div');

      let insertion_point = this.column.frame;

      insertion_point.appendChild(this.frame);

      this.frame.onmousedown = (e) => {if ((e.which && e.which == 3) || (e.button && e.button == 2)) return false; this.sheet.select(this);}

      this.frame.onmouseover = (e) => {if ((e.which && e.which == 3) || (e.button && e.button == 2)) return false; this.sheet.select_multiple(this);}

      this.frame.classList.add('cell')
     
     }


      
     this.frame.style.minHeight= parseFloat(this.height)+1 + 'px'

     this.frame.style.maxHeight= parseFloat(this.height)+1 + 'px'

      
     this.frame.style.borderRight='';

     this.frame.style.borderBottom='';
      
     this.frame.style.borderTop='';

     this.frame.style.borderLeft='';

     this.frame.style.overflowX = 'visible'; 

     if (!this.selected) {

      
       if (this.value.trim()!=='') {

       this.frame.style.overflowX = 'visible'; 

        
        this.sheet.measure_text.innerText = this.value;

        let ll = this.sheet.measure_text.clientWidth;

        
        for (let i = this.column.num; i< this.sheet.columns.length-1; i++) {

           ll = ll -  this.sheet.columns[i].width;

           if (ll<0) break;




           if (this.sheet.rows[this.num].cells[i+1].value.trim()!=='') {

          

            this.frame.style.overflowX = 'hidden'; 

            break;


           }

         } 
  

       } 
      
      this.frame.style.borderRight='0.5px solid lightgray'

      this.frame.style.borderBottom='0.5px solid lightgray'

     // this.frame.style.overflow = 'visible'

      this.frame.innerText = this.value;
      
      }
      else if (this.selected) {

       this.input_wrapper.style.height = this.height+'px'
       
      // this.input_wrapper.style.width = this.column.width-2+'px';

       this.input_wrapper.style.borderTop='2px solid darkgreen'

       this.input_wrapper.style.borderRight='2px solid darkgreen'

       this.input_wrapper.style.borderBottom='2px solid darkgreen'

       this.input_wrapper.style.borderLeft='2px solid darkgreen'

       

       this.input.style.height = '100%'

       this.input.style.width = '100%'


       this.sheet.measure_text.innerText = this.value;

       if (this.sheet.measure_text.clientWidth>this.column.width - 2) this.input_wrapper.style.width = this.sheet.measure_text.clientWidth +'px'
       else this.input_wrapper.style.width = this.column.width - 2  +'px'



     

       this.frame.innerText = '';
       
       this.input.value=this.value;

       if (this.input_wrapper.parentNode!==this.frame) { 
        
         this.frame.appendChild(this.input_wrapper);
    
       }

       this.input.onkeyup = () =>{

         

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
      else this.frame.style.backgroundColor = 'rgba(255, 255, 255, 0)';
      
    }

    select() {

        this.selected = true;

        this.render();

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

    }

  
    constructor (app, sheet, column, num){

      this.label = 'cell'

      this.value = '';

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

    }


}

