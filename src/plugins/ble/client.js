var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { dataViewToHexString, hexStringToDataView } from "./conversion";
import { DisengageStatusType, } from "./definitions";
import { AbrevvaBLE } from "./plugin";
import { getQueue } from "./queue";
import { validateUUID } from "./validators";
var AbrevvaBLEClientClass = /** @class */ (function () {
    function AbrevvaBLEClientClass() {
        this.scanResultListener = null;
        this.scanStartListener = null;
        this.scanStopListener = null;
        this.eventListeners = new Map();
        this.queue = getQueue(true);
    }
    AbrevvaBLEClientClass.prototype.initialize = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.initialize(options)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.isEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.isEnabled()];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, result.value];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.isLocationEnabled = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.isLocationEnabled()];
                                    case 1:
                                        result = _a.sent();
                                        return [2 /*return*/, result.value];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.startEnabledNotifications = function (callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var key, listener;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        key = "onEnabledChanged";
                                        return [4 /*yield*/, ((_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _b.sent();
                                        listener = AbrevvaBLE.addListener(key, function (result) {
                                            callback(result.value);
                                        });
                                        this.eventListeners.set(key, listener);
                                        return [4 /*yield*/, AbrevvaBLE.startEnabledNotifications()];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.stopEnabledNotifications = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var key;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        key = "onEnabledChanged";
                                        return [4 /*yield*/, ((_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _b.sent();
                                        this.eventListeners.delete(key);
                                        return [4 /*yield*/, AbrevvaBLE.stopEnabledNotifications()];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.openLocationSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.openLocationSettings()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.openBluetoothSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.openBluetoothSettings()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.openAppSettings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.openAppSettings()];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.startScan = function (options, onScanResult, onScanStart, onScanStop) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            var _a, _b, _c;
                            return __generator(this, function (_d) {
                                switch (_d.label) {
                                    case 0: return [4 /*yield*/, ((_a = this.scanResultListener) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _d.sent();
                                        this.scanResultListener = AbrevvaBLE.addListener("onScanResult", function (device) {
                                            onScanResult(device);
                                        });
                                        if (!onScanStart) return [3 /*break*/, 3];
                                        return [4 /*yield*/, ((_b = this.scanStartListener) === null || _b === void 0 ? void 0 : _b.remove())];
                                    case 2:
                                        _d.sent();
                                        this.scanStartListener = AbrevvaBLE.addListener("onScanStart", function (result) {
                                            var _a;
                                            onScanStart(result.value);
                                            (_a = _this.scanStartListener) === null || _a === void 0 ? void 0 : _a.remove();
                                        });
                                        _d.label = 3;
                                    case 3:
                                        if (!onScanStop) return [3 /*break*/, 5];
                                        return [4 /*yield*/, ((_c = this.scanStopListener) === null || _c === void 0 ? void 0 : _c.remove())];
                                    case 4:
                                        _d.sent();
                                        this.scanStopListener = AbrevvaBLE.addListener("onScanStop", function (result) {
                                            var _a;
                                            onScanStop(result.value);
                                            (_a = _this.scanStopListener) === null || _a === void 0 ? void 0 : _a.remove();
                                        });
                                        _d.label = 5;
                                    case 5: return [4 /*yield*/, AbrevvaBLE.startScan(options)];
                                    case 6:
                                        _d.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.stopScan = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0: return [4 /*yield*/, ((_a = this.scanResultListener) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _b.sent();
                                        this.scanResultListener = null;
                                        return [4 /*yield*/, AbrevvaBLE.stopScan()];
                                    case 2:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.connect = function (deviceId, onDisconnect, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var key, listener;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        if (!onDisconnect) return [3 /*break*/, 2];
                                        key = "disconnected|".concat(deviceId);
                                        return [4 /*yield*/, ((_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _b.sent();
                                        listener = AbrevvaBLE.addListener(key, function () {
                                            onDisconnect(deviceId);
                                        });
                                        this.eventListeners.set(key, listener);
                                        _b.label = 2;
                                    case 2: return [4 /*yield*/, AbrevvaBLE.connect(__assign({ deviceId: deviceId }, options))];
                                    case 3:
                                        _b.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.disconnect = function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, AbrevvaBLE.disconnect({ deviceId: deviceId })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.read = function (deviceId, service, characteristic, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = validateUUID(service);
                        characteristic = validateUUID(characteristic);
                        return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                                var result;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, AbrevvaBLE.read(__assign({ deviceId: deviceId, service: service, characteristic: characteristic }, options))];
                                        case 1:
                                            result = _a.sent();
                                            return [2 /*return*/, this.convertValue(result.value)];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.write = function (deviceId, service, characteristic, value, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                service = validateUUID(service);
                characteristic = validateUUID(characteristic);
                return [2 /*return*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                        var writeValue;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!(value === null || value === void 0 ? void 0 : value.buffer)) {
                                        throw new Error("Invalid data.");
                                    }
                                    writeValue = dataViewToHexString(value);
                                    return [4 /*yield*/, AbrevvaBLE.write(__assign({ deviceId: deviceId, service: service, characteristic: characteristic, value: writeValue }, options))];
                                case 1:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })];
            });
        });
    };
    AbrevvaBLEClientClass.prototype.signalize = function (deviceId) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, AbrevvaBLE.signalize({ deviceId: deviceId })];
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.disengage = function (deviceId, mobileId, mobileDeviceKey, mobileGroupId, mediumAccessData, isPermanentRelease, onConnect, onDisconnect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var status, result;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!onConnect) return [3 /*break*/, 2];
                                        return [4 /*yield*/, ((_a = this.eventListeners.get("connected|".concat(deviceId))) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _c.sent();
                                        this.eventListeners.set("connected|".concat(deviceId), AbrevvaBLE.addListener("connected|".concat(deviceId), function () {
                                            onConnect(deviceId);
                                        }));
                                        _c.label = 2;
                                    case 2:
                                        if (!onDisconnect) return [3 /*break*/, 4];
                                        return [4 /*yield*/, ((_b = this.eventListeners.get("disconnected|".concat(deviceId))) === null || _b === void 0 ? void 0 : _b.remove())];
                                    case 3:
                                        _c.sent();
                                        this.eventListeners.set("disconnected|".concat(deviceId), AbrevvaBLE.addListener("disconnected|".concat(deviceId), function () {
                                            onDisconnect(deviceId);
                                        }));
                                        _c.label = 4;
                                    case 4: return [4 /*yield*/, AbrevvaBLE.disengage({
                                            deviceId: deviceId,
                                            mobileId: mobileId,
                                            mobileDeviceKey: mobileDeviceKey,
                                            mobileGroupId: mobileGroupId,
                                            mediumAccessData: mediumAccessData,
                                            isPermanentRelease: isPermanentRelease,
                                        })];
                                    case 5:
                                        status = (_c.sent()).value;
                                        if (Object.values(DisengageStatusType).some(function (val) { return val === status; })) {
                                            result = status;
                                        }
                                        else {
                                            result = DisengageStatusType.Error;
                                        }
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.disengageWithXvnResponse = function (deviceId, mobileId, mobileDeviceKey, mobileGroupId, mediumAccessData, isPermanentRelease, onConnect, onDisconnect) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                            var response, status;
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        if (!onConnect) return [3 /*break*/, 2];
                                        return [4 /*yield*/, ((_a = this.eventListeners.get("connected|".concat(deviceId))) === null || _a === void 0 ? void 0 : _a.remove())];
                                    case 1:
                                        _c.sent();
                                        this.eventListeners.set("connected|".concat(deviceId), AbrevvaBLE.addListener("connected|".concat(deviceId), function () {
                                            onConnect(deviceId);
                                        }));
                                        _c.label = 2;
                                    case 2:
                                        if (!onDisconnect) return [3 /*break*/, 4];
                                        return [4 /*yield*/, ((_b = this.eventListeners.get("disconnected|".concat(deviceId))) === null || _b === void 0 ? void 0 : _b.remove())];
                                    case 3:
                                        _c.sent();
                                        this.eventListeners.set("disconnected|".concat(deviceId), AbrevvaBLE.addListener("disconnected|".concat(deviceId), function () {
                                            onDisconnect(deviceId);
                                        }));
                                        _c.label = 4;
                                    case 4: return [4 /*yield*/, AbrevvaBLE.disengageWithXvnResponse({
                                            deviceId: deviceId,
                                            mobileId: mobileId,
                                            mobileDeviceKey: mobileDeviceKey,
                                            mobileGroupId: mobileGroupId,
                                            mediumAccessData: mediumAccessData,
                                            isPermanentRelease: isPermanentRelease,
                                        })];
                                    case 5:
                                        response = _c.sent();
                                        if (Object.values(DisengageStatusType).some(function (val) { return val === response.status; })) {
                                            status = response.status;
                                        }
                                        else {
                                            status = DisengageStatusType.Error;
                                        }
                                        return [2 /*return*/, { status: status, xvnData: response.xvnData }];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.startNotifications = function (deviceId, service, characteristic, callback) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = validateUUID(service);
                        characteristic = validateUUID(characteristic);
                        return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                                var key, listener;
                                var _this = this;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            key = "notification|".concat(deviceId, "|").concat(service, "|").concat(characteristic);
                                            return [4 /*yield*/, ((_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove())];
                                        case 1:
                                            _b.sent();
                                            listener = AbrevvaBLE.addListener(key, function (event) {
                                                callback(_this.convertValue(event === null || event === void 0 ? void 0 : event.value));
                                            });
                                            this.eventListeners.set(key, listener);
                                            return [4 /*yield*/, AbrevvaBLE.startNotifications({
                                                    deviceId: deviceId,
                                                    service: service,
                                                    characteristic: characteristic,
                                                })];
                                        case 2:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.stopNotifications = function (deviceId, service, characteristic) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        service = validateUUID(service);
                        characteristic = validateUUID(characteristic);
                        return [4 /*yield*/, this.queue(function () { return __awaiter(_this, void 0, void 0, function () {
                                var key;
                                var _a;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            key = "notification|".concat(deviceId, "|").concat(service, "|").concat(characteristic);
                                            return [4 /*yield*/, ((_a = this.eventListeners.get(key)) === null || _a === void 0 ? void 0 : _a.remove())];
                                        case 1:
                                            _b.sent();
                                            this.eventListeners.delete(key);
                                            return [4 /*yield*/, AbrevvaBLE.stopNotifications({
                                                    deviceId: deviceId,
                                                    service: service,
                                                    characteristic: characteristic,
                                                })];
                                        case 2:
                                            _b.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AbrevvaBLEClientClass.prototype.convertValue = function (value) {
        if (typeof value === "string") {
            return hexStringToDataView(value);
        }
        else if (value === undefined) {
            return new DataView(new ArrayBuffer(0));
        }
        return value;
    };
    return AbrevvaBLEClientClass;
}());
export var AbrevvaBLEClient = new AbrevvaBLEClientClass();
