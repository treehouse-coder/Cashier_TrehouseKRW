/*======================================
TREEHOUSE POS
EDIT.JS
======================================*/

const Edit = (() => {

    let selectedRow = null;
    let debounceTimer = null;

    /*======================================
    ELEMENT
    ======================================*/

    const modal = document.getElementById("editModal");

    const searchInput = document.getElementById("searchTherapist");
    const tableBody = document.getElementById("editTable");

    const therapist = document.getElementById("editTherapist");
    const timein = document.getElementById("editTime");
    const treatment = document.getElementById("editTreatment");
    const gift = document.getElementById("editGift");
    const happy = document.getElementById("editHappy");
    const paid = document.getElementById("editPaid");

    const btnClose = document.getElementById("btnCloseModal");
    const btnCancel = document.getElementById("btnCancel");
    const btnUpdate = document.getElementById("btnUpdate");
    const btnEdit = document.getElementById("btnEdit");

    /*======================================
    INIT
    ======================================*/

    function init() {

    btnEdit.addEventListener("click", open);

    btnClose.addEventListener("click", close);

    btnCancel.addEventListener("click", close);

    btnUpdate.addEventListener("click", update);

    searchInput.addEventListener("input", () => {

        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(search, 300);

    });

}

    /*======================================
    OPEN
    ======================================*/

    function open() {

        modal.classList.add("show");

        document.querySelector(".fab-container").style.display = "none";

        clear();

        searchInput.focus();

    }

    /*======================================
    CLOSE
    ======================================*/

    function close() {

        modal.classList.remove("show");
        document.querySelector(".fab-container").style.display = "flex";

        clear();

    }

    /*======================================
    CLEAR
    ======================================*/

    function clear() {

        selectedRow = null;

        searchInput.value = "";

        tableBody.innerHTML = "";

        therapist.value = "";
        timein.value = "";
        treatment.value = "";
        gift.value = "";
        happy.value = "";
        paid.value = "";

    }

    /*======================================
    SEARCH
    ======================================*/

    async function search() {

    const keyword = searchInput.value.trim();

    if (keyword === "") {

        tableBody.innerHTML = "";

        return;

    }

    try {

        const res = await API.searchTransaction(

            APP.filter.date,

            keyword

        );

        if (res.success) {

            render(res.data);

        } else {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center">
                        ${res.message}
                    </td>
                </tr>
            `;

        }

    } catch (err) {

        console.error(err);

    }

}

    /*======================================
    RENDER
    ======================================*/

    function render(data) {

        tableBody.innerHTML = "";

        if (!data || data.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center">
                        Data tidak ditemukan
                    </td>
                </tr>
            `;

            return;

        }

        data.forEach(item => {

            const tr = document.createElement("tr");

            tr.dataset.row = item.row;

            tr.innerHTML = `
                <td>${item.therapist}</td>
                <td>${item.timein}</td>
                <td>${item.treatment}</td>
                <td>${item.gift || "-"}</td>
                <td>${item.happy}</td>
                <td>${item.paid}</td>
            `;

            tr.addEventListener("click", () => {

                tableBody.querySelectorAll("tr").forEach(r => {

                    r.classList.remove("selected");

                });

                tr.classList.add("selected");

                selectedRow = item.row;

                therapist.value = item.therapist;
                timein.value = item.timein
                    ? item.timein.padStart(5, "0")
                    : "";
                treatment.value = item.treatment;
                gift.value = item.gift;
                happy.value = item.happy;
                paid.value = item.paid;

            });

            tableBody.appendChild(tr);

        });

    }
/*======================================
UPDATE
======================================*/

async function update() {

    if (!selectedRow) {

        Notify.error("Pilih transaksi terlebih dahulu.");

        return;

    }

    if (therapist.value === "") {

        Notify.error("Pilih therapist.");

        therapist.focus();

        return;

    }

    if (timein.value === "") {

        Notify.error("Time In belum diisi.");

        timein.focus();

        return;

    }

    if (treatment.value === "") {

        Notify.error("Pilih treatment.");

        treatment.focus();

        return;

    }

    if (paid.value === "") {

        Notify.error("Pilih metode pembayaran.");

        paid.focus();

        return;

    }

    await Button.loading(btnUpdate, async () => {

        try {

            const result = await API.updateTransaction({

                row: selectedRow,

                therapist: therapist.value,

                timein: timein.value,

                treatment: treatment.value,

                gift: gift.value,

                happy: happy.value,

                paid: paid.value

            });

            if (!result.success) {

                Notify.error(result.message);

                return;

            }

            Notify.success("Transaksi berhasil diperbarui.");

            close();

            await new Promise(resolve =>
                setTimeout(resolve, 300)
            );

            await Table.load();
            await Summary.load();

        }

        catch (err) {

            console.error(err);

            Notify.error("Gagal memperbarui transaksi.");

        }

    });

}
/*======================================
PUBLIC
======================================*/

return {

    init,
    open,
    close

};

})();

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Edit.init();

    }

);