const Table = {

    data: [],

    filter: [],


    /*======================================
    INIT
    ======================================*/

    init() {

    },


    /*======================================
    SET DATA
    ======================================*/

    setData(data){

        this.data = data || [];

        this.filter = [...this.data];

        this.render();

    },


    /*======================================
    LOADING
    ======================================*/

    showLoading(){

        const tbody =
            document.getElementById(
                "tableTransaction"
            );

        tbody.innerHTML = `

            <tr>

                <td
                    colspan="9"
                    style="text-align:center"
                >

                    Loading data...

                </td>

            </tr>

        `;

    },


    /*======================================
    LOAD
    ======================================*/

    async load(){

        const result =
            await API.getTable();

        if(!result.success){

            Notify.error(result.message);

            return;

        }

        this.setData(
            result.data
        );

    },


    /*======================================
    SEARCH
    ======================================*/

    search(){

        const keyword =
            document
            .getElementById("search")
            .value
            .trim()
            .toLowerCase();

        if(keyword === ""){

            this.filter =
                [...this.data];

            this.render();

            return;

        }

        this.filter =
            this.data.filter(function(row){

                return (

                    String(row[1])
                        .toLowerCase()
                        .includes(keyword)

                    ||

                    String(row[4])
                        .toLowerCase()
                        .includes(keyword)

                );

            });

        this.render();

    },


    /*======================================
    RENDER
    ======================================*/

    render(){

        const tbody =
            document.getElementById(
                "tableTransaction"
            );

        tbody.innerHTML = "";

        this.filter.forEach(function(row){

            const tr =
                document.createElement("tr");

            tr.innerHTML = `

                <td>${row[0]}</td>

                <td>${row[1]}</td>

                <td>${row[2]}</td>

                <td>${row[3]}</td>

                <td>${row[4]}</td>

                <td>${row[5]}</td>

                <td>${row[6]}</td>

                <td>${row[7]}</td>

                <td>${row[8]}</td>

            `;

            tbody.appendChild(tr);

        });

        this.refreshTotal();

    },


    /*======================================
    TOTAL DATA
    ======================================*/

    refreshTotal(){

        document.getElementById(
            "totalData"
        ).textContent =

            "Total : " +

            this.filter.length;

    },


    /*======================================
    FORMAT NUMBER
    ======================================*/

    formatNumber(value){

        if(

            value === "" ||

            value == null

        ){

            return "";

        }

        return Number(value)
            .toLocaleString("id-ID");

    }

};