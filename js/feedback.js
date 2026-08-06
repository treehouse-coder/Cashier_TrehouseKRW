/*======================================
TREEHOUSE POS
FEEDBACK
======================================*/

const Feedback = {

    /*======================================
    LOAD CARD
    ======================================*/

    async load(){

        try{

            const result =
                await API.getFeedback();

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            this.render(result.data);

        }

        catch(err){

            console.error(err);

        }

    },

    /*======================================
    RENDER
    ======================================*/

    render(data){

        const list =
            document.getElementById(
                "feedbackList"
            );

        list.innerHTML = "";

        data.forEach(row=>{

            list.innerHTML += `

                <div class="feedback-item">

                    <span>${row[0] || ""}</span>

                    <span>${row[1] || ""}</span>

                    <span>${row[2] || ""}</span>

                    <span>${row[3] || ""}</span>

                </div>

            `;

        });

    }

};



/*======================================
FEEDBACK MODAL
======================================*/

const FeedbackModal = {

    modal:null,

    init(){

        this.modal =
            document.getElementById(
                "feedbackModal"
            );

        document
            .getElementById(
                "btnCloseFeedback"
            )
            .addEventListener(

                "click",

                ()=>this.close()

            );

        document
            .getElementById(
                "btnFeedbackAdd"
            )
            .addEventListener(

                "click",

                ()=>this.save()

            );

        Grid.enable(
            "#feedbackModal .feedback-row input"
        );    

    },

    /*======================================
    LOAD
    ======================================*/

    async load(){

        const result =
            await API.searchFeedback(

                APP.filter.date

            );

        if(!result.success){

            Notify.error(result.message);

            return;

        }

        result.data.forEach((row,index)=>{

            const i = index + 1;

            document.getElementById(
                `feedbackTherapist${i}`
            ).value = row.therapist;

            document.getElementById(
                `feedbackGuest${i}`
            ).value = row.guest;

            document.getElementById(
                `feedbackTime${i}`
            ).value = row.time;

            document.getElementById(
                `feedbackText${i}`
            ).value = row.feedback;

        });

    },

    async open(){

        this.modal.style.display = "flex";

        document.querySelector(
            ".fab-container"
        ).style.display = "none";

        await this.load();

    },

    close(){

        this.modal.style.display = "none";

        document.querySelector(
            ".fab-container"
        ).style.display = "flex";

        this.clear();

    },

    clear(){

        for(let i=1;i<=10;i++){

            document.getElementById(`feedbackTherapist${i}`).value = "";
            document.getElementById(`feedbackGuest${i}`).value = "";
            document.getElementById(`feedbackTime${i}`).value = "";
            document.getElementById(`feedbackText${i}`).value = "";

        }

    },

    /*======================================
SAVE
======================================*/

async save(){

    await Button.loading(

        "btnFeedbackAdd",

        async ()=>{

            const rows = [];

            for(let i=1;i<=10;i++){

                rows.push({

                    therapist:

                        document
                        .getElementById(`feedbackTherapist${i}`)
                        .value
                        .trim(),

                    guest:

                        document
                        .getElementById(`feedbackGuest${i}`)
                        .value
                        .trim(),

                    time:

                        document
                        .getElementById(`feedbackTime${i}`)
                        .value
                        .trim(),

                    feedback:

                        document
                        .getElementById(`feedbackText${i}`)
                        .value
                        .trim()

                });

            }

            const result =
                await API.saveFeedback(

                    APP.filter.date,

                    rows

                );

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(
                "Feedback berhasil disimpan."
            );

            this.close();

            await new Promise(r=>setTimeout(r,300));

            await Feedback.load();

        }

    );

}

};