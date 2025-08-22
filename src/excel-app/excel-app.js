
import {sheet} from '../excel-classes/sheet/sheet'

import {popup_menu} from '../popup-menu/popup-menu'

import '@fortawesome/fontawesome-free/js/all.js';

import './excel-app.css'





class footer_panel {

  constructor (app) {
    
     this.frame = document.createElement('div');

     this.frame.classList.add('footer-panel');


     this.left_bar = document.createElement('div');

     this.left_bar.classList.add('left-bar');

   
     this.right_bar = document.createElement('div');

     this.right_bar.classList.add('right-bar');

     //this.right_bar.innerHTML=`<i class="fa fa-minus "></i><i class="fa fa-plus "></i>`



     /*
     
     <i class="fa fa-minus "></i></div><div style="margin-left: 8px; border-bottom: 1px solid; height: 15px; min-width: 30px;"></div><div style="border-bottom: 1px solid; height: 15px; min-width: 30px;"></div><div style="cursor: pointer; margin-left: 8px; font-size: 10px;"><i class="fa fa-plus "></i></div><div style="margin-left: 8px; font-size: 10px;">100%</div></div>
     
     
     */ 



     
     
     
     this.add_sheet = document.createElement('div');

     this.add_sheet.classList.add('first-left-bar-icon');

     this.add_sheet.innerHTML=`<i class="fa fa-plus-circle fa-lg"></i>`

     this.add_sheet.title = 'Добавить лист'


     this.remove_sheet = document.createElement('div');

     this.remove_sheet.classList.add('left-bar-icon');

     this.remove_sheet.innerHTML=`<i class="fa fa-trash fa-lg"></i>`

     this.remove_sheet.title = 'Удалить лист'

     this.selected_sheet_title = document.createElement('div');

     this.selected_sheet_title.style.paddingLeft = '10px' 

     this.selected_sheet_title.style.color = 'green'

     this.selected_sheet_title.style.fontWeight = '700'

     this.size_down = document.createElement('div');

     this.size_down.classList.add('right-bar-icon');

     this.size_down.innerHTML=`<i class="fa fa-minus "></i>`

     this.size_down.title = 'Уменьшить масштаб'

     this.size_up = document.createElement('div');

     this.size_up.classList.add('right-bar-icon');

     this.size_up.innerHTML=`<i class="fa fa-plus "></i>`

     this.size_up.title = 'Увеличить масштаб'

     this.scale = document.createElement('div');

     this.scale.classList.add('right-bar-scale');

     this.scale_value = document.createElement('div');

     this.scale_value.classList.add('last-right-bar-icon');

     this.scale_value.innerHTML = '100%'

     this.frame.appendChild(this.left_bar);
     
     this.frame.appendChild(this.right_bar);

     this.left_bar.appendChild(this.add_sheet);

     this.left_bar.appendChild(this.remove_sheet);
     
     this.left_bar.appendChild(this.selected_sheet_title);

     this.right_bar.appendChild(this.size_down);

     this.right_bar.appendChild(this.scale);

     this.right_bar.appendChild(this.size_up);

     this.right_bar.appendChild(this.scale_value);

     
  }


}


class excel_main_space {


 constructor (app) {

   this.frame = document.createElement('div');

   this.frame.classList.add('excel-main-space');

 } 


}


class object_properties_input {


