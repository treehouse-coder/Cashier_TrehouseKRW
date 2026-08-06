/*======================================
TREEHOUSE POS
PRINT
======================================*/

const Print = {

    /*======================================
    PRINT
    ======================================*/

    async print(){

        try{

            Notify.info("Membuat PDF...");

            const result = await API.print();

            if(!result.success){

                Notify.error(result.message);

                return;

            }

            Notify.success(result.message);

        }

        catch(err){

            console.error(err);

            Notify.error(err.message);

        }

    }

};