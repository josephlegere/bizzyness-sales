<template>
    <div>
        <PDFViewer :src="generatePDF" :toPrint="toPrint" />
    </div>
</template>

<script>
import PDFViewer from './PDFViewer';
import { jsPDF } from 'jspdf';
// import 'jspdf-autotable';
// import num_convert from 'number-to-words';
import { ToWords } from 'to-words';
import moment from 'moment';

export default {
    props: {
        invoice: {
            type: Object,
            required: true
        },
        toPrint: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            headers: [{key: 'Item\nNo.', description: 'Description', quantity: 'Qty', price: 'Unit\nPrice', amount: 'Amount QRS.'}],
            body: [],
            footer: [],
            total: 0,
            toWords: new ToWords()
        }
    },
    methods: {
        fillBody() {
            this.body = this.extractLayout(this.invoice.layout);
        },
        fillFooter() {
            let _footer = [];
            _footer[0] = [
                //  Qatar Riyals
                { content: `${this.toWords.convert(this.total)} Only`, colSpan: 4, styles: { halign: 'left' } },
                { content: this.numberWithCommas(this.total.toFixed(2)), styles: { halign: 'right' }}
            ];
            this.footer = _footer;
        },
        extractLayout(layout, len = 0) {
            let _records = [];

            layout.forEach(elem => {
                let _temp_object = {};
                _temp_object.key = elem.key; //key

                if (elem.source.hasOwnProperty('content'))
                    _temp_object.description = this.viewFormat(`${elem.source.content}`, { newline: true, tab: len });
                else if (elem.source.hasOwnProperty('origin')) {
                    let _item = this.extractSourceData(this.invoice, elem.source.origin.split('/'));

                    _temp_object.description = this.viewFormat(_item.name, { newline: true, tab: len }); //description
                    _temp_object.quantity = _item.quantity; //quantity
                    _temp_object.price = _item.price !== '' ? this.numberWithCommas(parseFloat(_item.price).toFixed(2)) : ''; //prices
                    _temp_object.amount = _item.price !== '' ? this.numberWithCommas(parseFloat(_item.price * _item.quantity).toFixed(2)) : ''; //total price
                    this.total += _item.price * _item.quantity;
                }
                else if (elem.source.hasOwnProperty('size')) {
                    _temp_object.description = (() => {
                        let newline = '';
                        for ( let i = 1; i < elem.source.size; i++ ) {
                            newline += '\n';
                        }
                        return newline;
                    })();
                }

                //console.log(_temp_object)
                _records.push(_temp_object);
                
                if (elem.children.length > 0) //extract layout of children
                    _records = _records.concat(this.extractLayout(elem.children, len+1));
            });

            return _records;
        },
        extractSourceData(obj, arr) {
            let _item;
            if (arr.length > 1)
                _item = this.extractSourceData(obj[arr[0]], arr.slice(1))
            else
                _item = obj[arr[0]];

            return _item;
        },
        viewFormat(txt, opt = null) {
            let formattedText = txt;

            if (opt === null) return txt;
            
            if (opt.hasOwnProperty('newline') && opt.newline)
                formattedText = formattedText.replace(/\\n/g, '\n');
            
            if (opt.hasOwnProperty('tab') && opt.tab > 0) { //indent "2" spaces
                let _tab = '';
                for (let i = 0; i < opt.tab; i++) {
                    _tab += '  ';
                }
                formattedText = _tab + formattedText;
            }
                
            return formattedText;
        },
        tempBodyData() {
            let _data = [
                {description: 'Hello'},
                {description: 'Hi'},
                {description: 'What is up'},
                {description: 'COntrol Power'},
                {description: 'Slary for who'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'},
                {description: 'Hello'}
            ];

            _data.forEach((elem, key) => {
                let _temp_object = {};
                _temp_object.key = key + 1;
                _temp_object.description = elem.description;
                this.body.push(_temp_object)
            });
        },
        numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        firstLetterUpperCase(str) { //make all first letters capitals
            return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
        }
    },
    created: function() {
        this.fillBody(); //set body
        //this.tempBodyData();
        this.fillFooter();
    },
    computed: {
        generatePDF() {
            if (process.client) {
                require('jspdf-autotable');
                
                let doc = new jsPDF(); //default => unit: 'mm', format: 'a4',

                // doc.setFontSize(7);
                // doc.text(`(Edge)`, 1, 1);

                doc.setFontSize(11);
                doc.setFont('Helvetica', 'Bold');

                doc.text(`Cash/Credit Invoice`, 85, 42);
                doc.text(`No. ${this.invoice.invoice_code}`, 14, 52);
                doc.text(`To: ${this.invoice.customer.account}`, 14, 58);
                doc.text(`Date: ${moment(this.invoice.date).format("MMMM DD, YYYY")}`, 161, 52);
                doc.text(`Due Date: ${moment(this.invoice.dateDue).format("MMMM DD, YYYY")}`, 153, 58);

                doc.autoTable({
                    head: this.headers,
                    body: this.body,
                    foot: this.footer,
                    startY: 70,
                    theme: 'plain',
                    tableLineColor: [0, 0, 0],
                    tableLineWidth: 0.2,
                    styles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0,
                        halign: 'center'
                    },
                    headStyles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0.2,
                        fillColor: [255, 255, 255],
                        textColor: 0,
                        fontSize: 11,
                        valign: 'middle'
                    },
                    footStyles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0.2,
                    },
                    columnStyles: {
                        keys: { valign: 'top' },
                        description: { halign: 'left' },
                        price: { halign: 'right' },
                        amount: { halign: 'right' }
                    },
                    willDrawCell: function (data) {
                        if (data.row.section === 'body') {
                            //console.log(data)
                            data.doc.line(data.cursor.x + data.column.width, data.cursor.y, data.cursor.x + data.column.width, data.cursor.y + data.row.height);
                        }
                    }
                });
                
                doc.setFont('Helvetica', '');
                doc.text(`Received By:`, 14, doc.lastAutoTable.finalY + 10);
                doc.line(40, doc.lastAutoTable.finalY + 10, 74, doc.lastAutoTable.finalY + 10);
                doc.text(`Signature:`, 14, doc.lastAutoTable.finalY + 20);
                doc.line(40, doc.lastAutoTable.finalY + 20, 74, doc.lastAutoTable.finalY + 20);
                doc.text(`Authorized Signature`, 160, doc.lastAutoTable.finalY + 20);
                
                //doc.rect(14, 14, 182, doc.lastAutoTable.finalY - 14); //border
                //console.log(doc.lastAutoTable); //info about the last drawn table
                
                doc.autoPrint({ variant: 'non-conform' });
                let _pdf = doc.output('datauristring');
                return _pdf;
            }
            else {
                return
            }
        }
    },
    components: {
        PDFViewer
    }
}
</script>

<style>

</style>