  constructor(app, label, what, type='text', extra_span = {on:false}, value = '') { 

      this.app = app; 

      this.frame = document.createElement('div');
 
      this.frame.classList.add('object-properties-input');

      this.frame.innerHTML = `<label>${label}<input class="${what}" type="${type}" value="${value}"/><span>${extra_span.txt}</span></label>`

      this.sp = this.frame.querySelector('span');

      this.sp.style.display = (extra_span.on)?'':'none' 

      this.sp.style.cursor = 'pointer'

      this.sp.style.color = 'blue'

      if (extra_span.span_click)  this.sp.onclick = () =>{
        
        
         let s = this.frame.querySelector('input');

        


         s.value = extra_span.span_click();


         this.sp.style.display = (extra_span.on)?'':'none'

          if (extra_span.on) {

            this.sp.style.position = 'absolute';

            this.sp.style.left = 'calc(150px + 50%)';

          }



      }  

      //else this.frame.innerHTML = `<label>${label}<input type="${type}" value="${value}"/></label>`

      let s = this.frame.querySelector('input');

      if (extra_span.on) {
         
         //let a = this.frame.querySelector('span');

         this.sp.style.position = 'absolute';

         this.sp.style.left = 'calc(150px + 50%)';
      
       }

       

      s.oninput = (e) => {

        if (extra_span.change_function) {
        
          extra_span.change_function();

          this.sp.style.display = (extra_span.on)?'':'none'

          if (extra_span.on) {

            this.sp.style.position = 'absolute';

            this.sp.style.left = 'calc(150px + 50%)';

          }
        
        }  
      
        if (app.selected_object) app.selected_object.update({evt:'propertyChanged', what:what, value:e.target.value})
        
      }

  }

}




class object_properties_select {


  constructor(app, label, what, options = [], val = null) {

      this.app = app;

      this.frame = document.createElement('div');
 
      this.frame.classList.add('object-properties-select');

      let opts = options.map(item =>`<option value=${item.value}>${item.name}</option>`).join();

      this.frame.innerHTML = `<label>${label}<select><options>${opts}</options></select></label>`

      let s = this.frame.querySelector('select');

      if (val!==null) s.value = val;

      s.onchange = (e) => {
      
        if (app.selected_object) app.selected_object.update({evt:'propertyChanged', what:what, value:e.target.value})
        
      }


  }


}


class object_properties_checkbox {

 constructor(app, label, what, initial_value = false){

      this.app = app;    

      this.frame = document.createElement('div');
 
      this.frame.classList.add('object-properties-checkbox');

      this.frame.innerHTML = `<label>${label}<input type="checkbox" /></label>`

      let s = this.frame.querySelector('input');

      s.checked = initial_value;

      s.onchange = (e) => {
      
        if (app.selected_object) app.selected_object.update({evt:'propertyChanged', what:what, value:e.target.checked})
        
      }



  }


}


class object_properties_group {

 
  render() {

    if (this.active)  {
      this.spn.innerHTML = '<i class="fa fa-angle-down">'
       
      this.body.style.display = '';
    
    }
    else {
      
      this.spn.innerHTML = '<i class="fa fa-angle-right">'

      this.body.style.display = 'none';

    }  


  }

 

  constructor (app, title) {

   this.app = app 

   this.frame = document.createElement('div');

   this.frame.classList.add('object-properties-group');

   this.active = false;

   this.title = document.createElement('div');

   this.title.classList.add('object-properties-group-title');

   this.body = document.createElement('div');

   this.body.style.display = 'none';

   this.body.classList.add('object-properties-group-body');

   this.spn = document.createElement('span');

   this.spn.style.marginRight = '15px'

   this.spn.innerHTML = '<i class="fa fa-angle-right">'

   this.spn.onclick = (e) =>{this.active = !this.active; this.render()} 

   this.spn2 = document.createElement('span');

   this.spn2.innerHTML = `<strong>${title}<strong>`;

   this.title.appendChild(this.spn);

   this.title.appendChild(this.spn2);

   this.frame.appendChild(this.title);

   this.frame.appendChild(this.body);

   this.render();


 }



}

class epura_list {


  async load(){

     this.list = await this.app.datasource.get_epura_list();

     this.plot_list = await this.app.datasource.get_plot_list();

     this.plot_set = await this.app.datasource.get_plot_set();

     this.plot_line = await this.app.datasource.get_plot_line();

     this.diagram_list = await this.app.datasource.get_diagram_list();
     
     this.list.unshift({plot_name:'не задана'})

     this.render();

     this.select(0)

  }

