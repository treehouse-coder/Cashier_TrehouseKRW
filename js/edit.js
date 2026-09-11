/*======================================
TREEHOUSE POS
EDIT.JS
======================================*/

const Edit = (() => {

    let selectedRow = null;

    /*======================================
    ELEMENT
    ======================================*/

    const modal =
        document.getElementById("editModal");

    const therapist =
        document.getElementById("editTherapist");

    const timein =
        document.getElementById("editTime");

    const treatment =
        document.getElementById("editTreatment");

    const gift =
        document.getElementById("editGift");

    const happy =
        document.getElementById("editHappy");

    const paid =
        document.getElementById("editPaid");

    const btnClose =
        document.getElementById("btnCloseModal");

    const btnCancel =
        document.getElementById("btnCancel");

    const btnUpdate =
        document.getElementById("btnUpdate");


    /*======================================
    INIT
    ======================================*/

    function init() {

        btnClose.addEventListener(
            "click",
            close
        );

        btnCancel.addEventListener(
            "click",
            close
        );

        btnUpdate.addEventListener(
            "click",
            update
        );

    }


    /*======================================
    OPEN ROW
    ======================================*/

    async function openRow(row) {

        if (!row) {

            Notify.error(
                "Data transaksi tidak ditemukan."
            );

            return;

        }


        const selectedTherapist =
            String(
                row.therapist || ""
            ).trim();


        const selectedTime =
            String(
                row.timein || ""
            ).trim();


        if (
            selectedTherapist === "" ||
            selectedTime === ""
        ) {

            Notify.error(
                "Therapist atau jam in tidak ditemukan."
            );

            return;

        }


        /*==================================
        BUKA MODAL
        ==================================*/

        modal.classList.add("show");


        const fab =
            document.querySelector(
                ".fab-container"
            );

        if (fab) {

            fab.style.display = "none";

        }


        clear();


        therapist.value =
            selectedTherapist;

        timein.value =
            selectedTime;


        /*==================================
        LOADING
        ==================================*/

        therapist.disabled = true;

        timein.disabled = true;

        treatment.disabled = true;

        gift.disabled = true;

        happy.disabled = true;

        paid.disabled = true;


        try {

            const result =
                await API.searchTransaction(

                    APP.filter.date,

                    selectedTherapist,

                    selectedTime

                );


            if (!result.success) {

                Notify.error(
                    result.message
                );

                close();

                return;

            }


            if (
                !result.data ||
                result.data.length === 0
            ) {

                Notify.error(
                    "Transaksi tidak ditemukan."
                );

                close();

                return;

            }


            /*================================
            HASIL TRANSACTION
            =================================*/

            const item =
                result.data[0];


            selectedRow =
                item.row;


            therapist.value =
                item.therapist || "";


            timein.value =
                item.timein
                    ? String(item.timein)
                        .padStart(5, "0")
                    : "";


            treatment.value =
                item.treatment || "";


            gift.value =
                item.gift || "";


            happy.value =
                item.happy || "";


            paid.value =
                item.paid || "";


        }

        catch (err) {

            console.error(err);

            Notify.error(
                "Gagal mengambil data transaksi."
            );

            close();

        }

        finally {

            therapist.disabled = false;

            timein.disabled = false;

            treatment.disabled = false;

            gift.disabled = false;

            happy.disabled = false;

            paid.disabled = false;

        }

    }


    /*======================================
    CLOSE
    ======================================*/

    function close() {

        modal.classList.remove("show");


        const fab =
            document.querySelector(
                ".fab-container"
            );

        if (fab) {

            fab.style.display = "flex";

        }


        clear();

    }


    /*======================================
    CLEAR
    ======================================*/

    function clear() {

        selectedRow = null;


        therapist.value = "";

        timein.value = "";

        treatment.value = "";

        gift.value = "";

        happy.value = "";

        paid.value = "";

    }


    /*======================================
    UPDATE
    ======================================*/

    async function update() {

        if (!selectedRow) {

            Notify.error(
                "Transaksi belum dipilih."
            );

            return;

        }


        if (
            therapist.value.trim() === ""
        ) {

            Notify.error(
                "Therapist belum diisi."
            );

            therapist.focus();

            return;

        }


        if (
            timein.value.trim() === ""
        ) {

            Notify.error(
                "Time In belum diisi."
            );

            timein.focus();

            return;

        }


        if (
            treatment.value.trim() === ""
        ) {

            Notify.error(
                "Pilih treatment."
            );

            treatment.focus();

            return;

        }


        if (
            paid.value.trim() === ""
        ) {

            Notify.error(
                "Pilih metode pembayaran."
            );

            paid.focus();

            return;

        }


        await Button.loading(
            btnUpdate,
            async () => {

                try {

                    const result =
                        await API.updateTransaction({

                            row:
                                selectedRow,

                            therapist:
                                therapist.value,

                            timein:
                                timein.value,

                            treatment:
                                treatment.value,

                            gift:
                                gift.value,

                            happy:
                                happy.value,

                            paid:
                                paid.value

                        });


                    if (!result.success) {

                        Notify.error(
                            result.message
                        );

                        return;

                    }


                    Notify.success(
                        "Transaksi berhasil diperbarui."
                    );


                    close();


                    await new Promise(
                        resolve =>
                            setTimeout(
                                resolve,
                                300
                            )
                    );


                    await Table.load();

                    await Summary.load();


                }

                catch (err) {

                    console.error(err);

                    Notify.error(
                        "Gagal memperbarui transaksi."
                    );

                }

            }
        );

    }


    /*======================================
    PUBLIC
    ======================================*/

    return {

        init,

        openRow,

        close

    };

})();


document.addEventListener(
    "DOMContentLoaded",
    () => {

        Edit.init();

    }
);