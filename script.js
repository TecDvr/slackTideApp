'use strict';

function todaySlackClick() {
    //converting JS time to needed time format
    const today = new Date(); 
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hour = today.getHours();
    let minute = today.getMinutes();
    const date = today.getFullYear()+''+(month < 10 ? ('0' + month) : month)+''+(day < 10 ? ('0' + day) : day);
    const time = (hour < 10 ? ('0' + hour): hour) + ":" + (minute < 10 ? ('0' + minute) : minute);

    $('body').on('click', '.city', function(event) {
        //pulls correct name for tide and weather search from city div
        const citySelection = $(this).attr('class').split(' ')[2];
        const citySelectionName = $(this).attr('id');
        $(this).animate({opacity: '0'});
        $('.city').animate({
            opacity: '0',
            height: '+=900px'
          }, {
            duration: 800,
            easing: 'swing',
            complete: function(){
            }    
        });
        $('.whereDiving').animate({
            opacity: '0',
          }, {
            duration: 800,
            easing: 'swing',
            complete: function(){
                getData();
            }    
        });

        function getData() {
            $('.loadingScreen').show();
            fetch(`https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=${date} ${time}&range=24&station=${citySelection}&product=predictions&units=english&time_zone=lst_ldt&format=json&datum=mllw&interval=hilo`)
            .then(response => response.json())
            .then(tideDataList => {
                fetch(`https://api.openweathermap.org/data/2.5/find?q=${citySelectionName}&units=imperial&appid=f45c5dca7b6df9490219f032a35434a1`)
                .then(response => response.json())
                .then(weatherDataList => {
                    displayTodaysTides(tideDataList, citySelectionName, time, weatherDataList);
                });
            })
            .catch(error => {
                alert('Please check your internet connection!');
            });
        };
    });
}
  