  async toggle_dates (e, plot_no) {

    if (e.target.checked) {

      if (this.date_list_selected.length ===parseFloat(this.plot_qnt_date)) {

         alert('Превышено допустимое количество дат!');
        
         e.target.checked = false;

         return false;


      }


    }


    if (!e.target.checked) {

       let idx = this.date_list_selected.indexOf(e.target.value);

       this.date_list_selected.splice(idx, 1);


    } else {


      this.date_list_selected.push(e.target.value);


    }

    let dts = '';

    for (let i =0;i<this.date_list_selected.length;i++) {
      
      dts+=this.date_list_selected[i];

      if (i!==this.date_list_selected.length-1) dts+=','
    
    }  

  

    if (this.date_list_selected.length===0) {

       for (let i =0; i<this.app.sheets.length; i++) {

        for (let j =0; j<this.app.sheets[i].diags.length; j++) {

          this.app.sheets[i].diags[j].current_data = null;

          this.app.sheets[i].diags[j].current_table = null;

          //this.app.sheets[i].diags[j].current_table = null;


          this.app.sheets[i].diags[j].render();
          
        }

       }

    }

    if (this.date_list_selected.length!==0) {
      
      this.current_data = await this.app.datasource.get_epura_data(plot_no, dts);

      this.current_table = await this.app.datasource.get_epura_table(plot_no, dts);

      

      for (let i =0; i<this.app.sheets.length; i++) {

        for (let j =0; j<this.app.sheets[i].diags.length; j++) {
        
          
          this.app.sheets[i].diags[j].load_data(this.the_diag.pdiag_plot_no, this.current_data, this.current_table, this.plot_line, this.diagram_list, this.plot_set, this.the_diag.pline_pdiag_no); 
          
          if (this.app.selected_object&&this.app.selected_object.label==='diagram') this.app.object_properties.render('diagram');
           
        
        }  
        
       


      }

     


    }  



        

  }

  async select (num) {



    let ei = this.body.querySelector('.elist-item-selected');

    if (ei) {
      ei.classList.remove('elist-item-selected');

      ei.classList.add('elist-item');

    }

    let eis = this.body.querySelectorAll('.elist-item');

    this.selected = num;

    eis[num].classList.remove('elist-item');

    eis[num].classList.add('elist-item-selected');

    this.body2.innerHTML = '';

    this.date_list = '';

    this.plot_qnt_date = 0;

    this.title2.innerText = `Доступные даты`

    this.date_list_selected = [];

    this.current_data = [];

    this.app.sheets = [];

    this.app.sheets.push(new sheet('Лист 1', this.app, true));

    



 
    
    this.app.selected_sheet_title.innerHTML = this.app.sheets[0].title; 

    this.app.selected_sheet = 0;

    

    this.selected_object = this.app.sheets[0];

    this.app.object_properties.render('sheet');
    

    if (num === 0) {

     this.app.selected_object = null; 

     this.app.object_properties.render('none');
 

     this.app.frame.querySelector('.excel-main-space').innerHTML = '<div style="display: flex; flex: 1;justify-content: center; align-items: center;font-size: 30px;color: gray;">Выберите эпюру</div>';

     


    }


    if (num!==0) {


     this.app.frame.querySelector('.excel-main-space').innerHTML = ''; 

      

     this.app.sheets = [];



     this.the_diag  = this.diagram_list.find(o=>o.pdiag_plot_no===this.list[num].plot_no);

        
 
     this.app.diags = [];

     for (let i =0; i<this.diagram_list.length; i++) {

       if (this.diagram_list[i].pdiag_plot_no === this.list[num].plot_no) this.app.diags.push(this.diagram_list[i]);
    

     }



   




     this.app.sheets.push(new sheet('Лист 1', this.app, true));

     this.app.subscribe(this.app.sheets[this.app.sheets.length-1]);





     this.app.selected_sheet = 0;

     this.app.selected_object = this.app.sheets[this.app.sheets.length-1];

     this.app.selected_sheet_title.innerHTML = this.app.sheets[this.app.sheets.length-1].title;

     this.app.sheets[this.app.selected_sheet].render();


     this.date_list = await this.app.datasource.get_epura_dates(this.list[num].plot_no);

     this.plot_qnt_date = this.list[num].plot_qnt_date;

     this.title2.innerText = `Доступные даты (макс. кол-во - ${this.list[num].plot_qnt_date}):`


     for (let i =0; i<this.date_list.length;i++) { 
     
       let ei = document.createElement('div');

       ei.classList.add('elist-item');

       this.body2.appendChild(ei);

       let dt = this.date_list[i].replace;

       let dt1 = dt.split('T');

       let dt2 = dt1[0].split('-');

       dt = dt2[2]+'.'+dt2[1]+'.'+dt2[0]+' '+dt1[1];

       ei.innerHTML = `<label><input type='checkbox' value='${this.date_list[i].replace}'/>${dt}</label>`

       ei.firstChild.firstChild.onchange = (e) => this.toggle_dates(e, this.list[num].plot_no)

      } 
    
    }


  }

