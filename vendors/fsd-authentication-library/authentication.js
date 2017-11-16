var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var InvalidTokenError = (function (_super) {
    __extends(InvalidTokenError, _super);
    function InvalidTokenError() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidTokenError;
}(Error));
var FSDAuthentication = (function () {
    function FSDAuthentication(config, token) {
        this.tokenPath = 'oauth/token';
        this.usersPath = 'oauth/user/synchronize';
        this._hashList = [];
        if (token) {
            // noinspection JSAnnotator
            this.token = JSON.parse(token);
        }
        if (config === undefined) {
            throw new Error('You must provide a configuration specifying: [hostURL, clientId, clientSecret]');
        }
        if (config.hostURL === undefined ||
            config.clientId === undefined ||
            config.clientSecret === undefined) {
            throw new Error('Invalid config. You must specify: [hostURL, clientId, clientSecret]');
        }
        if (config) {
            this._hostURL = config.hostURL;
            this._clientId = config.clientId;
            this._clientSecret = config.clientSecret;
            if (config.hashList) {
                this._hashList = config.hashList;
            }
        }
    }
    Object.defineProperty(FSDAuthentication.prototype, "clientId", {
        get: function () {
            return this._clientId;
        },
        set: function (value) {
            this._clientId = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "clientSecret", {
        get: function () {
            return this._clientSecret;
        },
        set: function (value) {
            this._clientSecret = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "hostURL", {
        get: function () {
            return this._hostURL;
        },
        set: function (value) {
            this._hostURL = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "userId", {
        get: function () {
            return this.parsedToken.client_id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "name", {
        get: function () {
            return this.parsedToken.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "user_name", {
        get: function () {
            return this.parsedToken.user_name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "role", {
        get: function () {
            return this.parsedToken.role;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "scope", {
        get: function () {
            return this.parsedToken.scope;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "expireTime", {
        get: function () {
            var epoch = this.parsedToken.exp;
            return new Date(epoch * 1000).toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "expired", {
        get: function () {
            var epoch = new Date(this.parsedToken.exp * 1000).valueOf();
            return Date.now() > epoch;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "parsedToken", {
        get: function () {
            return this.decodeToken(this.token.access_token);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FSDAuthentication.prototype, "userHashList", {
        get: function () {
            return this._hashList;
        },
        set: function (value) {
            this._hashList = value;
        },
        enumerable: true,
        configurable: true
    });
    FSDAuthentication.prototype.authenticate = function (username, password, callback) {
        var _this = this;
        var params = {
            grant_type: 'password',
            username: username,
            password: password,
        };
        var url = this._hostURL + "/" + this.tokenPath;
        this.sendRequest('POST', url, false, params, function (err, result) {
            if (err) {
                console.log(err);
                callback(err);
                return;
            }
            if (result) {
                _this.token = result;
                console.log('Authentication Token information updated');
                callback();
            }
        });
    };
    FSDAuthentication.prototype.refreshToken = function ( callback) {
        var _this = this;
        if (!this.token) {
            throw new Error('Cannot refresh. No token available');
        }
        var params = {
            grant_type: 'refresh_token',
            refresh_token: this.token.refresh_token,
        };
        var url = this._hostURL + "/" + this.tokenPath;
        console.log('Refreshing auth token');
        this.sendRequest('POST', url, false, params, function (err, result) {
            if (err) {
                console.error(err);
                callback(err);
                return;
            }
            if (result) {
                _this.token = result;
                console.log('Authentication Token information updated');
                callback();
            }
        });
    };
    FSDAuthentication.prototype.userList = function (callback) {
        var _this = this;
        if (!this.token) {
            throw new Error('Cannot fetch user list. No token available');
        }
        var url = this._hostURL + "/" + this.usersPath;
        console.log('Fetching user list');
        this.sendRequest('GET', url, true, {}, function (err, result) {
            if (err) {
                console.error(err);
                callback(err);
                return;
            }
            _this._hashList = result;
            callback(undefined, result);
        });
    };
    FSDAuthentication.prototype.offlinePasswordCheck = function (username, password, callback) {
        if (dcodeIO === undefined) {
            return callback(new Error('bcryptjs is required'));
        }
        if (this._hashList === undefined) {
            return callback(new Error('No user list available'));
        }
        var hashEntry = this._hashList.find(function (item) { return item.operatorId === +username; });
        if (hashEntry === undefined) {
            return callback(new Error('Operator ID is not in user list'));
        }
        callback(undefined, dcodeIO.bcrypt.compareSync(password, hashEntry.accessPassword));
    };
    /**
     * Private method to structure AJAX requests made to PCS.
     *
     * @param method: GET, PUT, POST, DELETE
     * @param url: API endpoint
     * @param data: any data to send with the request
     * @param callback: a callback to execute when the request finishes. Ex: function (err, result) { ... }
     */
    FSDAuthentication.prototype.sendRequest = function (method, url, bearer, data, callback) {
        if (callback === undefined) {
            callback = this.defaultCallback;
        }
        var formData = Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }).join('&');
        var xhr = this.buildXHRRequest(method, url, data, callback);
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        if (bearer === true && this.token !== undefined) {
            xhr.setRequestHeader('Authorization', "Bearer " + this.token.access_token);
        }
        else {
            var authCombo = this._clientId + ":" + this._clientSecret;
            xhr.setRequestHeader('Authorization', "Basic " + btoa(authCombo));
        }
        switch (method) {
            case 'POST':
            case 'PUT':
                xhr.send(formData);
                break;
            default:
                xhr.send();
        }
    };
    /**
     * A private helper method to build an XMLHttpRequest for executing queries
     *
     * @param {String} method GET, POST, PUT, DELETE
     * @param {String} url the URL to make the request to
     * @param {Object} data data to send with the request
     * @param {Function} callback a callback function to execute when the request finishes
     * @returns
     */
    FSDAuthentication.prototype.buildXHRRequest = function (method, url, data, callback) {
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        xhr.onreadystatechange = function () {
            if (this.readyState === XMLHttpRequest.DONE) {
                if ((this.status >= 200 && this.status < 300) || this.status === 304) {
                    var response = void 0;
                    try {
                        response = JSON.parse(this.responseText);
                    }
                    catch (e) {
                        response = this.responseText;
                    }
                    callback(undefined, response);
                }
                else {
                    var serverResponse = void 0;
                    try {
                        serverResponse = JSON.parse(this.responseText);
                    }
                    catch (e) {
                        serverResponse = this.statusText || this.responseText;
                    }
                    var errData = {
                        message: 'Authentication Request Failed',
                        statusCode: this.status,
                        serverResponse: serverResponse
                    };
                    var err = new Error(JSON.stringify(errData));
                    console.error(errData);
                    callback(err);
                }
            }
        };
        switch (method) {
            case 'POST':
            case 'PUT':
                xhr.open(method, url, true);
                break;
            default:
                xhr.open(method, this.parameterURL(url, data), true);
        }
        return xhr;
    };
    /**
     * A private function to generate a parameterized string from JSON data
     *
     * @param {Object} data
     * @returns A serialized string in URL parameter format
     */
    FSDAuthentication.prototype.jsonParameterString = function (data) {
        return Object.keys(data).map(function (k) {
            return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
        }).join('&');
    };
    /**
     * A private helper method to generate a full URL with parameters
     * @param {String} url
     * @param {Object} data
     * @returns A URL string with parameters added
     */
    FSDAuthentication.prototype.parameterURL = function (url, data) {
        return url + '?' + this.jsonParameterString(data);
    };
    /**
     * Helper method to show information in the console if a callback is not provided.
     */
    FSDAuthentication.prototype.defaultCallback = function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result);
    };
    FSDAuthentication.prototype.decodeToken = function (token, options) {
        if (typeof token !== 'string') {
            throw new InvalidTokenError('Invalid token specified');
        }
        options = options || {};
        var pos = options.header === true ? 0 : 1;
        try {
            return JSON.parse(this.base64_url_decode(token.split('.')[pos]));
        }
        catch (err) {
            throw new InvalidTokenError("Invalid token specified: " + err.message);
        }
    };
    FSDAuthentication.prototype.base64_url_decode = function (value) {
        var output = value.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw new Error('Illegal base64urlString');
        }
        try {
            return decodeURIComponent(atob(value).replace(/(.)/g, function (m, p) {
                var code = p.charCodeAt(0).toString(16).toUpperCase();
                if (code.length < 2) {
                    code = '0' + code;
                }
                return '%' + code;
            }));
        }
        catch (err) {
            return atob(output);
        }
    };
    return FSDAuthentication;
}());
