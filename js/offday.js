/*======================================
OFFDAY
======================================*/

const Offday = {

    /*======================================
    LOAD
    ======================================*/

    async load() {

        try {

            const result = await API.getOffday();

            if (!result.success) {

                Notify.error(result.message);

                return;

            }

            this.render(result.data);

        }

        catch (err) {

            console.error(err);

            Notify.error("Gagal memuat data Offday.");

        }

    },

    /*======================================
    RENDER
    ======================================*/

    render(data) {

        const list = document.getElementById(
            "offdayList"
        );

        list.innerHTML = "";

        data.forEach(function(row) {

            list.innerHTML += `

                <div class="offday-row">

                    ${row[0] || ""}

                </div>

            `;

        });

    }

};


/*======================================
OFFDAYmodal
======================================*/
const OffdayModal = {

    modal:null,

    init(){

        this.modal =
            document.getElementById(
                "offdayModal"
            );
        
            document
            .getElementById("btnOffdayAdd")
            .addEventListener(

                "click",

                () => this.save()

            );
        
        document
            .getElementById(
                "btnCloseOffday"
            )
            .addEventListener(
                "click",
                ()=>this.close()
            );

            Grid.enable("#offdayModal .offday-body input");

    },

    async open(){

    this.modal.style.display = "flex";

    document.querySelector(".fab-container").style.display = "none";

    await this.load();

    },

    close(){

    this.modal.style.display = "none";

    document.querySelector(".fab-container").style.display = "flex";

    for(let i=1;i<=7;i++){

        document.getElementById(

            `offday${i}`

        ).value = "";

    }

    },

/*======================================
LOAD
======================================*/

async load(){

    const result = await API.searchOffday(

        APP.filter.date

    );

    if(!result.success){

        Notify.error(result.message);

        return;

    }

    for(let i=1;i<=7;i++){

        document.getElementById(

            `offday${i}`

        ).value = result.data[i-1] || "";

    }

},    

/*======================================
SAVE
======================================*/

async save(){

    await Button.loading(

        "btnOffdayAdd",

        async()=>{

            const names = [];

            for(let i=1;i<=7;i++){

                const value = document
                    .getElementById(`offday${i}`)
                    .value
                    .trim();

                if(value){

                    names.push(value);

                }

            }

            const result = await API.saveOffday(

                APP.filter.date,

                names

            );

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(
                "Offday berhasil disimpan."
            );

            this.close();

            await new Promise(resolve =>
                setTimeout(resolve,300)
            );

            await Offday.load();

        }

    );

}

}