  render() {

    this.body.innerHTML = '';

    this.body2.innerHTML = '';

    for (let i = 0; i<this.list.length;i++) {

      

      let ei = document.createElement('div');

      if (i!==this.selected) ei.classList.add('elist-item');
      else ei.classList.add('elist-item-selected');

      ei.innerText = this.list[i].plot_name;

      ei.onclick = ()=>this.select(i);

      this.body.appendChild(ei);

    }

  }


  constructor (app) {

   this.app = app 

   this.frame = document.createElement('div');

   this.frame.classList.add('epura-list');

   this.title = document.createElement('div');

   this.title.classList.add('epura-list-title');

   this.title.innerText = 'Список эпюр:'
      
   this.body = document.createElement('div');

   this.body.classList.add('epura-list-body');
   
   this.title2 = document.createElement('div');

   this.title2.classList.add('epura-list-title');

   this.title2.innerText = 'Доступные даты:'

   this.body2 = document.createElement('div');

   this.body2.classList.add('epura-list-body');

   
   
   this.frame.appendChild(this.title);

   this.frame.appendChild(this.body);

   this.frame.appendChild(this.title2);
   
   this.frame.appendChild(this.body2);

   
   this.list = [];

   this.date_list_selected = [];

   this.date_list = [];

   this.current_data = [];

   this.render();

   this.selected = 0;

   this.plot_qnt_date = 0;

   this.the_diag = null;

   //this.diags = null;

  } 


}




class object_properties {


