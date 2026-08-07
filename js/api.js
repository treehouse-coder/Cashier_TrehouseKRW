/*======================================
TREEHOUSE POS
API
======================================*/

const API = {

    url: "https://script.google.com/macros/s/AKfycbzWTq7z5OFMNgsAU1yhaAuH8betxU2rVsESF8VzgNeIP-LcDCkoGwo4d1wXZKIar1Uh/exec",



    /*======================================
    INIT
    ======================================*/

    init(url) {

        this.url = url;

    },



    /*======================================
GET
======================================*/

async get(action, params = {}) {

    try {

        const query = new URLSearchParams({

            action,

            ...params

        });

        const response = await fetch(

            `${this.url}?${query.toString()}`

        );

        const text = await response.text();

        try{

            return JSON.parse(text);

        }

        catch(err){

            console.error("========== RESPONSE BUKAN JSON ==========");
            console.error("Action :", action);
            console.error(text);

            return {

                success:false,

                message:"Response bukan JSON",

                data:text

            };

        }

    }

    catch(err){

        console.error(err);

        return {

            success:false,

            message:err.message,

            data:null

        };

    }

},



    /*======================================
    POST
    ======================================*/

    async post(data) {

    try {

        const response = await fetch(

            this.url,

            {
                method: "POST",

                body: new URLSearchParams(data)

            }

        );


        return await response.json();

    }

    catch(err){

        console.error(err);

        return {

            success:false,

            message:err.message,

            data:null

        };

    }

},


/*======================================
GET ADDITIONAL
======================================*/

async getAdditional(){

    return await this.get(

        "getAdditional"

    );

},

/*======================================
SEARCH ADDITIONAL
======================================*/

async searchAdditional(date){

    return await this.get(

        "searchAdditional",

        {

            date

        }

    );

},

/*======================================
SAVE ADDITIONAL
======================================*/

async saveAdditional(date,rows){

    return await this.post({

        action:"saveAdditional",

        date,

        rows:JSON.stringify(rows)

    });

},

/*======================================
GET FEEDBACK
======================================*/

async getFeedback(){

    return await this.get(

        "feedback"

    );

},

/*======================================
SEARCH FEEDBACK
======================================*/

async searchFeedback(date){

    return await this.get(

        "searchFeedback",

        {

            date

        }

    );

},

/*======================================
SAVE FEEDBACK
======================================*/

async saveFeedback(date,rows){

    return await this.post({

        action:"saveFeedback",

        date,

        rows:JSON.stringify(rows)

    });

},

/*======================================
GET CONFIG MODAL
======================================*/

async getConfigData(){

    return await this.get(

        "searchConfig"

    );

},

/*======================================
SAVE CONFIG MODAL
======================================*/

async saveConfigData(names){

    return await this.post({

        action:"saveConfig",

        names:JSON.stringify(names)

    });

},

/*======================================
GET CONFIG MODAL
======================================*/

async getConfigModal(){

    return await this.get(

        "getConfigModal"

    );

},

    /*======================================
PERIODE
======================================*/

async setPeriode(date) {

    return await this.get(

        "setPeriode",

        {

            date: date

        }

    );

},

/*======================================
LOAD PERIODE
======================================*/

async loadPeriode(date) {

    return await this.get(

        "loadPeriode",

        {
            date: date
        }

    );

},

    /*======================================
    CONFIG
    ======================================*/

    async getConfig() {

        return await this.get(

            "config"

        );

    },



    /*======================================
    HOLIDAY
    ======================================*/

    async getHoliday() {

        return await this.get(

            "getHoliday"

        );

    },



    async setHoliday(status) {

        return await this.post({

            action: "setHoliday",

            status: status

        });

    },



    /*======================================
    TRANSACTION
    ======================================*/

    async addTransaction(data) {

        return await this.post({

            action: "addTransaction",

            ...data

        });

    },



    /*======================================
    EDIT
    ======================================*/

    async searchTransaction(date, therapist) {

        return await this.get(

            "searchTransaction",

            {

                date: date,

                therapist: therapist

            }

        );

    },



    async updateTransaction(data) {

        return await this.post({

            action: "updateTransaction",

            ...data

        });

    },

    /*======================================
TABLE
======================================*/

async getTable() {

    return await this.get(

        "table"

    );

},

/*======================================
GET OFFDAY
======================================*/

async getOffday() {

    return await this.get(

        "getOffday"

    );

},

/*======================================
GET OMSET SUMMARY
======================================*/

async getSummary(){

    return await this.get("summary");

},

/*======================================
GET GIFT CARD
======================================*/

async getGiftCard() {

    return await this.get(
        "giftcard"
    );

},

/*======================================
GIFT FORM
======================================*/

async getGiftForm(){

    return await this.get(

        "giftForm"

    );

},

/*======================================
SAVE GIFT CARD
======================================*/

async saveGiftCard(data){

    return await this.post({

        action:"saveGiftCard",

        ...data

    });

},

/*======================================
SET GIFT PERIODE
======================================*/

async setGiftPeriode(date){

    return await this.get(

        "setGiftPeriode",

        {

            date:date

        }

    );

},

/*======================================
SEARCH GIFT CARD
======================================*/

async searchGiftCard(id){

    return await this.get(

        "searchGiftCard",

        {

            id:id

        }

    );

},

/*======================================
USE GIFT CARD
======================================*/

async useGiftCard(data){

    return await this.post({

        action:"useGiftCard",

        ...data

    });

},

/*======================================
SAVE OFFDAY
======================================*/

async saveOffday(date,names){

    return await this.post({

        action:"saveOffday",

        date,

        names:JSON.stringify(names)

    });

},

/*======================================
SEARCH OFFDAY
======================================*/

async searchOffday(date){

    return await this.get(

        "searchOffday",

        {

            date

        }

    );

},

/*======================================
PRINT
======================================*/

async print(){

    return await this.post({

        action:"print"

    });

}

};