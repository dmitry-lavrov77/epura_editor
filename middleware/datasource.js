import './datasource.css'

export class DBLDataSource {


async get_diagram_list () {



    let response = await fetch('https://31.44.94.234:38435/api/kia_data/diagramlist', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

         body:''

        


       });

      let result = await response.json();


     


      return result;
  







}


async get_plot_list () {


      let response = await fetch('https://31.44.94.234:38435/api/kia_data/plotlist', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

         body:''

        


       });

      let result = await response.json();


      return result;

      

}


async get_plot_set () {



      let response = await fetch('https://31.44.94.234:38435/api/kia_data/plotset', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

         body:''

        


       });

      let result = await response.json();


      return result;


      

}


async get_plot_line () {


      let response = await fetch('https://31.44.94.234:38435/api/kia_data/plotline', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

         body:''

        


       });

      let result = await response.json();


      return result;

}


 async get_epura_table (eid, dates) {


     let response = await fetch('https://31.44.94.234:38435/api/kia_data/epuratabledata', {

        method: 'POST',
        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

          body:'['+eid+', "'+dates+'"]',

       });

      let result = await response.json();


   
    


      return result;





 }
  
 async get_epura_data (eid, dates) {

     let response = await fetch('https://31.44.94.234:38435/api/kia_data/epuradata', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

          body:'['+eid+', "'+dates+'"]',

       });

      let result = await response.json();

     


   
    


      return result;

   


  }
  
  

   async get_epura_dates (eid) {

     let response = await fetch('https://31.44.94.234:38435/api/kia_data/epuradates', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

          body:'["'+eid+'"]',

       });

      let result = await response.json();


    


      return result;

   


  }
  




  
async get_epura_list () {

     let response = await fetch('https://31.44.94.234:38435/api/kia_data/epuralist', {

        method: 'POST',

        
         headers: {
          'x-access-token':this.token,
          'Content-Type': 'application/json'
         },

         body:''

        


       });

      let result = await response.json();


      return result;

    


  }

  async doload (uname, upass, dbid, funct) {

        let response = await fetch('https://31.44.94.234:38435/api/auth/signin', {

         method: 'POST',

        
         headers: {
          'db-id': dbid,
          'Content-Type': 'application/json'
         },

        body:'["'+uname+'", "'+upass+'"]',


       });

       let result = await response.json();

       if (result.message&&result.message==='OK') {

         this.token = result.accessToken;

         this.connected = true;

         this.dbindex = dbid;

         if (this.auth) this.auth.parentNode.innerHTML = '';

         funct();
         
        }


  }  

  async show_connection_window(insertion_point, funct) {


    let response = await fetch('https://31.44.94.234:38435/api/getstations', {

      method: 'POST',
      
      headers: {
       'Content-Type': 'application/json;charset=utf-8'
      },
     
    });

    let result = await response.json();

    let options = ''

    for (let i=0;i<result.length;i++) {

        options += "<option value='"+result[i].Id+"'>"+result[i].Name+"</option>"


    }



    this.auth = document.createElement('div');

    this.auth.classList.add('container');

    this.auth.classList.add('login-container');

    this.auth.innerHTML=

    `
        <div class="row">
            <div class="col-md-6 mx-auto login-form-1">
             
                <h3>Пожалуйста, войдите в систему</h3>
                <form>
                    <div class="form-group">
                        <input type="text" class="form-control uname" placeholder="Имя пользователя *" value=''/>
                    </div>
                    <div class="form-group">
                        <input type="password" autoComplete="on" class="form-control upass" placeholder="Пароль *" value=''/>
                    </div>
                    <div class="form-group">
                        <select  class="form-control dbid" value=''>
                        ${options}
                        </select>    
                    </div>
                    <div class="form-group">
                        <input type="submit" class="btnSubmit" value="Войти"/>
                    </div>
                </form>
            </div>
         </div>

    
    
    
    `


    this.auth.querySelector('.btnSubmit').onclick = () => {
        
        let uname = this.auth.querySelector('.uname').value.trim();    
        
        let upass = this.auth.querySelector('.upass').value.trim();

        let dbid = this.auth.querySelector('.dbid').value.trim();

        this.doload(uname, upass, dbid, funct);

        return false;    
    
    };

    insertion_point.appendChild(this.auth);



  } 
 
 
  constructor () {

    this.auth = null;

    this.dbindex = -1;

    this.token = '';

    this.connected = false;


 }

}