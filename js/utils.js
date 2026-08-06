/*======================================
GRID NAVIGATION
======================================*/

const Grid = {

    enable(selector){

        const inputs = [
            ...document.querySelectorAll(selector)
        ];

        inputs.forEach((input,index)=>{

            input.addEventListener("keydown",(e)=>{

                const row = input.parentElement;

let cols = 1;

if(

    row.classList.contains("additional-row") ||

    row.classList.contains("feedback-row")

){

    cols = row.children.length;

}

                let next = null;

                switch(e.key){

                    case "ArrowLeft":

                        next = index - 1;

                        break;

                    case "ArrowRight":

                        next = index + 1;

                        break;

                    case "ArrowUp":

                        next = index - cols;

                        break;

                    case "ArrowDown":

                        next = index + cols;

                        break;

                    case "Enter":

                        next = index + 1;

                        break;

                    default:

                        return;

                }

                e.preventDefault();

                if(next < 0){

                    next = 0;

                }

                if(next >= inputs.length){

                    next = inputs.length - 1;

                }

                inputs[next].focus();

                inputs[next].select();

            });

        });

    }

};

/*======================================
BUTTON
======================================*/

const Button = {

    /*======================================
    LOADING
    ======================================*/

    async loading(id, callback){

        const btn = typeof id === "string"

            ? document.getElementById(id)

            : id;

        if(!btn){

            return await callback();

        }

        const text = btn.innerHTML;

        btn.disabled = true;

        btn.innerHTML = "Processing...";

        try{

            return await callback();

        }

        finally{

            btn.disabled = false;

            btn.innerHTML = text;

        }

    }

};