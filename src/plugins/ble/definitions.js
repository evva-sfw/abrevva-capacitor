export var DisengageStatusType;
(function (DisengageStatusType) {
    /// Component
    DisengageStatusType["Authorized"] = "AUTHORIZED";
    DisengageStatusType["AuthorizedPermanentEngage"] = "AUTHORIZED_PERMANENT_ENGAGE";
    DisengageStatusType["AuthorizedPermanentDisengage"] = "AUTHORIZED_PERMANENT_DISENGAGE";
    DisengageStatusType["AuthorizedBatteryLow"] = "AUTHORIZED_BATTERY_LOW";
    DisengageStatusType["AuthorizedOffline"] = "AUTHORIZED_OFFLINE";
    DisengageStatusType["Unauthorized"] = "UNAUTHORIZED";
    DisengageStatusType["UnauthorizedOffline"] = "UNAUTHORIZED_OFFLINE";
    DisengageStatusType["SignalLocalization"] = "SIGNAL_LOCALIZATION";
    DisengageStatusType["MediumDefectOnline"] = "MEDIUM_DEFECT_ONLINE";
    DisengageStatusType["MediumBlacklisted"] = "MEDIUM_BLACKLISTED";
    DisengageStatusType["Error"] = "ERROR";
    /// Interface
    DisengageStatusType["UnableToConnect"] = "UNABLE_TO_CONNECT";
    DisengageStatusType["UnableToSetNotifications"] = "UNABLE_TO_SET_NOTIFICATIONS";
    DisengageStatusType["UnableToReadChallenge"] = "UNABLE_TO_READ_CHALLENGE";
    DisengageStatusType["UnableToWriteMDF"] = "UNABLE_TO_WRITE_MDF";
    DisengageStatusType["AccessCipherError"] = "ACCESS_CIPHER_ERROR";
    DisengageStatusType["BleAdapterDisabled"] = "BLE_ADAPTER_DISABLED";
    DisengageStatusType["UnknownDevice"] = "UNKNOWN_DEVICE";
    DisengageStatusType["UnknownStatusCode"] = "UNKNOWN_STATUS_CODE";
    DisengageStatusType["Timeout"] = "TIMEOUT";
})(DisengageStatusType || (DisengageStatusType = {}));
