import {window_object} from '../window-object/window-object'

import '@fortawesome/fontawesome-free/js/all.js';



/*

  this.svg.onclick = (evt) => { // convert clientXY to SVG XY
      let { a, d, e, f } = this.svg.getScreenCTM(); // has a,d and e,f property values
      let x = (evt.clientX - e) / a;
      let y = (evt.clientY - f) / d;
      this.drawCircle( x, y , evt.ctrlKey ? 50 : 30 );
    };

*/



export class picture_object{


    set_point(evt, svg) {

      let { a, d, e, f } = svg.getScreenCTM();

      let x = (evt.clientX - e) / a;

      let y = (evt.clientY - f) / d;

   

    }


    load_file (contents) {

      this.lfle = contents;

      let body = this.wo.frame.querySelector('.window-body');

      body.innerHTML =  contents;

      let w = body.firstElementChild.getAttribute('width')

      let h = body.firstElementChild.getAttribute('height')
 
      body.firstElementChild.setAttribute('width','100%');
    
      body.firstElementChild.setAttribute('height', '100%');



      body.firstElementChild.style.cursor='crosshair'

      body.firstElementChild.onclick = (e)=>this.set_point(e,body.firstElementChild);



     let view_box_on = body.firstElementChild.getAttribute('viewBox');

    
    
     if (view_box_on) {

    
      const viewBox =  body.firstElementChild.getAttribute('viewBox').split(/\s+|,/);
 
    
      let probable_height = (this.width-6)*parseFloat(viewBox[3])/parseFloat(viewBox[2]);

      if (probable_height<=(this.height-23)) {this.height = probable_height+23; this.frame.style.height= probable_height+23+'px'} 
 
      else {
 
       let probable_width = (this.height-23)*parseFloat(viewBox[2])/parseFloat(viewBox[3]);
 
       if (probable_width<=(this.width-6)) {this.width = probable_width+6; this.frame.style.width=probable_width + 6 +'px'} 
   
      }
 
    
   }
   else {


    if (w&&h) {

       body.firstElementChild.setAttribute('viewBox','0 0 '+w+' '+h);

       let probable_height = (this.width-6)*parseFloat(h)/parseFloat(w);
 
       if (probable_height<=(this.height-23)) { this.height = probable_height + 23; body.style.height= probable_height + 23 +'px'} 
   
       else {
   
        let probable_width = (this.height-23)*parseFloat(w)/parseFloat(h);
   
        if (probable_width<=this.width-6) {this.width = probable_width +6; body.style.width=probable_width+6+'px'} 
     
   
       }


     }
    

    }
    

   }


    render() {

     this.wo.render();   
     
     let head = this.wo.frame.querySelector('.window-head');

     let uploader = document.createElement('div');

     let finput = document.createElement('input');

     let toolbar = document.createElement('div');

     let linker = document.createElement('div');

     toolbar.style.position = 'absolute';

     toolbar.style.right = '3px';

     toolbar.style.top = '2px';

     toolbar.style.display = 'flex';

     toolbar.style.flexDirection = 'row';


     finput.style.display = 'none';

     finput.type = 'file';

     finput.accept=".svg"; 


     linker.innerHTML = `<i class="fa fa-link"></i>`

     linker.style.cursor = 'pointer'

     linker.title = 'Привязать диаграмму'




     uploader.innerHTML = `<i class="fa fa-upload"></i>`

     uploader.style.cursor = 'pointer'

     uploader.style.paddingRight='5px'

     uploader.title = 'Загрузить подложку'

     uploader.onclick = () => finput.click()

     finput.onchange = () =>{

      var file = finput.files[0];

      if (file) {
         
         var reader = new FileReader();

         reader.readAsText(file, "UTF-8");
         
         reader.onload = (evt) => this.load_file(evt.target.result)

        }

     }


     toolbar.appendChild(uploader);

     toolbar.appendChild(linker);
     
     head.appendChild(toolbar);

     head.appendChild(finput);

     if (this.link) this.draw_link_curve (this.link.wo.left,this.link.wo.top,this.link.wo.width, this.link.wo.height);

     if (this.lfle) this.load_file(this.lfle)


    }

     draw_link_curve (left, top, width, height) {

      if (this.link&&this.wo.frame&&this.link.wo.frame) {

        if (this.link_curve!==null) this.link_curve.remove();
        
        this.link_curve =document.createElementNS("http://www.w3.org/2000/svg", 'line');
       
        this.link_curve.setAttribute ('x1', parseFloat(this.wo.frame.style.left) + parseFloat(this.wo.frame.style.minWidth)/2);

        this.link_curve.setAttribute ('x2', parseFloat(this.link.wo.frame.style.left) + parseFloat(this.link.wo.frame.style.minWidth)/2);

        this.link_curve.setAttribute ('y1', parseFloat(this.wo.frame.style.top) + parseFloat(this.wo.frame.style.minHeight));

        this.link_curve.setAttribute ('y2', parseFloat(this.link.wo.frame.style.top));


        this.link_curve.setAttribute ('stroke', 'blue');

        this.link_curve.setAttribute ('stroke-width', '0.5');


        this.sheet.connections_layer.appendChild(this.link_curve)


      }  

     }


     add_link (obj) {


        this.link = obj;

        this.link_curve = null;

        this.link.wo.moveing = (left,top,width,height) => this.draw_link_curve (left,top,width,height);

        this.link.wo.frame.style.zIndex = '500'

        this.draw_link_curve (this.link.wo.left,this.link.wo.top,this.link.wo.width, this.link.wo.height)

        this.link.wo.after_resizeing = () =>{this.draw_link_curve()}


     }



     move_all (left, top, width, height) {

       if (!this.link) return;


        let delta_x = left - this.wo.left;

        let delta_y = top - this.wo.top;

        this.link.wo.frame.style.left = this.link.wo.left+delta_x + 'px';

        this.link.wo.frame.style.top = this.link.wo.top+delta_y + 'px'; 

        this.draw_link_curve (this.link.wo.left+delta_x,this.link.wo.top+delta_y,this.link.wo.width, this.link.wo.height)

     }


  
     stop_all (left, top, width, height) {

       if (!this.link) return;

        this.link.wo.left = parseFloat(this.link.wo.frame.style.left); 

        this.link.wo.top = parseFloat(this.link.wo.frame.style.top); 

       

        
        // this.link.wo.resizeing = (dir, new_size) => {//this.draw_link_curve(); 
        // this.link.resizeing(dir, new_size)}

        this.draw_link_curve();

     }


  
  
  
     constructor(app, sheet) {

       this.lfle = null; 

       this.app = app;
       
       this.sheet = sheet;

       this.wo = new window_object (this.app, this.sheet);

       this.link = null;

       this.link_curve = null;

       this.wo.moveing = (left, top, width, height) => this.move_all(left, top, width, height);

       this.wo.stop = (left, top, width, height) => this.stop_all(left, top, width, height);

       this.wo.resizeing = (dir, new_size) => {this.draw_link_curve(); return true;}

       


     }




}