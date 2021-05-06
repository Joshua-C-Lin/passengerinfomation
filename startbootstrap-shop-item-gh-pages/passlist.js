$(function () {
    $('#select_data').on('change', function () {
        searchClickOption($("#select_data").val());
    })

    // $('#select_station').on('change', function () {
    //     searchClickOption($("#select_station").val());
    // })

    // $('#id_btn_add').on('click', function() {
    //     console.log( "The ADD() function result is", ADD( $('#aba').val(), $('#cdc').val() ) ) ;
    // }) ;
    // $('#id_btn_adda').on('click', function() {
    //     console.log( "The ADD() function result is", ADD( $('#abaa').val(), $('#cdca').val() ) ) ;
    // }) ;


    Date.prototype.format = function (format) {
        //eg:format="yyyy-MM-dd hh:mm:ss";


        if (!format) {
            format = "yyyy-MM-dd hh:mm:ss";
            // var date = { "M+": this.getMonth() + 1, "d+": this.getDate(), "h+": this.getHours(), "m+": this.getMinutes(), "s+": this.getSeconds(), "q+": Math.floor((this.getMonth() + 3) / 3), "S+": this.getMilliseconds() }; if (/(y+)/i.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)); } for (var k in date) { if (new RegExp("(" + k + ")").test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length)); } } return format; 
        }

        // Default today's date --- START
        // var date = new Date();

        // var day = date.getDate();
        // var month = date.getMonth() + 1;
        // var year = date.getFullYear();

        // if (month < 10) month = "0" + month;
        // if (day < 10) day = "0" + day;

        // var today = year + "-" + month + "-" + day;       
        // $("#select_data").attr("value", today);
        // Default today's date --- 

        var o = {
            "M+": this.getMonth() + 1,  // month
            "d+": this.getDate(),       // day
            "H+": this.getHours(),      // hour
            "h+": this.getHours(),      // hour
            "m+": this.getMinutes(),    // minute
            "s+": this.getSeconds(),    // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
        };


        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                    ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }

        return format;
    };

});
function sendList() {
    let dt = new Date().format("yyyyMMddHHmmss");
    let SHA1 = hex_sha1(
        "FUNC_ID=QueryManifest&SYS_DATE=" + dt
        + "&ACNT_NO=" + "088325806"
        + "&API_KEY=" + "31823206");

    console.log('SHA:', SHA1);
    console.log('dt:', dt);

    let dataJson = JSON.stringify({
        "FUNC_ID": "QueryManifest",
        "SYS_DATE": "20200101141030",
        "ACNT_NO": "088325806",
        "FUNC_SIG": "f6531a017fe8b4de8d46ecd3becc9e23ddcb53b2",
        "FUNC_DATA": {
            "SHIPPING_DATE": "2021-04-20",
            // apiGetDate
            "STATION": "D",
            "VOYAGE": "DL357-1236",
            "VOYAGE_TIME": "0800"
        }
    })

    let passInfo_OP = $.ajax({
        url: "https://hanggangjiu.tungliu.tw/API",
        method: 'POST',
        data: dataJson,
        success: function (res) {
            console.log(res);
            ListData(res.RSPN_DATA);
        }
    })
}
function ListData(data) {

    let table_html = '';
    let table_info = '<tr><td>' + data.SHPIPING_DATE + '</td><td>' + data.VESSEL_ID + '</td><td>' + data.VESSEL_NAME + '</td><td>' + data.STATION + '</td><td>' + data.VOYAGE + '</td><td>' + data.VOYAGE_TIME + '</td><td>' + data.PASSENGER_CNT + '</td>'

    let table_infoMation = '';
    for (let index = 0; index < data.MANIFEST.length; index++) {

        table_infoMation += table_info + '<td>' + data.MANIFEST[index].TICKET_NO + '</td><td>' + data.MANIFEST[index].BOARDING_DT + '</td><td>' + data.MANIFEST[index].ID_TYPE + '</td><td>' + data.MANIFEST[index].ID_NO + '</td><td>' + data.MANIFEST[index].NAME + '</td></tr>'
    }
    $('#table_data').html(table_html);
    $('#table_data').html(table_info);
    $('#table_data').html(table_infoMation);
}

function searchClickOption(apiGetDate) {
    let dt = new Date().format("yyyyMMddHHmmss");
    let SHA1 = hex_sha1(
        "FUNC_ID=QueryManifest&SYS_DATE=" + dt
        + "&ACNT_NO=" + "088325806"
        + "&API_KEY=" + "31823206");

    console.log('SHA:', SHA1);
    console.log('dt:', dt);

    let dataJson = JSON.stringify({
        "FUNC_ID": "QueryVessel",
        "SYS_DATE": "20200101141030",
        "ACNT_NO": "088325806",
        "FUNC_SIG": "f6531a017fe8b4de8d46ecd3becc9e23ddcb53b2",
        "FUNC_DATA": {
            "SHIPPING_DATE": apiGetDate,
        }
    })

    let passInfo_OP = $.ajax({
        url: "https://hanggangjiu.tungliu.tw/API",
        method: 'POST',
        data: dataJson,
        success: function (res) {
            console.log(res);
            SelectData(res.RSPN_DATA);
        }
    })
    function SelectData(data) {

        let table_html = '';
        let table_info = '<tr><td>' + data.SHPIPING_DATE + '</td><td>' + data.VESSEL_ID + '</td><td>' + data.VESSEL_NAME + '</td><td>' + data.STATION + '</td><td>' + data.VOYAGE + '</td><td>' + data.VOYAGE_TIME + '</td><td>' + data.PASSENGER_CNT + '</td>'

        let table_infoMation = '';
        for (let index = 0; index < data.MANIFEST.length; index++) {

            table_infoMation += table_info + '<td>' + data.MANIFEST[index].TICKET_NO + '</td><td>' + data.MANIFEST[index].BOARDING_DT + '</td><td>' + data.MANIFEST[index].ID_TYPE + '</td><td>' + data.MANIFEST[index].ID_NO + '</td><td>' + data.MANIFEST[index].NAME + '</td></tr>'
        }
        $('#table_data').html(table_html);
        $('#table_data').html(table_info);
        $('#table_data').html(table_infoMation);
    }

}


function SelectData(data) {
    let select_data = '<input>' + data.SHIPPING_DATE + '</input>'
    console.log(select_data)
}
function checkSelectCname() {
    $.ajax({
        type: "POST",
        url: 'https://hanggangjiu.tungliu.tw/APIp',
        dataType: "json",
        success: function (result) {
            document.getElementById(res.RSPN_DATA.VESSELS.VOYAGE_TIME).innerHTML = result;
        }
    });
}

function apiStation(data) {

    let table_html = '';
    let table_info = '<option>' + data.STATION + '</option>'

    let table_infoMation = '';
    for (let index = 0; index < data.VESSELS.length; index++) {
        table_infoMation += table_info + '<option>' + data.STATION.D + '</option><option>' + data.STATION.D + '</option>'
    }
    $('#select_timeTable').html(table_html);
    $('#select_timeTable').html(table_info);
    $('#select_timeTable').html(table_infoMation);
}




    // function ADD(number1, number2){
    //     console.log( "number1 is ", number1 ) ;
    //     console.log( "number2 is ", number2 ) ;
    //     return parseInt( number1 ) + parseInt( number2 );
    // }