function displayTodaysTides(tideDataList, citySelectionName, time, weatherDataList) {
    console.log(tideDataList, weatherDataList);
    $('.loadingScreen').hide();
    let tideHeightFeet = tideDataList.predictions[0].v.split('.')[0];
    $('.cityCluster').html(`
        <div class="weatherDisplay">
            <h2 class="cityName"><img class="smallLogo" src="https://lh3.googleusercontent.com/7Sb9cOxJIBPLLc8_SZybShWmtCpF5A5ehxR-MkFc8ud41AvTPQckm-rpfY7T3CYptIqvu5OxXn_Xlrz5Xlc8OM59JsO5zpSTTlM_PbBybLYUb2eLZkwmptySZ5WmX7seNPvPuGwEytHZND5_IbB_asl55bMqXVzbrWKVyL3amMiCZaChQu3sZjWuK52Elw4Wwr49q6_kcuTrct--dconukfLr68zYKpPLykXIIH4psOJd3mi0kndnLpvNePVdI1tQdd_NrWVekNfqlJhC1W0Zd2goROQIq47hbumLl-RWy3ZSu1SI40uv1NfYGYPjTXDSesa4q4RRC5ngc3lb3_fXSaqyQUrHLKzcusAsxcF50ASOaRC-F5JUdw4_gVs_py9BpZPs_3lV_PyMwzyaVlTuKhsSIRe8wncuesOlefPeUR0eI832n3b71Xs7dnXpSlsurn_drD-ihAdkbbvSM5ilbN_M3R40SM0vGDwdddIbtcUaJDTGFKNJNsNQLDwdCWaqm2TgvA0IygJrkub_IKP5TfW_WaIwbOzHHNcfm7RFX4wEZ-xTy5_CXpiTNV6fWrqJYKBNwrR7tBNdmcwRnVqsxsB6_8IbWnMcW1EUIC1yNlU1ZbKROc-tYFQ64xIOf2IlIADwRSR3zGSMdF0GPl1zyfjpLNsW9dvCM1narzL3bQ7ByCgfNN6906M_l-UazeQP5iFndXWlwQXghorPL_-7nKY=w699-h698-no" alt="small slack tide logo">${weatherDataList.list[0].name}</h2>
            <ul class="ulWeather">
                <li class="liWeather"><img class="tempLogo" src="https://lh3.googleusercontent.com/59VNjLXhzg-MQOLtFsY4MUpm6XtEdgUb_JStbYo4oBkv4wyuaDf4A16Prw7UK7nMxysVb9FRN4wHB_OlBfU0O7Dx_V6_QoZEWTR_svaJE2J41ZfT2GDkBlEfibD8vYFXHOcVnmYtBD86LYv1RwvwD2I95VjTwCpPIZzHLQPllwlRpqt-Dz9CoqGGyh_WhQZJLoWC1C5s7ulch8Pby5wAelCs0BrWDi1oN5sEtqyI_WAOe6SzgmNYJi3yaEhA_RZ1p2VzrxLq3g1CkcBHt9JqaCdwVu2iwvj7oxMp8UPNnJupEeGHLU6lnJiIL-u6onOFarIzL1BtRSYvXAgI2SIfmiZ4Elc3l9ShLhFEAlDlZBUkLaBM11rNPk6ePOqNlHm7afIcyG2ZVcKNli72yZsaFpG0Ea3-yYnBwRMZr-LrbE4MTRXJwhip9MOjY2DnPdofCNPvydsVNxrLbjS78nImh8nNC_IpsUnzu6rd4yGOUT4inrHtpAfvdcH6GhEqDylYHDF1FtxtoG_5rrvDR4NEJyVm-doePYxfq6-CpktzvnayKdiQL0AN6u9mpz_OfFZLjcI_woI62u_2MeF8GTMQZwl382TZvPyh8tEZ45_W_gq-yHWvbNrEu1_us1WFkGOBL4dH6Pu8kCLnhyxsH21wzEVyhWCmWoVV9Nsf9XdQsS6-w4ouUAsJ0x0mGN0pFrbMeI034ZMHmyBy8ngUmK-CV-hO=w604-h769-no" alt="temperature icon"> ${weatherDataList.list[0].main.temp}F</li>
                <li class="liWeather">${weatherDataList.list[0].weather[0].description}</li>
                <li class="liWeather"><img class="tempLogo" src="https://lh3.googleusercontent.com/YHkD4GCH6nIfjHPbFYMkTGYDViJfGY7Qeh4JxJJTKdqxAw3sq9UuOS61-1ojhMuiy2bXqKROlyo5X0azoLn4wyIYxqas-T2hCUY5e8xPl4EZR0lkrCwwGxK2htemRUd8qUiiFhPyBltxgaCYbJoj3uqeRtYGHPqprKg9RbgdcpBpG48Shppgngfy2skgkFxFCpIejrAPJOV9AL4OcZ2BGqnFMqnotkTYPPst1nWblt0iH8oTXN7fmGidvnIsQfyXjcGEtCsujykRuFK4DoYAas7H_PbYhs1UoodruNgGGAKyvJXHfk1rm-a-kGVX5MSIYQqC6qWtsjgAzf9APL-2wke9Cw55e2P2S6o0ttD3sPLyGHXkCHbtQ-AuZJzHs6Q8txGOA1h5HAquxCQ6xNq7iCoIwOyZJBKOM7DgrTnOlZmjzm_VpNEw-uHTZ661C2eRVkehGwpTO0iKZH0vUB-FUE4H_rkN3IhMycIms2YBAoxte2bm6KbvwQx2ltpj4NZw-PbAygfITHdmVysVPkRVO4Iw8aOlyvvRNyC0MexYX_IJsxvPZ2YBiuE7CpYiXuw8uO553NXXazgObHWEz9BcvQYc6ZZlmiX4gvO9RZVyWtbgGR4iNNOPL2UG-7URzSh6rzj75w_riW8itS9aQmJZNGbJvq3xbNK4A2Xaahc3GbH9x_Qm9ZP6HdAzyTRDnUAyIOM6kb1aaF8kOfAyPZPCKxbF=w576-h768-no" alt="temperature icon"> ${weatherDataList.list[0].wind.speed}mph</li>
            </ul>
        </div>    
        <div class="tideResponse">
            <ul class="ulTides">
                <li class="tideDetails CurrentTime"><p class="tideDetailsPara">current time</p><p class="tideDetailsBold">${time}</p></li>
                <li class="tideDetails"><p class="tideDetailsPara">tide is</p><p class="tideDetailsBold">${tideDataList.predictions[0].type}</p></li>
                <li class="tideDetails CurrentHeight"><p class="tideDetailsPara">water level</p><p class="tideDetailsBold">${tideHeightFeet}'</p></li>
            </ul>
            <ul class="ulTides">
                <li class="nextSlack"><p>slack tide:</p>
                <p class="timeDisplay">${tideDataList.predictions[0].t.split(' ')[1]}</p></li>
             </ul>
        </div>  
        <div>
            <button class="citySelectButton">different city?</button>
        </div>
        `).hide().fadeIn(1500);
    backToCitiesButton();
};

function backToCitiesButton() {
    $('.container').on('click', '.citySelectButton', function(event) {
        $('.container').html(`
        <div class="cityCluster">        
        <h2 class="whereDiving">Where are you diving?</h2>
        <div class="citiesOne">
            <div class="city seattle 9447130" id="seattle"></div>
            <div class="city tacoma 9446484" id="tacoma"></div>
        </div>
        <div class="citiesTwo">
            <div class="city porttownsend 9444900" id="port townsend"></div>
            <div class="city neahbay 9444090" id="port angeles"></div>
        </div>
        </div>
        `);
    });
}    

function displayCities() {
        $('.container').addClass('modifyContainer')
        $('.container').html(`
            <div class="cityCluster">        
            <h2 class="whereDiving">Where are you diving?</h2>
            <div class="citiesOne">
                <div class="city seattle 9447130" id="seattle"></div>
                <div class="city tacoma 9446484" id="tacoma"></div>
            </div>
            <div class="citiesTwo">
                <div class="city porttownsend 9444900" id="port townsend"></div>
                <div class="city neahbay 9444090" id="port angeles"></div>
            </div>
            </div>
        `).hide().fadeIn(1500);
}

function loadDelayCities() {
    setTimeout(displayCities, 2000);
}

function runThisPuppy() {
    todaySlackClick();
    loadDelayCities();
};

$(runThisPuppy);
