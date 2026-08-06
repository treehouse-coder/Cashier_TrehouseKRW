const APP = {

    filter: {

        date: ""

    }

};


document.addEventListener(

    "DOMContentLoaded",

    async function(){

        API.init(
            "https://script.google.com/macros/s/AKfycbzWTq7z5OFMNgsAU1yhaAuH8betxU2rVsESF8VzgNeIP-LcDCkoGwo4d1wXZKIar1Uh/exec"
        );


        const periode = flatpickr("#periode",{

    dateFormat:"Y-m-d",

    altInput:true,

    altFormat:"d M y",

    defaultDate:new Date(),

    allowInput:false,

    onChange: async function(selectedDates, dateStr){

    APP.filter.date = dateStr;

    const result = await API.setPeriode(dateStr);

    if(!result.success){

        Notify.error(result.message);

        return;

    }

    await Promise.all([

    Table.load(),

    Summary.load(),

    Offday.load(),

    Additional.load(),

    Feedback.load()

]);

}

});

// Simpan tanggal awal (format yyyy-MM-dd)
APP.filter.date = periode.formatDate(

    periode.selectedDates[0],

    "Y-m-d"

);

// Tulis ke Modul!L1 saat aplikasi dibuka
await API.setPeriode(
    APP.filter.date
);

await Config.load();

Transaction.init();

Table.init();

GiftCard.init();

OffdayModal.init();

AdditionalModal.init();

FeedbackModal.init();

ConfigModal.init();

await Promise.all([

    Table.load(),

    Summary.load(),

    Offday.load(),

    Additional.load(),

    Feedback.load()

]);


    }

);


/*======================================
DIGITAL CLOCK
======================================*/

function updateClock(){

    const now = new Date();

    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");

    document.getElementById("digitalClock").textContent =
        `${h}:${m}:${s}`;

}

updateClock();

setInterval(updateClock, 1000);