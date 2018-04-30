window.FrontendBook=window.FrontendBook||{};(function(exports){'use strict';exports.manageMode=!1;exports.initialize=function(bindEventHandlers,manageMode){bindEventHandlers=bindEventHandlers||!0;manageMode=manageMode||!1;if(window.console===undefined){window.console=function(){}}
    FrontendBook.manageMode=manageMode;$('.book-step').qtip({position:{my:'top center',at:'bottom center'},style:{classes:'qtip-green qtip-shadow custom-qtip'}});$('#select-date').datepicker({dateFormat:'dd-mm-yy',firstDay:1,minDate:0,defaultDate:Date.today(),dayNames:[EALang.sunday,EALang.monday,EALang.tuesday,EALang.wednesday,EALang.thursday,EALang.friday,EALang.saturday],dayNamesShort:[EALang.sunday.substr(0,3),EALang.monday.substr(0,3),EALang.tuesday.substr(0,3),EALang.wednesday.substr(0,3),EALang.thursday.substr(0,3),EALang.friday.substr(0,3),EALang.saturday.substr(0,3)],dayNamesMin:[EALang.sunday.substr(0,2),EALang.monday.substr(0,2),EALang.tuesday.substr(0,2),EALang.wednesday.substr(0,2),EALang.thursday.substr(0,2),EALang.friday.substr(0,2),EALang.saturday.substr(0,2)],monthNames:[EALang.january,EALang.february,EALang.march,EALang.april,EALang.may,EALang.june,EALang.july,EALang.august,EALang.september,EALang.october,EALang.november,EALang.december],prevText:EALang.previous,nextText:EALang.next,currentText:EALang.now,closeText:EALang.close,onSelect:function(dateText,instance){FrontendBookApi.getAvailableHours(dateText);FrontendBook.updateConfirmFrame()},onChangeMonthYear:function(year,month,instance){var currentDate=new Date(year,month-1,1);FrontendBookApi.getUnavailableDates($('#select-provider').val(),$('#select-service').val(),currentDate.toString('yyyy-MM-dd'))}});if(bindEventHandlers){_bindEventHandlers()}
    if(FrontendBook.manageMode){_applyAppointmentData(GlobalVariables.appointmentData,GlobalVariables.providerData,GlobalVariables.customerData)}else{var $selectProvider=$('#select-provider');var $selectService=$('#select-service');var selectedServiceId=GeneralFunctions.getUrlParameter(location.href,'service');if(selectedServiceId&&$selectService.find('option[value="'+selectedServiceId+'"]').length>0){$selectService.val(selectedServiceId).prop('disabled',!0).css('opacity','0.5')}
        $selectService.trigger('change');var selectedProviderId=GeneralFunctions.getUrlParameter(location.href,'provider');if(selectedProviderId&&$selectProvider.find('option[value="'+selectedProviderId+'"]').length===0){for(var index in GlobalVariables.availableProviders){var provider=GlobalVariables.availableProviders[index];if(provider.id===selectedProviderId&&provider.services.length>0){$selectService.val(provider.services[0]).trigger('change')}}}
        if(selectedProviderId&&$selectProvider.find('option[value="'+selectedProviderId+'"]').length>0){$selectProvider.val(selectedProviderId).prop('disabled',!0).css('opacity','0.5').trigger('change')}}};function _bindEventHandlers(){$('#select-provider').change(function(){FrontendBookApi.getUnavailableDates($(this).val(),$('#select-service').val(),$('#select-date').datepicker('getDate').toString('yyyy-MM-dd'));FrontendBook.updateConfirmFrame()});$('#select-service').change(function(){var currServiceId=$('#select-service').val();$('#select-provider').empty();$.each(GlobalVariables.availableProviders,function(indexProvider,provider){$.each(provider.services,function(indexService,serviceId){if(serviceId==currServiceId){var optionHtml='<option value="'+provider.id+'">'+provider.first_name+' '+provider.last_name+'</option>';$('#select-provider').append(optionHtml)}})});if($('#select-provider option').length>=1){$('#select-provider').append(new Option('- '+EALang.any_provider+' -','any-provider'))}
    FrontendBookApi.getUnavailableDates($('#select-provider').val(),$(this).val(),$('#select-date').datepicker('getDate').toString('yyyy-MM-dd'));FrontendBook.updateConfirmFrame();_updateServiceDescription($('#select-service').val(),$('#service-description'))});$('.button-next').click(function(){if($(this).attr('data-step_index')==='1'&&$('#select-provider').val()==null){return}
    if($(this).attr('data-step_index')==='2'){if($('.selected-hour').length==0){if($('#select-hour-prompt').length==0){$('#available-hours').append('<br><br>'+'<span id="select-hour-prompt" class="text-danger">'+EALang.appointment_hour_missing+'</span>')}
        return}}
    if($(this).attr('data-step_index')==='3'){if(!_validateCustomerForm()){return}else{FrontendBook.updateConfirmFrame()}}
    var nextTabIndex=parseInt($(this).attr('data-step_index'))+1;$(this).parents().eq(1).hide('fade',function(){$('.active-step').removeClass('active-step');$('#step-'+nextTabIndex).addClass('active-step');$('#wizard-frame-'+nextTabIndex).show('fade')})});$('.button-back').click(function(){var prevTabIndex=parseInt($(this).attr('data-step_index'))-1;$(this).parents().eq(1).hide('fade',function(){$('.active-step').removeClass('active-step');$('#step-'+prevTabIndex).addClass('active-step');$('#wizard-frame-'+prevTabIndex).show('fade')})});$('#available-hours').on('click','.available-hour',function(){$('.selected-hour').removeClass('selected-hour');$(this).addClass('selected-hour');FrontendBook.updateConfirmFrame()});if(FrontendBook.manageMode){$('#cancel-appointment').click(function(event){var dialogButtons={};dialogButtons.OK=function(){if($('#cancel-reason').val()===''){$('#cancel-reason').css('border','2px solid red');return}
    $('#cancel-appointment-form textarea').val($('#cancel-reason').val());$('#cancel-appointment-form').submit()};dialogButtons[EALang.cancel]=function(){$('#message_box').dialog('close')};GeneralFunctions.displayMessageBox(EALang.cancel_appointment_title,EALang.write_appointment_removal_reason,dialogButtons);$('#message_box').append('<textarea id="cancel-reason" rows="3"></textarea>');$('#cancel-reason').css('width','100%');return!1})}
    $('#book-appointment-submit').click(function(event){FrontendBookApi.registerAppointment()});$('.captcha-title small').click(function(event){$('.captcha-image').attr('src',GlobalVariables.baseUrl+'//captcha?'+Date.now())});$('#select-date').on('mousedown','.ui-datepicker-calendar td',function(event){setTimeout(function(){FrontendBookApi.applyPreviousUnavailableDates()},300)})};function _validateCustomerForm(){$('#wizard-frame-3 input').css('border','');try{var missingRequiredField=!1;$('.required').each(function(){if($(this).val()==''){$(this).parents('.form-group').addClass('has-error');missingRequiredField=!0}});if(missingRequiredField){throw EALang.fields_are_required}
    if(!GeneralFunctions.validateEmail($('#email').val())){$('#email').parents('.form-group').addClass('has-error');throw EALang.invalid_email}
    return!0}catch(exc){$('#form-message').text(exc);return!1}}
    exports.updateConfirmFrame=function(){var selectedDate=$('#select-date').datepicker('getDate');if(selectedDate!==null){selectedDate=GeneralFunctions.formatDate(selectedDate,GlobalVariables.dateFormat)}
        var selServiceId=$('#select-service').val();var servicePrice;var serviceCurrency;$.each(GlobalVariables.availableServices,function(index,service){if(service.id==selServiceId){servicePrice='<br>'+service.price;serviceCurrency=service.currency;return!1}});var html='<h4>'+$('#select-service option:selected').text()+'</h4>'+'<p>'+'<strong class="text-primary">'+$('#select-provider option:selected').text()+'<br>'+selectedDate+' '+$('.selected-hour').text()+servicePrice+' '+serviceCurrency+'</strong>'+'</p>';$('#appointment-details').html(html);var firstName=GeneralFunctions.escapeHtml($('#first-name').val());var lastName=GeneralFunctions.escapeHtml($('#last-name').val());var phoneNumber=GeneralFunctions.escapeHtml($('#phone-number').val());var email=GeneralFunctions.escapeHtml($('#email').val());var address=GeneralFunctions.escapeHtml($('#address').val());var city=GeneralFunctions.escapeHtml($('#city').val());var zipCode=GeneralFunctions.escapeHtml($('#zip-code').val());html='<h4>'+firstName+' '+lastName+'</h4>'+'<p>'+EALang.phone+': '+phoneNumber+'<br/>'+EALang.email+': '+email+'<br/>'+EALang.address+': '+address+'<br/>'+EALang.city+': '+city+'<br/>'+EALang.zip_code+': '+zipCode+'</p>';$('#customer-details').html(html);var postData={};postData.customer={last_name:$('#last-name').val(),first_name:$('#first-name').val(),email:$('#email').val(),phone_number:$('#phone-number').val(),address:$('#address').val(),city:$('#city').val(),zip_code:$('#zip-code').val()};postData.appointment={start_datetime:$('#select-date').datepicker('getDate').toString('yyyy-MM-dd')+' '+$('.selected-hour').text()+':00',end_datetime:_calcEndDatetime(),notes:$('#notes').val(),is_unavailable:!1,id_users_provider:$('#select-provider').val(),id_services:$('#select-service').val()};postData.manage_mode=FrontendBook.manageMode;if(FrontendBook.manageMode){postData.appointment.id=GlobalVariables.appointmentData.id;postData.customer.id=GlobalVariables.customerData.id}
        $('input[name="csrfToken"]').val(GlobalVariables.csrfToken);$('input[name="post_data"]').val(JSON.stringify(postData))};function _calcEndDatetime(){var selServiceDuration=undefined;$.each(GlobalVariables.availableServices,function(index,service){if(service.id==$('#select-service').val()){selServiceDuration=service.duration;return!1}});var startDatetime=$('#select-date').datepicker('getDate').toString('dd-MM-yyyy')+' '+$('.selected-hour').text();startDatetime=Date.parseExact(startDatetime,'dd-MM-yyyy HH:mm');var endDatetime=undefined;if(selServiceDuration!==undefined&&startDatetime!==null){endDatetime=startDatetime.add({'minutes':parseInt(selServiceDuration)})}else{endDatetime=new Date()}
        return endDatetime.toString('yyyy-MM-dd HH:mm:ss')}
    function _applyAppointmentData(appointment,provider,customer){try{$('#select-service').val(appointment.id_services).trigger('change');$('#select-provider').val(appointment.id_users_provider);$('#select-date').datepicker('setDate',Date.parseExact(appointment.start_datetime,'yyyy-MM-dd HH:mm:ss'));FrontendBookApi.getAvailableHours($('#select-date').val());$('#last-name').val(customer.last_name);$('#first-name').val(customer.first_name);$('#email').val(customer.email);$('#phone-number').val(customer.phone_number);$('#address').val(customer.address);$('#city').val(customer.city);$('#zip-code').val(customer.zip_code);var appointmentNotes=(appointment.notes!==null)?appointment.notes:'';$('#notes').val(appointmentNotes);FrontendBook.updateConfirmFrame();return!0}catch(exc){return!1}}
    function _updateServiceDescription(serviceId,$div){var html='';$.each(GlobalVariables.availableServices,function(index,service){if(service.id==serviceId){html='<strong>'+service.name+' </strong>';if(service.description!=''&&service.description!=null){html+='<br>'+service.description+'<br>'}
        if(service.duration!=''&&service.duration!=null){html+='['+EALang.duration+' '+service.duration+' '+EALang.minutes+'] '}
        if(service.price!=''&&service.price!=null){html+='['+EALang.price+' '+service.price+' '+service.currency+']'}
        html+='<br>';return!1}});$div.html(html);if(html!=''){$div.show()}else{$div.hide()}}})(window.FrontendBook)