  render(tpe) {

    this.body.innerHTML = '';

    this.title.innerHTML = '';

    if (tpe === 'sheet') {

      this.title.innerText = 'Настройки листа'

      let dv = document.createElement('div')

      dv.style.position = 'relative'

      this.body.appendChild(dv);


      dv.appendChild((new object_properties_input(this.app, 'Имя листа:', 'sheet_name','text', {on:false}, this.app.sheets[this.app.selected_sheet].title)).frame);

      dv.appendChild((new object_properties_checkbox(this.app, 'Отображать сетку:', 'grid_visibility',this.app.sheets[this.app.selected_sheet].grid_visibility )).frame);

    }

    if (tpe==='diagram') {


        this.title.innerText = 'Свойства диаграммы'

        let grp = (new object_properties_group(this.app, 'Диаграммы эпюры'))

        let opts = [];

        opts.push({name:'не задана', value:-1});

        for (let i =0; i<this.app.diags.length;i++){

          let oname = (this.app.diags[i].pdiag_objectname)?this.app.diags[i].pdiag_objectname.toString().trim():'';

          let title = (this.app.diags[i].pdiag_title)?this.app.diags[i].pdiag_title.toString().trim():'';

          if (oname === '') oname = 'Объект';

          if (title === '') oname = 'Название';

          opts.push({name:oname+':'+title, value:this.app.diags[i].pdiag_no});


        }

          grp.body.appendChild((new object_properties_select(this.app, 'Диаграмма:','diagram_id',opts,this.app.selected_object.diagram_id)).frame);


        /*
grp.body.appendChild((new object_properties_select(this.app, 'Позиция:','legend_position',[{name:'справа',value:'right'},

          {name:'слева',value:'left'},{name:'сверху',value:'top'},{name:'снизу',value:'bottom'}

        */

       





        this.body.appendChild(grp.frame);

        grp = (new object_properties_group(this.app, 'Ось Х'))


        let x_min = (this.app.selected_object.axis_x_min.toString().trim()!=='')?this.app.selected_object.axis_x_min:this.app.selected_object.auto_x_min

        let x_max = (this.app.selected_object.axis_x_max.toString().trim()!=='')?this.app.selected_object.axis_x_max:this.app.selected_object.auto_x_max

        let x_step = (this.app.selected_object.axis_x_step.toString().trim()!=='')?this.app.selected_object.axis_x_step:this.app.selected_object.auto_x_step

        let kk = this.app.selected_object

        let show_auto_x_min = {

          on:(this.app.selected_object.axis_x_min.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_x_min = '';  arg.render(); this.on = false; return  arg.auto_x_min}  ,

          txt:'авто'

        }


         let show_auto_x_max = {

          on:(this.app.selected_object.axis_x_max.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_x_max = '';  arg.render(); this.on = false; return  arg.auto_x_max}  ,

          txt:'авто'

        }


         let show_auto_y_max = {

          on:(this.app.selected_object.axis_y_max.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_y_max = '';  arg.render(); this.on = false; return  arg.auto_y_max}  ,

          txt:'авто'

        }


         let show_auto_y_min = {

          on:(this.app.selected_object.axis_y_min.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_y_min = '';  arg.render(); this.on = false; return  arg.auto_y_min}  ,

          txt:'авто'

        }


        let show_auto_y_step = {

          on:(this.app.selected_object.axis_y_step.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_y_step = '';  arg.render(); this.on = false; return  arg.auto_y_step}  ,

          txt:'авто'

        }


         let show_auto_x_step = {

          on:(this.app.selected_object.axis_x_step.toString().trim()!=='')?true:false,

          change_function: function() { this.on = true},

          span_click: function(arg = kk) {arg.axis_x_step = '';  arg.render(); this.on = false; return  arg.auto_x_step}  ,

          txt:'авто'

        }





        grp.body.appendChild((new object_properties_checkbox(this.app, 'Отображать ось:', 'axis_x_visibility', this.app.selected_object.axis_x_visible)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Минимум:', 'axis_x_min', 'number', show_auto_x_min, x_min)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Максимум:', 'axis_x_max', 'number', show_auto_x_max,x_max)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Цена деления:', 'axis_x_step', 'number', show_auto_x_step, x_step )).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Отметка 1:', 'axis_x_mark1', 'number',{on:false},this.app.selected_object.axis_x_mark1)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Отметка 2:', 'axis_x_mark2', 'number',{on:false},this.app.selected_object.axis_x_mark2)).frame);


        this.body.appendChild(grp.frame);
        
        grp = (new object_properties_group(this.app, 'Ось Y'))

        grp.body.appendChild((new object_properties_checkbox(this.app, 'Отображать ось:', 'axis_y_visibility',this.app.selected_object.axis_y_visible)).frame);

        let y_min = (this.app.selected_object.axis_y_min.toString().trim()!=='')?this.app.selected_object.axis_y_min:this.app.selected_object.auto_y_min

        let y_max = (this.app.selected_object.axis_y_max.toString().trim()!=='')?this.app.selected_object.axis_y_max:this.app.selected_object.auto_y_max

        let y_step = (this.app.selected_object.axis_y_step.toString().trim()!=='')?this.app.selected_object.axis_y_step:this.app.selected_object.auto_y_step

        
        grp.body.appendChild((new object_properties_input(this.app, 'Минимум:', 'axis_y_min', 'number', show_auto_y_min, y_min)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Максимум:', 'axis_y_max', 'number', show_auto_y_max, y_max)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Цена деления:', 'axis_y_step', 'number', show_auto_y_step, y_step)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Отметка 1:', 'axis_y_mark1', 'number',{on:false},this.app.selected_object.axis_y_mark1)).frame);

        grp.body.appendChild((new object_properties_input(this.app, 'Отметка 2:', 'axis_y_mark2', 'number',{on:false},this.app.selected_object.axis_y_mark2)).frame);

        
        this.body.appendChild(grp.frame);
        
        grp = (new object_properties_group(this.app, 'Координатная сетка'))

        grp.body.appendChild((new object_properties_checkbox(this.app, 'Отображать Х:', 'grid_x_visibility', this.app.selected_object.grid_x_visible)).frame);

        grp.body.appendChild((new object_properties_checkbox(this.app, 'Отображать Y:', 'grid_y_visibility', this.app.selected_object.grid_y_visible)).frame);

        this.body.appendChild(grp.frame);


        grp = (new object_properties_group(this.app, 'Легенда'))

        grp.body.appendChild((new object_properties_checkbox(this.app, 'Показывать:', 'legend_visibility', this.app.selected_object.legend.show)).frame);

         grp.body.appendChild((new object_properties_select(this.app, 'Позиция:','legend_position',[{name:'справа',value:'right'},

          {name:'слева',value:'left'},{name:'сверху',value:'top'},{name:'снизу',value:'bottom'}


         ],this.app.selected_object.legend.pos)).frame);


          this.body.appendChild(grp.frame);


         grp = (new object_properties_group(this.app, 'Таблица'))

         grp.body.appendChild((new object_properties_checkbox(this.app, 'Показывать:', 'table_visibility', this.app.selected_object.table.show)).frame);

         grp.body.appendChild((new object_properties_input(this.app, 'Положение:', 'table_pos', 'text',{on:false},this.app.selected_object.table.pos)).frame);
         
         grp.body.appendChild((new object_properties_input(this.app, 'Точность:', 'table_pres', 'text',{on:false},this.app.selected_object.table.pres)).frame);
         
         
         this.body.appendChild(grp.frame);






    }

    if (tpe ==='cell') {
      



      this.title.innerText = 'Свойства ячейки'


      let grp = (new object_properties_group(this.app, 'Шрифт'))

      grp.body.appendChild((new object_properties_select(this.app, 'Название:','cell_font',[{name:'Arial',value:'Arial'},{name:'Calibri',value:'Calibri'},
             {name:'Verdana',value:'Verdana'},{name:'Tahoma',value:'Tahoma'},{name:'Trebuchet MS',value:'Trebuchet MS'},
             {name:'Times New Roman',value:'Times New Roman'},{name:'Georgia',value:'Georgia'},{name:'Garamond',value:'Garamond'}
             ,{name:'Courier New',value:'Courier New'}],this.app.selected_object.font.font_name)).frame);

      grp.body.appendChild((new object_properties_select(this.app, 'Размер:','cell_size',[{name:'11',value:'11'},{name:'12',value:'12'}, 
        {name:'14',value:'14'},{name:'16',value:'16'},{name:'18',value:'18'},{name:'18',value:'18'},
        {name:'20',value:'20'},{name:'22',value:'22'},{name:'24',value:'24'},{name:'28',value:'28'},
        ,{name:'36',value:'36'},{name:'48',value:'48'}
      ],this.app.selected_object.font.font_size)).frame);

      grp.body.appendChild((new object_properties_select(this.app, 'Начертание:', 'cell_style', [{name:'обычный',value:'plain'}, {name:'курсив', value:'italic'},

        {name:'полужирный',value:'bold'}, {name:'полужирный курсив', value:'bolditalic'}

      ],this.app.selected_object.font.font_style)).frame);

    

      grp.body.appendChild((new object_properties_input(this.app, 'Цвет:', 'cell_color', 'color',{on:false}, this.app.selected_object.font_color)).frame);
    

      this.body.appendChild(grp.frame);


      let grp2 = (new object_properties_group(this.app, 'Выравнивание'))

      grp2.body.appendChild((new object_properties_select(this.app, 'Вертикальное:','cell_vert',[{name:'по верхнему краю',value:'top'},
        {name:'по центру',value:'center'}, {name:'по нижнему краю',value:'bottom'}  ],this.app.selected_object.cell_vert)).frame);

      grp2.body.appendChild((new object_properties_select(this.app, 'Горизонтальное:','cell_horz',[{name:'по левому краю',value:'left'},
        {name:'по центру',value:'center'}, {name:'по правому краю',value:'right'}],this.app.selected_object.cell_horz)).frame);


      this.body.appendChild(grp2.frame);



      let grp3 = (new object_properties_group(this.app, 'Ячейка'))

      grp3.body.appendChild((new object_properties_input(this.app, 'Фон:', 'cell_bcolor', 'color',{on:false}, this.app.selected_object.bcolor)).frame);

      grp3.body.appendChild((new object_properties_select(this.app, 'Граница:', 'cell_border',[{name:'нет',value:false},
        {name:'есть',value:true}], this.app.selected_object.extra_border)).frame);

      this.body.appendChild(grp3.frame);



      //this.body.appendChild((new object_properties_select(this.app, 'Шрифт:')).frame);

    //this.body.appendChild((new object_properties_select(this.app, 'Размер:')).frame);

    //this.body.appendChild((new object_properties_input(this.app, 'Цвет:', 'color')).frame);



      


    }




  }


  constructor (app) {

   this.app = app 

   this.frame = document.createElement('div');

   this.frame.classList.add('object-properties');


   

   this.title = document.createElement('div');

   this.title.classList.add('object-properties-title');

   
   
   this.body = document.createElement('div');

   this.body.classList.add('object-properties-body');
   
   this.frame.appendChild(this.title);

   this.frame.appendChild(this.body);
   

  } 


}

class main_divider {


