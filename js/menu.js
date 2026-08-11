/*======================================
FLOATING MENU
======================================*/

const fabButton = document.getElementById("fabButton");
const fabMenu = document.getElementById("fabMenu");

/*======================================
OPEN / CLOSE
======================================*/

fabButton.addEventListener("click", (e) => {

    e.stopPropagation();

    fabMenu.classList.toggle("show");

    fabButton.classList.toggle("active");

});

/*======================================
CLICK OUTSIDE
======================================*/

document.addEventListener("click", () => {

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

});

/*======================================
PREVENT CLOSE
======================================*/

fabMenu.addEventListener("click", (e) => {

    e.stopPropagation();

});

/*======================================
additional modal
======================================*/

document.getElementById("btnAdditional").addEventListener("click",()=>{

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

    AdditionalModal.open();

});

/*======================================
offdaymodal
======================================*/
document.getElementById("btnOffday").addEventListener("click", () => {

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

    OffdayModal.open();

});

document
.getElementById("btnTherapistOmset")
.addEventListener("click", () => {

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

    TherapistOmset.open();

});


document.getElementById("btnGiftcard").addEventListener("click", () => {

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

    GiftCard.open();

});

document
    .getElementById("btnConfig")
    .addEventListener("click", () => {

        ConfigModal.open();

    });

/*======================================
FEEDBACK MODAL
======================================*/

document.getElementById("btnFeedback").addEventListener("click", () => {

    fabMenu.classList.remove("show");

    fabButton.classList.remove("active");

    FeedbackModal.open();

});

document
.getElementById("btnPrint")
.addEventListener("click", async()=>{

    document.querySelector(".fab-container").style.display = "none";

    Loading.show("Membuat PDF...");

    try{

        const result = await API.print();

        if(result.success){

            Notify.success("PDF berhasil dibuat.");

        }else{

            Notify.error(result.message);

        }

    }finally{

        Loading.hide();

        document.querySelector(".fab-container").style.display = "flex";

    }

});

