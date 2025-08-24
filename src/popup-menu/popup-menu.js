
import './popup-menu.css'

export class popup_menu {


    toggle_active (e, mode) {


      //console.log('toggle')

      
       //let insertion_point = this.app.frame.querySelector('.excel-main-space')

       //this.frame = document.createElement('div');

       //this.frame.classList.add('menu-popup');




       let menu = this.frame.querySelector('.menu-popup-context-menu');

       //console.log(menu)

      // console.log(menu.parentNode.parentNode)

       if (mode&&mode==='merge') {

          menu.innerHTML = `<div  data-action='merge' class="menu-popup-context-menu-item">Объединить ячейки</div>`

       } else if (mode&&mode ==='add') {

         menu.innerHTML = `<div  data-action='add' class="menu-popup-context-menu-item">Добавить диаграмму</div>`

       }

       menu.style.left = e.x + 'px';

       menu.style.top = e.y + 'px'
       
       this.frame.classList.toggle('menu-popup_active');

    }


    render() {


        let insertion_point = this.app.frame;
        //.querySelector('.excel-app')

        this.frame = document.createElement('div');

        this.frame.classList.add('menu-popup');

        this.frame.onclick = (e) => {
        
          
          
          this.toggle_active(e);
        
          if (e.target.classList.contains('menu-popup-context-menu-item')) {


             const menuEvent =  {
               evt:'menuEvent', 
                detail: {
      
                  what:e.target.dataset.action

                },
              };


              this.app.notify(menuEvent);



          }

        
        }

        this.frame.oncontextmenu = (e) => { this.toggle_active(e); let el = document.elementFromPoint(e.x,e.y); el.oncontextmenu(e);/*e.preventDefault(); e.stopPropagation(); this.toggle_active(e); this.toggle_active(e);*/ }

        this.frame.innerHTML = `
        
          <div class = 'menu-popup-wrapper'></div>

          <div class="menu-popup-context-menu">

          </div>

        `


        //  <div  data-action='copy' class="menu-popup-context-menu-item">Добавить подложку</div>
    
        //       <div  data-action='copy' class="menu-popup-context-menu-item">Добавить диаграмму</div>
    
        //       <div  data-action='copy' class="menu-popup-context-menu-item">Добавить таблицу</div>

       insertion_point.appendChild(this.frame);


    }

    constructor(app) {

        this.app = app;
        
        this.frame = null;

    }



}

/*
        <div class='reader2023_menu-popup'>
          <div class = 'reader2023_menu-popup-wrapper'></div>
          <div class="menu-popup-context-menu">
              <div  data-action='copy' class="menu-popup-context-menu-item">Копировать</div>
              <div  data-action='share' class="menu-popup-context-menu-item">Поделиться</div>
              <div  data-action='add-bmark' class="menu-popup-context-menu-item">Добавить закладку</div>
              <div  data-action='add-note' class="menu-popup-context-menu-item">Добавить заметку</div>
              <div  data-action='kill-bmark' class="menu-popup-context-menu-item">Удалить закладку</div>
              <div  data-action='kill-note' class="menu-popup-context-menu-item">Удалить заметку</div>
          </div>
        </div>
 */
 
 
 
/* 
.reader2023_menu-popup {
    position: absolute;
    width:100%; height:100%;
    top:0; left:0; right: 0; bottom: 0;
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    font-size: .75em;
}
 
.reader2023_menu-popup_active {
    display: block;
}
.reader2023_menu-popup-wrapper {
    position: absolute;
    width:100%; height:100%;
    top:0; left:0; right: 0; bottom: 0;
}
 
.menu-popup-context-menu {
    width: 184px;
    position: absolute;
    z-index: 1;
    background: #fff;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    
}
 
.menu-popup-context-menu-item {
  padding: 9px 12px 7px 36px;
  transition: background .8s, color;
  border-bottom: 1px solid #E3E9FF;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
  position: relative;
  display: flex;
  align-items: center;
}
 
.menu-popup-context-menu-item:hover {
  background: #4A5CAF1A;
}
 
.menu-popup-context-menu-item:active {
  background: #4052A51A;
}
 
.menu-popup-context-menu-item::before {
  content:'';
  position: absolute;
  left: 8px;
  width:16px;
  height:16px;
  transition: background .8s;
}
 
.menu-popup-context-menu-item[data-action="copy"]::before {
  background: url("src/assets/img/v2/context-menu_copy_share.svg") center center no-repeat;
}
.menu-popup-context-menu-item[data-action="copy"]:hover::before {
  background: url("src/assets/img/v2/context-menu_copy_share_hover.svg") center center no-repeat;
}
 
.menu-popup-context-menu-item[data-action="share"]::before {
  background: url("src/assets/img/v2/context-menu_copy.svg") center center no-repeat;
}
.menu-popup-context-menu-item[data-action="share"]:hover::before {
  background: url("src/assets/img/v2/context-menu_copy_hover.svg") center center no-repeat;
}
 
.menu-popup-context-menu-item[data-action="add-bmark"]::before {
  background: url("src/assets/img/v2/context-menu_bookmark_add.svg") center center no-repeat;
}
.menu-popup-context-menu-item[data-action="add-bmark"]:hover::before {
  background: url("src/assets/img/v2/context-menu_bookmark_add_hover.svg") center center no-repeat;
}
 
.menu-popup-context-menu-item[data-action="add-note"]::before {
  background: url("src/assets/img/v2/context-menu_note_add.svg") center center no-repeat;
}
.menu-popup-context-menu-item[data-action="add-note"]:hover::before {
  background: url("src/assets/img/v2/context-menu_note_add_hover.svg") center center no-repeat;
}
 
.menu-popup-context-menu-item[data-action="kill-bmark"]::before,
.menu-popup-context-menu-item[data-action="kill-note"]::before {
  background: url("src/assets/img/v2/context-menu_delete.svg") center center no-repeat;
}
.menu-popup-context-menu-item[data-action="kill-bmark"]:hover::before,
.menu-popup-context-menu-item[data-action="kill-note"]:hover::before {
  background: url("src/assets/img/v2/context-menu_delete_hover.svg") center center no-repeat;
}
 

 
.reader2023_copy-done {
    position: fixed;
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    z-index: 1000;
}
 
.reader2023_copy-done_active {
    opacity: 0;
    transition: opacity 0.8s;
    display: flex;
}
 
.reader2023_copy-done_opacity {
    display: flex;
    opacity: 1;
 
}
 
.reader2023_copy-done-wrapper {
    position: absolute;
    width:100%; height: 100%;
}
 
.reader2023_copy-done-container {
    width: 420px; height: 16px;
    padding: 1em 2em;
    border-radius: 2em;
    box-shadow: 0 0 22px 0 rgba(0, 0, 0, 0.15);
    background: #526ece;
    color:#fff;
    margin-top: 98px;
    text-align: center;
   
 
    
}
.reader2023_copy-done-container.invalid {
    background: #e9806e;
}
    */