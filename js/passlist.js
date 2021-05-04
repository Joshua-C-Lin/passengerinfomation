console.log(document)
function clickSend() {
    let dt = new Date().format("yyyyMMddHHmmss") ;
    let SHA1 = hex_sha1(
    "FUNC_ID=QueryManifest&SYS_DATE=" + dt
    + "&ACNT_NO=" + "088325806"
    + "&API_KEY=" + "31823206" ) ;

    console.log( 'SHA:', SHA1 ) ;
    console.log( 'dt:', dt ) ;
    
    let dataJson = JSON.stringify({
        "FUNC_ID": "QueryManifest",
        "SYS_DATE": "20200101141030",
        "ACNT_NO": "088325806",
        "FUNC_SIG": "f6531a017fe8b4de8d46ecd3becc9e23ddcb53b2",
        "FUNC_DATA":  {
          "SHIPPING_DATE":"2021-04-20",
          "STATION": "D",
          "VOYAGE": "DL357-1236",
          "VOYAGE_TIME": "0800"
        }
    })

    let passInfo_OP = $.ajax({
        url: "https://hanggangjiu.tungliu.tw/API",
        method: 'POST',
        data: dataJson,
        success: function( res ){
            console.log( res ) ;
            ListData( res.RSPN_DATA ) ;
        }
    })
}

function ListData( data ){
    
    let table_html = ''; 
    let table_info = '<tr><td>' + data.SHPIPING_DATE + '</td><td>'+ data.VESSEL_ID +'</td><td>'+ data.VESSEL_NAME +'</td><td>'+ data.STATION +'</td><td>'+ data.VOYAGE +'</td><td>' + data.VOYAGE_TIME +'</td><td>' + data.PASSENGER_CNT +'</td>' 
        
    let table_infoMation = '';  
        for (let index = 0; index < data.MANIFEST.length; index++) {
        
        table_infoMation += table_info + '<td>' + data.MANIFEST[index].TICKET_NO + '</td><td>'+ data.MANIFEST[index].BOARDING_DT +'</td><td>'+ data.MANIFEST[index].ID_TYPE +'</td><td>'+ data.MANIFEST[index].ID_NO +'</td><td>'+ data.MANIFEST[index].NAME +'</td></tr>'            
    }
    $('#table_data').html(table_html);
    $('#table_data').html(table_info);
    $('#table_data').html(table_infoMation);
}

Date.prototype.format = function (format) {
    //eg:format="yyyy-MM-dd hh:mm:ss";

    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }

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
