const journeyPlayer = xmsdk.XmSdk();
const CONSTS = {
    TRANSMIT_UI_CONTAINER_ID: 'transmitContainer',
    SESSION_STORAGE_KEY: 'transmit_token'
}

function createTransmitConnectionSettings() {

    //const serverUrl = "https://smartinez.tsdemo.transmit-field.com";
    //const appId = "jpsdk-300-web";
    const serverUrl = "https://smartinez6.tsdemo.transmit-field.com";
    const appId = "multisesion";
    const apiTokenId = null; // "YOUR_TRANSMIT_CONSOLE_ACCESS_TOKEN_NAME"; // optional
    const apiToken = null; // "YOUR_TRANSMIT_CONSOLE_ACCESS_TOKEN"; // optional
    let settings = com.ts.mobile.sdk.SDKConnectionSettings.create(serverUrl, appId, apiTokenId, apiToken);
    // settings.setRealm("YOUR_REALM_NAME_IF_EXIST"); // optional
    return settings;

}

function initJourneyPlayer() {
    const settings = createTransmitConnectionSettings();
    journeyPlayer.setConnectionSettings(settings);
    journeyPlayer.setUiHandler(new xmui.XmUIHandler());
	//journeyPlayer.setUiHandler(new MyUIHandler()); // *** Change the UI Handler

    journeyPlayer.setUiAssetsDownloadMode(com.ts.mobile.sdk.UIAssetsDownloadMode.DownloadOnInit);
    journeyPlayer.setLocale("fr-FR");
    journeyPlayer.initialize()
    .then((results) => {
        console.log(`Transmit JP initialized successfully: ${results}`);
        const token = getSessionToken(); // getSessionToken function was defined in the Authenticate a User unit
                if (token) {
                     showAuthenticatedUserUI();
                } else {
                     showAuthenticateUI();
                }
    })
    .catch((error) => {
        console.error(`Transmit JP initialization error!: ${error}`);
    });
}

function showAuthenticatedUserUI() {
    $.get("app_content/authenticated-user-ui.html", function(data) {
        $("#appContentContainer").html(data);
    });
}

function showAuthenticateUI() {
    $.get("app_content/authenticate.html", function(data) {
        $("#appContentContainer").html(data);
    });
}
function onAuthenticate() {
    const userId = $(`#input_userid`).val();
    if (!userId || userId.length === 0) {
        alert('Please fill in your userId to authenticate');
        return;
    }
}


/** Add training code above ^ */

function hideAllAppContainers() {
    const appContainerIds = ['login_with_userid_container', 'authenticated_user_ui'];
    appContainerIds.forEach(id => $(`#${id}`).hide());
}

function onPageInitLoad() {
console.log("Starting app");
    hideAllAppContainers();
    initJourneyPlayer();
    console.log("Starter app is setup correctly!");
}

$(document).ready(function () {
console.log("Starting app");
    onPageInitLoad(); // Called when the page is ready
});

function updateSessionToken(token) {
    if (!token) {
        sessionStorage.removeItem(CONSTS.SESSION_STORAGE_KEY.TRANSMIT_TOKEN);
        return;
    }
    sessionStorage.setItem(CONSTS.SESSION_STORAGE_KEY.TRANSMIT_TOKEN, token);
}

function getSessionToken() {
    return sessionStorage.getItem(CONSTS.SESSION_STORAGE_KEY.TRANSMIT_TOKEN);
}

/*
/*Authentication
/*This method is used for doing the authentication
/*
*/
function onAuthenticate() {
    const userId = $(`#input_userid`).val();
    if (!userId || userId.length === 0) {
        alert('Please fill in your userId to authenticate');
        return;
    }

    $("#appContentContainer").hide();

    var clientContext = getClientContext();
    const additionalParams = {};
    const journeyID = "authentication";

  // clientContext = { username: userId };

    journeyPlayer.authenticate(userId, journeyID, additionalParams, clientContext)
        .then((results) => {
            const token = results.getToken();
            updateSessionToken(token); // store to maintain state between page/tab reloads
            transmitJourneyEnded(clientContext); // clear the Transmit UI
            // TODO: show authenticated user UI
            showAuthenticatedUserUI();
        })
        .catch((error) => {
            console.error(`Authenticate Error: ${error}`);
            transmitJourneyEnded(clientContext); // clear also on error
        });
}

function getClientContext() {
    return {
        uiContainer: document.getElementById("transmitContainer")
    };
}

function transmitJourneyEnded(clientContext) {
    $(clientContext.uiContainer).html('');
    $("#appContentContainer").show();
}


/*
These handles the post authentication methods

*/


function onLogout() {
    journeyPlayer.logout()
    .then((results) => {
        updateSessionToken(null); // clears the token from the session
        showAuthenticateUI();
    })
    .catch((error) => {
        console.log(`Authenticate Error: ${error}`);
    });
}

function invokeJourney() {
    $("#appContentContainer").hide();

    const transferAmount = prompt("Selecciona un número: 1, 2 o 3"); // collect user input

    const clientContext = getClientContext();
    //const policyName = "money_transfer_byApp";
    const policyName = "anonimo";
    const additionalParams = { "numeroSeleccionado": transferAmount }; // pass the input to the server

    //journeyPlayer.invokePolicy(policyName, additionalParams, clientContext)
    journeyPlayer.invokeAnonymousPolicy(policyName, additionalParams, clientContext)
    .then((results) => {
        console.log(`Example journey ended successfully: ${results}`);
        transmitJourneyEnded(clientContext);
    })
    .catch((err) => {
        console.error(`Example journey ended with error: ${err.getMessage()}`);
        transmitJourneyEnded(clientContext);
    });
}

function invokeAuthenticationConfiguration() {
    $("#appContentContainer").hide();

    const clientContext = getClientContext();
    journeyPlayer.startAuthenticationConfiguration(clientContext)
    .then((results) => {
        console.log(`Finished configuration with results: ${results}`);
        transmitJourneyEnded(clientContext);
    })
    .catch((err) => {
        console.error(`Error: ${err.getMessage()}`);
        transmitJourneyEnded(clientContext);
    });
}

function invokeDeviceManagement() {
    $("#appContentContainer").hide();

    const clientContext = getClientContext();
    journeyPlayer.startDeviceManagementSession(clientContext)
    .then((results) => {
        console.log(`Device Management Journey ended successfully: ${results}`);
        transmitJourneyEnded(clientContext);
    })
    .catch((err) => {
        console.error(`Device Management Journey ended with error: ${err.getMessage()}`);
        transmitJourneyEnded(clientContext);
    });
}
