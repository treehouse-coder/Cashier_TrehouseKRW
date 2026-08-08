/*======================================
TREEHOUSE POS
TRANSACTION
======================================*/

const Transaction = {

    /*======================================
    INIT
    ======================================*/

    init() {

        document
    .getElementById("btnSave")
    .addEventListener(
        "click",
        () => this.save()
    );
    },



   /*======================================
SAVE
======================================*/

async save(){

    await Button.loading(

        "btnSave",

        async()=>{

            const data = {

                date: document
                    .getElementById("periode")
                    .value,

                therapist: document
                    .getElementById("therapist")
                    .value,

                treatment: document
                    .getElementById("treatment")
                    .value,

                gift: document
                    .getElementById("gift")
                    .value,

                paid: document
                    .getElementById("paid")
                    .value

            };

            if(!this.validate(data)){

                return;

            }

            const result =
                await API.addTransaction(data);

            if(!result.success){

                Notify.error(
                    result.message
                );

                return;

            }

            Notify.success(
                "Transaction Saved"
            );

            this.clear();

            if(typeof Table !== "undefined"){

                await Table.load();
                await Summary.load();
            }

        }

    );

},



    /*======================================
    VALIDATE
    ======================================*/

    validate(data) {

        if (data.therapist === "") {

            Notify.error(
    "Pilih Therapist."
);

            document
                .getElementById("therapist")
                .focus();

            return false;

        }

        if (data.treatment === "") {

            Notify.error(
    "Pilih Tratment."
);

            document
                .getElementById("treatment")
                .focus();

            return false;

        }

        if (data.paid === "") {

            Notify.error(
    "Pilih Pembayaran."
);

            document
                .getElementById("paid")
                .focus();

            return false;

        }

        return true;

    },



    /*======================================
    CLEAR
    ======================================*/

    clear() {

        document.getElementById("therapist").selectedIndex = 0;

        document.getElementById("treatment").selectedIndex = 0;

        document.getElementById("gift").selectedIndex = 0;

        document.getElementById("paid").selectedIndex = 0;

        document
            .getElementById("therapist")
            .focus();

    }

};