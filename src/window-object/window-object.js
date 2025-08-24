export class window_object{


    capture (e, action) {


       e.target.setPointerCapture(e.pointerId);

       this.action = action;

       this.action_start.left0 = this.left*this.app.cscale;

       this.action_start.top0 = this.top*this.app.cscale;

       this.action_start.width0 = this.width*this.app.cscale;

       this.action_start.height0 = this.height*this.app.cscale;

       this.action_start.x0 = e.x;

       this.action_start.y0 = e.y;

       e.stopPropagation()


    }

    release (e) {

      this.left = parseFloat(this.frame.style.left)/this.app.cscale;

      this.top = parseFloat(this.frame.style.top)/this.app.cscale;;
        
      
      this.width =  parseFloat(this.frame.style.minWidth)/this.app.cscale;

      this.height =  parseFloat(this.frame.style.minHeight)/this.app.cscale;

      
      this.action = null;  

      this.action_start = {};

      e.target.releasePointerCapture(e.pointerId); 

      this.stop(this.left*this.app.cscale, this.top*this.app.cscale, this.width*this.app.cscale, this.height*this.app.cscale);


    }


    perform (e) {

        if (this.action === 'move') {

           let new_x = this.action_start.left0 + e.x - this.action_start.x0;

           let new_y = this.action_start.top0 + e.y - this.action_start.y0;

           if (new_x<0) new_x = 0;

           if (new_y<0) new_y = 0;
           
           this.frame.style.left =  new_x + 'px';

           this.frame.style.top =  new_y + 'px';
           
           this.moveing(new_x, new_y, this.width*this.app.cscale, this.height*this.app.cscale);




        } 
        else if (this.action === 'resize-east') {

             let new_width = this.action_start.width0 + e.x - this.action_start.x0;

             if (!this.resizeing('resize-east', {width:new_width})) {this.after_resizeing(); return;}
             
            
             this.frame.style.minWidth =  new_width + 'px';

             this.frame.style.maxWidth =  new_width + 'px';


this.after_resizeing();



             //this.resizeing();
             
        }

        else if (this.action === 'resize-south') {

             let new_height = this.action_start.height0 + e.y - this.action_start.y0;


             if (!this.resizeing('resize-south', {height:new_height})) {this.after_resizeing(); return;}
            
             this.frame.style.minHeight =  new_height + 'px';

             this.frame.style.maxHeight =  new_height + 'px';

            this.after_resizeing();
             
        }



        else if (this.action === 'resize-west') {

             let new_left = this.action_start.left0 + e.x - this.action_start.x0;

             let new_width = this.action_start.width0 - e.x + this.action_start.x0;
            
             
             if (new_left < 0 ) {
                
                new_left = 0;

                new_width = this.action_start.width0 - this.action_start.x0 + this.action_start.left0 + this.action_start.x0;
             
             }

             if (!this.resizeing('resize-west', {left:new_left, width:new_width})) {this.after_resizeing(); return;}

             this.frame.style.left = new_left + 'px';
             
             this.frame.style.minWidth =  new_width + 'px';

             this.frame.style.maxWidth =  new_width + 'px';

             this.after_resizeing();

            
             
             
        }


        else if (this.action === 'resize-north') {

             let new_top = this.action_start.top0 + e.y - this.action_start.y0;

             let new_height = this.action_start.height0 - e.y + this.action_start.y0;
            
             
             if (new_top < 0 ) {
                
                new_top = 0;

                new_height = this.action_start.height0 - this.action_start.y0 + this.action_start.top0 + this.action_start.y0;
             
             }

             if (!this.resizeing('resize-north', {top:new_top, height:new_height})) {this.after_resizeing(); return;}

             this.frame.style.top = new_top + 'px';
             
             this.frame.style.minHeight =  new_height + 'px';

             this.frame.style.maxHeight =  new_height + 'px';

             this.after_resizeing();

             
             
             
        }

        

    }

    set_action (frame, action) {

        frame.onpointerdown=(e)=>this.capture(e, action);
        
        frame.onpointermove=(e)=>this.perform(e);

        frame.onpointerup=(e)=>this.release(e);
    }
   
    render() {

        this.frame = document.createElement('div');

        this.frame.style.position='absolute';

        this.frame.style.left = this.left*this.app.cscale + 'px';

        this.frame.style.top = this.top*this.app.cscale + 'px';




        this.frame.style.zIndex = '100';

        this.frame.style.minWidth = this.width*this.app.cscale+'px';

        this.frame.style.maxWidth = this.width*this.app.cscale+'px';

        this.frame.style.minHeight = this.height*this.app.cscale+'px';

        this.frame.style.maxHeight = this.height*this.app.cscale+'px';

        this.frame.style.backgroundColor  = 'white'

        let ss = this.sheet.frame.querySelector('.sheet');

        
        this.head = document.createElement('div');

        this.head.classList.add('window-head');

        this.head.style.position='absolute';

        this.head.style.height = '20px';

        this.head.style.left = '0px';

        this.head.style.right = '0px';

        this.head.style.backgroundColor  = 'rgb(211, 227, 253, 0.6)' //'#d3e3fd';

        this.head.style.borderLeft ='1px solid gray'

        this.head.style.borderRight ='1px solid gray'

        this.head.style.cursor  = 'move';

        this.set_action(this.head, 'move');



        
        this.handle_left = document.createElement('div');

        this.handle_left.style.position='absolute';

        this.handle_left.style.width = '3px';

        this.handle_left.style.left = '0px';

        this.handle_left.style.top = '20px';

        this.handle_left.style.bottom = '3px';

        this.handle_left.style.backgroundColor  = 'transparent';

        this.handle_left.style.cursor  = 'col-resize';

        this.handle_left.style.borderLeft ='1px solid gray'

        this.set_action(this.handle_left,'resize-west')

      
        this.handle_right = document.createElement('div');

        this.handle_right.style.position='absolute';


        this.handle_right.style.width = '3px';

        this.handle_right.style.right = '0px';

        this.handle_right.style.top = '20px';

        this.handle_right.style.bottom = '3px';

        this.handle_right.style.backgroundColor  = 'transparent';

        this.handle_right.style.borderRight ='1px solid gray'

        this.handle_right.style.cursor  = 'col-resize';

        this.set_action(this.handle_right,'resize-east')

        
        this.handle_bottom = document.createElement('div');

        this.handle_bottom.style.position='absolute';

        this.handle_bottom.style.height = '3px';

        this.handle_bottom.style.right = '3px';

        this.handle_bottom.style.left = '3px';

        this.handle_bottom.style.bottom = '0px';

        this.handle_bottom.style.borderBottom ='1px solid gray'

        this.handle_bottom.style.backgroundColor  = 'transparent';

        this.handle_bottom.style.cursor  = 'row-resize';

        this.set_action(this.handle_bottom,'resize-south')




        this.handle_top = document.createElement('div');

        this.handle_top.style.position='absolute';

        this.handle_top.style.height = '3px';

        this.handle_top.style.right = '3px';

        this.handle_top.style.left = '3px';

        this.handle_top.style.top = '0px';

        this.handle_top.style.borderTop ='1px solid gray'

       // this.handle_top.style.backgroundColor  = '#d3e3fd';

       this.handle_top.style.backgroundColor  = 'transparent';

      
       this.handle_top.style.cursor  = 'row-resize';

       
       this.set_action(this.handle_top,'resize-north')



        this.handle_nw = document.createElement('div');

        this.handle_nw.style.position='absolute';

        this.handle_nw.style.height = '3px';

        this.handle_nw.style.width = '3px';

        
        this.handle_nw.style.top = '0px';

        this.handle_nw.style.left = '0px';

        this.handle_nw.style.borderTop ='1px solid gray'

        this.handle_nw.style.backgroundColor  = '#d3e3fd';

        this.handle_nw.style.cursor  = 'nwse-resize';

        this.set_action(this.handle_nw,'resize-nw')



        this.handle_ne = document.createElement('div');

        this.handle_ne.style.position='absolute';

        this.handle_ne.style.height = '3px';

        this.handle_ne.style.width = '3px';

        
        this.handle_ne.style.top = '0px';

        this.handle_ne.style.right = '0px';

        this.handle_ne.style.borderTop ='1px solid gray'

        this.handle_ne.style.backgroundColor  = '#d3e3fd';

        this.handle_ne.style.cursor  = 'nesw-resize';

        this.set_action(this.handle_ne,'resize-nw')




        this.handle_sw = document.createElement('div');

        this.handle_sw.style.position='absolute';

        this.handle_sw.style.height = '3px';

        this.handle_sw.style.width = '3px';

        
        this.handle_sw.style.bottom = '0px';

        this.handle_sw.style.left = '0px';

        this.handle_sw.style.borderLeft ='1px solid gray'

        this.handle_sw.style.borderBottom ='1px solid gray'

        this.handle_sw.style.backgroundColor  = 'transparent';

        this.handle_sw.style.cursor  = 'nesw-resize';

        this.set_action(this.handle_sw,'resize-sw')



        this.handle_se = document.createElement('div');

        this.handle_se.style.position='absolute';

        this.handle_se.style.height = '3px';

        this.handle_se.style.width = '3px';

        
        this.handle_se.style.bottom = '0px';

        this.handle_se.style.right = '0px';

        this.handle_se.style.borderRight ='1px solid gray'

        this.handle_se.style.borderBottom ='1px solid gray'

        this.handle_se.style.backgroundColor  = 'transparent';

        this.handle_se.style.cursor  = 'nwse-resize';

        this.set_action(this.handle_se,'resize-se')


        this.body = document.createElement('div');

        this.body.classList.add('window-body')

        this.body.style.backgroundColor='white';
        
        this.body.style.position='absolute';

        this.body.style.top = '21px';

        this.body.style.bottom = '4px';
        
        this.body.style.left = '4px';

        this.body.style.right = '4px';









        //let fle = <input type="file" id ="fileForUpload"></input>

        //let btn = document.createElement('btn');

        /*let btn = document.createElement('input');

        btn.type = 'file';

        btn.id = "fileForUpload";



        btn.onclick =() =>{

           var file = document.getElementById("fileForUpload").files[0];
if (file) {
    var reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = function (evt) {
        
       
        
        //document.getElementById("fileContents").innerHTML = evt.target.result;
    }
    reader.onerror = function (evt) {
        //document.getElementById("fileContents").innerHTML = "error reading file";
    }
}




        }

*/

        this.head.appendChild(this.handle_top);

        this.head.appendChild(this.handle_nw);

        this.head.appendChild(this.handle_ne);
        //this.head.appendChild(btn);


        
        this.frame.appendChild(this.head);
        
        this.frame.appendChild(this.handle_left);

        this.frame.appendChild(this.handle_right);

        this.frame.appendChild(this.handle_bottom);

        this.frame.appendChild(this.handle_sw);

        this.frame.appendChild(this.handle_se);

        this.frame.appendChild(this.body);


        ss.appendChild(this.frame);

    }



    constructor(app, sheet) {

      this.action = null;  

      this.action_start = {};

      this.app = app; 
      
      this.sheet = sheet;

      this.frame=null;

      this.head=null;

      this.body=null;

      this.handle_top=null;

      this.handle_bottom=null;

      this.handle_right=null;

      this.handle_left=null;

      this.top = 0;

      this.left = 0;


      this.width = 200;

      this.height = 150;

      this.moveing = (left, top, width, height) =>{}

      this.stop = (left, top, width, height) =>{}

      this.resizeing = (dir, new_size) =>{return true};

      this.after_resizeing = () =>{return true};

    }

}