const Summary = {

    async load(){

        const result = await API.getSummary();

        if(!result.success){

            Notify.error(result.message);

            return;

        }

        this.render(result.data);

    },

    render(data){

        document.getElementById("summaryCash").textContent = data.cash;
        document.getElementById("summaryQris").textContent = data.qris;
        document.getElementById("summaryDebit").textContent = data.debit;
        document.getElementById("summaryCredit").textContent = data.credit;
        document.getElementById("summaryTransfer").textContent = data.transfer;
        document.getElementById("summaryTotal").textContent = data.total;
        document.getElementById("summaryGift").textContent = data.gift;
        document.getElementById("summaryLoyalty").textContent = data.loyalty;

    }

};