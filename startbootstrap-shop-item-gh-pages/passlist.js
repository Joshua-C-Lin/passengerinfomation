$(function () {
    // $('#select_data').on('change', function () {
    //     searchClickOption($("#select_data").val());
    // })
  
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
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "H+": this.getHours(), // hour
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        S: this.getMilliseconds(),
      };
  
      if (/(y+)/.test(format)) {
        format = format.replace(
          RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length)
        );
      }
  
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(
            RegExp.$1,
            RegExp.$1.length == 1
              ? o[k]
              : ("00" + o[k]).substr(("" + o[k]).length)
          );
        }
      }
  
      return format;
    };
  
    $("#select_data").on("change", function () {
      onDateSelected($("#select_data").val());
    });
  
    let initalDate = new Date().format("yyyy-MM-dd");
    onDateSelected(initalDate);
    $("#select_data").val(initalDate);
  });
  
  function onDateSelected(dateString) {
    let dt = new Date().format("yyyyMMddHHmmss");
    let SHA1 = hex_sha1(
      "FUNC_ID=QueryVessel&SYS_DATE=" +
        dt +
        "&ACNT_NO=" +
        "088325806" +
        "&API_KEY=" +
        "31823206"
    );
  
    let vesselData = JSON.stringify({
      FUNC_ID: "QueryVessel",
      SYS_DATE: "20200101141030",
      ACNT_NO: "088325806",
      FUNC_SIG: SHA1,
      FUNC_DATA: {
        SHIPPING_DATE: dateString,
      },
    });
  
    // let manifestData = JSON.stringify({
    //     "FUNC_ID": "QueryManifest",
    //     "SYS_DATE": "20200101141030",
    //     "ACNT_NO": "088325806",
    //     "FUNC_SIG": "f6531a017fe8b4de8d46ecd3becc9e23ddcb53b2",
    //     "FUNC_DATA": {
    //         "SHIPPING_DATE": "2021-04-20",
    //         // apiGetDate
    //         "STATION": "D",
    //         "VOYAGE": "DL357-1236",
    //         "VOYAGE_TIME": "0800"
    //     }
    // })
  
    $.ajax({
      url: "https://hanggangjiu.tungliu.tw/API",
      method: "POST",
      data: vesselData,
      success: function (res) {
        console.log(res);
        // SelectData(res.RSPN_DATA);
        showVoyageOptions(res.RSPN_DATA);
      },
    });
  }
  
  function showVoyageOptions(response) {
    let options = new Set(response.VESSELS.map((vessel) => vessel.STATION));
    // console.log(options)
    let optionsArray = Array.from(options);
    // console.log(optionsArray)
    console.log(response.SHIPPING_DATE);
    $("#select_station").html(
      optionsArray
        .map(
          (option) =>
            `<option value=${option}>${
              option === "D" ? "東港" : "小琉球"
            }</option>`
        )
        .join("")
    );
  
    renderTimeOptionsByVoyage(
      response.VESSELS,
      $("#select_station").val(),
      response.SHIPPING_DATE
    );
    $("#select_station").on("change", (e) => {
      renderTimeOptionsByVoyage(
        response.VESSELS,
        $("#select_station").val(),
        response.SHIPPING_DATE
      );
    });
  }
  
  function renderTimeOptionsByVoyage(vessels, voyage, DATE) {
    let options = vessels
      .filter((vessel) => vessel.STATION === voyage)
      .map((vessel) => vessel.VOYAGE)
      .sort();
    console.log(DATE);
    $("#select_timeTable").html(
      options
        .map(
          (option) =>
            `<option value=${option}>${
              option.slice(0, 2) + ":" + option.slice(2, 4)
            }</option>`
        )
        .join("")
    );
  
    let filteredVessels = vessels.filter(
      (vessel) =>
        vessel.STATION === voyage &&
        vessel.VOYAGE === $("#select_timeTable").val()
    );
    console.log(filteredVessels);
    renderInfoBoard(filteredVessels, DATE);
    $("#select_timeTable").on("change", () => {
      let filteredVessels = vessels.filter(
        (vessel) =>
          vessel.STATION === voyage &&
          vessel.VOYAGE === $("#select_timeTable").val()
      );
      renderInfoBoard(filteredVessels, DATE);
    });
  }
  
  function renderInfoBoard(vessels, DATE) {
      $("#table_data").empty();
    // api2
    let dt = new Date().format("yyyyMMddHHmmss");
    let SHA2 = hex_sha1(
      "FUNC_ID=QueryManifest&SYS_DATE=" +
        dt +
        "&ACNT_NO=" +
        "088325806" +
        "&API_KEY=" +
        "31823206"
    );
  
    vessels.forEach( (vessel) => {
      let manifestData = JSON.stringify({
        FUNC_ID: "QueryManifest",
        SYS_DATE: dt,
        ACNT_NO: "088325806",
        FUNC_SIG: SHA2,
        FUNC_DATA: {
          SHIPPING_DATE: DATE,
          STATION: vessel.STATION,
          VOYAGE: vessel.VOYAGE,
          VOYAGE_TIME: vessel.VOYAGE_TIME,
        },
      });
  
      $.ajax({
        url: "https://hanggangjiu.tungliu.tw/API",
        method: "POST",
        data: manifestData,
        success: function (res) {
          console.log(res);
          console.log(vessel)
          let manifest = res.RSPN_DATA.MANIFEST;
          let info = manifest.map(mani=>{
              return `
              <tr>
                <td>${DATE}</td>
                <td>${vessel.VESSEL_ID}</td>
                <td>${vessel.VESSEL_NAME}</td>
                <td>${vessel.STATION}</td>
                <td>${vessel.VOYAGE}</td>
                <td>${vessel.VOYAGE_TIME}</td>
                <td>${vessel.PASSENGER_NO}</td>
                <td>${mani.TICKET_NO}</td>
                <td>${mani.BOARDING_DT}</td>
                <td>${mani.ID_TYPE}</td>
                <td>${mani.ID_NO}</td>
                <td>${mani.NAME}</td>
              </tr>
              `
          })
  
          $("#table_data").append(info);
  
        },
      });
    });
  }
  