   capture(e) {

     e.target.setPointerCapture(e.pointerId);

     if (this.tpe === 'right') this.start_size = this.app.object_properties.frame.clientWidth;
     else this.start_size = this.app.epura_list.frame.clientWidth;

     this.start_x0 = e.x;

     this.in_action = true;

     


   }

   perform(e){

     if (!this.in_action) return;


     let new_size =  (this.tpe === 'right')?this.start_size - e.x + this.start_x0:this.start_size + e.x - this.start_x0

     if (new_size<5) new_size = 5;
     
     

     //this.width = new_size;

     let op = (this.tpe === 'right')?this.app.frame.querySelector('.object-properties'):this.app.frame.querySelector('.epura-list');

     
     
     op.style.minWidth = new_size+'px'

     op.style.maxWidth = new_size+'px'

   }
   
   release(e){
     

    this.in_action = false;

     e.target.releasePointerCapture(e.pointerId); 

     /*if (this.action.type==='col'){

        for  (let i=0;i<this.rows.length-1;i++) {
         
          for (let j=0;j<=this.action.num;j++)  
         
            this.rows[i].cells[j].render();

        }    

     }

     this.action = {};

     this.action_start = {x0:0, y0:0}*/


   }



   constructor(app, tpe='right') {


     this.tpe = tpe;

     this.app = app;

     this.frame = document.createElement('div');
       
     this.frame.classList.add('main-divider');

 

     this.switch =  document.createElement('div');

     if (tpe==='left') this.switch.classList.add('divider-switch-left');
     else this.switch.classList.add('divider-switch-right');

     this.switch.onclick = () => this.app.switch(tpe, this.switch);

     this.frame.appendChild(this.switch);



     this.start_size = 0;

     this.start_x0 = 0;

     this.in_action = false;

     this.frame.onpointerdown=(e)=>this.capture(e);
        
     this.frame.onpointermove=(e)=>this.perform(e);

     this.frame.onpointerup=(e)=>this.release(e);



     

   }

}

export class excel_app{

