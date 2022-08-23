

function PlaceHolderAuthenticatorSession(title, username) {
    
    this.submitHandler = null;

    this.startSession = function(description, mode, actionContext, clientContext) {
        console.log(`started new ${mode} placeholder authenticator session`);
        this.description = description;
        this.mode = mode;
        this.actionContext = actionContext;                     
        this.clientContext = clientContext;
        console.log("description: "+description);
        console.log(description);
        console.log("mode: "+mode);
        console.log(mode);
        console.log("actionContext: "+actionContext);
        console.log(actionContext);
        console.log("clientContext: "+clientContext);
        console.log(clientContext);
    }

    this.endSession = function() {
        console.log('placeholder session ended')
    }

    this.promiseInput = function() {
        console.log(`promiseInput for placeholder authenticator was called`);
        // load placeholder UI here
        return new Promise((resolve, reject) => {
            // run your login here
            let status = "success"; // status indicator
            let token = prompt("Favor de introducir su correo a validar"); // collect user input
            //let token = "djfhkdjfhdk"; // tocken received
            // check authentication status and create input response
            if(status == "success") {
                var inputResponse = com.ts.mobile.sdk.PlaceholderInputResponse.createSuccessResponse(token);
                var response = com.ts.mobile.sdk.InputOrControlResponse.createInputResponse(inputResponse);
                resolve(response);
            }
            else {
            // otherwise create failed response
                var inputResponse = com.ts.mobile.sdk.PlaceholderInputResponse.createdFailedResponse(othis.description, com.ts.mobile.sdk.AuthenticationError.createApplicationGeneratedGeneralError(event.data.error_description,event.data) );
                var response = com.ts.mobile.sdk.InputOrControlResponse.createInputResponse(inputResponse);
                resolve(response);
            }
        });
    }
    

    this.promiseRecoveryForError = function(error, validRecoveries, defaultRecovery) {
        return new Promise((resolve, reject) => {
            console.log(`LOGG: promiseRecoveryForError was called with error: ${error}`);
            validRecoveries.forEach(element => {
                console.log("Valid recovery:"+element)
            });
            console.log("ERROR: "+error);
            console.log("ERROR message: "+error.getMessage());
            console.log("ERROR code: "+error.getErrorCode());
            console.log("ERROR data: "+error.getData());
            const mensaje=error.getErrorCode()==0?"(error)":error.getErrorCode()==1?"(invalid)":"";
            console.log(mensaje);
            if(defaultRecovery === com.ts.mobile.sdk.AuthenticationErrorRecovery.RetryAuthenticator) {
                if (confirm(error.getMessage() + mensaje+", would you like to try again ?")) {
                 //   resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.SelectAuthenticator);
                 resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.RetryAuthenticator);
                } else {
                    resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.Fail);
                }
            } else {
                resolve(defaultRecovery);
            } 
        });
    }

    this.promiseCancelAction = function(validOptions, session, clientContext) {
        const controlRequest = com.ts.mobile.sdk.ControlRequest.create(com.ts.mobile.sdk.ControlRequestType.CancelAuthenticator);
        const response = com.ts.mobile.sdk.InputOrControlResponse.createControlResponse(controlRequest);
        return Promise.resolve(response)
    }
}