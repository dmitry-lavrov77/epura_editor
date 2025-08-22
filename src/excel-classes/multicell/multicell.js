import './multicell.css'
import {efont} from '../efont/efont'




export class multicell {

    render() {

       if (!this.frame) {

          this.frame = document.createElement('div');

          this.frame.onmousedown = (e) => {if ((e.which && e.which == 3) || (e.button && e.button == 2)) return false; this.sheet.select(this);}

          this.frame.style.backgroundColor = 'white';

          this.frame.classList.add('multicell')

          this.frame.style.position = 'absolute';



          
     






          let str_x = this.sheet.frame.querySelector('.sheet').getBoundingClientRect().left;

          let str_y = this.sheet.frame.querySelector('.sheet').getBoundingClientRect().top;

          this.frame.style.top = this.sheet.rows[this.row_start].cells[this.column_start].frame.getBoundingClientRect().top - str_y + 'px';

          this.frame.style.height = this.sheet.rows[this.row_end+1].cells[this.column_end+1].frame.getBoundingClientRect().top - str_y - parseFloat(this.frame.style.top) -1 + 'px';        

          this.frame.style.left = this.sheet.columns[this.column_start].frame.getBoundingClientRect().left - str_x + 'px';

          this.frame.style.width = this.sheet.columns[this.column_end+1].frame.getBoundingClientRect().left - str_x - parseFloat(this.frame.style.left) -1 + 'px';

          let ss = this.sheet.frame.querySelector('.sheet');

          

          ss.appendChild(this.frame);

          this.app.subscribe(this);

       }   


         let prefix = '';

          if (this.font.font_style.includes('bold')) prefix +='bold '; 

          if (this.font.font_style.includes('italic')) prefix +='italic ';

          this.frame.style.font = prefix+this.font.font_size+'pt '+this.font.font_name;

          this.frame.style.color = this.font_color;

          this.frame.style.backgroundColor = this.bcolor.toString() + 'FF';


          this.input.style.font = prefix+this.font.font_size+'pt '+this.font.font_name;

          this.input.style.color = this.font_color;

          this.input.style.backgroundColor = this.bcolor.toString() + 'FF';


           if (this.cell_horz==='left')  this.frame.style.justifyContent = 'start';

     if (this.cell_horz==='center')  this.frame.style.justifyContent = 'center';

     if (this.cell_horz==='right')  this.frame.style.justifyContent = 'end';



     if (this.cell_vert==='top')  this.frame.style.alignItems = 'start';

     if (this.cell_vert==='center')  this.frame.style.alignItems = 'center';

     if (this.cell_vert==='bottom')  this.frame.style.alignItems = 'end';


     if (this.extra_border) {

          this.frame.style.borderRight='2px solid black'
          this.frame.style.borderLeft='2px solid black'
          this.frame.style.borderTop='2px solid black'
          this.frame.style.borderBottom='2px solid black'
          



      }



        this.frame.innerText = this.value;

        if (this.selected) {


         this.input_wrapper.style.height = parseFloat(this.frame.style.height)+'px'

         this.input_wrapper.style.borderTop='2px solid darkgreen'

         this.input_wrapper.style.borderRight='2px solid darkgreen'

         this.input_wrapper.style.borderBottom='2px solid darkgreen'

         this.input_wrapper.style.borderLeft='2px solid darkgreen'

         //this.input_wrapper.style.display = 'flex';

         this.input_wrapper.style.alignItems='end';

         this.input_wrapper.onmousedown = (e) =>{ this.input.focus(); e.preventDefault() }

         this.input.style.height = ''

         this.input.style.width = '100%'


         this.sheet.measure_text.innerText = this.value;

         if (this.sheet.measure_text.clientWidth>parseFloat(this.frame.style.width) - 2) this.input_wrapper.style.width = this.sheet.measure_text.clientWidth +'px'
         else this.input_wrapper.style.width = parseFloat(this.frame.style.width) - 2  +'px'

         this.frame.innerText = '';
       
         this.input.value=this.value;

         if (this.input_wrapper.parentNode!==this.frame) { 
        
           this.frame.appendChild(this.input_wrapper);
    
          }

          this.input.onkeyup = () =>{

         



            this.sheet.measure_text.innerText = this.input.value;

            if (this.sheet.measure_text.clientWidth>parseFloat(this.frame.style.width)) this.input_wrapper.style.width = this.sheet.measure_text.clientWidth +'px'
            else this.input_wrapper.style.width = parseFloat(this.frame.style.width) +'px'
        
            this.value = this.input.value;

         }

         this.input_wrapper.style.display = 'flex';
         this.input.style.display = '';

         this.input.focus();

        }



       


    }

    select() {

        this.selected = true;

        this.render();

        this.app.object_properties.render('cell');



    }

    deselect() {

        this.selected = false;

        this.render();
        

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

          console.log(data.value)

          this.font_color = data.value;
     
          this.render();

        }

         if (data.what==='cell_bcolor') {

          //console.log(data.value)

          this.bcolor = data.value;
     
          this.render();

        }

         if (data.what==='cell_border') {

          //console.log(data.value)

          this.extra_border = data.value;
     
          this.render();

        }


 

        // console.log(data.what, data.value)

        //if (data.what==='')
        
        //console.log(data.value)


      } 

        

        if (data.evt === 'resizeRCEvent') {

          if ((data.detail.what==='col'&&data.detail.num<=this.column_end) || (data.detail.what==='row'&&data.detail.num<=this.row_end)) {  
        
            let str_x = this.sheet.frame.querySelector('.sheet').getBoundingClientRect().left;

            let str_y = this.sheet.frame.querySelector('.sheet').getBoundingClientRect().top;

            this.frame.style.top = this.sheet.rows[this.row_start].cells[this.column_start].frame.getBoundingClientRect().top - str_y + 'px';

            this.frame.style.height = this.sheet.rows[this.row_end+1].cells[this.column_end+1].frame.getBoundingClientRect().top - str_y - parseFloat(this.frame.style.top) -1 + 'px';        

            this.frame.style.left = this.sheet.columns[this.column_start].frame.getBoundingClientRect().left - str_x + 'px';

            this.frame.style.width = this.sheet.columns[this.column_end+1].frame.getBoundingClientRect().left - str_x - parseFloat(this.frame.style.left) -1 + 'px';

          }
        
        }  
        
    }

  
    constructor (app, sheet, row_start, row_end, column_start, column_end) {

      this.label = 'multicell';

      this.input_wrapper = sheet.text_input_wrapper;

      this.input = sheet.text_input;

      this.row_start = row_start;

      this.row_end = row_end;

      this.column_start = column_start;

      this.column_end = column_end;

      this.frame = null;

      this.app = app;

      this.sheet = sheet;

      this.value = '';

      this.selected = false;

       this.font = new efont('Calibri', 11, 'plain');
      
       this.font_color = '#000000'
      
       this.bcolor = '#FFFFFF'
      
       this.extra_border = false;

       this.cell_horz='left';

       this.cell_vert='bottom';
      
    }


}

