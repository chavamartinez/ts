

function PasswordAuthenticatorSession(title, username) {

    this.submitHandler = null;

    this.startSession = function(description, mode, actionContext, clientContext) {

        console.log(`started new ${mode} password session`);
        const self = this;

        //$.get("app_content/custom_ui/password.html", function(data){
        $.get("app_content/custom_ui/authenticate.html", function(data){
        //$.get("app_content/custom_ui/change_password_expired.html", function(data){
            $(clientContext.uiContainer).html(data);
            $("#custom-password-authenticator_title").text(title);
            $("#custom-password-authenticator_text").text(`Hello ${username}, please type your password to continue`);

            $("#custom-password-authenticator_continue-button").on("click", function() {
                const password = $("#input_password").val();
                if (password.length === 0) { return alert('Please type a valid password') }
                const inputResponse = com.ts.mobile.sdk.PasswordInput.create(password);
                const response = com.ts.mobile.sdk.InputOrControlResponse.createInputResponse(inputResponse);
                self.submitHandler(response);
            });

            $("#custom-password-authenticator_cancel-button").on("click", function() {
                const controlRequest = com.ts.mobile.sdk.ControlRequest.create(com.ts.mobile.sdk.ControlRequestType.CancelAuthenticator);
                const response = com.ts.mobile.sdk.InputOrControlResponse.createControlResponse(controlRequest);
                self.submitHandler(response);
            });
        });
    }


    this.promiseInput = function() {

        return new Promise((resolve, reject) => {
            this.submitHandler = (response) => {
                resolve(response);
            }
        });
    }


    this.endSession = function() {
        console.log('password session ended')


    }

    this.changeSessionModeToRegistrationAfterExpiration = function() {
        console.log('Password EXPIRADO');
        const self = this;
        clientContext=getClientContext();
        $.get("app_content/custom_ui/change_password_expired.html", function(data){
            $(clientContext.uiContainer).html(data);
            $("#custom-password-authenticator_title").text(title);
            $("#custom-password-authenticator_text").text(`Hello ${username}, your password is expired, you must change it. Please type your new password to continue`);

            $("#custom-password-authenticator_continue-button").on("click", function() {
                const password = $("#input_password_change").val();
                const password_confirmation = $("#input_password_change_confirmation").val();
                if (password.length === 0) { return alert('Please type a valid password') }
                if (!(password === password_confirmation)) { return alert('New password and confirmation must match') }
                const inputResponse = com.ts.mobile.sdk.PasswordInput.create(password);
                const response = com.ts.mobile.sdk.InputOrControlResponse.createInputResponse(inputResponse);
                self.submitHandler(response);
            });

            $("#custom-password-authenticator_cancel-button").on("click", function() {
                const controlRequest = com.ts.mobile.sdk.ControlRequest.create(com.ts.mobile.sdk.ControlRequestType.CancelAuthenticator);
                const response = com.ts.mobile.sdk.InputOrControlResponse.createControlResponse(controlRequest);
                self.submitHandler(response);
            });
        });
    }



    this.promiseRecoveryForError = function(error, validRecoveries, defaultRecovery) {
        return new Promise((resolve, reject) => {
            console.log(`LOGG: promiseRecoveryForError was called with error: ${error}`);
            validRecoveries.forEach(element => {
                console.log("Valid recovery:"+element)
            });
            console.log("ERROR pwdsession: "+error);
            console.log(error);
            console.log("ERROR message: "+error.getMessage());
            console.log(error.getMessage());
            console.log("ERROR code: "+error.getErrorCode());
            console.log(error.getErrorCode());
            console.log("ERROR data: "+error.getData());
            console.log(error.getData());

            if(defaultRecovery === com.ts.mobile.sdk.AuthenticationErrorRecovery.RetryAuthenticator) {
                if (confirm(error.getMessage() + ", would you like to try again ?")) {
                    resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.SelectAuthenticator);
                    //resolve(com.ts.mobile.sdk.AuthenticationErrorRecovery.RetryAuthenticator);
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