   switch(tpe, sww) {

    if (tpe==='left') {


      if (this.epura_list.frame.style.display!=='none') {

        this.epura_list.frame.style.display='none';

        sww.classList.remove('divider-switch-left');

        sww.classList.add('divider-switch-right');
      
      }
      else {

        this.epura_list.frame.style.display='';

        sww.classList.remove('divider-switch-right');
  
        sww.classList.add('divider-switch-left');

      
      }


    } else {

     if (this.object_properties.frame.style.display!=='none') {

        this.object_properties.frame.style.display='none';

        sww.classList.remove('divider-switch-right');

        sww.classList.add('divider-switch-left');
      
      }
      else {

        this.object_properties.frame.style.display='';

        sww.classList.remove('divider-switch-left');
  
        sww.classList.add('divider-switch-right');

      
      }



    }


   }

   render() {



    if (!this.datasource.connected) {

 
         this.datasource.show_connection_window(this.insertion_point, ()=>this.render())

         return;


    }

    this.epura_list.load();

    this.insertion_point.appendChild(this.frame);

    //this.sheets[this.selected_sheet].render();

    this.popup_menu.render();

    
    
    this.object_properties.render('cell');




    this.frame.oncontextmenu = (e) =>{

  
      
       e.preventDefault(); e.stopPropagation(); 
    
    
    }
               
   }
    
