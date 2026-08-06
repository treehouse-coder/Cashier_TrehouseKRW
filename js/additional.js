/*======================================
TREEHOUSE POS
ADDITIONAL
======================================*/

const Additional = {

    /*======================================
    LOAD CARD
    ======================================*/

    async load(){

        try{

            const result =
                await API.getAdditional();

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            this.render(result.data);

        }

        catch(err){

            console.error(err);

        }

    },

    /*======================================
    RENDER
    ======================================*/

    render(data){

        const list =
            document.getElementById(
                "additionalList"
            );

        list.innerHTML = "";

        data.forEach(row=>{

            list.innerHTML += `

                <div class="additional-item">

                    <span>${row[0] || ""}</span>

                    <span>${row[1] || ""}</span>

                    <span>${row[2] || ""}</span>

                </div>

            `;

        });

    }

};








/*======================================
ADDITIONAL MODAL
======================================*/

const AdditionalModal = {

    modal:null,

    init(){

        this.modal =
            document.getElementById(
                "additionalModal"
            );

        document
            .getElementById(
                "btnCloseAdditional"
            )
            .addEventListener(

                "click",

                ()=>this.close()

            );

        document
            .getElementById(
                "btnAdditionalAdd"
            )
            .addEventListener(

                "click",

                ()=>this.save()

            );

        Grid.enable(
            "#additionalModal .additional-row input"
        );

    },

    /*======================================
LOAD
======================================*/

async load(){

    const result =
        await API.searchAdditional(

            APP.filter.date

        );

    if(!result.success){

        Notify.error(result.message);

        return;

    }

    result.data.forEach((row,index)=>{

        const i = index + 1;

        document.getElementById(
            `additionalPaid${i}`
        ).value = row.paid;

        document.getElementById(
            `additionalHarga${i}`
        ).value = row.harga;

        document.getElementById(
            `additionalKet${i}`
        ).value = row.ket;

    });

},

    async open(){

    this.modal.style.display = "flex";

    document.querySelector(
        ".fab-container"
    ).style.display = "none";

    await this.load();

},

    close(){

        this.modal.style.display = "none";

        document.querySelector(
            ".fab-container"
        ).style.display = "flex";

        this.clear();

    },

    clear(){

        for(let i=1;i<=7;i++){

            document.getElementById(
                `additionalPaid${i}`
            ).value = "";

            document.getElementById(
                `additionalHarga${i}`
            ).value = "";

            document.getElementById(
                `additionalKet${i}`
            ).value = "";

        }

    },

/*======================================
SAVE
======================================*/

async save(){

    await Button.loading(

        "btnAdditionalAdd",

        async ()=>{

            const rows = [];

            for(let i=1;i<=7;i++){

                rows.push({

                    paid:
                        document
                        .getElementById(`additionalPaid${i}`)
                        .value
                        .trim(),

                    harga:
                        document
                        .getElementById(`additionalHarga${i}`)
                        .value
                        .trim(),

                    ket:
                        document
                        .getElementById(`additionalKet${i}`)
                        .value
                        .trim()

                });

            }

            const result = await API.saveAdditional(

                APP.filter.date,

                rows

            );

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(
                "Additional berhasil disimpan."
            );

            this.close();

            await new Promise(r=>setTimeout(r,300));

            await Additional.load();

        }

    );

}

};

/*======================================
INIT
======================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        AdditionalModal.init();

    }

);