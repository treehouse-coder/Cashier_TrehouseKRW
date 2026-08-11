/*======================================
TREEHOUSE POS
THERAPIST OMSET
======================================*/

const TherapistOmset = {


    /*======================================
    OPEN
    ======================================*/

    async open(){

        const modal =
            document.getElementById(
                "therapistOmsetModal"
            );

        if(!modal){

            console.error(
                "therapistOmsetModal tidak ditemukan."
            );

            return;

        }


        modal.classList.add("show");


        Loading.show(
            "Memuat Therapist Omset..."
        );


        try{

            const result =
                await API.getTherapistOmset();

                console.log( "THERAPIST OMSET RESULT:", result ); console.log( "THERAPIST OMSET DATA:", result.data ); console.log( "THERAPIST OMSET ROWS:", result.data?.rows );


            if(!result.success){

                Notify.error(
                    result.message ||
                    "Gagal memuat data."
                );

                return;

            }


            this.render(result.data);


        }catch(error){

            console.error(
                "TherapistOmset:",
                error
            );

            Notify.error(
                "Gagal memuat Therapist Omset."
            );


        }finally{

            Loading.hide();

        }

    },


    /*======================================
    CLOSE
    ======================================*/

    close(){

        const modal =
            document.getElementById(
                "therapistOmsetModal"
            );


        if(modal){

            modal.classList.remove("show");

        }

    },


    /*======================================
    RENDER
    ======================================*/

    render(data){

        const table =
            document.getElementById(
                "therapistOmsetTable"
            );


        if(!table){

            console.error(
                "therapistOmsetTable tidak ditemukan."
            );

            return;

        }


        table.innerHTML = "";


        /*==================================
        COLUMN WIDTH
        ==================================*/

        const colgroup =
            document.createElement(
                "colgroup"
            );


        if(data.columnWidths){

            data.columnWidths.forEach(
                width => {

                    const col =
                        document.createElement(
                            "col"
                        );


                    col.style.width =
                        `${width}px`;


                    colgroup.appendChild(
                        col
                    );

                }
            );

        }


        table.appendChild(
            colgroup
        );


        /*==================================
        TBODY
        ==================================*/

        const tbody =
            document.createElement(
                "tbody"
            );


        table.appendChild(
            tbody
        );


        const rows =
            data.rows || [];


        const merges =
            data.merges || [];


        /*==================================
        MERGE MAP
        ==================================*/

        const mergeMap =
            this.createMergeMap(
                merges,
                data.startRow || 1,
                data.startColumn || 15
            );


        /*==================================
        CREATE ROW
        ==================================*/

        rows.forEach(
            (row, rowIndex) => {

                const tr =
                    document.createElement(
                        "tr"
                    );


                /*==============================
                ROW HEIGHT
                ==============================*/

                if(
                    data.rowHeights &&
                    data.rowHeights[rowIndex]
                ){

                    tr.style.height =
                        `${data.rowHeights[rowIndex]}px`;

                }


                const values =
                    row.values || [];


                for(
                    let colIndex = 0;
                    colIndex < 10;
                    colIndex++
                ){

                    /*==========================
                    CHECK MERGE
                    ==========================*/

                    const merge =
                        mergeMap[
                            `${rowIndex},${colIndex}`
                        ];


                    /*
                    Cell ini adalah bagian dari
                    merge tetapi bukan cell utama.
                    */

                    if(
                        merge &&
                        (
                            merge.startRow !== rowIndex ||
                            merge.startColumn !== colIndex
                        )
                    ){

                        continue;

                    }


                    const td =
                        document.createElement(
                            "td"
                        );


                    const cell =
                        values[colIndex] ||
                        {};


                    /*==========================
                    VALUE
                    ==========================*/

                    td.textContent =
                        this.getValue(
                            cell
                        );


                    /*==========================
                    FORMAT
                    ==========================*/

                    this.applyFormat(
                        td,
                        cell.effectiveFormat ||
                        cell.userEnteredFormat ||
                        {}
                    );


                    /*==========================
                    MERGE
                    ==========================*/

                    if(merge){

                        const rowSpan =
                            merge.endRow -
                            merge.startRow;


                        const colSpan =
                            merge.endColumn -
                            merge.startColumn;


                        if(rowSpan > 1){

                            td.rowSpan =
                                rowSpan;

                        }


                        if(colSpan > 1){

                            td.colSpan =
                                colSpan;

                        }

                    }


                    tr.appendChild(
                        td
                    );

                }


                tbody.appendChild(
                    tr
                );

            }
        );

    },


    

/*======================================
GET VALUE
======================================*/

getValue(cell){

    if(!cell){

        return "";

    }


    /*==================================
    DISPLAY VALUE
    ==================================*/

    /*
    Gunakan displayValue dari Google Sheets.

    Ini mengikuti tampilan asli:
    - angka
    - Rp
    - persen
    - tanggal
    - desimal
    - custom number format
    */

    if(
        cell.displayValue !== undefined &&
        cell.displayValue !== null
    ){

        return cell.displayValue;

    }


    /*==================================
    FALLBACK
    ==================================*/

    const value =
        cell.effectiveValue;


    if(!value){

        return "";

    }


    if(
        value.stringValue !== undefined
    ){

        return value.stringValue;

    }


    if(
        value.boolValue !== undefined
    ){

        return String(
            value.boolValue
        );

    }


    if(
        value.errorValue !== undefined
    ){

        return String(
            value.errorValue
        );

    }


    if(
        value.numberValue !== undefined
    ){

        return String(
            value.numberValue
        );

    }


    return "";

},


/*======================================
FORMAT NUMBER
======================================*/

formatNumber(
    value,
    numberFormat
){

    if(
        !numberFormat ||
        !numberFormat.pattern
    ){

        return String(
            value
        );

    }


    const pattern =
        numberFormat.pattern;


    /*==================================
    PERCENT
    ==================================*/

    if(
        pattern.includes("%")
    ){

        const decimals =
            this.getDecimalPlaces(
                pattern
            );


        return new Intl.NumberFormat(
            "id-ID",
            {

                style:
                    "percent",

                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals

            }
        ).format(
            value
        );

    }


    /*==================================
    DATE / TIME
    ==================================*/

    if(
        this.isDateFormat(
            pattern
        )
    ){

        return this.formatDate(
            value,
            pattern
        );

    }


    /*==================================
    NUMBER
    ==================================*/

    const decimals =
        this.getDecimalPlaces(
            pattern
        );


    const useGrouping =
        pattern.includes(",");


    let result =
        new Intl.NumberFormat(
            "id-ID",
            {

                useGrouping,

                minimumFractionDigits:
                    decimals,

                maximumFractionDigits:
                    decimals

            }
        ).format(
            value
        );


    /*==================================
    CURRENCY
    ==================================*/

    if(
        pattern.includes("Rp") ||
        pattern.includes("IDR")
    ){

        result =
            "Rp " + result;

    }


    return result;

},



    /*======================================
    FORMAT NUMBER
    ======================================*/

    formatNumber(
        value,
        numberFormat
    ){

        if(
            !numberFormat ||
            !numberFormat.pattern
        ){

            return String(
                value
            );

        }


        const pattern =
            numberFormat.pattern;


        /*==================================
        PERCENT
        ==================================*/

        if(
            pattern.includes("%")
        ){

            const decimals =
                this.getDecimalPlaces(
                    pattern
                );


            return new Intl.NumberFormat(
                "id-ID",
                {

                    style:
                        "percent",

                    minimumFractionDigits:
                        decimals,

                    maximumFractionDigits:
                        decimals

                }
            ).format(
                value
            );

        }


        /*==================================
        DATE / TIME
        ==================================*/

        if(
            this.isDateFormat(
                pattern
            )
        ){

            return this.formatDate(
                value,
                pattern
            );

        }


        /*==================================
        NUMBER
        ==================================*/

        const decimals =
            this.getDecimalPlaces(
                pattern
            );


        const useGrouping =
            pattern.includes(",");


        let result =
            new Intl.NumberFormat(
                "id-ID",
                {

                    useGrouping,

                    minimumFractionDigits:
                        decimals,

                    maximumFractionDigits:
                        decimals

                }
            ).format(
                value
            );


        /*==================================
        CURRENCY
        ==================================*/

        if(
            pattern.includes("Rp") ||
            pattern.includes("IDR")
        ){

            result =
                "Rp " + result;

        }


        return result;

    },


    /*======================================
    DECIMAL PLACES
    ======================================*/

    getDecimalPlaces(pattern){

        const positive =
            pattern.split(";")[0];


        const parts =
            positive.split(".");


        if(parts.length < 2){

            return 0;

        }


        const decimal =
            parts[1];


        let count = 0;


        for(
            let i = 0;
            i < decimal.length;
            i++
        ){

            if(
                decimal[i] === "0" ||
                decimal[i] === "#"
            ){

                count++;

            }

        }


        return count;

    },


    /*======================================
    CHECK DATE FORMAT
    ======================================*/

    isDateFormat(pattern){

        const p =
            pattern.toLowerCase();


        /*
        Hindari menganggap angka biasa
        sebagai tanggal hanya karena
        memiliki karakter m.
        */

        return (
            p.includes("dd") ||
            p.includes("yyyy") ||
            p.includes("yy") ||
            p.includes("hh") ||
            p.includes("ss")
        );

    },


    /*======================================
    FORMAT DATE
    ======================================*/

    formatDate(
        serial,
        pattern
    ){

        const date =
            this.sheetSerialToDate(
                serial
            );


        if(!date){

            return String(
                serial
            );

        }


        const p =
            pattern.toLowerCase();


        const day =
            String(
                date.getUTCDate()
            ).padStart(
                2,
                "0"
            );


        const month =
            String(
                date.getUTCMonth() + 1
            ).padStart(
                2,
                "0"
            );


        const year =
            date.getUTCFullYear();


        if(
            p.includes("yyyy") &&
            p.includes("mm") &&
            p.includes("dd")
        ){

            return (
                `${year}-${month}-${day}`
            );

        }


        if(
            p.includes("dd") &&
            p.includes("mm") &&
            p.includes("yy")
        ){

            return (
                `${day}/${month}/${String(year).slice(-2)}`
            );

        }


        if(
            p.includes("dd") &&
            p.includes("mm") &&
            p.includes("yyyy")
        ){

            return (
                `${day}/${month}/${year}`
            );

        }


        return (
            `${day}/${month}/${year}`
        );

    },


    /*======================================
    SHEET SERIAL → DATE
    ======================================*/

    sheetSerialToDate(serial){

        if(
            typeof serial !== "number"
        ){

            return null;

        }


        const date =
            new Date(
                Date.UTC(
                    1899,
                    11,
                    30
                )
            );


        date.setUTCDate(
            date.getUTCDate() +
            Math.floor(serial)
        );


        return date;

    },


    /*======================================
    CREATE MERGE MAP
    ======================================*/

    createMergeMap(
        merges,
        startRow,
        startColumn
    ){

        const map = {};


        merges.forEach(
            merge => {

                /*
                Google Sheets API menggunakan
                koordinat 0-based.

                Range O1:X21:

                O = column 14
                X = column 23
                */


                const startR =
                    merge.startRow -
                    (startRow - 1);


                const startC =
                    merge.startColumn -
                    (startColumn - 1);


                const endR =
                    merge.endRow -
                    (startRow - 1);


                const endC =
                    merge.endColumn -
                    (startColumn - 1);


                /*
                Merge di luar range
                tidak perlu diproses.
                */

                if(
                    endR <= 0 ||
                    endC <= 0
                ){

                    return;

                }


                for(
                    let r =
                        Math.max(
                            0,
                            startR
                        );

                    r < endR;

                    r++
                ){

                    for(
                        let c =
                            Math.max(
                                0,
                                startC
                            );

                        c < endC;

                        c++
                    ){

                        map[
                            `${r},${c}`
                        ] = {

                            startRow:
                                startR,

                            startColumn:
                                startC,

                            endRow:
                                endR,

                            endColumn:
                                endC

                        };

                    }

                }

            }
        );


        return map;

    },


    /*======================================
    APPLY FORMAT
    ======================================*/

    applyFormat(
        td,
        format
    ){

        /*==================================
        BACKGROUND
        ==================================*/

        if(
            format.backgroundColor
        ){

            td.style.backgroundColor =
                this.rgb(
                    format.backgroundColor
                );

        }


        /*==================================
        TEXT FORMAT
        ==================================*/

        const text =
            format.textFormat;


        if(text){

            if(
                text.foregroundColor
            ){

                td.style.color =
                    this.rgb(
                        text.foregroundColor
                    );

            }


            if(text.fontSize){

                td.style.fontSize =
                    `${text.fontSize}px`;

            }


            if(text.fontFamily){

                td.style.fontFamily =
                    text.fontFamily;

            }


            if(text.bold){

                td.style.fontWeight =
                    "bold";

            }


            if(text.italic){

                td.style.fontStyle =
                    "italic";

            }


            const decorations = [];


            if(text.underline){

                decorations.push(
                    "underline"
                );

            }


            if(text.strikethrough){

                decorations.push(
                    "line-through"
                );

            }


            if(
                decorations.length
            ){

                td.style.textDecoration =
                    decorations.join(" ");

            }

        }


        /*==================================
        HORIZONTAL ALIGNMENT
        ==================================*/

        if(
            format.horizontalAlignment
        ){

            td.style.textAlign =
                format
                .horizontalAlignment
                .toLowerCase();

        }


        /*==================================
        VERTICAL ALIGNMENT
        ==================================*/

        if(
            format.verticalAlignment
        ){

            td.style.verticalAlign =
                format
                .verticalAlignment
                .toLowerCase();

        }


        /*==================================
        WRAP
        ==================================*/

        if(
            format.wrapStrategy
        ){

            switch(
                format.wrapStrategy
            ){

                case "WRAP":

                    td.style.whiteSpace =
                        "normal";

                    td.style.overflowWrap =
                        "break-word";

                    break;


                case "CLIP":

                    td.style.whiteSpace =
                        "nowrap";

                    td.style.overflow =
                        "hidden";

                    break;


                case "OVERFLOW_CELL":

                    td.style.whiteSpace =
                        "nowrap";

                    break;

            }

        }


        /*==================================
        NUMBER FORMAT
        ==================================*/

        if(
            format.numberFormat
        ){

            td.dataset.numberFormat =
                format
                .numberFormat
                .pattern || "";

        }


        /*==================================
        BORDERS
        ==================================*/

        if(
            format.borders
        ){

            this.applyBorders(
                td,
                format.borders
            );

        }

    },


    /*======================================
    BORDERS
    ======================================*/

    applyBorders(
        td,
        borders
    ){

        const borderMap = {

            top:
                "borderTop",

            bottom:
                "borderBottom",

            left:
                "borderLeft",

            right:
                "borderRight"

        };


        Object.keys(
            borderMap
        ).forEach(
            side => {

                const border =
                    borders[side];


                if(!border){

                    return;

                }


                const css =
                    borderMap[side];


                const style =
                    border.style ||
                    "SOLID";


                let borderStyle =
                    "solid";


                if(
                    style === "DASHED"
                ){

                    borderStyle =
                        "dashed";

                }


                if(
                    style === "DOTTED"
                ){

                    borderStyle =
                        "dotted";

                }


                const width =
                    this.borderWidth(
                        style
                    );


                const color =
                    border.color
                        ? this.rgb(
                            border.color
                        )
                        : "#000";


                td.style[css] =
                    `${width}px ${borderStyle} ${color}`;

            }
        );

    },


    /*======================================
    BORDER WIDTH
    ======================================*/

    borderWidth(style){

        switch(style){

            case "SOLID_THICK":

                return 2;


            case "SOLID_MEDIUM":

                return 1.5;


            default:

                return 1;

        }

    },


    /*======================================
    RGB
    ======================================*/

    rgb(color){

        if(!color){

            return "";

        }


        const r =
            Math.round(
                (color.red || 0) *
                255
            );


        const g =
            Math.round(
                (color.green || 0) *
                255
            );


        const b =
            Math.round(
                (color.blue || 0) *
                255
            );


        const a =
            color.alpha !== undefined
                ? color.alpha
                : 1;


        return (
            `rgba(${r},${g},${b},${a})`
        );

    }

};