   subscribe (observer) {

     //console.log('subscribing')

     this.observers.push(observer);

   }

  unsubscribe(observer) {
  
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  
  }

   notify(data) {

    for (let i =0; i<this.observers.length;i++) {

      console.log('notify', data)

      if (this.observers[i]&&this.observers[i].update) this.observers[i].update(data);

    }
   
   }
    

  

   constructor (insertion_point, datasource, mode = 'editor') {    // mode = 'editor'|'viewer'

  
        this.observers = []; 


        this.datasource = datasource
       
        this.col_names = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','AA','AB','AC','AD','AE','AF','AG','AH','AI','AJ','AK','AL','AM','AN','AO','AP','AQ','AR','AS','AT','AU','AV','AW','AX','AY','AZ'],


        this.row_names = [];

        for (let i=1;i<=99;i++) this.row_names.push(i.toString());
      
        this.insertion_point =  insertion_point;

        this.mode = mode;

        this.frame = document.createElement('div');

        this.frame.classList.add('excel-app');

       
     

        let main_space_wrapper = document.createElement('div');

        main_space_wrapper.classList.add('main-space-wrapper');

        this.main_divider2 = new main_divider(this, 'left');

        this.epura_list = new epura_list(this);

        

        main_space_wrapper.appendChild(this.epura_list.frame);

        main_space_wrapper.appendChild(this.main_divider2.frame);




        let ems = (new excel_main_space(this)).frame

      

       
        main_space_wrapper.appendChild(ems)


     



        this.object_properties = new object_properties(this);



        this.main_divider = new main_divider(this, 'right');


        main_space_wrapper.appendChild(this.main_divider.frame);

        main_space_wrapper.appendChild(this.object_properties.frame);


        


        this.frame.appendChild(main_space_wrapper)

         let fp =new footer_panel(this)

         this.frame.appendChild(fp.frame)


        this.selected_sheet_title = fp.selected_sheet_title;


      


        this.sheets = [];

        let tt = this.frame.querySelector('.excel-main-space');
        
        let ttt = document.createElement('div');

        ttt.classList.add('sheet');

        tt.appendChild(ttt);


        this.diags = [];


        this.selected_sheet = -1;

        this.selected_object = null;

        this.popup_menu = new popup_menu (this);
      
        this.render();  

    }

} 