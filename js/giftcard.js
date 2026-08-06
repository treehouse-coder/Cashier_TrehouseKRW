/*======================================
GIFT CARD
======================================*/

const GiftCard = {

    modal : null,

    /*======================================
    INIT
    ======================================*/

    init(){

        this.modal = document.getElementById(
            "giftcardModal"
        );

        document
            .getElementById("btnCloseGiftcard")
            .addEventListener(
                "click",
                () => this.close()
            );

        document
.getElementById("btnGiftUse")
.addEventListener(

    "click",

    ()=>{

        GiftCard.useGift();

    }

);    

document
    .getElementById("btnGiftCancel")
    .addEventListener(

        "click",

        ()=>this.clearUse()

    );

        this.modal.addEventListener(
            "click",
            (e) => {

                if(e.target === this.modal){

                    this.close();

                }

            }

        );

        /*======================================
PERIODE
======================================*/

flatpickr("#giftcardDate",{

    dateFormat:"Y-m-d",

    altInput:true,

    altFormat:"d M y",

    defaultDate:new Date(),

    allowInput:false,

    onChange: async function(selectedDates, dateStr){

        const result =
            await API.setGiftPeriode(
                dateStr
            );

        if(result.success){

            await GiftCard.refresh();

        }

        else{

            Notify.error(
                result.message
            );

        }

    }

});

        /*======================================
        SaveButton
        ======================================*/
        document
        .getElementById("btnGiftSave")
        .addEventListener(

            "click",

            ()=>{

                GiftCard.save();

            }

        );

    },

    /*======================================
LOAD TABLE
======================================*/

async load(){

    const result = await API.getGiftCard();

    

    if(!result.success){

        
        Notify.error(result.message);

        return;

    }

    this.render(result.data);

},

/*======================================
RENDER TABLE
======================================*/

/*======================================
RENDER
======================================*/

render(data){

    const tbody = document.getElementById(
        "giftTableBody"
    );

    tbody.innerHTML = "";

    data.forEach((row,index)=>{

        tbody.innerHTML += `

        <tr>

            <td>${index + 1}</td>

            <td>

                <span
                    class="gift-id"
                    data-id="${row[0]}">

                    ${row[0]}

                </span>

            </td>

            <td>${row[1]}</td>

            <td>${row[2]}</td>

            <td>${row[4]}</td>

            <td>${row[5]}</td>

            <td>

               

                <span
                    class="gift-status ${
                        row[6] === "Active"
                            ? "status-active"
                            : "status-used"
                    }"
                    data-id="${row[0]}"
                    data-status="${row[6]}">

                    ${row[6]}

                </span>

                

            </td>

        </tr>

        `;

    });

    /*======================================
CLICK GIFT ID
======================================*/

document
.querySelectorAll(".gift-id")
.forEach(item=>{

    item.onclick = ()=>{

        GiftCard.clickGiftId(

            item.dataset.id

        );

    };

});

},

/*======================================
CLICK GIFT ID
======================================*/

async clickGiftId(id){

    // Isi Gift ID
    document.getElementById(
        "giftUseId"
    ).value = id;

    const result = await API.searchGiftCard(id);

    console.log(result);

    if(!result.success){

        Notify.error(result.message);

        return;

    }

    document.getElementById(
    "giftUseInfo"
    ).value =

    `Gift ID    : ${result.data.giftId}
    Guest       : ${result.data.guest}
    Treatment   : ${result.data.treatment}
    Status      : ${result.data.status}
    Used Date   : ${result.data.usedDate || "-"}
    Therapist   : ${result.data.therapist || "-"}`;

},
/*======================================
OPEN
======================================*/

async open(){

    document.querySelector(".fab-container").style.display = "none";

    this.modal.style.display = "flex";

    const input = document.getElementById(
        "giftcardDate"
    );

    if(!input.value){

        const today = new Date();

        input.value =
            today.getFullYear() + "-" +
            String(today.getMonth()+1).padStart(2,"0") + "-" +
            String(today.getDate()).padStart(2,"0");

    }

    await API.setGiftPeriode(
        input.value
    );

    await this.refresh();

    await this.loadForm();

},

/*======================================
LOAD FORM
======================================*/

async loadForm(){

    const result = await API.getGiftForm();

    if(!result.success){

        Notify.error(result.message);

        return;

    }

    this.renderForm(result.data);

},

/*======================================
RENDER FORM
======================================*/

renderForm(data){

    /*==============================
    Treatment
    ==============================*/

    const treatment = document.getElementById(
        "giftTreatment"
    );

    treatment.innerHTML =
        "<option value=''>Select Treatment</option>";

    data.treatment.forEach(item=>{

        treatment.innerHTML +=

            `<option value="${item}">${item}</option>`;

    });

    /*==============================
    Discount
    ==============================*/

    const discount = document.getElementById(
        "giftDiscount"
    );

    discount.innerHTML =

        `
        <option value="No">No</option>
        <option value="Yes">Yes</option>
        `;

    /*==============================
    Paid
    ==============================*/

    const paid = document.getElementById(
        "giftPaid"
    );

    paid.innerHTML =
        "<option value=''>Select Paid</option>";

    data.paid.forEach(item=>{

        paid.innerHTML +=

            `<option value="${item}">${item}</option>`;

    });

    /*==============================
THERAPIST
==============================*/

const therapist = document.getElementById(
    "giftUseTherapist"
);

therapist.innerHTML =
    "<option value=''>Select Therapist</option>";

data.therapist.forEach(item=>{

    therapist.innerHTML +=
        `<option value="${item}">${item}</option>`;

});

},

    /*======================================
SAVE
======================================*/

async save(){

    await Button.loading(

        "btnGiftSave",

        async()=>{

            const data = {

                guestName: document
                    .getElementById("giftGuestName")
                    .value
                    .trim(),

                treatment: document
                    .getElementById("giftTreatment")
                    .value,

                discount: document
                    .getElementById("giftDiscount")
                    .value,

                paid: document
                    .getElementById("giftPaid")
                    .value

            };

            /*======================================
            VALIDATION
            ======================================*/

            if(data.guestName === ""){

                Notify.error("Guest Name wajib diisi.");

                document
                    .getElementById("giftGuestName")
                    .focus();

                return;

            }

            if(data.treatment === ""){

                Notify.error("Pilih Treatment.");

                document
                    .getElementById("giftTreatment")
                    .focus();

                return;

            }

            if(data.paid === ""){

                Notify.error("Pilih metode pembayaran.");

                document
                    .getElementById("giftPaid")
                    .focus();

                return;

            }

            /*======================================
            SAVE
            ======================================*/

            const result = await API.saveGiftCard(data);

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(
                "Gift Card berhasil disimpan."
            );

            await this.refresh();

        }

    );

},

/*======================================
REFRESH
======================================*/

async refresh(){

    await new Promise(resolve =>

        setTimeout(resolve,300)

    );

    await this.load();

},

    /*======================================
    CLOSE
    ======================================*/

    close(){

        this.modal.style.display = "none";
        document.querySelector(".fab-container").style.display = "flex";

    },

/*======================================
CLEAR USE FORM
======================================*/

clearUse(){

    document.getElementById(
        "giftUseId"
    ).value = "";

    document.getElementById(
        "giftUseInfo"
    ).value = "";

    document.getElementById(
        "giftUseTherapist"
    ).selectedIndex = 0;

},

/*======================================
USE GIFT
======================================*/

async useGift(){

    await Button.loading(

        "btnGiftUse",

        async()=>{

            const id = document
                .getElementById("giftUseId")
                .value
                .trim();

            const therapist = document
                .getElementById("giftUseTherapist")
                .value;

            /*======================================
            VALIDATION
            ======================================*/

            if(id === ""){

                Notify.error(
                    "Pilih Gift Card terlebih dahulu."
                );

                return;

            }

            if(therapist === ""){

                Notify.error(
                    "Pilih Therapist."
                );

                document
                    .getElementById("giftUseTherapist")
                    .focus();

                return;

            }

            /*======================================
            USE GIFT
            ======================================*/

            const result = await API.useGiftCard({

                id,
                therapist

            });

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(

                result.message ||

                "Gift Card berhasil digunakan."

            );

            this.clearUse();

            await new Promise(resolve =>
                setTimeout(resolve,300)
            );

            await this.refresh();

        }

    );

}
}