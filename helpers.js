function handleAuthenticatorError(validRecoveries, callback) {
    const dialogConfig = { title: "Authentication Error", cancelTitle: "Abort Authentication" }
    const options = { 0: "Retry Authenticator", 1: "Change Authenticator", 2: "Select Authenticator", 3: "Fail" }
    const dialogOptions = validRecoveries.map((recovery) => {
        return { title: options[recovery], value: recovery }
    });

    showDialog(dialogConfig, dialogOptions, (selectedOption) => {
        if (selectedOption === null) {
            callback(com.ts.mobile.sdk.AuthenticationErrorRecovery.Fail);
        } else {
            callback(selectedOption);
        }
    });
}

function showDialog(config, options, callback) {

    function onDismiss(value) {
        $("#transmit-training-options-dialog").remove();
        callback(value);
    }

    const optionButtons = options.map((option) => {
        return $('<button/>', { class: `transmit-dialog-option-button`, text: option.title, click: () => { onDismiss(option.value) }});
    });

    const cancelButton = $('<button/>', { class: `transmit-dialog-cancel-button`, text: config.cancelTitle, click: () => { onDismiss(null) }});

    const dialog = `
        <html>
            <head>
                <style>
                    #transmit-training-options-dialog {
                        position: fixed;
                        left: 0px; top: 0px; width: 100vw; height: 100vh;
                        background-color: rgba(0,0,0,0.3);
                    }
                    #transmit-training-options-dialog-content {
                        width: 36%;
                        padding: 12px;
                        position: absolute;
                        top: 30%;
                        left: 50%;
                        margin-right: -50%;
                        transform: translate(-50%, -50%);
                        background-color: #ffffff;
                        border-radius: 4px;
                    }
                    #transmit-training-options-dialog-content-title {
                        border-radius: 2px;
                    }
                    #transmit-training-options-dialog-content-title-label {
                        display: block;
                        color: #1E2743;
                        font-size: 22px;
                        padding: 6px;
                    }
                    #transmit-training-options-dialog-content-body {
                        padding: 6px;
                        margin-top: 12px;
                    }
                    .transmit-dialog-option-button {
                        width: 100%;
                        height: 40px;
                        cursor: pointer;
                        font-size: 16px;
                        color: #1E2743;
                        border: 0.5px solid #1E2743;
                        border-radius: 4px;
                        margin-bottom: 16px;
                    }
                    .transmit-dialog-cancel-button {
                        width: 100%;
                        height: 40px;
                        background-color: #FF0000;
                        cursor: pointer;
                        font-size: 16px;
                        color: #ffffff;
                        border: 0.5px solid #ffffff;
                        border-radius: 4px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div id="transmit-training-options-dialog">
                    <div id="transmit-training-options-dialog-content">
                        <div id="transmit-training-options-dialog-content-title">
                            <label id="transmit-training-options-dialog-content-title-label">${config.title}</label>
                        </div>
                        
                        <div id="transmit-training-options-dialog-content-body">
                            <div id="transmit-training-options-dialog-content-body-options"></div>
                            <hr />
                            <div id="transmit-training-options-dialog-content-body-cancel"></div>
                        </div>
                        
                    </div>
                </div>
            </body>
        <html>
    `;
    
    $("body").append(dialog);
    
    optionButtons.forEach((optionButton) => {
        $("#transmit-training-options-dialog-content-body-options").append(optionButton);
    });
    $("#transmit-training-options-dialog-content-body-cancel").append(cancelButton);
}