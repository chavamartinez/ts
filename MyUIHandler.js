//Constructor de la clase
function MyUIHandler() {
    xmui.XmUIHandler.call(this);
}
//Modificación de comportamiento default
MyUIHandler.prototype = Object.create(xmui.XmUIHandler.prototype);
MyUIHandler.prototype.constructor = MyUIHandler;



MyUIHandler.prototype.getInformationResponse = function (title, text, continueText, actionContext, clientContext) {
    //console.log("ACtion context:" + actionContext);
    // console.log("miactionstring:"+actionContext._actionLocalStrings.miactionstring);



    return new Promise((resolve, reject) => {
        $.get("app_content/custom_ui/custom-information-dialog.html", function (data) {
            $(clientContext.uiContainer).html(data);
            $("#custom-information-dialog_title").text(title + "-- Enablement");
            $("#custom-information-dialog_text").text(text);
            $("#custom-information-dialog_continue-button").html(continueText);
            $("#custom-information-dialog_continue-button").on("click", function () {
                const okResponseNumber = -1;
                const confirmationResponse = com.ts.mobile.sdk.ConfirmationInput.create(okResponseNumber);
                resolve(confirmationResponse);
            });
            //Action strings
            console.log (JSON.stringify(actionContext._actionLocalStrings));
            var result=actionContext._actionLocalStrings;
            const optionsContainer = $(`#action-strings`);
            for(var k in result) {
                console.log(k, result[k]);
                const elem = $(`<div>${k}:${result[k]}</div>`);
                optionsContainer.append(elem);
             }

             //Localization directo
             const otrasContainer = $(`#otras-cosas`);
             var uiContext = actionContext.getUiContext();
             otrasContainer.append("Localization key ts_gen_back= "+uiContext.getString("ts_gen_back")+"<br>");
             otrasContainer.append("Localization key custom_key1= "+uiContext.getString("custom_key1")+"<br>");
             otrasContainer.append("Localization key custom_key3= "+uiContext.getString("custom_key3")+"<br>");
            console.log(actionContext.getEscapeOptions());
            $("#test-escape-info").text(actionContext.getEscapeOptions()[0]._displayName);
            $("#test-escape-info").on("click", function () {
                resolve(com.ts.mobile.sdk.InputOrControlResponse.createEscapeResponse(actionContext.getEscapeOptions()[0]));
            });
        });
    });
}

MyUIHandler.prototype.startActivityIndicator = function (actionContext,
    clientContext) {
    var element = $("h1");
    element.text("Activity started");
    //alert("start activity - actionContext:"+actionContext)
    console.log("Start activity:" + actionContext);
    console.log(actionContext);
    $(clientContext.uiContainer).html("<img src=\"https://upload.wikimedia.org/wikipedia/commons/d/de/Ajax-loader.gif\">");
}
MyUIHandler.prototype.endActivityIndicator = function (actionContext,
    clientContext) {
    var element = $("h1");
    element.text("Activity ended");
    //alert("start activity - actionContext:"+actionContext)
    console.log("End activity:" + actionContext);
    console.log(actionContext)
}


//
MyUIHandler.prototype.selectAuthenticator = function (options, actionContext, clientContext) {
    return new Promise((resolve, reject) => {
        $.get("app_content/custom_ui/custom-select-authenticator.html", function (data) {
            $(clientContext.uiContainer).html(data);

            const optionsContainer = $(`#custom-select-authenticator_options-list`);

            options.forEach((authenticatorOption) => {
                const authenticator = authenticatorOption.getAuthenticator(); // return AuthenticatorDescription
                const authenticatorName = authenticator.getName();
                let elem;
                if(authenticatorName=="Questions")
                {
                     elem = $(`<div><button id="authenticator_${authenticatorName}">Validación de correo</button></div>`);
                }
                else{
                    //const authenticatorName = authenticator.getAuthenticatorId(); ************************************************************************************
                    elem = $(`<div><button id="authenticator_${authenticatorName}">${authenticatorName}</button></div>`);
                }
                elem.find(`#authenticator_${authenticatorName}`).on("click", function () {
                    //Input que recibirá el journey para continuar
                    const authenticatorSelection = com.ts.mobile.sdk.AuthenticatorSelectionResult.createSelectionRequest(authenticator);
                    resolve(authenticatorSelection);
                });

                optionsContainer.append(elem);
            });

            $("#custom-select-authenticator_cancel-button").on("click", function () {
                //Input que recibirá el journey para escapar (cancelar)
                resolve(com.ts.mobile.sdk.AuthenticatorSelectionResult.createAbortRequest());
            });
        });
    });
}


MyUIHandler.prototype.createPasswordAuthSession = function (title, username) {
    //alert("pwd auth session"+username)
    return new PasswordAuthenticatorSession(title, username);
}

MyUIHandler.prototype.createPlaceholderAuthSession = function (placeholderName, placeholderType, title, username, authenticatorConfiguredData, serverPayload) {
    //  alert("placeholder username:"+username);
    //  alert("title:"+title);
    //  alert("placeholderName:"+placeholderName);
    //  alert("placeholderType:"+placeholderType);
    //  alert("authenticatorConfiguredData:"+authenticatorConfiguredData); //Will be provided as is to the hosting application
    //  alert("serverPayload:"+serverPayload);  // JWT
    console.log("placeholderName:" + placeholderName);
    console.log("placeholderType:" + placeholderType);
    console.log("authenticatorConfiguredData:" + authenticatorConfiguredData);
    console.log("Server payload:" + serverPayload);
    return new PlaceHolderAuthenticatorSession(title, username);
}


MyUIHandler.prototype.getConfirmationInput = function (title, text, continueText, cancelText, actionContext, clientContext) {
    return new Promise((resolve, reject) => {
        $.get("app_content/custom_ui/custom-confirmation-dialog.html", function (data) {
            $(clientContext.uiContainer).html(data);

            $("#custom-confirmation-dialog_title").text(title);
            $("#custom-confirmation-dialog_text").text(text);
            $("#custom-confirmation-dialog_continue-button").html(continueText);
            $("#custom-confirmation-dialog_cancel-button").html(cancelText);

            $("#custom-confirmation-dialog_continue-button").on("click", function () {
                const okResponseNumber = 0;
                const confirmationResponse = com.ts.mobile.sdk.ConfirmationInput.create(okResponseNumber);
                resolve(confirmationResponse);
            });

            $("#custom-confirmation-dialog_cancel-button").on("click", function () {
                const cancelResponseNumber = 1;
                const cancelResponse = com.ts.mobile.sdk.ConfirmationInput.create(cancelResponseNumber);
                resolve(cancelResponse);
            });
        });
    });
}

MyUIHandler.prototype.processJsonData = function (jsonData,
    actionContext,
    clientContext) {
    console.log("JSONDATA: " + JSON.stringify(jsonData));
    const confirmationResponse = com.ts.mobile.sdk.JsonDataProcessingResult.create(true);
    return Promise.resolve(confirmationResponse);
}


