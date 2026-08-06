/*======================================
NOTIFICATION
======================================*/

const Notify = {

    timer: null,



    show(message, type = "success") {

        const box = document.getElementById("notification");

        box.className = "";

        box.classList.add(type);

        box.classList.add("show");

        box.textContent = message;

        clearTimeout(this.timer);

        this.timer = setTimeout(function(){

            box.classList.remove("show");

        },2000);

    },



    success(message){

        this.show(message,"success");

    },



    error(message){

        this.show(message,"error");

    },



    info(message){

        this.show(message,"info");

    }

};