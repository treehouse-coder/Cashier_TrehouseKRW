/*======================================
TREEHOUSE POS
CONFIG
======================================*/

const Config = {

    therapist: [],

    treatment: [],

    gift: [],

    paid: [],

    holiday: "NORMAL",



    /*======================================
    LOAD
    ======================================*/

    async load() {

        await this.loadConfig();

        await this.loadHoliday();

    },



    /*======================================
    LOAD CONFIG
    ======================================*/

    async loadConfig() {

        const result = await API.getConfig();

        if (!result.success) {

            Notify.error(
    result.message
);

            return;

        }

        this.therapist = result.data.therapist;

        this.treatment = result.data.treatment;

        this.gift = result.data.gift;

        this.paid = result.data.paid;

        this.fillSelect(
            "therapist",
            this.therapist
        );

        this.fillSelect(
            "treatment",
            this.treatment
        );

        this.fillSelect(
            "gift",
            this.gift
        );

        this.fillSelect(
            "paid",
            this.paid
        );

        this.fillSelect(
    "editTherapist",
    this.therapist
);

this.fillSelect(
    "editTreatment",
    this.treatment
);

this.fillSelect(
    "editGift",
    this.gift
);

this.fillSelect(
    "editPaid",
    this.paid
);

    },



    /*======================================
    LOAD HOLIDAY
    ======================================*/

    async loadHoliday() {

        const result = await API.getHoliday();

        if (!result.success) {

            Notify.error(
    result.message
);

            return;

        }

        this.holiday = result.data;

        

        this.refreshHolidayButton();


const button = document.getElementById("btnHoliday");


if(button){

    button.onclick = () => {

        this.toggleHoliday();

    };

}

    },



    /*======================================
    FILL SELECT
    ======================================*/

    fillSelect(id, list) {

        const select = document.getElementById(id);

        select.innerHTML = "";

        const option = document.createElement("option");

        option.value = "";

        option.textContent = "-- Pilih --";

        select.appendChild(option);

        list.forEach(function(item){

            const option = document.createElement("option");

            option.value = item;

            option.textContent = item;

            select.appendChild(option);

        });

    },



    /*======================================
    REFRESH HOLIDAY BUTTON
    ======================================*/

    refreshHolidayButton() {

        const button = document.getElementById("btnHoliday");

        if (!button) {

            return;

        }

        button.textContent = this.holiday;

        if (this.holiday === "HOLIDAY") {

            button.classList.add("holiday");

            button.classList.remove("normal");

        } else {

            button.classList.add("normal");

            button.classList.remove("holiday");

        }

    },



    /*======================================
    TOGGLE HOLIDAY
    ======================================*/

    async toggleHoliday() {

        const status =

            this.holiday === "NORMAL"

                ? "HOLIDAY"

                : "NORMAL";

        const result = await API.setHoliday(

            status

        );

        if (!result.success) {

            Notify.error(
    result.message
);

            return;

        }

        this.holiday = result.data;

        this.refreshHolidayButton();

    }

};