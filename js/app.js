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

    Loading.show("Memuat data...");

    try{

        const result =
            await API.loadPeriode(dateStr);

        if(!result.success){

            Notify.error(
                result.message
            );

            return;

        }

        Table.setData(
            result.data.table
        );

        Summary.render(
            result.data.summary
        );

        Offday.render(
            result.data.offday
        );

        Additional.render(
            result.data.additional
        );

        Feedback.render(
            result.data.feedback
        );

    }

    finally{

        Loading.hide();

    }

}

});

// Simpan tanggal awal (format yyyy-MM-dd)
APP.filter.date = periode.formatDate(

    periode.selectedDates[0],

    "Y-m-d"

);


await Config.load();

Transaction.init();

Table.init();

GiftCard.init();

OffdayModal.init();

AdditionalModal.init();

FeedbackModal.init();

ConfigModal.init();


/*======================================
LOAD DATA AWAL
======================================*/

const result =
    await API.loadPeriode(
        APP.filter.date
    );

if(!result.success){

    Notify.error(
        result.message
    );

    return;

}


/*======================================
RENDER DATA
======================================*/

Table.setData(
    result.data.table
);

Summary.render(
    result.data.summary
);

Offday.render(
    result.data.offday
);

Additional.render(
    result.data.additional
);

Feedback.render(
    result.data.feedback
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



}
);