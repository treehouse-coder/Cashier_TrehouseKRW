/*======================================
CONFIG MODAL
======================================*/

const ConfigModal = {

    modal:null,

    init(){

        this.modal =
            document.getElementById(
                "configModal"
            );

        document
            .getElementById("btnConfigSave")
            .addEventListener(
                "click",
                () => this.save()
            );

        document
            .getElementById("btnCloseConfig")
            .addEventListener(
                "click",
                () => this.close()
            );

        Grid.enable("#configModal .config-body input");

    },

    async open(){

        this.modal.style.display = "flex";

        document.querySelector(".fab-container").style.display = "none";

        await this.load();

    },

    close(){

        this.modal.style.display = "none";

        document.querySelector(".fab-container").style.display = "flex";

        for(let i=1;i<=13;i++){

            document.getElementById(
                `config${i}`
            ).value = "";

        }

    },

/*======================================
LOAD
======================================*/

    async load(){

        const result = await API.getConfigData();

        if(!result.success){

            Notify.error(result.message);

            return;

        }

        for(let i=1;i<=13;i++){

            document.getElementById(
                `config${i}`
            ).value = result.data[i-1] || "";

        }

    },

/*======================================
SAVE
======================================*/

    async save(){

        await Button.loading(

            "btnConfigSave",

            async()=>{

                const data = [];

                for(let i=1;i<=13;i++){

                    data.push(

                        document
                        .getElementById(`config${i}`)
                        .value
                        .trim()

                    );

                }

                const result = await API.saveConfigData(
                    data
                );

                if(!result.success){

                    Notify.error(result.message);

                    return;

                }

                Notify.success(
                    "Config berhasil disimpan."
                );

                this.close();
                await Config.loadConfig();
                

            }

        );

    }

};